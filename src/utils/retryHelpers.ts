/**
 * src/utils/retryHelpers.ts
 * Retry logic with exponential backoff for resilient test execution
 */

import { RETRY_CONFIG } from '../constants/timeouts';
import { Logger } from './logger';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: Error) => boolean;
}

export class RetryHelpers {
  private maxRetries: number;
  private initialDelayMs: number;
  private maxDelayMs: number;
  private backoffMultiplier: number;

  constructor(
    private logger: Logger,
    options?: RetryOptions
  ) {
    this.maxRetries = options?.maxRetries || RETRY_CONFIG.MAX_RETRIES;
    this.initialDelayMs = options?.initialDelayMs || RETRY_CONFIG.INITIAL_DELAY_MS;
    this.maxDelayMs = options?.maxDelayMs || 30000; // 30 seconds max
    this.backoffMultiplier = options?.backoffMultiplier || 2;
  }

  /**
   * Execute function with retry logic
   */
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    operationName?: string
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.logger.debug(`${operationName || 'Operation'} attempt ${attempt}/${this.maxRetries}`);
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < this.maxRetries) {
          const delayMs = this.calculateBackoffDelay(attempt);
          this.logger.retryAttempt(attempt, this.maxRetries, delayMs);
          await this.delay(delayMs);
        } else {
          this.logger.error(
            `${operationName || 'Operation'} failed after ${this.maxRetries} attempts`,
            lastError
          );
        }
      }
    }

    throw lastError || new Error('Operation failed after retries');
  }

  /**
   * Execute assertion with retry logic
   */
  async retryAssertion(
    assertionFn: () => Promise<void> | void,
    assertionName?: string
  ): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        this.logger.debug(`Assertion attempt ${attempt}/${this.maxRetries}: ${assertionName || 'unnamed'}`);
        const result = assertionFn();
        if (result instanceof Promise) {
          await result;
        }
        return;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < this.maxRetries) {
          const delayMs = this.calculateBackoffDelay(attempt);
          this.logger.retryAttempt(attempt, this.maxRetries, delayMs);
          await this.delay(delayMs);
        } else {
          this.logger.error(
            `Assertion failed after ${this.maxRetries} attempts: ${assertionName || 'unnamed'}`,
            lastError
          );
        }
      }
    }

    throw lastError || new Error('Assertion failed after retries');
  }

  /**
   * Execute assertion until it passes or times out
   */
  async retryAssertionUntilPass(
    assertionFn: () => Promise<boolean> | boolean,
    assertionName?: string,
    timeoutMs?: number
  ): Promise<void> {
    const timeout = timeoutMs || (this.maxRetries * this.initialDelayMs * 2);
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        this.logger.debug(`Checking assertion: ${assertionName || 'unnamed'}`);
        const result = assertionFn();
        const isPass = result instanceof Promise ? await result : result;
        
        if (isPass) {
          this.logger.info(`Assertion passed: ${assertionName || 'unnamed'}`);
          return;
        }
      } catch (error) {
        // Continue retrying
      }

      // Wait before retry
      const delayMs = Math.min(this.initialDelayMs, 500);
      await this.delay(delayMs);
    }

    throw new Error(
      `Assertion did not pass within ${timeout}ms timeout: ${assertionName || 'unnamed'}`
    );
  }

  /**
   * Execute condition check with retries
   */
  async retryUntilConditionMet(
    conditionFn: () => Promise<boolean> | boolean,
    conditionName?: string,
    maxWaitMs?: number
  ): Promise<void> {
    const maxWait = maxWaitMs || (this.maxRetries * this.initialDelayMs * 3);
    const startTime = Date.now();
    let lastError: Error | null = null;

    while (Date.now() - startTime < maxWait) {
      try {
        const result = conditionFn();
        const isMet = result instanceof Promise ? await result : result;
        
        if (isMet) {
          this.logger.debug(`Condition met: ${conditionName || 'unnamed'}`);
          return;
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }

      // Wait before next check
      const delayMs = this.calculateBackoffDelay(
        Math.floor((Date.now() - startTime) / 500)
      );
      await this.delay(delayMs);
    }

    const error = lastError || new Error(
      `Condition not met within ${maxWait}ms: ${conditionName || 'unnamed'}`
    );
    throw error;
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoffDelay(attemptNumber: number): number {
    // Formula: initialDelay * (backoffMultiplier ^ (attempt - 1))
    // Min: initialDelayMs, Max: maxDelayMs
    const delay = this.initialDelayMs * Math.pow(this.backoffMultiplier, attemptNumber - 1);
    return Math.min(delay, this.maxDelayMs);
  }

  /**
   * Simple delay function
   */
  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  /**
   * Set retry options
   */
  public setOptions(options: RetryOptions): void {
    if (options.maxRetries !== undefined) this.maxRetries = options.maxRetries;
    if (options.initialDelayMs !== undefined) this.initialDelayMs = options.initialDelayMs;
    if (options.maxDelayMs !== undefined) this.maxDelayMs = options.maxDelayMs;
    if (options.backoffMultiplier !== undefined) this.backoffMultiplier = options.backoffMultiplier;
  }

  /**
   * Get current retry configuration
   */
  public getConfig(): Readonly<{
    maxRetries: number;
    initialDelayMs: number;
    maxDelayMs: number;
    backoffMultiplier: number;
  }> {
    return {
      maxRetries: this.maxRetries,
      initialDelayMs: this.initialDelayMs,
      maxDelayMs: this.maxDelayMs,
      backoffMultiplier: this.backoffMultiplier
    };
  }
}

export default RetryHelpers;
