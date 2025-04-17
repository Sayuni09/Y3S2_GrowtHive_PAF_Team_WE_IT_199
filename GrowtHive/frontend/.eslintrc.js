module.exports = {
    extends: ["react-app"],
    rules: {
      "no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_", 
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_" 
      }],
      "jsx-a11y/anchor-is-valid": ["warn", {
        "components": ["Link"],
        "specialLink": ["to"]
      }]
    }
  };
  