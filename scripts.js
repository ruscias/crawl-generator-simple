const generate_script_button = document.querySelector('button#generate-script-button');
const results_area = document.querySelector('p#results-area');
console.log(results_area);


generate_script_button.addEventListener('click', generateScript);

function generateScript() {
  const id_to_read_from = document.getElementById('id-to-read-from').value;
  const sheet_name_to_read_from = document.getElementById('sheet-name-to-read-from').value;
  const id_to_write_to = document.getElementById('id-to-write-to').value;
  const sheet_name_to_write_to = document.getElementById('sheet-name-to-write-to').value;
  const sleep_interval = document.getElementById('sleep-interval').value;
  const user_attr = document.getElementById('user-attr').value;
  const user_attr_value = document.getElementById('user-attr-value').value;
  const user_tag = document.getElementById('user-tag').value;
  const user_words_raw = document.getElementById('user-words').value.split('|');
  const user_words = [];
  for (const word of user_words_raw) {
    user_words.push(`'${word}'`)
  }

  const indent = `\u00A0\u00A0`;

  const sorry = `${indent}/*
  USER DEFINED CONSTANTS
  */

  // declare id of spreadsheet to read urls from
  const id_to_read_from = '${id_to_read_from}';
  // declare name of sheet with urls
  const sheet_name_to_read_from = '${sheet_name_to_read_from}';

  // declare id of spreadsheet to write results to
  const id_to_write_to = '${id_to_write_to}';
  // declare name of sheet with data
  const sheet_name_to_write_to = '${sheet_name_to_write_to}';

  // declare sleep interval
  // recommend less that 1 to start, ex: 0.2 or 1/5 of a second
  const sleep_interval_in_seconds = ${sleep_interval};
  // an html tag that contains standard soft 404 messaging
  const tag = '${user_tag}';
  // an identifying attribute of the tag
  const attr = '${user_attr}';
  // the value of the identifying attribute
  const attr_value = '${user_attr_value}';
  // words that might be on the page if there is a soft 404
  const words = [${user_words}]

  /*
  ADDITIONAL CONSTANTS
  */

  // get the spreadsheet
  const spreadsheet_to_read_from = SpreadsheetApp.openById(id_to_read_from);
  // get the sheet with the urls
  const sheet_to_read_from = spreadsheet_to_read_from.getSheetByName(sheet_name_to_read_from);
  const rows_to_read_from = sheet_to_read_from.getDataRange().getValues().slice(1);

  // get the spreadsheet
  const spreadsheet_to_write_to = SpreadsheetApp.openById(id_to_write_to);
  // get the sheet with the urls
  const sheet_to_write_to = spreadsheet_to_write_to.getSheetByName(sheet_name_to_write_to);
  const rows_to_write_to = [
  ${indent}['urls', 'status_codes', 'possible_soft_404', 'time_crawled']
  ];

  const timestamp = Utilities.formatDate(new Date(), 'GMT', 'MM-dd-yyyy HH:mm:ss');

  /*
  HELPER FUNCTIONS
  */

  function getElementsByID(tag, content, attr, attr_value) {
  ${indent}const pattern = new RegExp(\`(<\${tag}[^<]*\${attr}=['"]\${attr_value}['"].*\/\${tag}>)\`);
  ${indent}const result = pattern.exec(content);
  ${indent}//debug console.log(\`\${result}\`);
  ${indent}return result;
  }

  function isIndicatorWordFound(parsed_response, words) {
  ${indent}for (const element of parsed_response) {
  ${indent}${indent}for (const word of words) {
  ${indent}${indent}${indent}if (element.toLowerCase().includes(word.toLowerCase())) {
  ${indent}${indent}${indent}${indent}return true;
  ${indent}${indent}${indent}} 
  ${indent}${indent}}
  ${indent}}
  ${indent}return false;
  }

  function isSoft404(response, words, tag, attr, attr_value) {
  ${indent}const content = response.getContentText();
  ${indent}parsed_response = getElementsByID(tag, content, attr, attr_value);
  ${indent}if (parsed_response) {
  ${indent}${indent}return isIndicatorWordFound(parsed_response, words);
  ${indent}} else {
  ${indent}${indent}return false;
  ${indent}}
  }

  function crawlUrl(url, words, tag, attr, attr_value) {
  ${indent}const response = UrlFetchApp.fetch(url, {'muteHttpExceptions': true});
  ${indent}const status_code = response.getResponseCode();
  ${indent}const is_200_code = status_code === 200? true: false;
  ${indent}const is_soft_404 = is_200_code ? isSoft404(response, words, tag, attr, attr_value): false; 
  ${indent}return [url, status_code, is_soft_404];
  } 

  function main() {
  ${indent}// crawl each url and update status_code in rows array
  ${indent}for (const row of rows_to_read_from) {
  ${indent}${indent}new_row = crawlUrl(row[0], words, tag, attr, attr_value);
  ${indent}${indent}Utilities.sleep(sleep_interval_in_seconds * 1000);
  ${indent}${indent}rows_to_write_to.push([new_row[0], new_row[1], new_row[2], timestamp]);
  ${indent}${indent}console.log('...');
  ${indent}}

  ${indent}// remove existing rows
  ${indent}sheet_to_write_to.clear();

  ${indent}console.log('Adding rows...');

  ${indent}// append rows to spreadsheet 
  ${indent}for (const row of rows_to_write_to) {
  ${indent}${indent}sheet_to_write_to.appendRow(row);
  ${indent}${indent}console.log('...')
  ${indent}}
  }`;
  results_area.innerText = sorry;
}

