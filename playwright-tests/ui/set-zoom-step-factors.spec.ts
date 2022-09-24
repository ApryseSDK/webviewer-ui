import { loadViewerSample, loadConsoleSample } from '../../playwright-utils';
import { test, expect } from '@playwright/test';

test.describe.skip('SetZoomStepFactors', () => {
    // TODO:reenable this. This will disable to reduce runtime and not exceed circleCI limit
    test('should print error when there is zoomStepFactors is an empty array', async ({ page, browserName }) => {
        test.skip(browserName === 'firefox', 'TODO: investigate why this test fails on firefox');
        const waitForTimeout = {
            chromium: 10000,
            firefox: 10000,
            webkit: 10000
          };
      
        const { consoleLogs } = await loadConsoleSample(page, waitForTimeout[browserName], 'viewing/viewing');
        
        const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
        const instance = await waitForInstance();
        await instance('setZoomStepFactors', []);
        await page.waitForTimeout(5000);
        const expectedConsoleLog = consoleLogs.filter(log => log.includes('zoomStepFactors'));
        expect(expectedConsoleLog.length).toBe(1);
    });

    test('should print error when there is no zoomStepFactor with startZoom: 0', async ({ page, browserName }) => {
        test.skip(browserName === 'firefox', 'TODO: investigate why this test fails on firefox');
        const waitForTimeout = {
            chromium: 10000,
            firefox: 10000,
            webkit: 10000
          };
      
        const { consoleLogs, downloadedFiles } = await loadConsoleSample(page, waitForTimeout[browserName], 'viewing/viewing');
        
        const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
        const instance = await waitForInstance();
        await instance('setZoomStepFactors', [
            {
                step: 50,
                startZoom: 50
            }
        ]);

        await page.waitForTimeout(5000);
        const expectedConsoleLog = consoleLogs.filter(log => log.includes('zoomStepFactors'))
        expect(expectedConsoleLog.length).toBe(1);
    });

    test('should accept both zoomStepFactor.step and zoomStepFactor.startZoom as percentage in strings', async ({ page }) => {
        const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
        const instance = await waitForInstance();
        await page.waitForTimeout(5000);
        const firstZoomLevel = await instance('getZoomLevel');
        await instance('setZoomStepFactors', [
            {
                step: '50',
                startZoom: '0'
            },
            {
                step: '100',
                startZoom: '200'
            }
        ]);

        await page.waitForTimeout(1000);
        let zoomLevels = [firstZoomLevel];

        for (let i = 0; i < 5; i++) {
            await iframe.click('[data-element=zoomInButton]');
            await page.waitForTimeout(1000);
            const currentZoomLevel = await instance('getZoomLevel');
            zoomLevels.push(Number(currentZoomLevel.toFixed(2)));
        }

        for (let i = 0; i < zoomLevels.length; i++) {
            if (zoomLevels[i + 1]) {
                zoomLevels[i] > 2?
                    expect(zoomLevels[i + 1]).toBe(Number((zoomLevels[i] + 1).toFixed(2))) :
                    expect(zoomLevels[i + 1]).toBe(Number((zoomLevels[i] + 0.5).toFixed(2)));
            }
        }
    });

    test('should accept both zoomStepFactor.step and zoomStepFactor.startZoom as percetage in number', async ({ page }) => {
        const { iframe, waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
        const instance = await waitForInstance();
        await page.waitForTimeout(5000);
        const firstZoomLevel = await instance('getZoomLevel');
        await instance('setZoomStepFactors', [
            {
                step: 50,
                startZoom: 0
            },
            {
                step: 100,
                startZoom: 200
            }
        ]);

        await page.waitForTimeout(1000);
        let zoomLevels = [firstZoomLevel];

        for (let i = 0; i < 5; i++) {
            await iframe.click('[data-element=zoomInButton]');
            await page.waitForTimeout(1000);
            const currentZoomLevel = await instance('getZoomLevel');
            zoomLevels.push(Number(currentZoomLevel.toFixed(2)));
        }

        for (let i = 0; i < zoomLevels.length; i++) {
            if (zoomLevels[i + 1]) {

                zoomLevels[i] > 2?
                    expect(zoomLevels[i + 1]).toBe(Number((zoomLevels[i] + 1).toFixed(2))) :
                    expect(zoomLevels[i + 1]).toBe(Number((zoomLevels[i] + 0.5).toFixed(2)));
            }
        }
    });

    test('should print: "Invalid step input." when zoomStepFactor.step cannot be parsed to number', async ({ page, browserName }) => {
        test.skip(browserName === 'firefox', 'TODO: investigate why this test fails on firefox');
        const waitForTimeout = {
            chromium: 10000,
            firefox: 10000,
            webkit: 10000
          };
        const { consoleLogs, downloadedFiles } = await loadConsoleSample(page, waitForTimeout[browserName], 'viewing/viewing');
        
        const { waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
        const instance = await waitForInstance();
        await page.waitForTimeout(5000);
        const firstZoomLevel = await instance('getZoomLevel');
        await instance('setZoomStepFactors', [
            {
                step: 'aa',
                startZoom: 0
            },
            {
                step: 100,
                startZoom: 200
            }
        ]);

        await page.waitForTimeout(5000);
        const expectedConsoleLog = consoleLogs.filter(log => log.includes('Invalid step input.'))
        expect(expectedConsoleLog.length).toBe(1);
    });

    test('should print: "Invalid step input." when zoomStepFactor.startZoom cannot be parsed to number', async ({ page, browserName }) => {
        test.skip(browserName === 'firefox', 'TODO: investigate why this test fails on firefox');
        const waitForTimeout = {
            chromium: 10000,
            firefox: 10000,
            webkit: 10000
          };
        const { consoleLogs, downloadedFiles } = await loadConsoleSample(page, waitForTimeout[browserName], 'viewing/viewing');
        
        const { waitForInstance } = await loadViewerSample(page, 'viewing/viewing');
        const instance = await waitForInstance();
        await page.waitForTimeout(5000);
        const firstZoomLevel = await instance('getZoomLevel');
        await instance('setZoomStepFactors', [
            {
                step: 20,
                startZoom: 0
            },
            {
                step: 100,
                startZoom: 'aa'
            }
        ]);

        await page.waitForTimeout(5000);
        const expectedConsoleLog = consoleLogs.filter(log => log.includes('Invalid startZoom input.'))
        expect(expectedConsoleLog.length).toBe(1);
    });
})