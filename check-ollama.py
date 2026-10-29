"""Offline regression checks: python check-ollama.py (no Ollama or cloud calls)."""
import json
import unittest
from io import BytesIO
from types import SimpleNamespace
from unittest.mock import Mock, patch

import mentor_import as importer
import ollama_client as ollama
import server


def response(value, status=200):
    reply = Mock(status=status)
    reply.read.return_value = json.dumps(value).encode('utf-8')
    return reply


class OllamaChecks(unittest.TestCase):
    def test_fixed_local_payload_and_allowlist(self):
        connection = Mock()
        connection.getresponse.return_value = response({'choices': [{'message': {'content': '<think>Working</think>OK'}}]})
        with patch.object(ollama.http.client, 'HTTPConnection', return_value=connection) as connect:
            result = ollama.test_model('deepseek-r1:7b')
            self.assertTrue(result['ok'])
            connect.assert_called_once_with('localhost', 11434, timeout=180)
            args, kwargs = connection.request.call_args
            self.assertEqual(args, ('POST', '/v1/chat/completions'))
            payload = json.loads(kwargs['body'])
            self.assertEqual(payload['model'], 'deepseek-r1:7b')
            self.assertEqual(payload['max_tokens'], 128)
            self.assertFalse(payload['stream'])
            self.assertNotIn('Authorization', kwargs['headers'])
        with patch.object(ollama, '_request') as upstream:
            for model in ['cloud-model', '', None, ['deepseek-r1:7b']]:
                with self.assertRaises(ValueError):
                    ollama.test_model(model)
            upstream.assert_not_called()
        with patch.object(ollama, '_request', return_value={'choices': [{'message': {'content': '{}'}}]}) as upstream:
            ollama.chat(ollama.DEFAULT_MODEL, [], schema=importer._SCHEMA)
            self.assertEqual(upstream.call_args.args[1]['response_format']['json_schema']['schema'], importer._SCHEMA)
        with patch.object(ollama, '_request', return_value={'data': [{'id': 'deepseek-r1:7b'}, {'id': 'other'}]}):
            found = ollama.list_models()
            self.assertTrue(found['available'])
            self.assertEqual(found['models'], [{'id': 'deepseek-r1:1.5b', 'installed': False}, {'id': 'deepseek-r1:7b', 'installed': True}])

    def test_malformed_results_and_provider_failure(self):
        self.assertEqual(ollama.parse_json_object('<think>not user-visible</think>\n```json\n{"name":"Ada"}\n```'), {'name': 'Ada'})
        for content in ['[]', 'broken', '<think>unfinished', '```json\n{"name":', None]:
            with self.assertRaises(ollama.OllamaError):
                ollama.parse_json_object(content)
        for bad in [{'choices': []}, {'choices': [{'message': {'content': {}}}]}, {'choices': [{'message': {}}]}]:
            with patch.object(ollama, '_request', return_value=bad):
                with self.assertRaises(ollama.OllamaError):
                    ollama.test_model(ollama.DEFAULT_MODEL)
        with patch.object(ollama, '_request', return_value={'data': {}}):
            self.assertFalse(ollama.list_models()['available'])
        connection = Mock()
        connection.getresponse.return_value = response({'error': 'model is not installed'}, 404)
        with patch.object(ollama.http.client, 'HTTPConnection', return_value=connection):
            with self.assertRaisesRegex(ollama.OllamaError, 'HTTP 404.*model is not installed'):
                ollama.test_model(ollama.DEFAULT_MODEL)
        source = '<h1>Ada Researcher</h1><p>Ada Researcher studies carbon dioxide electroreduction with copper catalysts.</p>'
        with patch.object(importer, 'chat', side_effect=ollama.OllamaError('connection refused')) as generate:
            draft = importer.import_mentor('https://example.edu/ada', source, 'deepseek-r1:7b')
            self.assertEqual(draft['method'], 'metadata')
            self.assertEqual(draft['model'], 'deepseek-r1:7b')
            self.assertTrue(any('未调用云端模型' in warning for warning in draft['warnings']))
            self.assertEqual(generate.call_count, 1)
            self.assertEqual(generate.call_args.args[0], 'deepseek-r1:7b')
            self.assertTrue(generate.call_args.kwargs['json_object'])
        extracted = {field: '' for field in ('name', 'school', 'schoolShort', 'country', 'title', 'email', 'summary')}
        extracted.update(topics=[], evidence={field: '' for field in ('name', 'school', 'country', 'title', 'email', 'topics', 'summary')})
        extracted['summary'] = 'unsupported claim'
        extracted['evidence']['summary'] = 'invented quote'
        with patch.object(importer, 'chat', return_value=(json.dumps(extracted), False)):
            draft = importer.import_mentor('https://example.edu/ada', source)
            self.assertEqual(draft['method'], 'ollama')
            self.assertNotEqual(draft['mentor']['summary'], 'unsupported claim')
        extracted['country'] = None
        extracted['topics'] = None
        extracted['evidence']['country'] = None
        with patch.object(importer, 'chat', return_value=(json.dumps(extracted), False)):
            self.assertEqual(importer.import_mentor('https://example.edu/ada', source)['method'], 'ollama')
        extracted['evidence'] = []
        with patch.object(importer, 'chat', return_value=(json.dumps(extracted), False)):
            self.assertEqual(importer.import_mentor('https://example.edu/ada', source)['method'], 'metadata')

    def test_local_http_routes(self):
        handler = object.__new__(server.Handler)
        handler.server = SimpleNamespace(server_port=8792)
        handler.send_json = Mock()
        handler.path = '/api/models'
        with patch.object(ollama, '_request', return_value={'data': [{'id': model} for model in ollama.MODELS]}):
            handler.do_GET()
            self.assertTrue(handler.send_json.call_args.args[0]['available'])
        handler.path = '/api/models/test'
        with patch.object(ollama, 'test_model', side_effect=ollama.OllamaError('local provider failed')) as test:
            for model, status in [('unapproved-model', 400), (ollama.DEFAULT_MODEL, 503)]:
                body = json.dumps({'model': model}).encode('utf-8')
                handler.headers = {'Content-Type': 'application/json', 'Content-Length': str(len(body)), 'Host': '127.0.0.1:8792'}
                handler.rfile = BytesIO(body)
                handler.do_POST()
                value, code = handler.send_json.call_args.args
                self.assertEqual(code, status)
                self.assertIn('error', value)
            test.assert_called_once_with(ollama.DEFAULT_MODEL)


if __name__ == '__main__':
    unittest.main()
