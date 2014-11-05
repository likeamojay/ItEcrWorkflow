/ Engineering Change Request Workflow 2
// By James Lane, Spartan Shops IT
// Last updated 9/5/14

// Modified from Google Expense Report Workflow tutorial.
// Improvements:
// 1.Progam is autonomous and does not have to be run
// manually by IT.
// 2. Expense Report ID or ECR number in this case, does not have
// to be typed in manually by director in approval form. A supplementary
// script Automatically inserts it.
// in spreadsheet every time an approval form is submitted.
// 3. Checks for new ECR submissions automatically


/*Use Case Actors involved:
1. Director or manager receiving the emails about ECR and then promoted to fill out approval form
2. Requestor who fills out ECR form and receives email with approval results*/


/********* Workflow Algorithm*********
1. Requestor fills out Engineering Change Request Form (ECR).

2. This script runs automatically and sends an email to STATE_MANAGER_EMAIL with 
information about ECR and then prompts them to 
click the hyperlink to fill out the approval form.

3. After approval form is submitted. Secondary script "Insert ECR Number" automatically 
runs and inserts ECR number into Engineering Change Request Approvals (Responses) spreadhseet.

4.Every 5 minutes this script runs again automatically to check if Director or manager has filled
out a new Approval form that hasn't been responded to yet. If it has then sends an email to requestor
with the ECR approval results.

*****End Worflow Algorithm********/



/***************************IMPORTANT GLOBAL CONSTANTS: Modify with discretion. Changing these incorrectly can stop completely stop sheets and triggers from interacting properly****************/


var APPROVALS_SPREADSHEET_ID = "SPREADSHEET_ID_HERE"; // Google Sheets spreadhseet ID of approval form

var APPROVAL_FORM_URL = "APPROVALS_FORM_URL_HERE"; // URL of approval form

var STATE_MANAGER_EMAIL = "YOUR_MANAGER_EMAIL_HERE"; // This is the email address to the person to receive the Request.

var STATE_APPROVED = "Approved";

var STATE_DENIED = "Denied";

var COLUMN_STATE = 10; // State column is 10th column in spreadsheet

var COLUMN_COMMENT = 3; // Comment column is 3rd column in approvals spreadhseet





/*******************************************************************Main Approval and/or Submission Functions**************************************************************/

function onReportOrApprovalSubmit() {
  
  // Initialize Enginhering Change Request ECR (Responses) spreadsheet for editing
  // This is the active spreadhseet since this script is stored with it.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];

  // Initialize Engineeering Change Request ECR Approvals spreadsheet for editing
  // Since this spreadheet is not active spreadsheet. It initializes it by spreadhseet ID.
  var approvalsSpreadsheet = SpreadsheetApp.openById(APPROVALS_SPREADSHEET_ID);
  var approvalsSheet = approvalsSpreadsheet.getSheets()[0];
  
  // GetRowsData creates a searchable 2D array 
  var data = getRowsData(sheet);

  // GetRowsData creates a searchable 2D array 
  var approvalsData = getRowsData(approvalsSheet);


  // Iterate through 2D array of Engineering Chenge Request (ECR) (Responses) sheet data
  for (var i = 0; i < data.length; ++i) {
    var row = data[i];
    row.rowNumber = i + 2;
    
    // If State field is empty then this s a newly submitted ECR.
    if (!row.state) {
      
      // Email the director about ECR.
      sendReportToManager(row);
      
      // Put manager's email in state field to mark it as being sent to director for approval
      sheet.getRange(row.rowNumber, COLUMN_STATE).setValue(row.state);
      
    } else if (row.state == STATE_MANAGER_EMAIL) {
      
      // If ECR has already been sent to director then iterate through
      // approvals sheet
      
      for (var j = 0; j < approvalsData.length; ++j) {
        var approval = approvalsData[j];
        
        // If current ECR is not the same as the last ECR number
        // Then don't stop
        if (row.rowNumber != approval.ecrNumber) {
          continue;
        }
        // Send approval results to requestor
        sendApprovalResults(row, approval);
        
        // Update the state field in sreadsheet to approved for denied
        sheet.getRange(row.rowNumber, COLUMN_STATE).setValue(row.state);
        
        // Stop if ECR number and current ECR are the same. This means there
        // are no new ECRs to check
        break;
      }
    }
  }
}

/**********************Emailer functions**************************************************************/

