/**
 * src/utils/waitHelpers.ts
 * Custom wait utilities and strategies for reliable element handling
 */

import { Page, Locator } from '@playwright/test';
import { TIMEOUTS } from '../constants/timeouts';
import { Logger } from './logger';

export class WaitHelpers {
  constructor(private page: Page, private logger: Logger) {}

  /**
   * Wait for element to be visible in DOM
   */
  async waitForElementVisible(locator: Locator | string, timeout?: number): Promise<void> {
    const selector = typeof locator === 'string' ? locator : locator.toString();
    const waitTimeout = timeout || TIMEOUTS.IMPLICIT_WAIT;
    
    try {
      this.logger.wait(selector, 'visible', waitTimeout);
      const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
      await loc.waitFor({ state: 'visible', timeout: waitTimeout });
    } catch (error) {
      this.logger.error(`Element not visible within ${waitTimeout}ms: ${selector}`, error as Error);
      throw error;
    }
  }

  /**
   * Wait for element to be hidden in DOM
   */
  async waitForElementHidden(locator: Locator | string, timeout?: number): Promise<void> {
    const selector = typeof locator === 'string' ? locator : locator.toString();
    const waitTimeout = timeout || TIMEOUTS.IMPLICIT_WAIT;
    
    try {
      this.logger.wait(selector, 'hidden', waitTimeout);
      const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
      await loc.waitFor({ state: 'hidden', timeout: waitTimeout });
    } catch (error) {
      this.logger.error(`Element not hidden within ${waitTimeout}ms: ${selector}`, error as Error);
      throw error;
    }
  }

  /**
   * Wait for element to be attached (in DOM)
   */
  async waitForElementAttached(locator: Locator | string, timeout?: number): Promise<void> {
    const selector = typeof locator === 'string' ? locator : locator.toString();
    const waitTimeout = timeout || TIMEOUTS.IMPLICIT_WAIT;
    
    try {
      this.logger.wait(selector, 'attached', waitTimeout);
      const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
      await loc.waitFor({ state: 'attached', timeout: waitTimeout });
    } catch (error) {
      this.logger.error(`Element not attached within ${waitTimeout}ms: ${selector}`, error as Error);
      throw error;
    }
  }

  /**
   * Wait for element to be clickable (visible and enabled)
   */
  async waitForElementClickable(locator: Locator | string, timeout?: number): Promise<void> {
    const selector = typeof locator === 'string' ? locator : locator.toString();
    const waitTimeout = timeout || TIMEOUTS.EXPLICIT_WAIT;
    
    try {
      this.logger.wait(selector, 'clickable', waitTimeout);
      const loc = typeof locator === 'string' ? this.page.locator(selector) : locator;
      
      // Wait for element to be visible first
      await loc.waitFor({ state: 'visible', timeout: waitTimeout });
      
      // Check if enabled (not disabled)
      const isDisabled = await loc.evaluate(el => (el as HTMLElement).hasAttribute('disabled'));
      if (isDisabled) {
        throw new Error(`Element is disabled: ${selector}`);
      }
    } catch (error) {
      this.logger.error(`Element not clickable within ${waitTimeout}ms: ${selector}`, error as Error);
      throw error;
    }
  }

  /**
   * Wait for element to have specific text
   */
  async waitForText(locator: Locator | string, text: string, timeout?: number): Promise<void> {
    const selector = typeof locator === 'string' ? locator : locator.toString();
    const waitTimeout = timeout || TIMEOUTS.EXPLICIT_WAIT;
    
    try {
      this.logger.wait(selector, `text "${text}"`, waitTimeout);
      const loc = typeof locator === 'string' ? this.page.locator(selector) : locator;
      await loc.waitFor({ state: 'visible', timeout: waitTimeout });
      
      const startTime = Date.now();
      while (Date.now() - startTime < waitTimeout) {
        const content = await loc.textContent();
        if (content && content.includes(text)) {
          return;
        }
        await this.page.waitForTimeout(100);
      }
      throw new Error(`Text not found: ${text}`);
    } catch (error) {
      this.logger.error(`Text "${text}" not found in ${selector} within ${waitTimeout}ms`, error as Error);
      throw error;
    }
  }

  /**
   * Wait for page to load (network idle)
   */
  async waitForPageLoad(timeout?: number): Promise<void> {
    const waitTimeout = timeout || TIMEOUTS.PAGE_LOAD_TIMEOUT;
    
    try {
      this.logger.info(`Waiting for page load (${waitTimeout}ms)`);
      await this.page.waitForLoadState('networkidle', { timeout: waitTimeout });
      this.logger.pageLoad(this.page.url());
    } catch (error) {
      this.logger.error(`Page did not load within ${waitTimeout}ms`, error as Error);
      throw error;
    }
  }

