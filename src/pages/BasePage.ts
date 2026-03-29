/**
 * src/pages/BasePage.ts
 * Core foundation class for all page objects
 * Provides 23 methods across 7 categories: waits, retries, interactions, assertions, accessibility, screenshots, cleanup
 */

import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';
import { WaitHelpers } from '../utils/waitHelpers';
import { RetryHelpers } from '../utils/retryHelpers';
import { ScreenshotHelper } from '../utils/screenshotHelper';
import { COMMON_SELECTORS } from '../constants/selectors';
import { MESSAGES } from '../constants/messages';

export class BasePage {
  readonly page: Page;
  protected logger: Logger;
  protected waitHelpers: WaitHelpers;
  protected retryHelpers: RetryHelpers;
  protected screenshotHelper: ScreenshotHelper;
  protected pageTitle: string = 'Page';

  constructor(page: Page, pageName?: string) {
    this.page = page;
    this.logger = new Logger(pageName || 'BasePage');
    this.waitHelpers = new WaitHelpers(page, this.logger);
    this.retryHelpers = new RetryHelpers(this.logger);
    this.screenshotHelper = new ScreenshotHelper(page, this.logger, pageName);
    this.pageTitle = pageName || 'Page';
  }

  // ========== WAIT UTILITIES (6 methods) ==========

  /**
   * Wait for element to be visible
   */
  async waitForElementVisible(locator: Locator | string, timeout?: number): Promise<void> {
    return this.waitHelpers.waitForElementVisible(locator, timeout);
  }

  /**
   * Wait for element to be hidden
   */
  async waitForElementHidden(locator: Locator | string, timeout?: number): Promise<void> {
    return this.waitHelpers.waitForElementHidden(locator, timeout);
  }

  /**
   * Wait for element to be clickable
   */
  async waitForElementClickable(locator: Locator | string, timeout?: number): Promise<void> {
    return this.waitHelpers.waitForElementClickable(locator, timeout);
  }

