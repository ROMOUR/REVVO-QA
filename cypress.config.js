const { defineConfig } = require("cypress");

module.exports = defineConfig({
  retries: {
    runMode: 2,
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    baseUrl: 'https://sandbox.moodledemo.net/login/index.php',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