  /**
   * Wait for specific URL
   */
  async waitForUrlChange(expectedUrl: string, timeout?: number): Promise<void> {
    const waitTimeout = timeout || TIMEOUTS.PAGE_LOAD_TIMEOUT;
    
    try {
      this.logger.info(`Waiting for URL change to: ${expectedUrl}`);
      await this.page.waitForURL(expectedUrl, { timeout: waitTimeout });
    } catch (error) {
      this.logger.error(`URL did not change to ${expectedUrl} within ${waitTimeout}ms`, error as Error);
      throw error;
    }
  }

  /**
   * Wait for function to return true
   */
  async waitForCondition(
    conditionFn: () => Promise<boolean>,
    timeout?: number,
    message?: string
  ): Promise<void> {
    const waitTimeout = timeout || TIMEOUTS.EXPLICIT_WAIT;
    const startTime = Date.now();
    
    try {
      this.logger.debug(`Waiting for condition: ${message || 'custom condition'}`);
      
      while (Date.now() - startTime < waitTimeout) {
        try {
          const result = await conditionFn();
          if (result) {
            this.logger.debug(`Condition met: ${message || 'custom condition'}`);
            return;
          }
        } catch (error) {
          // Condition check failed, retry
        }
        await this.page.waitForTimeout(100);
      }
      
      throw new Error(`Condition not met within ${waitTimeout}ms`);
    } catch (error) {
      this.logger.error(
        `Condition failed within ${waitTimeout}ms: ${message || 'custom condition'}`,
        error as Error
      );
      throw error;
    }
  }

  /**
   * Wait for multiple elements to be visible
   */
  async waitForElementsVisible(locators: Locator[] | string[], timeout?: number): Promise<void> {
    const waitTimeout = timeout || TIMEOUTS.IMPLICIT_WAIT;
    
    try {
      this.logger.debug(`Waiting for ${locators.length} elements to be visible`);
      
      const promises = locators.map((locator) => {
        const loc = typeof locator === 'string' ? this.page.locator(locator) : locator;
        return loc.waitFor({ state: 'visible', timeout: waitTimeout });
      });
      
      await Promise.all(promises);
    } catch (error) {
      this.logger.error(`Not all elements became visible within ${waitTimeout}ms`, error as Error);
      throw error;
    }
  }

  /**
   * Wait for element count to match expected
   */
  async waitForElementCount(locator: Locator | string, count: number, timeout?: number): Promise<void> {
    const selector = typeof locator === 'string' ? locator : locator.toString();
    const waitTimeout = timeout || TIMEOUTS.EXPLICIT_WAIT;
    const startTime = Date.now();
    
    try {
      this.logger.wait(selector, `count = ${count}`, waitTimeout);
      const loc = typeof locator === 'string' ? this.page.locator(selector) : locator;
      
      while (Date.now() - startTime < waitTimeout) {
        const actualCount = await loc.count();
        if (actualCount === count) {
          return;
        }
        await this.page.waitForTimeout(100);
      }
      
      const finalCount = await loc.count();
      throw new Error(`Expected ${count} elements but found ${finalCount}`);
    } catch (error) {
      this.logger.error(`Element count not ${count} within ${waitTimeout}ms`, error as Error);
      throw error;
    }
  }

  /**
   * Wait for attribute to have specific value
   */
  async waitForAttribute(
    locator: Locator | string,
    attribute: string,
    value: string,
    timeout?: number
  ): Promise<void> {
    const selector = typeof locator === 'string' ? locator : locator.toString();
    const waitTimeout = timeout || TIMEOUTS.EXPLICIT_WAIT;
    const startTime = Date.now();
    
    try {
      this.logger.wait(selector, `${attribute}="${value}"`, waitTimeout);
      const loc = typeof locator === 'string' ? this.page.locator(selector) : locator;
      
      while (Date.now() - startTime < waitTimeout) {
        const attrValue = await loc.getAttribute(attribute);
        if (attrValue === value) {
          return;
        }
        await this.page.waitForTimeout(100);
      }
      
      throw new Error(`Attribute ${attribute} did not equal ${value}`);
    } catch (error) {
      this.logger.error(
        `Attribute ${attribute}="${value}" not found within ${waitTimeout}ms`,
        error as Error
      );
      throw error;
    }
  }

  /**
   * Wait for API response
   */
  async waitForResponse(urlPattern: string | RegExp, timeout?: number): Promise<any> {
    const waitTimeout = timeout || TIMEOUTS.API_RESPONSE_TIMEOUT;
    
    try {
      this.logger.debug(`Waiting for API response: ${urlPattern}`);
      const response = await this.page.waitForResponse(
        (res) => {
          if (typeof urlPattern === 'string') {
            return res.url().includes(urlPattern);
          }
          return urlPattern.test(res.url());
        },
        { timeout: waitTimeout }
      );
      
      const status = response.status();
      this.logger.apiRequest(response.request().method(), response.url(), status);
      
      return response;
    } catch (error) {
      this.logger.error(`API response not received within ${waitTimeout}ms`, error as Error);
      throw error;
    }
  }

  /**
   * Wait with specified delay (simple sleep)
   */
  async delay(milliseconds: number): Promise<void> {
    this.logger.debug(`Delaying ${milliseconds}ms`);
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}

export default WaitHelpers;
