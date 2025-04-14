module.exports = {
  root: true,
  extends: ["eslint:recommended", "next/core-web-vitals"],
  rules: {
    // Possible Errors
    "no-undef": "error",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-console": "warn",

    // Best Practices
    eqeqeq: ["error", "always"],
    curly: "error",

    // Style (minimal)
    semi: ["error", "always"],
    quotes: ["error", "single"],

    // React/JSX (Next.js uses React under the hood)
    "react/react-in-jsx-scope": "off", // not needed with Next.js

    // Disable TypeScript no-explicit-any rule
    "@typescript-eslint/no-explicit-any": "off",
  },
};
