module.exports = function (wallaby) {
  return {
    files: ["src/**/*.ts", "examples/**/*.txt", "!src/**/__tests__/*.ts"],
    tests: ["src/**/__tests__/*.ts"],
    env: { type: "node", runner: "node" },
    testFramework: "jest",
    debug: true,
    compilers: {
      "**/*.ts?(x)": wallaby.compilers.typeScript(),
    },
  };
};
