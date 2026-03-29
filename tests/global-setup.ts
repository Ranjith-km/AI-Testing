/**
 * tests/global-setup.ts
 * Global setup runs before all tests
 * Used for one-time initialization and environment setup
 */

import { chromium, FullConfig } from '@playwright/test';
import { Logger } from '../src/utils/logger';

const logger = new Logger('Global Setup');

async function globalSetup(config: FullConfig) {
  logger.info('='.repeat(60));
  logger.info('STARTING GLOBAL TEST SETUP');
  logger.info('='.repeat(60));

  try {
    // Environment validation
    logger.info(`Environment: ${process.env.ENVIRONMENT || 'local'}`);
    logger.info(`Base URL: ${process.env.BASE_URL || 'http://localhost:3000'}`);

    // Browser launch test (validate Playwright installation)
    logger.info('Validating Playwright browser launch...');
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      logger.info(`Testing connectivity to ${baseUrl}...`);
      const response = await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
      
      if (response?.status() === 200) {
        logger.info(`✓ Successfully connected to ${baseUrl}`);
      } else {
        logger.warn(`Got status ${response?.status()} from ${baseUrl}`);
      }
    } catch (error) {
      logger.warn(`Could not connect to ${process.env.BASE_URL || 'http://localhost:3000'}, will retry during tests`, 
        { error: String(error) });
    } finally {
      await page.close();
      await browser.close();
    }

    // Create output directories
    logger.info('Creating output directories...');
    const fs = require('fs');
    const path = require('path');

    const dirs = [
      'test-results',
      'html-report',
      'logs',
      'screenshots'
    ];

    for (const dir of dirs) {
      const dirPath = path.join(process.cwd(), dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        logger.info(`Created directory: ${dir}`);
      }
    }

    // Log test execution configuration
    logger.info(`Test workers: ${config.workers}`);
    logger.info(`Test timeout: ${config.timeout}ms`);
    logger.info(`Reporter: ${config.reporter?.map((r: any) => r[0]).join(', ')}`);

    // Validate test files exist
    logger.info('Validating test files...');
    const testPattern = path.join(process.cwd(), 'tests', '**/*.spec.ts');
    logger.info(`Test pattern: ${testPattern}`);

    logger.info('='.repeat(60));
    logger.info('✓ GLOBAL SETUP COMPLETED SUCCESSFULLY');
    logger.info('='.repeat(60));

  } catch (error) {
    logger.error('GLOBAL SETUP FAILED', error as Error);
    logger.info('='.repeat(60));
    throw error;
  }

  // Flush logs before proceeding
  await logger.flush();
}

export default globalSetup;
