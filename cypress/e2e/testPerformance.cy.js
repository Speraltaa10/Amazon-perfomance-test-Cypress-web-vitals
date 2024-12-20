import "cypress-web-vitals";
import "@cypress-audit/lighthouse/commands";

describe("Capture metrics", () => {
  it("saves Lighthouse and Web Vitals metrics to a JSON file", () => {
    const metrics = {
      lighthouse: {
        metrics: {},
      },
      webVitals: {},
    };

    // Capturar métricas de Lighthouse
    cy.task("lighthouse", {
      url: "https://www.amazon.com",
      thresholds: {
        performance: 50,
        accessibility: 50,
        "best-practices": 50,
        seo: 50,
      },
    }).then((lighthouseResults) => {
      // Reorganizar métricas de Lighthouse
      const categories = ["performance", "accessibility", "bestPractices", "seo"];
      categories.forEach((category) => {
        const score = lighthouseResults[category];
        const threshold = 50; // Ajusta según tu configuración
        metrics.lighthouse.metrics[category] = {
          score,
          threshold,
          status: score >= threshold ? "Pass" : "Fail",
        };
      });
    });

    // Capturar métricas de Web Vitals
    cy.visit("https://www.amazon.com");
    cy.vitals({
      thresholds: {
        LCP: 4000, // Ajustar umbral de Largest Contentful Paint (ms)
        FCP: 3000, // Ajustar umbral de First Contentful Paint (ms)
        TTFB: 1000, // Ajustar umbral de Time to First Byte (ms)
      },
    }).then((webVitalsResults) => {
      // Reorganizar métricas de Web Vitals
      metrics.webVitals = {
        LCP: {
          value: webVitalsResults.LCP,
          threshold: 4000,
          status: webVitalsResults.LCP <= 4000 ? "Pass" : "Fail",
        },
        FCP: {
          value: webVitalsResults.FCP,
          threshold: 3000,
          status: webVitalsResults.FCP <= 3000 ? "Pass" : "Fail",
        },
        TTFB: {
          value: webVitalsResults.TTFB,
          threshold: 1000,
          status: webVitalsResults.TTFB <= 1000 ? "Pass" : "Fail",
        },
      };
    });

    // Guardar las métricas en un archivo JSON
    cy.then(() => {
      cy.writeFile("metrics-results.json", metrics);
      cy.log("Metrics saved to metrics-results.json");
    });
  });
});