  /**
   * Wait for text to appear
   */
  async waitForText(locator: Locator | string, text: string, timeout?: number): Promise<void> {
    return this.waitHelpers.waitForText(locator, text, timeout);
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad(timeout?: number): Promise<void> {
    return this.waitHelpers.waitForPageLoad(timeout);
  }

  /**
   * Wait for URL to change
   */
  async waitForUrlChange(expectedUrl: string, timeout?: number): Promise<void> {
    return this.waitHelpers.waitForUrlChange(expectedUrl, timeout);
  }

  // ========== RETRY MECHANISMS (2 methods) ==========

  /**
   * Execute operation with retry logic
   */
  async executeWithRetry<T>(fn: () => Promise<T>, operationName?: string): Promise<T> {
    return this.retryHelpers.executeWithRetry(fn, operationName);
  }

  /**
   * Retry assertion with exponential backoff
   */
  async retryAssertion(
    assertionFn: () => Promise<void> | void,
    assertionName?: string
  ): Promise<void> {
    return this.retryHelpers.retryAssertion(assertionFn, assertionName);
  }

  // ========== USER INTERACTIONS (5 methods) ==========

  /**
   * Navigate to URL
   */
  async goto(url: string): Promise<void> {
    try {
      this.logger.action('NAVIGATE', url);
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
      await this.waitForPageLoad();
      this.logger.pageLoad(this.page.url());
    } catch (error) {
      this.logger.error(`Navigation failed to ${url}`, error as Error);
      throw error;
    }
  }

  /**
   * Click element
   */
  async click(locator: Locator | string, options?: { force?: boolean; delay?: number }): Promise<void> {
    try {
      const selector = typeof locator === 'string' ? locator : locator.toString();
      this.logger.action('CLICK', selector);
      
      const loc = typeof locator === 'string' ? this.page.locator(selector) : locator;
      await this.waitForElementClickable(loc);
      await loc.click({
        force: options?.force,
        delay: options?.delay
      });
    } catch (error) {
      this.logger.error(`Click failed on locator`, error as Error);
      throw error;
    }
  }

  /**
   * Fill text input
   */
  async fill(locator: Locator | string, text: string, options?: { delay?: number }): Promise<void> {
    try {
      const selector = typeof locator === 'string' ? locator : locator.toString();
      this.logger.action('FILL', selector, `"${text}"`);
      
      const loc = typeof locator === 'string' ? this.page.locator(selector) : locator;
      await this.waitForElementVisible(loc);
      await loc.clear();
      await loc.fill(text, { delay: options?.delay });
    } catch (error) {
      this.logger.error(`Fill failed on locator`, error as Error);
      throw error;
    }
  }

  /**
   * Select dropdown option
   */
  async selectDropdownOption(locator: Locator | string, option: string): Promise<void> {
    try {
      const selector = typeof locator === 'string' ? locator : locator.toString();
      this.logger.action('SELECT', selector, option);
      
      const loc = typeof locator === 'string' ? this.page.locator(selector) : locator;
      await this.waitForElementVisible(loc);
      await loc.selectOption(option);
    } catch (error) {
      this.logger.error(`Dropdown selection failed`, error as Error);
      throw error;
    }
  }

  /**
   * Press keyboard key
   */
  async pressKey(key: string, locator?: Locator | string): Promise<void> {
    try {
      const selector = locator ? (typeof locator === 'string' ? locator : locator.toString()) : 'body';
      this.logger.action('PRESS', selector, `key: ${key}`);
      
      if (locator) {
        const loc = typeof locator === 'string' ? this.page.locator(selector) : locator;
        await loc.focus();
      }
      await this.page.keyboard.press(key);
    } catch (error) {
      this.logger.error(`Key press failed`, error as Error);
      throw error;
    }
  }

  // ========== ELEMENT ASSERTIONS (6 methods) ==========

  /**
   * Get element text
   */
  async getText(locator: Locator | string): Promise<string | null> {
    try {
      const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
      await this.waitForElementVisible(loc);
      const text = await loc.textContent();
      this.logger.debug(`Got text: "${text}"`);
      return text;
    } catch (error) {
      this.logger.error(`Failed to get text from locator`, error as Error);
      throw error;
    }
  }

  /**
   * Get element attribute
   */
  async getAttribute(locator: Locator | string, attributeName: string): Promise<string | null> {
    try {
      const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
      await this.waitForElementVisible(loc);
      const value = await loc.getAttribute(attributeName);
      this.logger.debug(`Got attribute ${attributeName}: "${value}"`);
      return value;
    } catch (error) {
      this.logger.error(`Failed to get attribute from locator`, error as Error);
      throw error;
    }
  }

  /**
   * Get computed style
   */
  async getComputedStyle(locator: Locator | string, property: string): Promise<string> {
    try {
      const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
      const value = await loc.evaluate(
        (el, prop) => window.getComputedStyle(el as Element).getPropertyValue(prop),
        property
      );
      this.logger.debug(`Got style ${property}: "${value}"`);
      return value;
    } catch (error) {
      this.logger.error(`Failed to get computed style`, error as Error);
      throw error;
    }
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(locator: Locator | string): Promise<boolean> {
    try {
      const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
      const isVisible = await loc.isVisible();
      this.logger.debug(`Element visible: ${isVisible}`);
      return isVisible;
    } catch (error) {
      this.logger.debug(`Element visibility check failed`);
      return false;
    }
  }

  /**
   * Check if element is enabled
   */
  async isElementEnabled(locator: Locator | string): Promise<boolean> {
    try {
      const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
      const isEnabled = await loc.isEnabled();
      this.logger.debug(`Element enabled: ${isEnabled}`);
      return isEnabled;
    } catch (error) {
      this.logger.debug(`Element enabled check failed`);
      return false;
    }
  }

  /**
   * Check if element is checked (for checkboxes/radio)
   */
  async isElementChecked(locator: Locator | string): Promise<boolean> {
    try {
      const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
      const isChecked = await loc.isChecked();
      this.logger.debug(`Element checked: ${isChecked}`);
      return isChecked;
    } catch (error) {
      this.logger.debug(`Element checked status check failed`);
      return false;
    }
  }

  // ========== ACCESSIBILITY HELPERS (3 methods) ==========

  /**
   * Check if element is focused
   */
  async isFocused(locator: Locator | string): Promise<boolean> {
    try {
      const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
      const isFocused = await loc.evaluate((el) => {
        return document.activeElement === el;
      });
      this.logger.debug(`Element focused: ${isFocused}`);
      return isFocused;
    } catch (error) {
      this.logger.debug(`Focus check failed`);
      return false;
    }
  }

  /**
   * Get ARIA label
   */
  async getAriaLabel(locator: Locator | string): Promise<string | null> {
    try {
      const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
      const ariaLabel = await loc.getAttribute('aria-label');
      this.logger.debug(`Got aria-label: "${ariaLabel}"`);
      return ariaLabel;
    } catch (error) {
      this.logger.error(`Failed to get aria-label`, error as Error);
      throw error;
    }
  }

  /**
   * Get element role
   */
  async getElementRole(locator: Locator | string): Promise<string | null> {
    try {
      const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
      const role = await loc.getAttribute('role');
      this.logger.debug(`Got role: "${role}"`);
      return role;
    } catch (error) {
      this.logger.error(`Failed to get role attribute`, error as Error);
      throw error;
    }
  }

  // ========== SCREENSHOT & LOGGING (3 methods) ==========

  /**
   * Capture screenshot on failure
   */
  async captureScreenshot(fileName?: string): Promise<string> {
    return this.screenshotHelper.captureViewport(fileName);
  }

  /**
   * Capture full page screenshot
   */
  async captureFullPageScreenshot(fileName?: string): Promise<string> {
    return this.screenshotHelper.captureFullPage(fileName);
  }

  /**
   * Log assertion with result
   */
  async logAssertion(description: string, actual: any, expected: any, passed: boolean): void {
    this.logger.assertion(description, passed, String(actual), String(expected));
  }

  // ========== CLEANUP & TEARDOWN (4 methods) ==========

  /**
   * Navigate back
   */
  async navigateBack(): Promise<void> {
    try {
      this.logger.action('NAVIGATE', 'back');
      await this.page.goBack();
      await this.waitForPageLoad();
    } catch (error) {
      this.logger.warn(`Navigation back failed`, { error: String(error) });
    }
  }

  /**
   * Reload current page
   */
  async reloadPage(): Promise<void> {
    try {
      this.logger.action('RELOAD', this.page.url());
      await this.page.reload();
      await this.waitForPageLoad();
    } catch (error) {
      this.logger.error(`Page reload failed`, error as Error);
      throw error;
    }
  }

  /**
   * Clear browser data (cookies, storage, etc.)
   */
  async clearBrowserData(): Promise<void> {
    try {
      this.logger.info('Clearing cookies and local storage');
      await this.page.context()?.clearCookies();
      await this.page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    } catch (error) {
      this.logger.warn(`Failed to clear browser data`, { error: String(error) });
    }
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    const url = this.page.url();
    this.logger.debug(`Current URL: ${url}`);
    return url;
  }

  // ========== UTILITY METHODS ==========

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    const title = await this.page.title();
    this.logger.info(`Page title: ${title}`);
    return title;
  }

  /**
   * Wait for specific time
   */
  async waitForTimeout(milliseconds: number): Promise<void> {
    this.logger.debug(`Waiting ${milliseconds}ms`);
    return this.waitHelpers.delay(milliseconds);
  }

  /**
   * Check if element exists
   */
  async isElementPresent(locator: Locator | string): Promise<boolean> {
    try {
      const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
      const count = await loc.count();
      return count > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get number of matching elements
   */
  async getElementCount(locator: Locator | string): Promise<number> {
    try {
      const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
      const count = await loc.count();
      this.logger.debug(`Element count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error(`Failed to get element count`, error as Error);
      throw error;
    }
  }

  /**
   * Switch to iframe
   */
  frameLocator(frameSelector: string): any {
    this.logger.action('SWITCH_FRAME', frameSelector);
    return this.page.frameLocator(frameSelector);
  }

  /**
   * Tear down (cleanup)
   */
  async tearDown(): Promise<void> {
    try {
      this.logger.info(`Tearing down ${this.pageTitle}`);
      await this.screenshotHelper.clearScreenshots();
    } catch (error) {
      this.logger.warn(`Teardown failed`, { error: String(error) });
    }
  }
}

export default BasePage;
