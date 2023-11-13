module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: ["plugin:@typescript-eslint/recommended", "prettier", "plugin:prettier/recommended"],
  plugins: ["@typescript-eslint"],
  rules: {
    indent: 0,
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
        singleQuote: false,
        tabWidth: 2
      }
    ],
    "no-trailing-spaces": ["error", { skipBlankLines: true }],
    "vue/multi-word-component-names": "off",
    "prefer-rest-params": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "ban-ts-comment": "off"
  }
}
