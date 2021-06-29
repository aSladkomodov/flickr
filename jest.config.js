module.exports = {
  testRunner: "jest-circus/runner",
  modulePathIgnorePatterns: ["scripts"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
};
