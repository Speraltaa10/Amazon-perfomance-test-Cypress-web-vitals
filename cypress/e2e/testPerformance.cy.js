describe("Lighthouse metrics Desktop and Mobile", () => {
  it("Capture metrics for Desktop and Mobile", () => {
    //Lighthouse thresholds Desktop
    const thresholdsDesktop = {
      "performance": 50,
        "first-contentful-paint": 3000,
        "largest-contentful-paint": 3000,
        "total-blocking-time": 200,
        "cumulative-layout-shift": 0.1,
        "speed-index": 3000
    };
    //Lighthouse thresholds Mobile
    const thresholdsMobile={
      performance: 50,
      'first-contentful-paint': 4000,
      'largest-contentful-paint': 4000,
      'total-blocking-time': 300,
      'cumulative-layout-shift': 0.2,
      'speed-index': 4000,
    };

    //Setting up Desktop
    const desktopConfig = {
      formFactor: "desktop",
      screenEmulation: {
        width: 1350,
        height: 940,
        deviceScaleRatio: 1,
        mobile: false,
        disabled: false,
      },
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4,
      },
    };

    //Setting up Mobile
    const MobileConfig = {
      formFactor: "mobile",
      screenEmulation: {
        width: 412,
        height: 732,
        deviceScaleRatio: 2.625,
        mobile: true,
        disabled: false,
      },
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4,
      },
    };
    //Visit page
    cy.visit('/');
    //Executing Lighthouse for Desktop
    cy.lighthouse(thresholdsDesktop, desktopConfig).then((lighthouseReport) =>{
      cy.log("Lighthouse Results for Desktop");
    });

    cy.lighthouse(thresholdsMobile, MobileConfig). then((lighthouseReport) =>{
      cy.log("Lighthouse Results for Desktop");
    });
  });
});









