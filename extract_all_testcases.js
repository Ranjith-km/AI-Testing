const XLSX = require('xlsx');

try {
  const workbook = XLSX.readFile('./joyalukkas_foundation_test_cases.xlsx');
  
  const allTCSheet = workbook.Sheets['All Test Cases'];
  const allTCData = XLSX.utils.sheet_to_json(allTCSheet, { defval: '' });
  
  // Extract meaningful data
  const testCases = [];
  
  for (let i = 4; i < allTCData.length; i++) {
    const row = allTCData[i];
    if (!row['Test Cases Created By:'] || row['Test Cases Created By:'].trim() === '') break;
    
    const tcId = row['Test Cases Created By:'];
    const module = row['Ranjith KM'];
    const subModule = row['__EMPTY'] || '';
    const description = row['__EMPTY_1'] || '';
    const preconditions = row['__EMPTY_2'] || '';
    const testSteps = row['__EMPTY_3'] || '';
    const testData = row['__EMPTY_4'] || '';
    const expectedResult = row['__EMPTY_5'] || '';
    const priority = row['__EMPTY_8'] || '';
    const severity = row['__EMPTY_9'] || '';
    const testType = row['__EMPTY_10'] || '';
    
    testCases.push({
      id: tcId,
      module: module,
      subModule: subModule,
      description: description,
      preconditions: preconditions,
      testSteps: testSteps,
      testData: testData,
      expectedResult: expectedResult,
      priority: priority,
      severity: severity,
      testType: testType
    });
  }
  
  // Output as structured JSON
  console.log(JSON.stringify(testCases, null, 2));
  
} catch (error) {
  console.error('Error:', error.message);
}
