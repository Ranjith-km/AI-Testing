const XLSX = require('xlsx');

try {
  const workbook = XLSX.readFile('./joyalukkas_foundation_test_cases.xlsx');
  console.log('Available Sheets:', workbook.SheetNames);
  console.log('');
  
  // Get summary data
  const summarySheet = workbook.Sheets[workbook.SheetNames[0]];
  const summaryData = XLSX.utils.sheet_to_json(summarySheet);
  
  console.log('===== SHEET SUMMARY =====');
  console.log('Total Sheets:', workbook.SheetNames.length);
  
  workbook.SheetNames.forEach((name, index) => {
    const sheet = workbook.Sheets[name];
    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(`\nSheet ${index + 1}: "${name}" - ${data.length} rows`);
    if (data.length > 0) {
      console.log('Columns:', Object.keys(data[0]));
      if (data.length <= 3) {
        console.log('Data:', JSON.stringify(data, null, 2));
      } else {
        console.log('First Row Sample:', JSON.stringify(data[0], null, 2));
      }
    }
  });
  
} catch (error) {
  console.error('Error reading Excel file:', error.message);
}
