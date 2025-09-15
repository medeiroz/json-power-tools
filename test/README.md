# Testing Guide for JSON Power Tools

This document outlines the comprehensive testing strategy for the JSON Power Tools VS Code extension.

## Test Structure

### 📁 Test Organization

Tests are organized into separate directories by category:

- **`/unit/`** - Unit tests for core functionality
  - `format-all-jsons.test.js` - Core JSON formatting logic
  - `scenarios.test.js` - Specific test scenarios and edge cases
- **`/integration/`** - Integration tests for VS Code features
  - `extension.test.js` - VS Code extension integration
- **`/performance/`** - Performance and stress tests
  - `performance.test.js` - Benchmarks and load testing

## 🧪 Test Categories

### 1. Unit Tests (`/unit/format-all-jsons.test.js`)

Tests the core JSON formatting logic without VS Code dependencies.

**Coverage Areas:**
- ✅ Configuration management (`setConfig`, `getConfig`)
- ✅ JSON content formatting with nested string conversion
- ✅ Indentation options (spaces vs tabs, different sizes)
- ✅ File operations (`formatSingleJson`)
- ✅ File discovery (`findJsonFiles`) with extension and folder filtering
- ✅ Bulk formatting (`formatAllJsons`)
- ✅ Edge cases (malformed JSON, empty files, special characters)

**Key Test Scenarios:**
```javascript
// Simple JSON formatting
'{"name":"test"}' → '{\n  "name": "test"\n}'

// Nested JSON string conversion  
'{"data": "{\\"key\\": \\"value\\"}"}' → nested object structure

// Indentation testing
spaces vs tabs, different sizes (2, 4, etc.)
```

### 2. Integration Tests (`/integration/extension.test.js`)

Tests VS Code extension integration and commands.

**Coverage Areas:**
- ✅ Extension activation and registration
- ✅ Command availability and execution
- ✅ Configuration integration with VS Code settings
- ✅ Document formatting provider
- ✅ File and folder commands via Explorer context menu
- ✅ Active editor formatting
- ✅ Language context handling (JSON, JSONC)

**Key Integration Points:**
- Document formatting provider (`Shift+Alt+F`)
- Context menu commands (right-click formatting)
- Settings synchronization with VS Code configuration
- Extension activation events

### 3. Performance Tests (`/performance/performance.test.js`)

Tests performance characteristics and stress scenarios.

**Coverage Areas:**
- ✅ Large JSON object processing (1000+ properties)
- ✅ Deeply nested JSON strings (10+ levels)
- ✅ Bulk file processing (100+ files)
- ✅ Memory usage monitoring
- ✅ Concurrent processing
- ✅ Mixed file type handling
- ✅ Unicode and special character processing
- ✅ Very long string handling

**Performance Benchmarks:**
- Large JSON (1000 properties): < 5 seconds
- Deep nesting (10 levels): < 3 seconds  
- Bulk processing (100 files): < 10 seconds
- Memory usage: < 100MB for large operations

## 🚀 Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suites
```bash
# Unit tests only
npm run test:unit

# Integration tests only  
npm run test:integration

# Performance tests only
npm run test:performance
```



## 📊 Test Data

### Sample JSON Test Cases

**Simple JSON:**
```json
{"name":"test","value":123}
```

**Nested JSON Strings:**
```json
{"data": "{\"nested\": \"value\"}"}
```

**Complex Nested:**
```json
{"user": "{\"profile\": \"{\\\"preferences\\\": \\\"{\\\\\\\"theme\\\\\\\": \\\\\\\"dark\\\\\\\"}\\\"}\"}"}"
```

**Arrays with JSON:**
```json
{"items": ["{\"id\": 1}", "{\"id\": 2}"]}
```

### Configuration Test Cases

- **Spaces (2):** `  "property"` (2 spaces)
- **Spaces (4):** `    "property"` (4 spaces)  
- **Tabs:** `\t"property"` (tab character)

## 🔧 Test Environment Setup

### Temporary Files
Tests create temporary directories and files that are automatically cleaned up:
- Unit tests: `/tmp/json-power-tools-test-*`
- Performance tests: `/tmp/json-perf-test-*`
- Integration tests: `/tmp/vscode-json-test-*`

### Mock Data
- Generated JSON objects with varying complexity
- File structures with different extensions
- Configuration scenarios for comprehensive coverage

## 🐛 Error Handling Tests

### Malformed JSON
- Unclosed strings, brackets
- Invalid syntax
- Circular references
- Undefined values

### File System Errors  
- Non-existent files
- Permission issues
- Corrupted file content

### VS Code Integration Errors
- Invalid document types
- Missing active editor
- Command execution failures

## 📈 Continuous Testing

### Pre-commit Hooks
```bash
# Lint before testing
npm run lint

# Run all tests before commit
npm test
```

### CI/CD Integration
The test suite is designed to run in automated environments:
- GitHub Actions compatibility
- Azure DevOps pipeline support  
- Docker container testing

## 🎯 Test Quality Metrics

### Code Coverage Targets
- **Core Logic:** > 90% coverage
- **Integration:** > 80% coverage
- **Error Handling:** > 85% coverage

### Performance Targets
- **Formatting Speed:** < 5s for large files
- **Memory Usage:** < 100MB peak
- **Bulk Operations:** < 10s for 100 files

### Reliability Targets  
- **Success Rate:** > 99% for valid JSON
- **Error Handling:** 100% graceful failure
- **Resource Cleanup:** 100% temp file cleanup

## 🔄 Test Maintenance

### Adding New Tests
1. Choose appropriate test file based on functionality
2. Follow existing naming conventions
3. Include both positive and negative test cases
4. Add performance considerations for new features
5. Update this documentation

### Test Data Management
- Keep test data minimal but representative
- Use generated data for performance tests
- Clean up all temporary resources
- Document any external dependencies

---

**Total Test Coverage: 100+ test cases across 3 test suites**
**Estimated Test Runtime: < 60 seconds for full suite**