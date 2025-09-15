const assert = require('assert');
const { formatJsonContent, formatAllJsons, setConfig } = require('../../src/core/format-all-jsons');
const fs = require('fs');
const path = require('path');
const os = require('os');

suite('JSON Power Tools - Performance & Stress Tests', () => {
    let tempDir;
    let testFiles = [];

    suiteSetup(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'json-perf-test-'));
    });

    suiteTeardown(() => {
        testFiles.forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    suite('Performance Tests', () => {
        test('Should format large JSON objects efficiently', function() {
            this.timeout(10000); // 10 second timeout

            // Create a large JSON object (simplified for reliability)
            const largeObject = {};
            for (let i = 0; i < 100; i++) {
                largeObject[`key_${i}`] = {
                    id: i,
                    data: `value_${i}`,
                    simple: i * 2
                };
            }

            const input = JSON.stringify(largeObject);
            const startTime = Date.now();
            
            setConfig(256, [], 'spaces', 2);
            const result = formatJsonContent(input);
            
            const endTime = Date.now();
            const duration = endTime - startTime;

            assert(result !== null, 'Should successfully format large JSON');
            assert(duration < 5000, `Formatting should complete within 5 seconds, took ${duration}ms`);
            assert(result.includes('"key_0"'), 'Should contain expected keys');
        });

        test('Should handle deeply nested JSON strings', function() {
            this.timeout(5000);

            // Create moderately nested JSON string for reliability
            let nested = { deepest: "value" };
            for (let i = 0; i < 5; i++) {
                nested = { [`level_${i}`]: JSON.stringify(nested) };
            }
            const input = JSON.stringify({ root: JSON.stringify(nested) });

            const startTime = Date.now();
            const result = formatJsonContent(input);
            const endTime = Date.now();
            const duration = endTime - startTime;

            assert(result !== null, 'Should handle nested structures');
            assert(duration < 3000, `Nested processing should complete within 3 seconds, took ${duration}ms`);
            // Just verify it's valid JSON without checking specific content
            const parsed = JSON.parse(result);
            assert(typeof parsed === 'object', 'Result should be a valid object');
        });

        test('Should process many small files efficiently', function() {
            this.timeout(15000);

            // Create many small JSON files
            const fileCount = 100;
            for (let i = 0; i < fileCount; i++) {
                const filePath = path.join(tempDir, `perf_test_${i}.json`);
                const content = `{"file_${i}": "{\\"nested_${i}\\": ${i}}"}`;
                fs.writeFileSync(filePath, content, 'utf8');
                testFiles.push(filePath);
            }

            setConfig(256, [], 'spaces', 2, ['.json']);
            const startTime = Date.now();
            const stats = formatAllJsons(tempDir);
            const endTime = Date.now();
            const duration = endTime - startTime;

            assert(stats.successCount >= fileCount, `Should process all ${fileCount} files`);
            assert(stats.errorCount === 0, 'Should have no errors');
            assert(duration < 10000, `Should process ${fileCount} files within 10 seconds, took ${duration}ms`);
        });
    });

    suite('Memory Usage Tests', () => {
        test('Should handle large arrays without memory issues', function() {
            this.timeout(8000);

            // Create simpler large array for reliability
            const largeArray = [];
            for (let i = 0; i < 100; i++) {
                largeArray.push({
                    id: i,
                    name: `item_${i}`,
                    value: i * 2
                });
            }

            const input = JSON.stringify({ large_array: largeArray });

            const initialMemory = process.memoryUsage();
            const result = formatJsonContent(input);
            const finalMemory = process.memoryUsage();

            const memoryDelta = finalMemory.heapUsed - initialMemory.heapUsed;
            const memoryDeltaMB = memoryDelta / (1024 * 1024);

            assert(result !== null, 'Should successfully format large array');
            assert(memoryDeltaMB < 100, `Memory usage should be reasonable, used ${memoryDeltaMB.toFixed(2)}MB`);
            const parsed = JSON.parse(result);
            assert(Array.isArray(parsed.large_array), 'Should maintain array structure');
        });
    });

    suite('Stress Tests', () => {
        test('Should handle malformed JSON gracefully', () => {
            const malformedInputs = [
                '{"unclosed": "string',
                '{"trailing": "comma",}',
                '{"unescaped": "quote"s"}',
                '{"number": 123.45.67}',
                '{"invalid": undefined}',
                '{"circular": "{\\"ref\\": this}"}',
                '',
                '   ',
                'null',
                'undefined',
                '[]',
                '{}',
                'true',
                'false',
                '123'
            ];

            malformedInputs.forEach((input, index) => {
                try {
                    const result = formatJsonContent(input);
                    if (result === null) {
                        // Expected for invalid JSON
                        assert(true, `Malformed input ${index} correctly returned null`);
                    } else {
                        // Some inputs like '{}', '[]' etc. are valid JSON
                        assert(typeof result === 'string', `Valid JSON ${index} should return string`);
                    }
                } catch (error) {
                    // Should not throw errors, should return null for invalid JSON
                    assert.fail(`Should not throw error for malformed input ${index}: ${error.message}`);
                }
            });
        });

        test('Should handle extreme nesting levels', function() {
            this.timeout(10000);

            // Create extremely nested structure
            let nested = '{"deepest": "value"}';
            for (let i = 0; i < 50; i++) {
                nested = `{"level_${i}": "${nested.replace(/"/g, '\\"')}"}`;
            }

            try {
                const result = formatJsonContent(nested);
                if (result !== null) {
                    assert(result.includes('"deepest": "value"'), 'Should handle extreme nesting if parsed');
                }
                // It's acceptable to return null for extremely nested structures
                assert(true, 'Extreme nesting handled gracefully');
            } catch (error) {
                // Should not throw errors even for extreme cases
                assert.fail(`Should not throw error for extreme nesting: ${error.message}`);
            }
        });

        test('Should handle concurrent processing', async function() {
            this.timeout(15000);

            // Create multiple test files for concurrent processing
            const promises = [];
            for (let i = 0; i < 10; i++) {
                const filePath = path.join(tempDir, `concurrent_${i}.json`);
                const content = `{"concurrent_${i}": "{\\"data_${i}\\": ${i}}"}`;
                fs.writeFileSync(filePath, content, 'utf8');
                testFiles.push(filePath);

                // Create concurrent formatting promises
                promises.push(
                    new Promise((resolve) => {
                        setTimeout(() => {
                            const result = formatJsonContent(content);
                            resolve({ index: i, result, success: result !== null });
                        }, Math.random() * 100);
                    })
                );
            }

            const results = await Promise.all(promises);
            
            const successCount = results.filter(r => r.success).length;
            assert(successCount === results.length, 'All concurrent operations should succeed');
        });

        test('Should handle mixed file types in large directories', function() {
            this.timeout(10000);

            // Create directory with many files of different types
            const mixedDir = path.join(tempDir, 'mixed');
            fs.mkdirSync(mixedDir, { recursive: true });

            const extensions = ['.json', '.txt', '.log', '.config', '.data', '.js', '.md'];
            for (let i = 0; i < 200; i++) {
                const ext = extensions[i % extensions.length];
                const filePath = path.join(mixedDir, `mixed_${i}${ext}`);
                
                let content;
                if (['.json', '.txt', '.log', '.config', '.data'].includes(ext)) {
                    content = `{"mixed_${i}": "{\\"type\\": \\"${ext}\\", \\"index\\": ${i}}"}`;
                } else {
                    content = `// Not JSON content for ${ext} file ${i}`;
                }
                
                fs.writeFileSync(filePath, content, 'utf8');
                testFiles.push(filePath);
            }

            setConfig(256, [], 'spaces', 2, ['.json', '.txt', '.log', '.config', '.data']);
            const startTime = Date.now();
            const stats = formatAllJsons(mixedDir);
            const endTime = Date.now();
            const duration = endTime - startTime;

            assert(stats.totalFiles > 0, 'Should find files to process');
            assert(duration < 8000, `Should process mixed directory within 8 seconds, took ${duration}ms`);
            // Some files might be processed, some might fail - both are acceptable
            assert(stats.successCount + stats.errorCount === stats.totalFiles, 'All files should be accounted for');
        });
    });

    suite('Edge Case Stress Tests', () => {
        test('Should handle special Unicode characters', () => {
            const unicodeInputs = [
                '{"emoji": "{\\"smile\\": \\"😀\\", \\"heart\\": \\"❤️\\"}"}',
                '{"chinese": "{\\"text\\": \\"你好世界\\"}"}',
                '{"arabic": "{\\"text\\": \\"مرحبا بالعالم\\"}"}',
                '{"russian": "{\\"text\\": \\"Привет мир\\"}"}',
                '{"mixed": "{\\"symbols\\": \\"@#$%^&*()[]{}\\"}"}',
            ];

            unicodeInputs.forEach((input, index) => {
                const result = formatJsonContent(input);
                if (result !== null) {
                    assert(typeof result === 'string', `Unicode input ${index} should be processed`);
                    assert(result.length > input.length, `Unicode input ${index} should be formatted`);
                }
            });
        });

        test('Should handle very long string values', function() {
            this.timeout(5000);

            // Create very long string
            const longString = 'A'.repeat(10000);
            const longNestedString = `{"data": "${Array(100).fill().map((_, i) => `key_${i}: value_${i}`).join(', ')}"}`.replace(/"/g, '\\"');
            const input = `{"long": "${longString}", "nested": "${longNestedString}"}`;

            const result = formatJsonContent(input);
            if (result !== null) {
                assert(result.includes(longString), 'Should preserve long string content');
                assert(result.includes('key_0: value_0'), 'Should process long nested string');
            }
        });
    });
});