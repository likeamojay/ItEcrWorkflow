ItEcrWorkflow
=============

IT Infrastructure Engineering Change Request Workflow (ECR)

This is a Google Apps Script Workflow Application originally a mod of 
Google's Expense Report Tutorial to suit the ECR needs of a small-to-mid-size IT Department.


The original tutorial can be found at
http://developers.google.com/apps-script/articles/expense_report_approval

Differences from Tutorial Application:
1.Progam is autonomous and does not have to be run
manually by IT.
2. Expense Report ID or ECR number in this case, does not have
to be typed in manually by director in approval form. A supplementary
script Automatically inserts it.
in spreadsheet every time an approval form is submitted.
3. Checks for new ECR submissions automatically


Use Case Actors involved:
1. Director or manager receiving the emails about ECR and then promoted to fill out approval form
2. Requestor who fills out ECR form and receives email with approval results*/


Workflow Algorithm:
1. Requestor fills out Engineering Change Request Form (ECR).

2. This script runs automatically and sends an email to STATE_MANAGER_EMAIL with 
information about ECR and then prompts them to 
click the hyperlink to fill out the approval form.

3. After approval form is submitted. Secondary script "Insert ECR Number" automatically 
runs and inserts ECR number into Engineering Change Request Approvals (Responses) spreadhseet.

4.Every 5 minutes this script runs again automatically to check if Director or manager has filled
out a new Approval form that hasn't been responded to yet. If it has then sends an email to requestor
with the ECR approval results.

End Worflow Algorithm


