// Get Facebook Token
function getFbToken() {
  var appID = 'appID';
  var appSecret = 'appSecret';
  var getURL = "https://graph.facebook.com/oauth/access_token?client_id=" + appID + "&client_secret=" + appSecret + "&grant_type=client_credentials"
  var getToken = UrlFetchApp.fetch(getURL, "method" : "get");
  var token = getToken.getContentText();
  Logger.log("Token: " + token);
};

// Get Facebook Reach
function getReach() {

// Defining constant
  var pageID = 'pageID'
  var token = 'token' 
  var metrics = [['page_impressions_unique'],['page_impressions_organic_unique'],['page_impressions_paid_unique']]
  ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("sheetname");
  
// Get unix Timestamp of yesterday
  const dateTime = (Date.now()-1);
  const timestamp = Math.floor(dateTime / 1000);
  var yesterday_date = timestamp.toString();

// Calling the API + Collecting Data  
  var data = [];
  for (var i in metrics_all) {
    var metrics = metrics_all[i]
    var response = UrlFetchApp.fetch("https://graph.facebook.com/v2.3/"+ page_ID + "/insights/" + metrics + "?until=" + yesterday_date + "&since=" + yesterday_date + "&access_token=" + my_TOKEN);
    var raw_data = JSON.parse(response);
  for (var i in raw_data.raw_data){
    for (var k in raw_data.raw_data[i].values) {
      data.push([raw_data.raw_data[i].title, raw_data.raw_data[i].values[k].value]);}
  }
}

// sending data to spreadsheet 
  ss.getRange('a1').offset(0, 0, ar.length, ar[0].length).setValues(ar);

// Dispatching Data
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Weekly&Monthly data")
  var WeeklyReach = sheet.getRange('Reach collector!B2').getValue();
  var MonthlyReach = sheet.getRange('Reach collector!B3').getValue();
  var WeeklyOrg = sheet.getRange('Reach collector!B5').getValue();
  var MonthlyOrg = sheet.getRange('Reach collector!B6').getValue();
  var WeeklyPaid = sheet.getRange('Reach collector!B8').getValue();
  var MonthlyPaid = sheet.getRange('Reach collector!B9').getValue();
  var day = sheet.getRange('Reach collector!A10').getValue();
  sheet.appendRow([day,WeeklyReach,MonthlyReach,WeeklyOrg,MonthlyOrg,WeeklyPaid,MonthlyPaid]);
} 