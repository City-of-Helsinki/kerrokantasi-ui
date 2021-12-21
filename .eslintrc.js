module.exports = {
  "root": true,
  "extends": [
    "airbnb",
    "plugin:flowtype/recommended"
  ],
  "env": {"browser": true, "node": true},
  "globals": {"__DEVTOOLS__": true},
  "parser": "babel-eslint",
  "plugins": [
    "react",
    "import",
    "flowtype"
  ],
  "rules": {
    "arrow-body-style": 0,
    "arrow-parens": 0,
    "comma-dangle": 0,
    "function-paren-newline": "off",
    "global-require": 0,
    "id-length": [2, {"min": 2, "properties": "never", "exceptions": ["_"]}],
    "import/first": 0,
    "import/no-named-as-default-member": 0,
    "jsx-a11y/anchor-is-valid": 0,  // TODO: Remove me!
    "jsx-a11y/href-no-hash": 0,  // TODO: Remove me!
    "jsx-a11y/iframe-has-title": 0,  // TODO: Remove me!
    "jsx-a11y/label-has-for": [ 2, {"required": {"some": [ "nesting", "id" ]}}],
    "jsx-a11y/no-noninteractive-element-interactions": 0,  // TODO: Remove me!
    "jsx-a11y/no-static-element-interactions": 0,  // TODO: Remove me!
    "max-len": [1, 120],
    "new-cap": [2, {"capIsNew": false, "newIsCap": true}],
    "newline-per-chained-call": 0,
    "no-multi-spaces": ["error", {"ignoreEOLComments": true}],
    "no-underscore-dangle": 0,
    "no-use-before-define": [2, "nofunc"],
    "no-console": ["error", { allow: ["warn", "error", "info"]}],
    "object-curly-newline": "off",
    "object-curly-spacing": 0,
    "prefer-destructuring": 0,
    "prefer-template": 0,
    "quotes": 0,
    "react/forbid-prop-types": 0,
    "react/jsx-filename-extension": 0,
    "react/jsx-indent-props": 0,
    "react/jsx-no-bind": 0,  // disabled as we use es6 (see https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md#es6-classes)
    "react/jsx-space-before-closing": 0,
    "react/jsx-tag-spacing": 0,
    "react/jsx-wrap-multilines": 0,  // TODO: Remove me!
    "react/no-string-refs": 0,
    "react/no-typos": 0,  // Disabled due to https://github.com/yannickcr/eslint-plugin-react/issues/1389
    "react/no-unused-prop-types": 1,
    "react/prefer-stateless-function": 0,
    "react/require-default-props": 0,
    "react/sort-comp": 0,
    "linebreak-style": 0
  }
};
