ItEcrWorkflow
=============

IT Infrastructure Engineering Change Request Workflow (ECR)

This Google Apps Script Workflow is a modified fork of
Google's Expense Report Tutorial to suit the ECR needs of a small-to-mid-size IT Department.



For those not familiar with Google Apps Scripting, it is essentially Javascript with built in APIs to interface with  Google Forms, Gmail, and Google Sheets. The file extension is .gs rather than .js.

If you're looking to implement this workflow in your own Google Drive, you'll first need to set up two forms and two spreadsheets as outlined in the above tutorial link.

The original tutorial can be found at
http://developers.google.com/apps-script/articles/expense_report_approval


Differences from Tutorial Application:

1.Progam is autonomous and does not have to be run
manually by IT.

2. Primary Key or ECR number in this case, does not have
to be typed in manually by director in approval form. A supplementary
script Automatically inserts it every time an approval form is submitted.

3. Checks for new ECR submissions automatically


Use Case Actors involved:

1. Director or manager receiving the emails about ECR and then promoted to fill out approval form.

2. Requestor who fills out ECR form and receives email with approval results.


=
