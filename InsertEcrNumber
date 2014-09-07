/*The ECR Number is necessary to have a permanent record of which position
ECR Workflow should stay in after it finishes executing/*


/*This small simple script inserts the ECR number automatically so that the
user does not have to manually enter it in when they fill
 out the ECR approval form*/

/*It also circumvents a design flaw in Google Sheets that causes it to erase
any pre-existing data in a row every time a new form is submitted. Even it's not
 in the same column as the form responses.*/


// By James Lane, Spartan Shops IT
// Last Updated 9/5/2014

// ECR Number is 4th Column
var COLUMN_ECR_NUMBER = 4;


function InsertEcrNumber() {
  
  // Initialize sheet for editing
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var approvalsSheet = ss.getSheets()[0];
  
  // Object refrence to the last row with Content
  var lastRow = approvalsSheet.getLastRow();
  
  // Get Value of LastRow
  var oldRow = approvalsSheet.getRange(lastRow-1,COLUMN_ECR_NUMBER).getValue();
  
  // Current row that doesn't have an ECR number but should
  var currentRow = approvalsSheet.getRange(lastRow,COLUMN_ECR_NUMBER);
  
  // Add 1 to that value
  var newNumber = oldRow +1;
  
  // Insert value into empty cell
  currentRow.setValue(newNumber);
  
  // Done. Yay!
;
}
