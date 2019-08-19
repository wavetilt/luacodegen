const { expect } = require("chai");

const fs = require("fs");
const parser = require("luaparse");
const codegen = require("./codegen");
const files = fs.readdirSync("./tests");

function cleanTree(node) {
  if (typeof node !== "object" || node == null) return;
  delete node.inParens;
  Object.values(node).forEach(cleanTree);
}
files.forEach(filename => {
  describe(filename, () => {
    const lines = fs
      .readFileSync(`./tests/${filename}`, "utf-8")
      .trim()
      .split("\n");
    lines.forEach(line => {
      it(line, () => {
        const escapeLine = line.replace(/@(.)@/g, function(m, s) {
          return (
            { n: "\n", r: "\r", t: "\t", f: "\f", v: "\v", b: "\b" }[s] || s
          );
        });
        const tree = parser.parse(escapeLine);
        const gen = codegen(tree);
        const gentree = parser.parse(gen);
        cleanTree(tree);
        cleanTree(gentree);
        expect(gentree).to.deep.eql(tree);
      });
    });
  });
});

describe("version specific tests", () => {
  it("goto test", () => {
    const tree = parser.parse("goto test", { luaVersion: "5.2" });
    const gen = codegen(tree);
    const gentree = parser.parse(gen, { luaVersion: "5.2" });
    cleanTree(tree);
    cleanTree(gentree);
    expect(gentree).to.deep.eql(tree);
  });
  it("::test::", () => {
    const tree = parser.parse("::test::", { luaVersion: "5.2" });
    const gen = codegen(tree);
    const gentree = parser.parse(gen, { luaVersion: "5.2" });
    cleanTree(tree);
    cleanTree(gentree);
    expect(gentree).to.deep.eql(tree);
  });
});
