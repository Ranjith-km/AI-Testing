/**
 * src/constants/timeouts.ts
 * Global wait timeout values for the framework
 */

export const TIMEOUTS = {
  // Element interactions
  IMPLICIT_WAIT: 10000,           // 10 seconds - element visibility
  EXPLICIT_WAIT: 5000,            // 5 seconds - specific condition
  
  // Page or navigation
  PAGE_LOAD_TIMEOUT: 30000,       // 30 seconds - full page load
  QUICK_RESPONSE: 2000,           // 2 seconds - quick operations
  
  // API/Network
  API_RESPONSE_TIMEOUT: 15000,    // 15 seconds - API call response
  DEFAULT_NAVIGATION: 30000,      // 30 seconds - navigate() call
  
  // Retry backoff multiplier
  INITIAL_BACKOFF: 1000,          // 1 second initial delay
  MAX_BACKOFF: 8000,              // Max 8 seconds between retries
  
  // Screenshot delay (give UI time to settle)
  SCREENSHOT_DELAY: 1000          // 1 second before screenshot
};

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,                 // Maximum retry attempts
  INITIAL_DELAY_MS: 1000,         // Initial delay before first retry exponential backoff
  ASSERTION_RETRIES: 3,           // Retry assertion attempts
  ASSERTION_DELAY_MS: 500         // Delay between assertion retries
};

export default TIMEOUTS;
