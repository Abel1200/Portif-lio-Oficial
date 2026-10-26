import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["app.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        document: "readonly"
      }
    }
  }
];

