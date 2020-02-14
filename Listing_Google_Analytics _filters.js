// generate custom menu
function onOpen(e) { 
      SpreadsheetApp.getUi()
      .createMenu('Listing filters menu')
      .addItem('Run', 'main')
      .addToUi();
}

// Create a new 'Filters List' sheet if not already created
// Clean 'Filters List' sheet is already created
function helpers() {
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var filters_list_sheet = ss.getSheetByName('Filters List');

 if (!filters_list_sheet) {

  ss.insertSheet('Filters List');

 } else {

  filters_list_sheet.clear();

 }
}

// list all the filters looping through accounts, properties and views
function get_filters_list() {
  // select 'Filters list' sheet
 var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Filters List');
  
  // add header to 'Filters list' sheet
  ss.appendRow(['Account ID', 'Property ID', 'Profile ID', 'Filter Name', 'filter Type', 'Account Name', 'Property Name', 'View Name']);

  // list all the accounts
 var listAccounts = Analytics.Management.AccountSummaries.list();
  // loop through the account list
 for (var i = 0; i < listAccounts.totalResults; i++) {
   // list all properties for each account
  var listProperties = Analytics.Management.Webproperties.list(listAccounts.items[i].id);
   // loop through the property list
  for (var j = 0; j < listProperties.totalResults; j++) {
    // list all views for each property
   var listViews = Analytics.Management.Profiles.list(listAccounts.items[i].id, listProperties.items[j].id);
    //loop through the view list
   for (var k = 0; k < listViews.totalResults; k++) {
     // list all filters for each views
    var FilterLinks = Analytics.Management.ProfileFilterLinks.list(listAccounts.items[i].id, listProperties.items[j].id, listViews.items[k].id);
     // loop through filters list
    for (var l = 0; l < FilterLinks.totalResults; l++) {
      // append all the filters as a new row into the 'Filters List' sheet for each account, property and view 
     ss.appendRow([listAccounts.items[i].id, FilterLinks.items[l].profileRef.webPropertyId, FilterLinks.items[l].filterRef.id, FilterLinks.items[l].filterRef.name, '', listAccounts.items[i].name, listProperties.items[j].name, FilterLinks.items[l].profileRef.name]);

    }
   }
  }
 }
}

// list filter type and pass them to the spreadsheet
function get_filters_type() {
  // select 'Filters list' sheet
 var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Filters List')
 // list filters id from the sheet
 var filters_sheet_list = ss.getRange(2, 3, ss.getLastRow(), 1).getValues();
 // creating account list filter
 var account_filters_list = []
 
 // list accounts from the API endpoint 
 var listAccounts = Analytics.Management.AccountSummaries.list();

 for (var i = 0; i < listAccounts.totalResults; i++) {

  var listAccountFilters = Analytics.Management.Filters.list(listAccounts.items[i].id);

  for (var j = 0; j < listAccountFilters.totalResults; j++) {
    // push filters id and filters type to the account_filters_list array
   account_filters_list.push([listAccountFilters.items[j].id, listAccountFilters.items[j].type]);

  }

 }

  // flaten account list filter
 var flaten_filters_sheet_list = [];
 for (var k = 0; k < filters_sheet_list.length; k++) {
  flaten_filters_sheet_list.push(filters_sheet_list[k][0].toString());
 }

  // merge the two arrays 
 var filters_list_map = new Map(account_filters_list);
 var output = flaten_filters_sheet_list.map(num => {
  return filters_list_map.has(num) ? [num, filters_list_map.get(num)] : [num, null]
 });

  // flatten output 
 var flattened_output = [];
 for (var l = 0; l < output.length; l++) {
  flattened_output.push([output[l][1]]);
 }

  // past filter type to the sheet
 ss.getRange(2, 5, flattened_output.length, 1).setValues(flattened_output);

}

// run each script
function main() {
  helpers()
  get_filters_list()
  get_filters_type()
}
