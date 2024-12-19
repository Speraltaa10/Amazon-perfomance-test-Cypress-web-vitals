import "cypress-web-vitals";
import "@cypress-audit/lighthouse/commands";

// Definición de la función removeCircularReferences
function removeCircularReferences(obj) {
  const seen = new WeakSet();

  function clean(obj) {
    if (obj && typeof obj === "object") {
      if (seen.has(obj)) {
        return undefined; // Eliminar la referencia circular
      }
      seen.add(obj);

      // Crear un nuevo objeto limpio sin modificar el original
      const newObj = Array.isArray(obj) ? [] : {};
      Object.keys(obj).forEach((key) => {
        try {
          newObj[key] = clean(obj[key]); // Limpiar recursivamente
        } catch (e) {
          // Omitir propiedades que no puedan ser accedidas
          console.warn(`Omitting property ${key}: ${e.message}`);
        }
      });
      return newObj;
    }
    return obj; // Devolver valores primitivos como están
  }

  return clean(obj);
}

// Prueba Cypress
describe("Capture metrics", () => {
  it("saves Lighthouse and Web Vitals metrics to a JSON file", () => {
    const metrics = {}; // Objeto para almacenar las métricas

    // Capturar métricas de Lighthouse
    cy.task("lighthouse", {
      url: "https://www.amazon.com",
      thresholds: {
        performance: 50,
        accessibility: 50,
        "best-practices": 50,
        seo: 50,
      },
    })
      .then((lighthouseResults) => {
        // Limpiar los resultados de Lighthouse
        const cleanLighthouseResults = removeCircularReferences(lighthouseResults);
        metrics.lighthouse = cleanLighthouseResults;
      })
      .then(() => {
        // Capturar métricas de Web Vitals después de Lighthouse
        cy.visit("https://www.amazon.com");
        cy.vitals({
        }).then((webVitalsResults) => {
          // Limpiar los resultados de Web Vitals
          const cleanWebVitalsResults = removeCircularReferences(webVitalsResults);
          metrics.webVitals = cleanWebVitalsResults;
        });
      })
      .then(() => {
        // Escribir las métricas en un archivo JSON
        cy.writeFile("metrics-results.json", metrics);
        cy.log("Metrics saved to metrics-results.json");
      });
  });
});


