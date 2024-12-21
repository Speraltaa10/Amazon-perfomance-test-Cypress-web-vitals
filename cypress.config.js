const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");
const fs = require("fs");


module.exports = {
  e2e: {
    baseUrl: "https://www.google.com", // baseUrl correcto
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });

      //Lighthouse Report Desktop
      on("task", {
        lighthouse: lighthouse((lighthouseReport) =>{
          const filepath= "./cypress/fixtures/lighthouse-metrics-desktop.json";
          console.log("---- Lighthouse report ----");

          let data = [];
          if(fs.existsSync(filepath)){
            try{
              const fileContent = fs.readFileSync(filepath, "utf-8");
              data = JSON.parse(fileContent);
            }catch(error){
              console.error("Error leyendo el archivo", error);
              console.log(error);
            }
          }

          const {lhr} = lighthouseReport;
          const report = {
            viewport: lhr.configSettings['formFactor'],
            date: lhr.fetchTime,
            firstContentfulPaint_FCP: lhr.audits['first-contentful-paint'].numericValue,
            largestContentfulPaint_LCP: lhr.audits['largest-contentful-paint'].numericValue,
            cumulativeLayoutShift_CLS: lhr.audits['cumulative-layout-shift'].numericValue,
            speedIndex_SI: lhr.audits['speed-index'].numericValue,
          }

          data.push(report);
          fs.writeFile(filepath, JSON.stringify(data, null, 2), (error) => {
            error?console.error("Error escrbiendo el archivo", error):
              console.log("Report lighthouse metrics");
          });
        }),
      });
    },
  }
}





