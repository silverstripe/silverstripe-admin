const todo = {
  "react/jsx-filename-extension": [
    "off"
  ],
  "react/require-default-props": [
    "off"
  ],
  "react/prop-types": [
    "off"
  ],
  "comma-dangle": [
    "off"
  ],
  "arrow-parens": [
    "off"
  ],
  "indent": [
    "off"
  ],
  "jsx-a11y/iframe-has-title": [
    "off"
  ],
};

module.exports = {
  "extends": "airbnb",
  "env": {
    "jasmine": true
  },
  "rules": Object.assign({},
    todo,
    {
    "no-underscore-dangle": [
      "off",
      {
        "allow": [
          "_t"
        ],
        "allowAfterThis": true
      }
    ],
    "no-unused-vars": [
      "error",
      {
        "vars": "local"
      }
    ],
      "react/no-danger": [
        "error"
      ],
    "react/forbid-prop-types": [
      "off"
    ],
    "import/prefer-default-export": [
      "off"
    ],
    "import/first": [
      "off"
    ],
    "class-methods-use-this": [
      "off"
    ],
    "no-useless-escape": [
      "off"
    ],
  }),
  "settings": {
    "import/extensions": [
      ".js",
      ".jsx"
    ],
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".jsx"
        ],
        "moduleDirectory": [
          ".",
          "client/src",
          "node_modules"
        ]
      }
    }
  }
};
