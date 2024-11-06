// i18n-extract.config.js
module.exports = {
  input: ["./src/**/*.js"],
  output: {
    path: "./src/locales/{{lng}}/{{ns}}.json",
    jsonIndent: 2,
  },
};
