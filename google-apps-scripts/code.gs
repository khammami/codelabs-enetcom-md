/**
 * @OnlyCurrentDoc
 */

GITHUB_TOKEN =
  PropertiesService.getScriptProperties().getProperty("github_token");

/**
 * 
 */
function onOpen() {
  DocumentApp.getUi()
    .createMenu("GitHub")
    .addItem("Export", "exportFunction")
    .addItem("Add & Export", "addAndExportFunction")
    .addItem("Export All", "exportAllFunction")
    .addToUi();
}

/**
 * Triggers the 'gdocs_export' event in the connected GitHub repository to export the current document.
 * 
 * Optionally, a custom payload can be provided to override the default behavior of the export function.
 * This payload should be an object containing any additional data needed for the export process.
 * 
 * @param {String} payload (optional) - Custom data (JSON string) to include in the event trigger.
 */
function exportFunction(payload) {
  // Get document ID
  const documentId = DocumentApp.getActiveDocument().getId();

  if (!payload) {
    // Construct the payload for the GitHub workflow dispatch API
    var payload = JSON.stringify({
      event_type: "gdocs_export",
      client_payload: {
        documentId: documentId,
      },
    });
  }

  // Configure HTTP request
  const options = {
    method: "POST",
    payload: payload,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + GITHUB_TOKEN,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };

  // Dispatch the workflow
  const url = `https://api.github.com/repos/khammami/codelabs-enetcom-md/dispatches`;
  const response = UrlFetchApp.fetch(url, options);

  // Handle response
  if (response.getResponseCode() === 204) {
    DocumentApp.getUi().alert("Workflow dispatched successfully!");
  } else {
    DocumentApp.getUi().alert("Error: " + response.getContentText());
  }
}

/**
 * Adds the current document to the GitHub repository's "codelabs.json" file
 * and triggers a "gdocs_add" event for export.
 *
 * This function facilitates adding the current document to the list of codelabs
 * managed by the GitHub repository. It achieves this by:
 * 1. Updating the "codelabs.json" file with the document information.
 * 2. Dispatching a "gdocs_add" event, likely to trigger an export process.
 */
function addAndExportFunction() {
  // Get document UI
  var ui = DocumentApp.getUi();

  // Prompt the user to enter the ID
  const userResponse = ui.prompt(
    "Codelab ID",
    "Please Enter Codelab ID:",
    ui.ButtonSet.OK_CANCEL
  );
  const codelabId = userResponse.getResponseText();

  // Handle user clicking away (Cancel)
  if (userResponse.getSelectedButton() == ui.Button.OK) {
    // Validate the entered ID (optional)
    if (!codelabId || codelabId.trim() === "") {
      ui.alert("Please enter a valid Codelab ID.");
      Logger.log("The user didn't provide a valid ID.");
    } else {
      // Get document ID
      const documentId = DocumentApp.getActiveDocument().getId();

      // Construct the payload with the added eventType
      var payload = JSON.stringify({
        event_type: "gdocs_add",
        client_payload: {
          documentId: documentId,
          codelabId: codelabId,
        },
      });

      exportFunction(payload); // Call exportFunction with the modified payload
    }
  } else {
    Logger.log("The user cancels.");
  }
}

/**
 * Triggers the export of all codelabs in 'codelabs.json' to a GitHub repository.
 * This function dispatches the 'gdocs_export_all' event to the repository.
 */
function exportAllFunction() {
  const documentId = DocumentApp.getActiveDocument().getId();

  // Construct the payload with the added eventType
  var payload = JSON.stringify({
    event_type: "gdocs_export_all",
    client_payload: {
      documentId: documentId,
    },
  });

  exportFunction(payload); // Call exportFunction with the modified payload
}
