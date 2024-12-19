const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");

module.exports = {
  e2e: {
    baseUrl: "https://www.amazon.com", // baseUrl correcto
    setupNodeEvents(on, config) {
      const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");

      on("before:browser:launch", (browser = {}, launchOptions) => {
        prepareAudit(launchOptions); // Prepara el navegador para la auditoría
      });

      on("task", {
        lighthouse: lighthouse(), // Define la tarea de Lighthouse
      });
    },
    chromeWebSecurity: false,
  },
};




