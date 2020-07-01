var util = require("util");

const indent = x =>
  x
    .split("\n")
    .map(x => "\t" + x)
    .join("\n");

const nodeHandlers = {
  BreakStatement(node) {
    return "break;";
  },
  ReturnStatement(node) {
    let out = "";
    out += "return";
    if (node.arguments.length) out += ` ${node.arguments.map(gen).join(", ")}`;
    out += ";";
    return out;
  },
  VarargLiteral(node) {
    return node.raw;
  },
  NilLiteral(node) {
    return node.raw;
  },
  BooleanLiteral(node) {
    return node.raw;
  },
  NumericLiteral(node) {
    return node.raw;
  },
  StringLiteral(node) {
    return ` ${node.raw} `; // prevent `[[[` in code
  },
  StringCallExpression(node) {
    return `${gen(node.base)}${gen(node.argument)}`;
  },
  TableCallExpression(node) {
    return `${gen(node.base)}${gen(node.arguments)}`;
  },
  CallExpression(node) {
    return `${gen(node.base)}(${node.arguments.map(gen).join(", ")})`;
  },
  CallStatement(node) {
    return `${gen(node.expression)};`;
  },
  GotoStatement(node) {
    return `goto ${gen(node.label)};`;
  },
  LabelStatement(node) {
    return `::${gen(node.label)}::`;
  },
  TableConstructorExpression(node) {
    return `({ ${node.fields.map(gen).join(", ")} })`;
  },
  TableValue(node) {
    return gen(node.value);
  },
  TableKey(node) {
    return `[ ${gen(node.key)} ] = ${gen(node.value)}`;
  },
  TableKeyString(node) {
    return `${gen(node.key)} = ${gen(node.value)}`;
  },
  FunctionDeclaration(node) {
    let out = "";
    if (node.isLocal) out += "local ";
    out += "function ";
    if (node.identifier) out += `${gen(node.identifier)} `;
    out += `(${node.parameters.map(gen).join(", ")})\n`;
    out += indent(node.body.map(gen).join("\n"));
    out += "\nend";
    return out;
  },
  UnaryExpression(node) {
    return `(${node.operator} ${gen(node.argument)})`;
  },
  BinaryExpression(node) {
    return `(${gen(node.left)} ${node.operator} ${gen(node.right)})`;
  },
  LogicalExpression(node) {
    return `(${gen(node.left)} ${node.operator} ${gen(node.right)})`;
  },
  DoStatement(node) {
    let out = "";
    out += `do\n`;
    out += indent(node.body.map(gen).join("\n"));
    out += "\nend;";
    return out;
  },
  WhileStatement(node) {
    let out = "";
    out += `while ${gen(node.condition)} do\n`;
    out += indent(node.body.map(gen).join("\n"));
    out += "\nend;";
    return out;
  },
  RepeatStatement(node) {
    let out = "";
    out += "repeat\n";
    out += indent(node.body.map(gen).join("\n"));
    out += `\nuntil ${gen(node.condition)};`;
    return out;
  },
  ForGenericStatement(node) {
    let out = "";
    out += `for ${node.variables.map(gen).join(", ")} in ${node.iterators
      .map(gen)
      .join(", ")} do\n`;
    out += indent(node.body.map(gen).join("\n"));
    out += "\nend;";
    return out;
  },
  ForNumericStatement(node) {
    let out = "";
    out += `for ${gen(node.variable)} = ${gen(node.start)}, ${gen(node.end)}`;
    if (node.step) out += `, ${gen(node.step)}`;
    out += " do\n";
    out += indent(node.body.map(gen).join("\n"));
    out += "\nend;";
    return out;
  },
  IfStatement(node) {
    return `${node.clauses.map(gen).join("\n")}\nend;`;
  },
  IfClause(node) {
    return `if ${gen(node.condition)} then\n${indent(
      node.body.map(gen).join("\n")
    )}`;
  },
  ElseifClause(node) {
    return `elseif ${gen(node.condition)} then\n${indent(
      node.body.map(gen).join("\n")
    )}`;
  },
  ElseClause(node) {
    return `else\n${indent(node.body.map(gen).join("\n"))}`;
  },
  Identifier(node) {
    return node.name;
  },
  MemberExpression(node) {
    return `${gen(node.base)}${node.indexer}${gen(node.identifier)}`;
  },
  IndexExpression(node) {
    return `${gen(node.base)}[${gen(node.index)}]`;
  },
  LocalStatement(node) {
    let out = "";
    out += `local ${node.variables.map(gen).join(", ")}`;
    if (node.init.length) out += ` = ${node.init.map(gen).join(", ")}`;
    out += ";";
    return out;
  },
  AssignmentStatement(node) {
    return `${node.variables.map(gen).join(", ")} = ${node.init
      .map(gen)
      .join(", ")};`;
  },
  Comment(node) {
    return node.raw;
  },
  Chunk(node) {
    return [...node.comments.map(gen), ...node.body.map(gen)].join("\n");
  }
};

function gen(node) {
  const formatter = nodeHandlers[node.type];
  /* istanbul ignore if  */
  if (!formatter) {
    throw new Error(`Unhandled: ${util.inspect(node, false, 5, true)}`);
  }
  let text = formatter(node);
  return text;
}

module.exports = gen;