// Sends an email to an employee to communicate the manager's decision on a given ECR
function sendApprovalResults(row, approval) {
  
  
 // Truncate string containing ETA information to
 // prevent it from showing a date of 12/31/1969
 var eta = row.etaForCompletion;
 var etaTruncated = eta.toString().substring(16,25);
 var approvedOrRejected;
  
  if(approval.approveEcr == "Yes")
  {
  approvedOrRejected = "approved";
  }
  else if(approval.approveEcr == "No")
  {
  approvedOrRejected = "Rejected";
  }
  var message = "<html><body>"
    + "<p>" + "Director has " + approvedOrRejected + " your ECR."
    + "<P>" + "Purpose:" + row.purposeOfEcr
    + "<P>" + "Impacted Systems & Users: " + row.impactedSystemsUsers
    + "<P>" + "Known Risks: " + row.knownRisks
    + "<P>" + "Implementation Plan: " + row.implementationPlan
    + "<P>" + "Roll-Back Plan: " + row.rollbackPlan
    + "<P>" + "ETA for Completion: " + etaTruncated
    + "<P>" + "Planned Date and Time of Implementation: " + row.plannedDateTimeOfImplementation
    + "<P>Manager's comment: " + (approval.comments || "")
      + "</body></html>";
  MailApp.sendEmail(row.username, "ECR Approval Results", "", {htmlBody: message});
  
   // Update the state of the report to APPROVED or DENIED
  if (approval.approveEcr == "Yes") {
    row.state = STATE_APPROVED;
  } else{
    row.state = STATE_DENIED;
  }
}


// Sends an email about ECR to director
function sendReportToManager(row) {
  var eta = row.etaForCompletion;
  var etaString = eta.toString();
  var etaTruncated = etaString.substring(16,25); // shorten string to fix the issue with erroneous date and time
  var message = "<HTML><BODY>"
    + "<P>" + row.username + " has requested your approval for an Engineering Change Request."
    + "<P>" + "Purpose:" + row.purposeOfEcr
    + "<P>" + "Impacted Systems & Users: " + row.impactedSystemsUsers
    + "<P>" + "Known Risks: " + row.knownRisks
    + "<P>" + "Implementation Plan: " + row.implementationPlan
    + "<P>" + "Roll-Back Plan: " + row.rollbackPlan
    + "<P>" + "ETA for Completion: " + etaTruncated
    + "<P>" + "Planned Date and Time of Implementation: " + row.plannedDateTimeOfImplementation
    + '<P>Please approve or reject the ECR <A HREF="' + APPROVAL_FORM_URL + '">here</A>.'
    + "</HTML></BODY>";
  MailApp.sendEmail(STATE_MANAGER_EMAIL, "ECR Approval Request", "", {htmlBody: message});
  row.state = STATE_MANAGER_EMAIL;
}

/***********************************Data reading functions and column name normalizers******************************/

// Reccycled from Javascript objects tutorial on Google Developers website
// Tutorial last updated April 2009 and no longer maintained and supported
// Use with caution

function getRowsData(sheet, range, columnHeadersRowIndex) {
  var headersIndex = columnHeadersRowIndex || range ? range.getRowIndex() - 1 : 1;
  var dataRange = range || 
    sheet.getRange(headersIndex + 1, 1, sheet.getMaxRows() - headersIndex, sheet.getMaxColumns());
  var numColumns = dataRange.getEndColumn() - dataRange.getColumn() + 1;
  var headersRange = sheet.getRange(headersIndex, dataRange.getColumn(), 1, numColumns);
  var headers = headersRange.getValues()[0];
  return getObjects(dataRange.getValues(), normalizeHeaders(headers));
}

function getObjects(data, keys) {
  var objects = [];
  for (var i = 0; i < data.length; ++i) {
    var object = {};
    var hasData = false;
    for (var j = 0; j < data[i].length; ++j) {
      var cellData = data[i][j];
      if (isCellEmpty(cellData)) {
        continue;
      }
      object[keys[j]] = cellData;
      hasData = true;
    }
    if (hasData) {
      objects.push(object);
    }
  }
  return objects;
}


function normalizeHeaders(headers) {
  var keys = [];
  for (var i = 0; i < headers.length; ++i) {
    keys.push(normalizeHeader(headers[i]));
  }
  return keys;
}


function normalizeHeader(header) {
  var key = "";
  var upperCase = false;
  for (var i = 0; i < header.length; ++i) {
    var letter = header[i];
    if (letter == " " && key.length > 0) {
      upperCase = true;
      continue;
    }
    if (!isAlnum(letter)) {
      continue;
    }
    if (key.length == 0 && isDigit(letter)) {
      continue; // first character must be a letter
    }
    if (upperCase) {
      upperCase = false;
      key += letter.toUpperCase();
    } else {
      key += letter.toLowerCase();
    }
  }
  return key;
}

function isCellEmpty(cellData) {
  return typeof(cellData) == "string" && cellData == "";
}


function isAlnum(char) {
  return char >= 'A' && char <= 'Z' ||
    char >= 'a' && char <= 'z' ||
    isDigit(char);
}


function isDigit(char) {
  return char >= '0' && char <= '9';
}

