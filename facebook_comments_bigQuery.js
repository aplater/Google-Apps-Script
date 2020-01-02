
// https://stackoverflow.com/questions/33931180/google-sheets-upload-to-bigquery-bad-character/33963410
// https://developers.google.com/apps-script/advanced/bigquery

function cleanColumns() {
  // Get active spreadsheet
  var ss = SpreadsheetApp.getActiveSpreadsheet()

  // Get values from input sheet
  var input_sheet = ss.getSheetByName("input");
  var raw_data = input_sheet.getValues();
  

  // clean data
  var columnsToClean = [3,4];

  // helpers - cleaning spaces and punctuations 
  function cleanText(t) {
    var punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~\r\n|\n|\r]/g;
    var spaceRE = /\s+/g;
    return t.toString().replace(punctRE, "").replace(spaceRE, " ");
  };

  // helpers - ???
  function cleanColumn(col) {
    return raw_data
        .map(function(row) {return row[col];})
        .map(cleanText)
        .map(function(row) {return [row];})
  };

  var output = ss.getSheetByName("ouput");

  // ???
  function cleanAndWrite(col) {
    var data = cleanColumn(col);
    output.getRange(1, col + 1, data.length, 1).setValues(data);
  }

  columnsToClean.forEach(cleanAndWrite);
}


// Export to BQ
function BQ_fb_export() {
  var projectId = 'XXXXXX'; // Google app project 
  var fileId = 'XXXXXXXXXXXXXXXXXXXXX'; // google sheet id 
  var tableId = 'fb_' + new Date().getTime();

  // Define our load job.
  var jobSpec = {
    configuration: {
      load: {
        destinationTable: {
          projectId: projectId,
          datasetId: 'Facebook',
          tableId: tableId
        },
        allowJaggedRows: true,
        writeDisposition: 'WRITE_TRUNCATE',
        schema: {
          fields: [
        {name: 'Page_ID', type: 'STRING'},
        {name: 'Post_ID', type: 'STRING'},
        {name: 'Post_creation_date', type: 'STRING'},
        {name: 'Post_name', type: 'STRING'},
        {name: 'Post_message', type: 'STRING'},
        {name: 'Link_to_post', type: 'STRING'},
        {name: 'Post_shared_link', type: 'STRING'},
        {name: 'Post_type', type: 'STRING'},
        {name: 'Post_reach', type: 'INTEGER'},
        {name: 'Post_organic_reach', type: 'INTEGER'},
        {name: 'Post_paid_reach', type: 'INTEGER'},
        {name: 'Post_viral_reach', type: 'INTEGER'},
        {name: 'Post_engaged_users', type: 'INTEGER'},
        {name: 'Post_likes', type: 'INTEGER'},
        {name: 'Post_shares', type: 'INTEGER'},
        {name: 'Post_comments', type: 'INTEGER'},
        {name: 'Post_link_clicks', type: 'INTEGER'},
        {name: 'Video_views', type: 'INTEGER'},
        {name: 'Root_url', type: 'STRING'},
        {name: 'campaign_param', type: 'STRING'},
          ]
        }
      }
    }
  };
   
  var spreadsheet = SpreadsheetApp.openById(fileId);
  var filename = spreadsheet.getName();

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Raw_data");
  var row_count = sheet.getLastRow();
  var data = sheet.getDataRange().getValues();

  var csvdata = "";
  for (var row = 1; row < data.length && row < row_count + 1; row++) {
    for (var col = 0; col < data[row].length; col++) {  
    
      var cell = data[row][col].toString();
      
      if (cell.indexOf(",") != -1) {
        csvdata += "\"" + cell + "\"";
      } else {
        csvdata += cell;
      }

      if (col < data[row].length - 1) {
        csvdata += ",";
      }
    }
    csvdata += "\r\n";
  }
  
  var data = Utilities.newBlob(csvdata, "application/octet-stream");

  // Execute the job.
  BigQuery.Jobs.insert(jobSpec, projectId, data);
  sheet.clear();
  
}

