const { expect } = require("chai");

const fs = require("fs");
const parser = require("luaparse");
const codegen = require("./codegen");
const files = fs.readdirSync("./tests");

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
    expect(gentree).to.deep.eql(tree);
  });
  it("::test::", () => {
    const tree = parser.parse("::test::", { luaVersion: "5.2" });
    const gen = codegen(tree);
    const gentree = parser.parse(gen, { luaVersion: "5.2" });
    expect(gentree).to.deep.eql(tree);
  });
});
