import { loadViewerSample } from "../../playwright-utils";
import { expect, test } from "@playwright/test";

test.describe("Page manipulation overlay", () => {
  test("Overlay should be closed when loadDocument is called", async ({
    page,
  }) => {
    const { iframe, waitForInstance } = await loadViewerSample(
      page,
      "viewing/blank"
    );
    const instance = await waitForInstance();

    await page.waitForTimeout(5000);

    await iframe.click("[data-element=leftPanelButton]");
    await iframe.click("[data-element=pageManipulationOverlayButton]");

    let isElementOpen = await instance("isElementOpen", [
      "pageManipulationOverlay",
    ]);

    expect(isElementOpen).toBe(true);

    await instance("loadDocument", "/test-files/datepicker.pdf");

    await page.waitForTimeout(3000);

    isElementOpen = await instance("isElementOpen", [
      "pageManipulationOverlay",
    ]);
    expect(isElementOpen).toBe(false);
  });
});
