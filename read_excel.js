const XLSX = require('xlsx');

try {
  const workbook = XLSX.readFile('./joyalukkas_foundation_test_cases.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);
  console.log(JSON.stringify(data, null, 2));
} catch (error) {
  console.error('Error reading Excel file:', error.message);
  console.log('Attempting alternative method...');
  
  // Alternative: Try to read as CSV-like format
  try {
    const XLSX2 = require('xlsx');
    const workbook2 = XLSX2.readFile('./joyalukkas_foundation_test_cases.xlsx');
    console.log('Sheet names:', workbook2.SheetNames);
    
    workbook2.SheetNames.forEach(name => {
      console.log(`\n=== Sheet: ${name} ===`);
      const sheet = workbook2.Sheets[name];
      const data = XLSX2.utils.sheet_to_json(sheet);
      console.log(JSON.stringify(data, null, 2));
    });
  } catch (e) {
    console.error('Failed to read Excel file:', e);
  }
}
