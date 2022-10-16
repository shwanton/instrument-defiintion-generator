module.exports = function (wallaby) {
  return {
    files: [
      "packages/generator/src/**/*.ts",
      "examples/**/*.txt",
      "configs/**/*.json",
      "!packages/generator/src/**/__tests__/*.ts",
    ],
    tests: ["packages/generator/src/**/__tests__/*.ts"],
    env: { type: "node", runner: "node" },
    testFramework: "jest",
    debug: true,
    compilers: {
      "**/*.ts?(x)": wallaby.compilers.typeScript(),
    },
  };
};
