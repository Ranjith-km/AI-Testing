/**
 * src/constants/messages.ts
 * Assertion messages, error strings, and logging messages
 */

export const MESSAGES = {
  // Assertion Messages
  ASSERTIONS: {
    // Element Visibility
    ELEMENT_VISIBLE: 'Element {selector} is visible',
    ELEMENT_NOT_VISIBLE: 'Element {selector} is not visible',
    ELEMENT_ENABLED: 'Element {selector} is enabled',
    ELEMENT_DISABLED: 'Element {selector} is disabled',
    
    // Content Assertions
    TEXT_CONTAINS: 'Element {selector} contains text: "{text}"',
    TEXT_EQUALS: 'Element {selector} text equals: "{text}"',
    ATTRIBUTE_CONTAINS: 'Element {selector} has attribute {attribute}: "{value}"',
    ATTRIBUTE_EQUALS: 'Element {selector} attribute {attribute} equals: "{value}"',
    
    // Navigation
    URL_IS: 'Current URL is: {url}',
    URL_CONTAINS: 'Current URL contains: {substring}',
    TITLE_IS: 'Page title is: {title}',
    TITLE_CONTAINS: 'Page title contains: {substring}',
    
    // Form Assertions
    FORM_VALID: 'Form is valid and ready to submit',
    FORM_INVALID: 'Form validation failed',
    FIELD_REQUIRED: 'Field {fieldName} is required',
    FIELD_VALID: 'Field {fieldName} is valid',
    FIELD_INVALID: 'Field {fieldName} has validation errors',
    
    // API Assertions
    API_STATUS_OK: 'API returned status 200 OK',
    API_STATUS_ERROR: 'API returned error status: {status}',
    API_RESPONSE_CONTAINS: 'API response contains: {data}',
    
    // Accessibility Assertions
    ACCESSIBILITY_ERROR: 'Accessibility violation found: {error}',
    ARIA_LABEL_PRESENT: 'Element has aria-label: "{label}"',
    ROLE_CORRECT: 'Element has correct role: {role}'
  },
  
  // Error/Failure Messages
  ERRORS: {
    // Timeout Errors
    ELEMENT_NOT_FOUND: 'Element {selector} was not found within timeout period',
    ELEMENT_TIMEOUT: 'Timeout waiting for element {selector} to be {state}',
    PAGE_LOAD_TIMEOUT: 'Page failed to load within {timeout}ms',
    NAVIGATION_TIMEOUT: 'Navigation to {url} failed within {timeout}ms',
    
    // Interaction Errors
    CLICK_FAILED: 'Failed to click on element {selector}',
    FILL_FAILED: 'Failed to fill element {selector} with value: {value}',
    SELECT_FAILED: 'Failed to select dropdown option: {option}',
    SUBMIT_FAILED: 'Failed to submit form',
    
    // Navigation Errors
    NAVIGATION_FAILED: 'Navigation to {url} failed',
    PAGE_NOT_LOADED: 'Page did not load. Current URL: {url}',
    REDIRECT_FAILED: 'Expected redirect to {expectedUrl}, but got {actualUrl}',
    
    // Assertion Errors
    ASSERTION_FAILED: 'Assertion failed: {message}',
    TEXT_MISMATCH: 'Expected text "{expected}" but got "{actual}"',
    ATTRIBUTE_MISMATCH: 'Expected attribute value "{expected}" but got "{actual}"',
    
    // Form Errors
    FIELD_VALIDATION_ERROR: 'Field validation error for {fieldName}: {errorMessage}',
    FORM_SUBMISSION_ERROR: 'Form submission failed: {errorMessage}',
    REQUIRED_FIELD_EMPTY: 'Required field "{fieldName}" is empty',
    INVALID_EMAIL_FORMAT: 'Invalid email format: {email}',
    INVALID_PHONE_FORMAT: 'Invalid phone number format: {phone}',
    
    // API/Network Errors
    API_ERROR: 'API request failed: {errorMessage}',
    NETWORK_ERROR: 'Network error during request to {url}',
    TIMEOUT_ERROR: 'Request timeout after {timeout}ms',
    INVALID_RESPONSE: 'Invalid API response: {response}',
    
    // Accessibility Errors
    ACCESSIBILITY_VIOLATION: 'Accessibility violation: {violation}',
    MISSING_ALT_TEXT: 'Image missing alt text at {selector}',
    KEYBOARD_NOT_ACCESSIBLE: 'Element not keyboard accessible: {selector}',
    
    // Browser Errors
    BROWSER_NOT_LAUNCHED: 'Browser failed to launch',
    BROWSER_CRASHED: 'Browser crashed during test execution',
    CONTEXT_CLOSED: 'Browser context was closed unexpectedly',
    
    // File/Screenshot Errors
    SCREENSHOT_FAILED: 'Failed to capture screenshot',
    FILE_NOT_FOUND: 'File not found: {filePath}',
    FILE_WRITE_ERROR: 'Failed to write file: {filePath}'
  },
  
  // Info/Debug Messages
  INFO: {
    // Navigation
    NAVIGATING_TO: 'Navigating to: {url}',
    PAGE_LOADED: 'Page loaded successfully: {url}',
    URL_CHANGED: 'URL changed from {oldUrl} to {newUrl}',
    
    // Interactions
    CLICKING: 'Clicking element: {selector}',
    FILLING: 'Filling element {selector} with value: {value}',
    SELECTING: 'Selecting dropdown option: {option}',
    SUBMITTING: 'Submitting form',
    
    // Waits
    WAITING_FOR_ELEMENT: 'Waiting for element {selector}',
    WAITING_FOR_PAGE_LOAD: 'Waiting for page to load',
    WAITING_FOR_RESPONSE: 'Waiting for response from: {url}',
    
    // Retries
    RETRY_ATTEMPT: 'Retry attempt {attempt} of {maxAttempts}',
    RETRY_DELAY: 'Delaying {delay}ms before retry',
    
    // Screenshots
    TAKING_SCREENSHOT: 'Taking screenshot: {name}',
    SCREENSHOT_SAVED: 'Screenshot saved: {filePath}',
    SCREENSHOT_ON_FAILURE: 'Screenshot captured on failure: {filePath}',
    
    // Test Execution
    TEST_STARTED: 'Test started: {testName}',
    TEST_COMPLETED: 'Test completed: {testName}',
    SETUP_STARTED: 'Test setup started',
    TEARDOWN_STARTED: 'Test teardown started',
    
    // Performance
    PERFORMANCE_METRIC: 'Performance {metric}: {value}ms',
    NETWORK_TIMING: 'Network request took {duration}ms'
  },
  
  // Warning Messages
  WARNINGS: {
    // Deprecation
    DEPRECATED_SELECTOR: 'Selector is deprecated, consider using: {newSelector}',
    DEPRECATED_METHOD: 'Method is deprecated, use {alternativeMethod} instead',
    
    // Performance
    SLOW_INTERACTION: 'Element interaction took longer than expected: {duration}ms',
    SLOW_PAGE_LOAD: 'Page load took longer than expected: {duration}ms',
    MULTIPLE_MATCHES: 'Selector {selector} matched {count} elements, using first',
    
    // Accessibility
    ACCESSIBILITY_WARNING: 'Potential accessibility issue: {warning}',
    LOW_CONTRAST: 'Low contrast detected at {selector}',
    
    // Data
    DATA_INCONSISTENCY: 'Data inconsistency detected: {details}',
    MISSING_DATA: 'Expected data not found: {fieldName}'
  },
  
  // Success Messages
  SUCCESS: {
    TEST_PASSED: 'Test passed: {testName}',
    FORM_SUBMITTED: 'Form submitted successfully',
    NAVIGATION_SUCCESSFUL: 'Navigation successful: {url}',
    ELEMENT_LOCATED: 'Element located: {selector}',
    ASSERTION_PASSED: 'Assertion passed',
    DATA_VALIDATION_PASSED: 'Data validation passed'
  },
  
  // Status Messages
  STATUS: {
    RUNNING: 'Test suite running...',
    PENDING: 'Waiting for test execution...',
    PAUSED: 'Test execution paused',
    SKIPPED: 'Test skipped: {reason}',
    STARTED: 'Test started at {timestamp}',
    COMPLETED: 'Test completed at {timestamp}',
    DURATION: 'Test duration: {duration}ms'
  }
};

export default { MESSAGES };
