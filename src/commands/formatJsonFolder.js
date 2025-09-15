/**
 * Command: Format JSON Folder
 * 
 * Formats all JSON files in a selected folder
 */

const vscode = require('vscode');
const path = require('path');
const { formatAllJsons } = require('../core/format-all-jsons');

/**
 * Formats all JSON files in a folder
 * @param {string} folderPath - Path to the folder to be processed
 * @returns {Promise<boolean>} - Promise resolved with true if successful, false otherwise
 */
async function formatJsonFolder(folderPath) {
    try {
        // Configuration is already loaded in the module, just execute formatting
        const stats = formatAllJsons(folderPath);
        
        if (stats.errorCount === 0) {
            vscode.window.showInformationMessage(
                `✅ Formatting completed: ${stats.successCount} files formatted in ${stats.duration} - ${path.basename(folderPath)}`
            );
        } else {
            vscode.window.showWarningMessage(
                `⚠️ Formatting completed with errors: ${stats.successCount} successes, ${stats.errorCount} errors in ${stats.duration} - ${path.basename(folderPath)}`
            );
        }
        return true;
    } catch (error) {
        vscode.window.showErrorMessage(`Error processing JSON files folder: ${error.message}`);
        return false;
    }
}

/**
 * Command handler for formatting all JSON files in a folder
 * @param {vscode.Uri} uri - The URI of the selected folder
 * @returns {Promise<boolean>} - Promise resolved with true if successful, false otherwise
 */
async function handler(uri) {
    if (uri && uri.fsPath) {
        return formatJsonFolder(uri.fsPath);
    } else {
        vscode.window.showErrorMessage('No folder selected');
        return false;
    }
}

/**
 * Register the format JSON folder command
 * @param {vscode.ExtensionContext} context - The extension context
 */
function register(context) {
    const command = vscode.commands.registerCommand('json-power-tools.formatJsonFolder', handler);
    context.subscriptions.push(command);
}

module.exports = {
    register,
    handler,
    formatJsonFolder
};