const assert = require('assert');
const { formatJsonContent } = require('../../src/core/format-all-jsons');

suite('parseStringProperties Tests', () => {

    suite('String Type Preservation', () => {
        test('should preserve numeric strings', () => {
            const input = '{"document": "1234567890123"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(typeof parsed.document, 'string');
            assert.strictEqual(parsed.document, '1234567890123');
        });

        test('should preserve boolean strings', () => {
            const input = '{"has_identity": "true"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(typeof parsed.has_identity, 'string');
            assert.strictEqual(parsed.has_identity, 'true');
        });

        test('should preserve false as string', () => {
            const input = '{"is_active": "false"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(typeof parsed.is_active, 'string');
            assert.strictEqual(parsed.is_active, 'false');
        });

        test('should preserve null as string', () => {
            const input = '{"value": "null"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(typeof parsed.value, 'string');
            assert.strictEqual(parsed.value, 'null');
        });

        test('should preserve regular strings', () => {
            const input = '{"name": "John", "email": "john@example.com"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(parsed.name, 'John');
            assert.strictEqual(parsed.email, 'john@example.com');
        });
    });

    suite('JSON Object String Parsing', () => {
        test('should convert JSON object strings to objects', () => {
            const input = '{"person": "{\\"name\\":\\"Flavio\\"}"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(typeof parsed.person, 'object');
            assert.strictEqual(parsed.person.name, 'Flavio');
        });

        test('should handle nested JSON objects', () => {
            const input = '{"data": "{\\"user\\":{\\"name\\":\\"Alice\\",\\"age\\":30}}"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(typeof parsed.data, 'object');
            assert.strictEqual(parsed.data.user.name, 'Alice');
            assert.strictEqual(parsed.data.user.age, 30);
        });

        test('should convert JSON array strings to arrays', () => {
            const input = '{"items": "[1,2,3]"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert(Array.isArray(parsed.items));
            assert.deepStrictEqual(parsed.items, [1, 2, 3]);
        });

        test('should convert arrays of objects', () => {
            const input = '{"people": "[{\\"name\\":\\"John\\"},{\\"name\\":\\"Jane\\"}]"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert(Array.isArray(parsed.people));
            assert.strictEqual(parsed.people.length, 2);
            assert.strictEqual(parsed.people[0].name, 'John');
            assert.strictEqual(parsed.people[1].name, 'Jane');
        });
    });

    suite('Complex Mixed Scenarios', () => {
        test('should handle the main bug example', () => {
            const input = '{"document": "1234567890123", "has_identity": "true", "person": "{\\"name\\":\\"Flavio\\"}"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            // Strings should remain strings
            assert.strictEqual(parsed.document, '1234567890123');
            assert.strictEqual(typeof parsed.document, 'string');
            
            assert.strictEqual(parsed.has_identity, 'true');
            assert.strictEqual(typeof parsed.has_identity, 'string');
            
            // Only JSON object should be converted
            assert.strictEqual(typeof parsed.person, 'object');
            assert.strictEqual(parsed.person.name, 'Flavio');
        });

        test('should handle mixed types at same level', () => {
            const input = '{"id": "12345", "active": "false", "data": "{\\"key\\":\\"value\\"}", "normal": "text"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(parsed.id, '12345');
            assert.strictEqual(parsed.active, 'false');
            assert.strictEqual(typeof parsed.data, 'object');
            assert.strictEqual(parsed.data.key, 'value');
            assert.strictEqual(parsed.normal, 'text');
        });

        test('should handle empty JSON strings', () => {
            const input = '{"empty_obj": "{}",  "empty_arr": "[]"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.deepStrictEqual(parsed.empty_obj, {});
            assert.deepStrictEqual(parsed.empty_arr, []);
        });

        test('should handle multiple levels of nested JSON strings', () => {
            const input = '{"level1": "{\\"level2\\":\\"{\\\\\\"level3\\\\\\":\\\\\\"value\\\\\\"}\\"}"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(typeof parsed.level1, 'object');
            assert.strictEqual(typeof parsed.level1.level2, 'object');
            assert.strictEqual(parsed.level1.level2.level3, 'value');
        });
    });

    suite('Edge Cases', () => {
        test('should handle strings that start with { but are not valid JSON', () => {
            const input = '{"text": "{not valid json}"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            // Should remain as string since it's not valid JSON
            assert.strictEqual(parsed.text, '{not valid json}');
        });

        test('should handle strings that start with [ but are not valid JSON', () => {
            const input = '{"text": "[not valid json]"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            // Should remain as string since it's not valid JSON
            assert.strictEqual(parsed.text, '[not valid json]');
        });

        test('should handle strings with special characters', () => {
            const input = '{"text": "Hello @#$%"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(parsed.text, 'Hello @#$%');
        });

        test('should preserve numeric strings with leading zeros', () => {
            const input = '{"zip": "01234"}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(parsed.zip, '01234');
            assert.strictEqual(typeof parsed.zip, 'string');
        });

        test('should handle arrays containing strings and objects', () => {
            const input = '{"items": ["string", "{\\"id\\":1}"]}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert(Array.isArray(parsed.items));
            assert.strictEqual(parsed.items[0], 'string');
            // Second item might be string or object depending on implementation
            assert(parsed.items[1]);
        });
    });

    suite('Type Correctness', () => {
        test('should not convert actual numbers to strings', () => {
            const input = '{"count": 42}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(parsed.count, 42);
            assert.strictEqual(typeof parsed.count, 'number');
        });

        test('should not convert actual booleans to strings', () => {
            const input = '{"active": true, "deleted": false}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(parsed.active, true);
            assert.strictEqual(parsed.deleted, false);
            assert.strictEqual(typeof parsed.active, 'boolean');
            assert.strictEqual(typeof parsed.deleted, 'boolean');
        });

        test('should not convert null to string', () => {
            const input = '{"value": null}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(parsed.value, null);
        });

        test('should preserve actual objects', () => {
            const input = '{"user": {"name": "Bob", "age": 25}}';
            const result = formatJsonContent(input);
            const parsed = JSON.parse(result);
            
            assert.strictEqual(typeof parsed.user, 'object');
            assert.strictEqual(parsed.user.name, 'Bob');
            assert.strictEqual(parsed.user.age, 25);
        });
    });
});
