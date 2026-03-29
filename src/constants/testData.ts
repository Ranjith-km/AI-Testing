/**
 * src/constants/testData.ts
 * Test data constants for the Joyalukkas Foundation automation suite
 */

export const TEST_DATA = {
  // Valid Contact Form Data
  VALID_CONTACT: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1-800-123-4567',
    subject: 'General Inquiry',
    message: 'Hello, I would like to know more about your initiatives.'
  },
  
  // Alternative Valid Names
  VALID_NAMES: [
    'Alice Johnson',
    'Robert Smith',
    'Emma Williams',
    'Michael Brown',
    'Sophia Davis',
    'James Wilson',
    'Olivia Martinez',
    'Benjamin Garcia',
    'Ava Rodriguez',
    'Lucas Hernandez'
  ],
  
  // Valid Email Formats
  VALID_EMAILS: [
    'test@example.com',
    'user.name@gmail.com',
    'name+tag@domain.co.uk',
    'test123@test-domain.com',
    'email@subdomain.example.com'
  ],
  
  // Valid Phone Numbers
  VALID_PHONES: [
    '+1-800-123-4567',
    '+1-212-555-0172',
    '800-123-4567',
    '+44-20-7946-0958',
    '+91-9876543210'
  ],
  
  // Contact Form Variations
  CONTACT_VARIATIONS: [
    {
      fullName: 'Alice Test',
      email: 'alice@example.com',
      subject: 'Scholarship Inquiry',
      message: 'I am interested in your scholarship program.'
    },
    {
      fullName: 'Bob Smith',
      email: 'bob@test.com',
      subject: 'Partnership Opportunity',
      message: 'Would like to discuss partnership options.'
    },
    {
      fullName: 'Carol White',
      email: 'carol@example.org',
      subject: 'Donation',
      message: 'I would like to make a donation.'
    },
    {
      fullName: 'David Brown',
      email: 'david@example.net',
      subject: 'Volunteer',
      message: 'Interested in volunteering with your foundation.'
    },
    {
      fullName: 'Eve Johnson',
      email: 'eve@test.org',
      subject: 'Media Inquiry',
      message: 'Following up on media coverage request.'
    }
  ],
  
  // Invalid Email Formats
  INVALID_EMAILS: [
    'plainaddress',
    '@example.com',
    'user@',
    'user name@example.com',
    'user@example..com',
    'user@.example.com'
  ],
  
  // Invalid Phone Formats
  INVALID_PHONES: [
    '123',
    'abc-def-ghij',
    '+++1234567890',
    '  ',
    '....'
  ],
  
  // Long Strings (for boundary testing)
  LONG_NAME: 'A'.repeat(100),
  LONG_EMAIL: 'a' + 'b'.repeat(50) + '@example.com',
  LONG_MESSAGE: 'Lorem ipsum dolor sit amet. '.repeat(50),
  
  // Special Characters
  SPECIAL_CHAR_NAME: "O'Brien-Smith",
  SPECIAL_CHAR_MESSAGE: 'Test & verify <special> "characters" in message!@#$%^',
  
  // SQL Injection Attempts (should be escaped)
  SQL_INJECTION: "'; DROP TABLE contacts; --",
  
  // XSS Attempts (should be escaped)
  XSS_ATTEMPTS: [
    '<script>alert("XSS")</script>',
    '<img src="x" onerror="alert(\'XSS\')">',
    'javascript:alert("XSS")',
    '<iframe src="malicious.com"></iframe>'
  ],
  
  // Newsletter Subscription Data
  NEWSLETTER: {
    validEmail: 'newsletter@example.com',
    invalidEmail: 'invalid-email',
    subscribedEmail: 'subscribed@example.com'
  },
  
  // Search Test Data
  SEARCH_QUERIES: {
    valid: [
      'scholarship',
      'education',
      'initiatives',
      'annual report',
      'gallery',
      'news'
    ],
    empty: '',
    special: '@#$%^&*()',
    longQuery: 'query ' + 'x'.repeat(1000),
    unicode: '你好世界',
    mixed: 'test123 @keyword #tag'
  },
  
  // Filter/Selection Data
  INITIATIVES: [
    'Scholarship Program',
    'Relief Programs',
    'Healthcare Services',
    'Educational Support',
    'Community Development'
  ],
  
  YEARS: [
    '2024',
    '2023',
    '2022',
    '2021',
    '2020'
  ],
  
  CATEGORIES: [
    'Education',
    'Healthcare',
    'Relief',
    'Community',
    'Other'
  ],
  
  // User Journey Data
  USER_SCENARIOS: {
    new_visitor: {
      description: 'New user exploring the website',
      actions: ['Visit home', 'Browse initiatives', 'View gallery', 'Read news']
    },
    interested_donor: {
      description: 'Potential donor wanting to contribute',
      actions: ['View programs', 'Read impact stories', 'Contact form', 'Donate']
    },
    volunteer: {
      description: 'Volunteer seeking opportunities',
      actions: ['Explore initiatives', 'View programs', 'Contact', 'Volunteer form']
    },
    researcher: {
      description: 'Researcher gathering information',
      actions: ['Download reports', 'View statistics', 'Read news', 'View gallery']
    }
  },
  
  // Error Messages
  ERROR_STATES: {
    networkError: 'Network connection failed. Please try again.',
    notFound: 'The requested page was not found.',
    serverError: 'Internal server error. Please try again later.',
    unauthorized: 'You do not have permission to access this resource.',
    badRequest: 'Invalid request. Please verify your input.'
  },
  
  // Success Messages
  SUCCESS_MESSAGES: {
    contactFormSubmitted: 'Your message has been sent successfully.',
    newsletterSubscribed: 'You have been subscribed to our newsletter.',
    formValidated: 'Form is valid and ready to submit.',
    pageLoaded: 'Page loaded successfully.'
  },
  
  // Wait Times for Dynamic Content
  RESPONSE_TIMES: {
    fast: 1000,    // 1 second
    normal: 3000,  // 3 seconds
    slow: 5000,    // 5 seconds
    verySllow: 10000 // 10 seconds
  }
};

export default { TEST_DATA };
