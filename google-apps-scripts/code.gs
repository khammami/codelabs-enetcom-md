/**
 * @OnlyCurrentDoc
 */

GITHUB_TOKEN = PropertiesService.getScriptProperties().getProperty("github_token");

function onOpen() {
  DocumentApp.getUi()
    .createMenu('GitHub')
    .addItem('Export', 'exportFunction')
    .addItem('Add & Export', 'addAndExportFunction')
    .addToUi();
}

function exportFunction() {
  // Get document ID
  const documentId = DocumentApp.getActiveDocument().getId();

  // Construct the payload for the GitHub workflow dispatch API
  const payload = JSON.stringify({
    event_type: 'gdocs-export',
    client_payload: {
      documentId: documentId
    },
  });

  // Configure HTTP request
  const options = {
    'method' : 'POST',
    'payload' : payload,
    'headers' : {
      'Authorization': 'Bearer ' + GITHUB_TOKEN,
      'Content-Type': 'application/json',
    },
    'muteHttpExceptions': true,
    'followRedirects': true,
    'validateHttpsCertificates': true,
    'contentType': 'application/json',
  };

  // Dispatch the workflow
  const url = `https://api.github.com/repos/khammami/codelabs-enetcom-md/dispatches`;
  const response = UrlFetchApp.fetch(url, options);

  // Handle response
  if (response.getResponseCode() === 204) {
    DocumentApp.getUi().alert('Workflow dispatched successfully!');
  } else {
    DocumentApp.getUi().alert('Error: ' + response.getContentText());
  }
}

function addAndExportFunction() {
  // Get document UI
  var ui = DocumentApp.getUi();

  // Prompt the user to enter the ID
  const userResponse = ui.prompt('Codelab ID','Please Enter Codelab ID:',ui.ButtonSet.OK_CANCEL);
  const codelabId = userResponse.getResponseText();

  // Handle user clicking away (Cancel)
  if (userResponse.getSelectedButton() == ui.Button.OK) {
    // Validate the entered ID (optional)
    if (!codelabId || codelabId.trim() === '') {
      ui.alert('Please enter a valid Codelab ID.');
      Logger.log('The user didn\'t provide a valid ID.');
    } else {
      // Get document ID
      const documentId = DocumentApp.getActiveDocument().getId();

      // Construct the payload with the added eventType
      const payload = JSON.stringify({
        event_type: 'gdocs-add-export',
        client_payload: {
          documentId: documentId,
          codelabId: codelabId
        },
      });

      exportFunction(payload); // Call exportFunction with the modified payload
    }
  } else {
      Logger.log('The user cancels.');
  }
}
