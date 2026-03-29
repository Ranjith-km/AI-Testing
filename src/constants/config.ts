/**
 * src/constants/config.ts
 * Environment and configuration constants
 */

export interface Config {
  // Environment
  environment: 'local' | 'staging' | 'production';
  baseUrl: string;
  
  // Browser
  browserName: 'chromium' | 'firefox' | 'webkit';
  headless: boolean;
  slowDown: number;
  
  // Execution
  maxParallelWorkers: number;
  timeout: number;
  retryCount: number;
  
  // Reporting
  reportPath: string;
  screenshotOnFailure: boolean;
  videoRecording: boolean;
  
  // API (for mocking)
  apiBaseUrl: string;
  mockApiResponses: boolean;
}

export const CONFIG_BY_ENV: Record<string, Config> = {
  local: {
    environment: 'local',
    baseUrl: 'http://localhost:3000',
    browserName: 'chromium',
    headless: false,
    slowDown: 100,
    maxParallelWorkers: 1,
    timeout: 30000,
    retryCount: 2,
    reportPath: './reports',
    screenshotOnFailure: true,
    videoRecording: false,
    apiBaseUrl: 'http://localhost:3001',
    mockApiResponses: true
  },
  
  staging: {
    environment: 'staging',
    baseUrl: 'https://qa-joyalukkas-next.webc.in',
    browserName: 'chromium',
    headless: true,
    slowDown: 0,
    maxParallelWorkers: 4,
    timeout: 30000,
    retryCount: 3,
    reportPath: './reports',
    screenshotOnFailure: true,
    videoRecording: true,
    apiBaseUrl: 'https://api-staging.joyalukkas.in',
    mockApiResponses: false
  },
  
  production: {
    environment: 'production',
    baseUrl: 'https://joyalukkas.org',
    browserName: 'chromium',
    headless: true,
    slowDown: 0,
    maxParallelWorkers: 4,
    timeout: 30000,
    retryCount: 3,
    reportPath: './reports',
    screenshotOnFailure: true,
    videoRecording: false,
    apiBaseUrl: 'https://api.joyalukkas.in',
    mockApiResponses: false
  }
};

export function loadConfig(): Config {
  const env = process.env.ENVIRONMENT || 'local';
  const config = CONFIG_BY_ENV[env];
  
  if (!config) {
    throw new Error(`Unknown environment: ${env}`);
  }
  
  return config;
}

export default { CONFIG_BY_ENV, loadConfig };
