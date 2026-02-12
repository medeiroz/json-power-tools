const fs = require('fs');
const path = require('path');

// Default values for maximum depth and ignored folders
const DEFAULT_MAX_DEPTH = 256;
const DEFAULT_IGNORED_FOLDERS = ['node_modules', 'vendor', 'composer', 'packages'];
const DEFAULT_ALLOWED_EXTENSIONS = ['.json'];

// Current configuration loaded statically
let currentConfig = {
  maxDepth: DEFAULT_MAX_DEPTH,
  ignoredFolders: DEFAULT_IGNORED_FOLDERS,
  indentationType: 'spaces',
  indentationSize: 2,
  allowedExtensions: DEFAULT_ALLOWED_EXTENSIONS
};

/**
 * Sets the configuration to be used by all functions
 * @param {number} maxDepth - Maximum depth
 * @param {string[]} ignoredFolders - List of ignored folders
 * @param {string} indentationType - Type of indentation ('spaces' or 'tabs')
 * @param {number} indentationSize - Size of indentation
 * @param {string[]} allowedExtensions - List of allowed file extensions
 */
function setConfig(maxDepth = DEFAULT_MAX_DEPTH, ignoredFolders = DEFAULT_IGNORED_FOLDERS, indentationType = 'spaces', indentationSize = 2, allowedExtensions = DEFAULT_ALLOWED_EXTENSIONS) {
  currentConfig = {
    maxDepth,
    ignoredFolders,
    indentationType,
    indentationSize,
    allowedExtensions
  };
  console.log(`Configuration updated: maxDepth=${maxDepth}, ignoredFolders=${ignoredFolders.length} types, indentation=${indentationType}:${indentationSize}, allowedExtensions=${allowedExtensions.join(', ')}`);
}

/**
 * Gets the current configuration
 * @returns {object} - Current configuration
 */
function getConfig() {
  return { ...currentConfig };
}

/**
 * Gets the indentation string based on current configuration
 * @returns {string|number} - Indentation string for JSON.stringify
 */
function getIndentation() {
  if (currentConfig.indentationType === 'tabs') {
    return '\t';
  } else {
    return currentConfig.indentationSize;
  }
}

/**
 * Checks if a folder should be ignored
 * @param {string} folderName - Folder name
 * @returns {boolean} - True if the folder should be ignored
 */
function shouldIgnoreFolder(folderName) {
  return currentConfig.ignoredFolders
    .map(f => f.toLowerCase())
    .includes(folderName.toLowerCase());
}

/**
 * Checks if a file extension is allowed for formatting
 * @param {string} filePath - Full file path
 * @returns {boolean} - True if the file extension is allowed
 */
function isExtensionAllowed(filePath) {
  const fileExtension = path.extname(filePath).toLowerCase();
  return currentConfig.allowedExtensions
    .map(ext => ext.toLowerCase())
    .includes(fileExtension);
}

/**
 * Recursively find all files with allowed extensions in a directory.
 * @param {string} dir - Directory to search.
 * @param {number} currentDepth - Current depth level (default: 0).
 * @returns {string[]} - Array of file paths.
 */
function findJsonFiles(dir, currentDepth = 0) {
  // Check if maximum depth has been exceeded
  if (currentDepth >= currentConfig.maxDepth) {
    console.warn(`Maximum depth (${currentConfig.maxDepth}) reached at: ${dir}`);
    return [];
  }
  
  let results = [];
  
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = path.join(dir, file);
      
      try {
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
          // Check if the folder should be ignored
          if (shouldIgnoreFolder(file)) {
            console.log(`Ignoring folder: ${filePath} (${file})`);
            return;
          }
          
          // Recursively process subdirectories with incremented depth
          results = results.concat(findJsonFiles(filePath, currentDepth + 1));
        } else if (isExtensionAllowed(filePath)) {
          results.push(filePath);
        }
      } catch (statErr) {
        console.warn(`Cannot access ${filePath}: ${statErr.message}`);
      }
    });
  } catch (readErr) {
    console.warn(`Cannot read directory ${dir}: ${readErr.message}`);
  }
  
  return results;
}

/**
 * Try to parse string properties in a JSON object.
 * @param {object} obj - The JSON object.
 * @returns {object} - The processed object.
 */
function parseStringProperties(obj) {
  if (Array.isArray(obj)) {
    return obj.map(parseStringProperties);
  } else if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'string' && (value[0] === '{' || value[0] === '[')) {
        try {
          const parsed = JSON.parse(value);
          newObj[key] = typeof parsed === 'object' ? parseStringProperties(parsed) : value;
        } catch {
          newObj[key] = value;
        }
      } else {
        newObj[key] = typeof value === 'object' ? parseStringProperties(value) : value;
      }
    }
    return newObj;
  }
  return obj;
}

/**
 * Format a single JSON file.
 * @param {string} filePath - Path to the JSON file.
 * @returns {boolean} - True if formatting was successful, false otherwise.
 */
function formatSingleJson(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    let json = JSON.parse(data);
    json = parseStringProperties(json);
    const indentation = getIndentation();
    fs.writeFileSync(filePath, JSON.stringify(json, null, indentation), 'utf8');
    console.log(`Formatted: ${filePath}`);
    return true;
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
    return false;
  }
}

/**
 * Format JSON content from a string.
 * @param {string} content - JSON content as string.
 * @returns {string|null} - Formatted JSON string or null if error.
 */
function formatJsonContent(content) {
  try {
    content = content.trim();
    let json = JSON.parse(content);
    json = parseStringProperties(json);
    const indentation = getIndentation();
    return JSON.stringify(json, null, indentation);
  } catch (err) {

    console.error('Error formatting JSON content:', err.message);
    return null;
  }
}

/**
 * Pretty format all files with allowed extensions found in the directory.
 * @param {string} rootDir - Root directory to start search.
 * @returns {object} - Object with formatting statistics.
 */
function formatAllJsons(rootDir) {
  console.log(`Starting JSON formatting in: ${rootDir}`);
  console.log(`Maximum depth limit: ${currentConfig.maxDepth}`);
  console.log(`Ignoring ${currentConfig.ignoredFolders.length} folder types: ${currentConfig.ignoredFolders.slice(0, 5).join(', ')}${currentConfig.ignoredFolders.length > 5 ? '...' : ''}`);
  console.log(`Allowed extensions: ${currentConfig.allowedExtensions.join(', ')}`);
  
  const startTime = Date.now();
  const files = findJsonFiles(rootDir);
  
  console.log(`Found ${files.length} files to process`);
  
  let successCount = 0;
  let errorCount = 0;
  
  files.forEach(file => {
    const success = formatSingleJson(file);
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  });
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  const stats = {
    totalFiles: files.length,
    successCount,
    errorCount,
    duration: `${duration.toFixed(2)}s`
  };
  
  console.log(`Formatting completed:`);
  console.log(`- Total files: ${stats.totalFiles}`);
  console.log(`- Successful: ${stats.successCount}`);
  console.log(`- Errors: ${stats.errorCount}`);
  console.log(`- Duration: ${stats.duration}`);
  
  return stats;
}

// Export functions for use in the extension
module.exports = {
  formatSingleJson,
  formatJsonContent,
  formatAllJsons,
  findJsonFiles,
  setConfig,
  getConfig,
};