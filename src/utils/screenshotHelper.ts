/**
 * src/utils/screenshotHelper.ts
 * Screenshot capture utilities for debugging and reporting
 */

import { Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { Logger } from './logger';

export class ScreenshotHelper {
  private screenshotDir: string;
  private testName: string;

  constructor(
    private page: Page,
    private logger: Logger,
    testName?: string
  ) {
    this.testName = testName || 'test';
    this.screenshotDir = path.join(process.cwd(), 'screenshots', this.testName);
    
    // Create screenshot directory if it doesn't exist
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }

  /**
   * Capture full page screenshot
   */
  async captureFullPage(fileName?: string): Promise<string> {
    const name = fileName || `full-page-${Date.now()}.png`;
    const filePath = path.join(this.screenshotDir, name);

    try {
      this.logger.screenshot(`Full page: ${name}`);
      await this.page.screenshot({
        path: filePath,
        fullPage: true
      });
      this.logger.info(`Screenshot saved: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to capture full page screenshot`, error as Error);
      throw error;
    }
  }

  /**
   * Capture viewport screenshot (visible area only)
   */
  async captureViewport(fileName?: string): Promise<string> {
    const name = fileName || `viewport-${Date.now()}.png`;
    const filePath = path.join(this.screenshotDir, name);

    try {
      this.logger.screenshot(`Viewport: ${name}`);
      await this.page.screenshot({
        path: filePath,
        fullPage: false
      });
      this.logger.info(`Screenshot saved: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to capture viewport screenshot`, error as Error);
      throw error;
    }
  }

  /**
   * Capture specific element
   */
  async captureElement(selector: string, fileName?: string): Promise<string> {
    const name = fileName || `element-${Date.now()}.png`;
    const filePath = path.join(this.screenshotDir, name);

    try {
      this.logger.screenshot(`Element: ${selector}`);
      const locator = this.page.locator(selector);
      
      // Wait for element to be visible
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      
      await locator.screenshot({ path: filePath });
      this.logger.info(`Element screenshot saved: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to capture element screenshot: ${selector}`, error as Error);
      throw error;
    }
  }

  /**
   * Capture on failure (error scenario screenshot)
   */
  async captureOnFailure(errorMessage?: string, fileName?: string): Promise<string> {
    const name = fileName || `failure-${Date.now()}.png`;
    const filePath = path.join(this.screenshotDir, name);

    try {
      const currentUrl = this.page.url();
      const title = await this.page.title();
      
      this.logger.screenshot(`On failure: ${name}`, filePath);
      
      await this.page.screenshot({
        path: filePath,
        fullPage: true
      });

      // Create failure metadata file
      const metadataPath = filePath.replace('.png', '.json');
      const metadata = {
        fileName: name,
        timestamp: new Date().toISOString(),
        url: currentUrl,
        pageTitle: title,
        error: errorMessage || 'Test failed'
      };
      
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      
      this.logger.error(`Screenshot captured on failure: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to capture failure screenshot`, error as Error);
      throw error;
    }
  }

  /**
   * Capture multiple elements at once
   */
  async captureElements(selectors: string[], prefix?: string): Promise<string[]> {
    const filePaths: string[] = [];

    for (let i = 0; i < selectors.length; i++) {
      try {
        const selector = selectors[i];
        const fileName = prefix 
          ? `${prefix}-element-${i + 1}.png`
          : `element-${i + 1}.png`;
        
        const filePath = await this.captureElement(selector, fileName);
        filePaths.push(filePath);
      } catch (error) {
        this.logger.warn(`Could not capture element at index ${i}`, { error: String(error) });
      }
    }

    return filePaths;
  }

  /**
   * Capture comparison screenshot (before/after)
   */
  async captureBeforeAfter(
    beforeFileName: string,
    afterFileName: string,
    selector?: string
  ): Promise<{ before: string; after: string }> {
    try {
      let beforePath: string;
      let afterPath: string;

      // Capture before
      if (selector) {
        beforePath = await this.captureElement(selector, beforeFileName);
      } else {
        beforePath = await this.captureViewport(beforeFileName);
      }

      // Perform action (caller's responsibility, so we just capture)
      await this.page.waitForTimeout(500);

      // Capture after
      if (selector) {
        afterPath = await this.captureElement(selector, afterFileName);
      } else {
        afterPath = await this.captureViewport(afterFileName);
      }

      return { before: beforePath, after: afterPath };
    } catch (error) {
      this.logger.error(`Failed to capture before/after screenshots`, error as Error);
      throw error;
    }
  }

  /**
   * Capture with custom options
   */
  async captureCustom(fileName: string, options?: {
    fullPage?: boolean;
    omitBackground?: boolean;
    timeout?: number;
  }): Promise<string> {
    const filePath = path.join(this.screenshotDir, fileName);
    const screenshotOptions = {
      path: filePath,
      fullPage: options?.fullPage ?? true,
      omitBackground: options?.omitBackground ?? false
    };

    try {
      this.logger.screenshot(`Custom capture: ${fileName}`);
      await this.page.screenshot(screenshotOptions);
      this.logger.info(`Custom screenshot saved: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to capture custom screenshot`, error as Error);
      throw error;
    }
  }

  /**
   * Create comparison PDF from multiple screenshots
   */
  async capturePDF(fileName?: string): Promise<string> {
    const name = fileName || `report-${Date.now()}.pdf`;
    const filePath = path.join(this.screenshotDir, name);

    try {
      this.logger.screenshot(`PDF capture: ${name}`);
      await this.page.pdf({
        path: filePath,
        format: 'A4'
      });
      this.logger.info(`PDF saved: ${filePath}`);
      return filePath;
    } catch (error) {
      this.logger.error(`Failed to capture PDF`, error as Error);
      throw error;
    }
  }

  /**
   * Get screenshot directory
   */
  public getScreenshotDirectory(): string {
    return this.screenshotDir;
  }

  /**
   * Get all screenshots for this test
   */
  public getScreenshots(): string[] {
    try {
      if (!fs.existsSync(this.screenshotDir)) {
        return [];
      }
      return fs.readdirSync(this.screenshotDir)
        .filter(file => file.endsWith('.png'))
        .map(file => path.join(this.screenshotDir, file));
    } catch (error) {
      this.logger.error('Failed to get screenshots list', error as Error);
      return [];
    }
  }

  /**
   * Clear screenshots for this test
   */
  public clearScreenshots(): void {
    try {
      if (fs.existsSync(this.screenshotDir)) {
        const files = fs.readdirSync(this.screenshotDir);
        for (const file of files) {
          const filePath = path.join(this.screenshotDir, file);
          fs.unlinkSync(filePath);
        }
        this.logger.info(`Cleared ${files.length} screenshots`);
      }
    } catch (error) {
      this.logger.error('Failed to clear screenshots', error as Error);
    }
  }

  /**
   * Set test name for screenshot directory
   */
  public setTestName(testName: string): void {
    this.testName = testName;
    this.screenshotDir = path.join(process.cwd(), 'screenshots', testName);
    
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
    }
  }
}

export default ScreenshotHelper;
