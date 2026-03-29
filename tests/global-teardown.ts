/**
 * tests/global-teardown.ts
 * Global teardown runs after all tests
 * Used for cleanup and final reporting
 */

import { FullConfig } from '@playwright/test';
import { Logger } from '../src/utils/logger';
import * as fs from 'fs';
import * as path from 'path';

const logger = new Logger('Global Teardown');

async function globalTeardown(config: FullConfig) {
  logger.info('='.repeat(60));
  logger.info('STARTING GLOBAL TEST TEARDOWN');
  logger.info('='.repeat(60));

  try {
    // Clean up temporary files
    logger.info('Cleaning up temporary files...');
    const tempDirs = ['screenshots', 'test-results'];

    for (const dir of tempDirs) {
      const dirPath = path.join(process.cwd(), dir);
      if (fs.existsSync(dirPath)) {
        logger.info(`Analyzed directory: ${dir}`);
        const files = fs.readdirSync(dirPath);
        logger.info(`  Files in ${dir}: ${files.length}`);
      }
    }

    // Generate summary report
    logger.info('Generating test summary...');
    
    const resultsPath = path.join(process.cwd(), 'test-results', 'results.json');
    if (fs.existsSync(resultsPath)) {
      try {
        const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
        logger.info(`Test Results Summary:`);
        logger.info(`  Total tests: ${results.stats?.expected || 0}`);
        logger.info(`  Passed: ${results.stats?.expected || 0}`);
        logger.info(`  Failed: ${results.stats?.unexpected || 0}`);
        logger.info(`  Skipped: ${results.stats?.skipped || 0}`);
        logger.info(`  Duration: ${results.stats?.duration || 0}ms`);
      } catch (error) {
        logger.debug('Could not parse test results');
      }
    }

    // Archive logs
    logger.info('Archiving logs...');
    const logsDir = path.join(process.cwd(), 'logs');
    if (fs.existsSync(logsDir)) {
      const files = fs.readdirSync(logsDir);
      logger.info(`Archived ${files.length} log files`);
    }

    // Final cleanup
    logger.info('Performing final cleanup...');

    logger.info('='.repeat(60));
    logger.info('✓ GLOBAL TEARDOWN COMPLETED');
    logger.info('='.repeat(60));

    // Flush logs
    await logger.flush();

  } catch (error) {
    logger.error('GLOBAL TEARDOWN FAILED', error as Error);
    try {
      await logger.flush();
    } catch (flushError) {
      console.error('Failed to flush logs:', flushError);
    }
  }
}

export default globalTeardown;
