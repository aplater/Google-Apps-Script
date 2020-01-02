// add custom menu to UI
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu')
  .addItem('Format Data', 'formatData')
  .addToUi();
}

//function helper - return last rows for the selected range of values
function getLastRowSpecial(range) {
  var rowNum = 0;
  var blank = false;
  for (var row = 0; row < range.length; row++) {
    if (range[row][0] === "" && !blank) {
      rowNum = row;
      blank = true;
    } else if (range[row][0] !== "") {
      blank = false;
    };
  };
  return rowNum;
};

// Main function
function formatData() {
  
    // get Active spreadsheet.
  var ss = SpreadsheetApp.getActiveSpreadsheet();

    // CRM sheet get range and values  
  var crm_column = ss.getRange("crm!A2:A").getValues();
  var crm_lastRow = getLastRowSpecial(crm_column);
  var crm_range = ss.getSheetByName("crm").getRange(2, 1, crm_lastRow, 7);
  var crm_data = crm_range.getValues();


    //Transaction sheet get range and values
  var transaction_column = ss.getRange("transactions!A2:A").getValues();
  var transaction_lastRow = getLastRowSpecial(transaction_column);

    // if transaction sheet is not empty
  if (transaction_lastRow != 0) {
    var transaction_range = ss.getSheetByName("transactions").getRange(2, 1, transaction_lastRow, 7);
    var transactions_data = transaction_range.getValues();
  } else {
    var transactions_data = []
    }

  // creating empty arrays
  var Sale = []
  var Lead = []
  var Prospect = []
  var Transactions = []

  //Sale
  for (var i = 0; i < crm_data.length; i++) {
    if (crm_data[i][3] != 0.0) {
      Sale.push([crm_data[i][0], crm_data[i][3], crm_data[i][4], crm_data[i][5], crm_data[i][6], "first_sale", ""])
    }
  }

  //Lead
  for (var i = 0; i < crm_data.length; i++) {
    if (crm_data[i][1] != 0.0) {
      Lead.push([crm_data[i][0], crm_data[i][1], crm_data[i][4], crm_data[i][5], crm_data[i][6], "Lead", ""])
    }
  }

  //Prospect
  for (var i = 0; i < crm_data.length; i++) {
    if (crm_data[i][2] != 0.0) {
      Prospect.push([crm_data[i][0], crm_data[i][2], crm_data[i][4], crm_data[i][5], crm_data[i][6], "Prospect", ""])
    }
  }

  //Transactions
  for (var i = 0; i < transactions_data.length; i++) {
    Transactions.push([transactions_data[i][0], transactions_data[i][1], transactions_data[i][4], transactions_data[i][5], transactions_data[i][6], "transaction", transactions_data[i][3]])
  }

  // final array export
  var output = Sale.concat(Lead).concat(Prospect).concat(Transactions)

  // cleaning transaction sheet
  ss.getRange("dataFormatted!A2:G").clearContent();
    
  // filling transaction sheet with output values
  ss.getSheetByName("dataFormatted").getRange(2, 1, output.length, 7).setValues(output);

}