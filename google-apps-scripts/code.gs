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
  // Get document ID
  const documentId = DocumentApp.getActiveDocument().getId();

  // Construct the payload with the added eventType
  const payload = JSON.stringify({
    event_type: 'gdocs-add-export',
    client_payload: {
      documentId: documentId
    },
  });

  exportFunction(payload); // Call exportFunction with the modified payload
}
