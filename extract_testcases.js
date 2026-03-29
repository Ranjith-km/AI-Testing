const XLSX = require('xlsx');

try {
  const workbook = XLSX.readFile('./joyalukkas_foundation_test_cases.xlsx');
  
  // Read "All Test Cases" sheet to get full test case list
  const allTCSheet = workbook.Sheets['All Test Cases'];
  const allTCData = XLSX.utils.sheet_to_json(allTCSheet, { defval: '' });
  
  console.log('===== ALL TEST CASES SHEET =====');
  console.log('Total rows:', allTCData.length);
  console.log('');
  
  // First 20 rows to see structure
  allTCData.slice(0, 20).forEach((row, idx) => {
    console.log(`Row ${idx}:`, JSON.stringify(row, null, 2));
    console.log('---');
  });
  
} catch (error) {
  console.error('Error:', error.message);
}
