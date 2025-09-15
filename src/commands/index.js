/**
 * Commands Index
 * 
 * Centralizes all command exports and provides a single registration function
 */

const formatCurrentJson = require('./formatCurrentJson');
const formatSingleJsonFile = require('./formatSingleJsonFile');
const formatJsonFolder = require('./formatJsonFolder');
const openSettings = require('./openSettings');

/**
 * Register all commands
 * @param {vscode.ExtensionContext} context - The extension context
 */
function registerAllCommands(context) {
    formatCurrentJson.register(context);
    formatSingleJsonFile.register(context);
    formatJsonFolder.register(context);
    openSettings.register(context);
}

module.exports = {
    registerAllCommands,
    formatCurrentJson,
    formatSingleJsonFile,
    formatJsonFolder,
    openSettings
};