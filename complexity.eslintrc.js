module.exports = {
  "root": true,
  "env": {"browser": true, "node": true},
  "globals": {"__DEVTOOLS__": true},
  "parser": "babel-eslint",
  "rules": {
    "complexity": ["error", 5],
    "max-depth": ["error", 4],
    "max-len": "off",
    "max-nested-callbacks": ["error", 5],
    "max-params": ["error", 4],
    "max-statements": ["error", 10, {"ignoreTopLevelFunctions": true}],
  },
};
