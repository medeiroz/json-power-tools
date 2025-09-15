const assert = require('assert');
const { formatJsonContent, setConfig } = require('../../src/core/format-all-jsons');

suite('JSON Power Tools - Scenario Tests', () => {
        
        test('should handle minified JSON correctly', async () => {
            // Reset configuration for consistent test results
            setConfig({
                maxDepth: 256,
                ignoredFolders: [],
                indentation: { type: 'spaces', size: 2 },
                allowedExtensions: ['.json']
            });

            const minifiedJson = '{"name":"John","age":30,"address":{"street":"123 Main St","city":"New York"},"hobbies":["reading","swimming"]}';
            
            const result = formatJsonContent(minifiedJson);
            
            assert.strictEqual(typeof result, 'string');
            assert.ok(result.includes('\n'), 'Result should be formatted with newlines');
            assert.ok(result.includes('  '), 'Result should be indented');
            
            // Verify the structure is preserved
            const parsed = JSON.parse(result);
            assert.strictEqual(parsed.name, 'John');
            assert.strictEqual(parsed.age, 30);
            assert.deepStrictEqual(parsed.address, { street: "123 Main St", city: "New York" });
            assert.deepStrictEqual(parsed.hobbies, ["reading", "swimming"]);
        });

        test('should handle already formatted JSON gracefully', async () => {
            // Reset configuration for consistent test results
            setConfig({
                maxDepth: 256,
                ignoredFolders: [],
                indentation: { type: 'spaces', size: 2 },
                allowedExtensions: ['.json']
            });

            const formattedJson = `{
  "name": "Jane",
  "age": 25,
  "skills": [
    "JavaScript",
    "Python",
    "Go"
  ],
  "active": true
}`;
            
            const result = formatJsonContent(formattedJson);
            
            assert.strictEqual(typeof result, 'string');
            
            // Should still process it correctly
            const parsed = JSON.parse(result);
            assert.strictEqual(parsed.name, 'Jane');
            assert.strictEqual(parsed.age, 25);
            assert.deepStrictEqual(parsed.skills, ["JavaScript", "Python", "Go"]);
            assert.strictEqual(parsed.active, true);
        });

        test('should handle JSON with stringified JSON properties', async () => {
            // Reset configuration for consistent test results
            setConfig({
                maxDepth: 256,
                ignoredFolders: [],
                indentation: { type: 'spaces', size: 2 },
                allowedExtensions: ['.json']
            });

            const jsonWithStringifiedProperty = {
                "id": 1,
                "metadata": '{"created":"2024-01-01","updated":"2024-01-02"}',
                "config": '{"theme":"dark","notifications":true}',
                "name": "Test Record"
            };
            
            const input = JSON.stringify(jsonWithStringifiedProperty);
            const result = formatJsonContent(input);
            
            assert.strictEqual(typeof result, 'string');
            
            // Parse the result to verify structure
            const parsed = JSON.parse(result);
            assert.strictEqual(parsed.id, 1);
            assert.strictEqual(parsed.name, "Test Record");
            
            // The stringified JSON properties should be processed
            // Check if they're still strings (basic behavior) or converted to objects (advanced behavior)
            assert.ok(parsed.metadata);
            assert.ok(parsed.config);
        });

        test('should handle mixed stringified and regular JSON properties', async () => {
            // Reset configuration for consistent test results
            setConfig({
                maxDepth: 256,
                ignoredFolders: [],
                indentation: { type: 'spaces', size: 2 },
                allowedExtensions: ['.json']
            });

            const mixedJson = {
                "user": {
                    "name": "Alice",
                    "age": 28
                },
                "preferences": '{"language":"en","theme":"light"}',
                "tags": ["admin", "active"],
                "settings": '{"notifications":{"email":true,"sms":false}}'
            };
            
            const input = JSON.stringify(mixedJson);
            const result = formatJsonContent(input);
            
            assert.strictEqual(typeof result, 'string');
            
            // Verify the mixed structure is handled correctly
            const parsed = JSON.parse(result);
            assert.deepStrictEqual(parsed.user, { name: "Alice", age: 28 });
            assert.deepStrictEqual(parsed.tags, ["admin", "active"]);
            assert.ok(parsed.preferences);
            assert.ok(parsed.settings);
            
            // Ensure it's still valid JSON
            assert.doesNotThrow(() => JSON.parse(result));
        });

        test('should handle deep recursive objects with mixed JSON strings', async () => {
            // Reset configuration for consistent test results
            setConfig({
                maxDepth: 256,
                ignoredFolders: [],
                indentation: { type: 'spaces', size: 2 },
                allowedExtensions: ['.json']
            });

            // Create a deeply nested object with 10 levels of depth
            // Mix regular properties with stringified JSON properties at different levels
            const deepObject = {
                "level1": {
                    "data": "Level 1 data",
                    "config": '{"theme":"dark","language":"en"}',
                    "level2": {
                        "data": "Level 2 data",
                        "metadata": '{"created":"2024-01-01","version":"1.0"}',
                        "level3": {
                            "data": "Level 3 data",
                            "settings": '{"notifications":true,"autoSave":false}',
                            "level4": {
                                "data": "Level 4 data",
                                "userPrefs": '{"darkMode":true,"fontSize":14}',
                                "level5": {
                                    "data": "Level 5 data",
                                    "apiConfig": '{"baseUrl":"https://api.example.com","timeout":30000}',
                                    "level6": {
                                        "data": "Level 6 data",
                                        "cache": '{"enabled":true,"ttl":3600}',
                                        "level7": {
                                            "data": "Level 7 data",
                                            "security": '{"encryption":"AES-256","hashAlgorithm":"SHA-256"}',
                                            "level8": {
                                                "data": "Level 8 data",
                                                "database": '{"host":"localhost","port":5432,"ssl":true}',
                                                "level9": {
                                                    "data": "Level 9 data",
                                                    "logging": '{"level":"info","format":"json","rotation":"daily"}',
                                                    "level10": {
                                                        "data": "Level 10 data - deepest level",
                                                        "finalConfig": '{"success":true,"message":"Deep nesting test completed"}'
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            const input = JSON.stringify(deepObject);
            const result = formatJsonContent(input);
            
            assert.strictEqual(typeof result, 'string');
            assert.ok(result.includes('\n'), 'Result should be formatted with newlines');
            assert.ok(result.includes('  '), 'Result should be indented');
            
            // Parse the result to verify deep structure is preserved
            const parsed = JSON.parse(result);
            
            // Verify the deep nesting is maintained
            assert.strictEqual(parsed.level1.data, "Level 1 data");
            assert.strictEqual(parsed.level1.level2.data, "Level 2 data");
            assert.strictEqual(parsed.level1.level2.level3.data, "Level 3 data");
            assert.strictEqual(parsed.level1.level2.level3.level4.data, "Level 4 data");
            assert.strictEqual(parsed.level1.level2.level3.level4.level5.data, "Level 5 data");
            assert.strictEqual(parsed.level1.level2.level3.level4.level5.level6.data, "Level 6 data");
            assert.strictEqual(parsed.level1.level2.level3.level4.level5.level6.level7.data, "Level 7 data");
            assert.strictEqual(parsed.level1.level2.level3.level4.level5.level6.level7.level8.data, "Level 8 data");
            assert.strictEqual(parsed.level1.level2.level3.level4.level5.level6.level7.level8.level9.data, "Level 9 data");
            assert.strictEqual(parsed.level1.level2.level3.level4.level5.level6.level7.level8.level9.level10.data, "Level 10 data - deepest level");
            
            // Verify stringified JSON properties are present at various levels
            assert.ok(parsed.level1.config, 'Level 1 config should be present');
            assert.ok(parsed.level1.level2.metadata, 'Level 2 metadata should be present');
            assert.ok(parsed.level1.level2.level3.settings, 'Level 3 settings should be present');
            assert.ok(parsed.level1.level2.level3.level4.userPrefs, 'Level 4 userPrefs should be present');
            assert.ok(parsed.level1.level2.level3.level4.level5.apiConfig, 'Level 5 apiConfig should be present');
            assert.ok(parsed.level1.level2.level3.level4.level5.level6.cache, 'Level 6 cache should be present');
            assert.ok(parsed.level1.level2.level3.level4.level5.level6.level7.security, 'Level 7 security should be present');
            assert.ok(parsed.level1.level2.level3.level4.level5.level6.level7.level8.database, 'Level 8 database should be present');
            assert.ok(parsed.level1.level2.level3.level4.level5.level6.level7.level8.level9.logging, 'Level 9 logging should be present');
            assert.ok(parsed.level1.level2.level3.level4.level5.level6.level7.level8.level9.level10.finalConfig, 'Level 10 finalConfig should be present');
            
            // Verify the result is still valid JSON after formatting
            assert.doesNotThrow(() => JSON.parse(result), 'Formatted result should be valid JSON');
            
            // Check that the formatting maintained the structure integrity
            const formattedParsed = JSON.parse(result);
            
            // Deep comparison of a few key paths to ensure structure integrity
            // Note: The JSON formatter expands stringified JSON properties into objects
            // We need to check that the expanded structure is correct
            
            // Check that stringified JSON properties have been expanded to objects
            assert.strictEqual(typeof formattedParsed.level1.level2.level3.level4.level5.apiConfig, 'object', 'apiConfig should be expanded to object');
            assert.strictEqual(formattedParsed.level1.level2.level3.level4.level5.apiConfig.baseUrl, 'https://api.example.com');
            assert.strictEqual(formattedParsed.level1.level2.level3.level4.level5.apiConfig.timeout, 30000);
            
            // Check that regular data properties remain unchanged
            assert.strictEqual(formattedParsed.level1.level2.level3.level4.level5.data, 'Level 5 data');
            
            // Check a few more expanded objects to ensure deep expansion worked
            assert.strictEqual(typeof formattedParsed.level1.level2.level3.level4.level5.level6.cache, 'object');
            assert.strictEqual(formattedParsed.level1.level2.level3.level4.level5.level6.cache.enabled, true);
            assert.strictEqual(formattedParsed.level1.level2.level3.level4.level5.level6.cache.ttl, 3600);
        });

        test('should handle 5-level sequential nested JSON strings scenario', async () => {
            // Reset configuration for consistent test results
            setConfig({
                maxDepth: 256,
                ignoredFolders: [],
                indentation: { type: 'spaces', size: 2 },
                allowedExtensions: ['.json']
            });

            // Create a complex 5-level sequential nested JSON strings scenario
            // Each level contains the next level as a stringified JSON
            
            // Level 5 (deepest) - Final payload
            const level5 = {
                userId: 12345,
                permissions: ["read", "write", "admin"],
                isActive: true,
                lastLogin: "2025-09-11T22:00:00Z"
            };

            // Level 4 - contains level5 as JSON string
            const level4 = {
                userProfile: JSON.stringify(level5),
                sessionId: "sess_abc789",
                timestamp: "2025-09-11T21:55:00Z",
                clientIP: "192.168.1.100"
            };

            // Level 3 - contains level4 as JSON string
            const level3 = {
                authentication: JSON.stringify(level4),
                requestId: "req_xyz456",
                method: "POST",
                endpoint: "/api/v2/users/authenticate"
            };

            // Level 2 - contains level3 as JSON string
            const level2 = {
                apiCall: JSON.stringify(level3),
                version: "v2.1.3",
                service: "AuthenticationService",
                region: "us-east-1"
            };

            // Level 1 (root) - contains level2 as JSON string
            const level1 = {
                logEntry: JSON.stringify(level2),
                logLevel: "INFO",
                logId: "log_def123",
                service: "APIGateway",
                additionalData: {
                    server: "prod-gateway-01",
                    loadBalancer: "lb-prod-01",
                    healthStatus: "healthy"
                }
            };

            const input = JSON.stringify(level1);
            const result = formatJsonContent(input);
            
            assert.ok(result, 'Should return a result');
            assert.strictEqual(typeof result, 'string');
            assert.ok(result.includes('\n'), 'Result should be formatted with newlines');
            assert.ok(result.includes('  '), 'Result should be indented');
            
            const parsed = JSON.parse(result);
            
            // Verify root level properties (Level 1)
            assert.strictEqual(parsed.logLevel, "INFO");
            assert.strictEqual(parsed.logId, "log_def123");
            assert.strictEqual(parsed.service, "APIGateway");
            assert.strictEqual(parsed.additionalData.server, "prod-gateway-01");
            assert.strictEqual(parsed.additionalData.loadBalancer, "lb-prod-01");
            assert.strictEqual(parsed.additionalData.healthStatus, "healthy");
            
            // Verify level 1 -> 2: logEntry should be expanded to object
            assert.strictEqual(typeof parsed.logEntry, 'object', 'logEntry should be expanded to object');
            assert.strictEqual(parsed.logEntry.version, "v2.1.3");
            assert.strictEqual(parsed.logEntry.service, "AuthenticationService");
            assert.strictEqual(parsed.logEntry.region, "us-east-1");
            
            // Verify level 2 -> 3: apiCall should be expanded to object
            assert.strictEqual(typeof parsed.logEntry.apiCall, 'object', 'apiCall should be expanded to object');
            assert.strictEqual(parsed.logEntry.apiCall.requestId, "req_xyz456");
            assert.strictEqual(parsed.logEntry.apiCall.method, "POST");
            assert.strictEqual(parsed.logEntry.apiCall.endpoint, "/api/v2/users/authenticate");
            
            // Verify level 3 -> 4: authentication should be expanded to object
            assert.strictEqual(typeof parsed.logEntry.apiCall.authentication, 'object', 'authentication should be expanded to object');
            assert.strictEqual(parsed.logEntry.apiCall.authentication.sessionId, "sess_abc789");
            assert.strictEqual(parsed.logEntry.apiCall.authentication.timestamp, "2025-09-11T21:55:00Z");
            assert.strictEqual(parsed.logEntry.apiCall.authentication.clientIP, "192.168.1.100");
            
            // Verify level 4 -> 5: userProfile should be expanded to object
            assert.strictEqual(typeof parsed.logEntry.apiCall.authentication.userProfile, 'object', 'userProfile should be expanded to object');
            assert.strictEqual(parsed.logEntry.apiCall.authentication.userProfile.userId, 12345);
            assert.deepStrictEqual(parsed.logEntry.apiCall.authentication.userProfile.permissions, ["read", "write", "admin"]);
            assert.strictEqual(parsed.logEntry.apiCall.authentication.userProfile.isActive, true);
            assert.strictEqual(parsed.logEntry.apiCall.authentication.userProfile.lastLogin, "2025-09-11T22:00:00Z");
            
            // Verify the JSON is properly formatted (indented)
            assert.ok(result.includes('  '), 'Result should be properly indented');
            assert.ok(result.includes('\n'), 'Result should have line breaks');
            
            // Verify the entire chain is accessible through the parsed object
            const deepestValue = parsed.logEntry.apiCall.authentication.userProfile.userId;
            assert.strictEqual(deepestValue, 12345, 'Should be able to access the deepest nested value');
            
            // Ensure the result is still valid JSON
            assert.doesNotThrow(() => JSON.parse(result), 'Formatted result should be valid JSON');
            
            // Test edge case: verify arrays are preserved correctly at the deepest level
            const deepestArray = parsed.logEntry.apiCall.authentication.userProfile.permissions;
            assert.ok(Array.isArray(deepestArray), 'Permissions should remain an array');
            assert.strictEqual(deepestArray.length, 3, 'Array should have correct length');
            assert.ok(deepestArray.includes('admin'), 'Array should contain admin permission');
        });
});