"""Bounded calls to this computer's Ollama; no keys, redirects, retries or cloud."""
from __future__ import annotations

import http.client
import json
import re
import socket

from config import CONFIG, MODELS

BASE_URL = CONFIG.ollama_base_url
DEFAULT_MODEL = CONFIG.ollama_default_model
GENERATION_TIMEOUT = 180
MAX_RESPONSE_BYTES = 512 * 1024


class OllamaError(RuntimeError):
    def __init__(self, message, code='ollama_unavailable'):
        super().__init__(message)
        self.code = code


def validate_model(model):
    if not isinstance(model, str) or model not in MODELS:
        raise ValueError('请选择 deepseek-r1:1.5b 或 deepseek-r1:7b 本地模型。')
    return model


def _request(path, payload=None, timeout=5):
    # Config accepts only these two loopback hosts; no proxies or redirects are used.
    host = '127.0.0.1' if BASE_URL.startswith('http://127.0.0.1:') else 'localhost'
    connection = http.client.HTTPConnection(host, 11434, timeout=timeout)
    try:
        encoded = json.dumps(payload, ensure_ascii=False).encode('utf-8') if payload is not None else None
        connection.request('POST' if encoded is not None else 'GET', '/v1/' + path, body=encoded,
                           headers={'Accept': 'application/json', 'Content-Type': 'application/json'})
        response = connection.getresponse()
        raw = response.read(MAX_RESPONSE_BYTES + 1)
        if len(raw) > MAX_RESPONSE_BYTES:
            raise OllamaError('本地 Ollama 返回内容过长，已停止读取。', 'ollama_invalid_response')
        try:
            result = json.loads(raw.decode('utf-8'))
        except (ValueError, UnicodeError) as error:
            raise OllamaError(f'本地 Ollama 返回 HTTP {response.status}，内容不是有效 JSON。', 'ollama_invalid_response') from error
        if response.status != 200:
            detail = result.get('error', '') if isinstance(result, dict) else ''
            if isinstance(detail, dict):
                detail = detail.get('message', '')
            detail = re.sub(r'\s+', ' ', detail).strip()[:200] if isinstance(detail, str) else ''
            raise OllamaError(f'本地 Ollama 返回 HTTP {response.status}' + ('：' + detail if detail else '。'), 'ollama_http_error')
        if not isinstance(result, dict):
            raise OllamaError('本地 Ollama 返回的数据格式不正确。', 'ollama_invalid_response')
        return result
    except (TimeoutError, socket.timeout) as error:
        raise OllamaError(f'本地 Ollama 在 {timeout} 秒内未完成响应；模型首次加载可能较慢。', 'ollama_timeout') from error
    except (OSError, http.client.HTTPException) as error:
        raise OllamaError('无法连接本机 Ollama（localhost:11434）；请确认 Ollama 正在运行。') from error
    finally:
        connection.close()


def list_models():
    result = {'models': [{'id': model, 'installed': False} for model in MODELS],
              'available': False, 'baseUrl': BASE_URL, 'defaultModel': DEFAULT_MODEL}
    try:
        data = _request('models').get('data')
        if not isinstance(data, list) or any(not isinstance(item, dict) or not isinstance(item.get('id'), str) for item in data):
            raise OllamaError('本地 Ollama 模型列表格式不正确。', 'ollama_invalid_response')
        installed = {item['id'] for item in data}
        result['models'] = [{'id': model, 'installed': model in installed} for model in MODELS]
        result['available'] = True
    except OllamaError as error:
        result['error'] = str(error)
    return result


def chat(model, messages, max_tokens=2500, json_object=False, schema=None):
    validate_model(model)
    payload = {'model': model, 'messages': messages, 'stream': False,
               'temperature': 0, 'max_tokens': max_tokens}
    if schema is not None:
        payload['response_format'] = {'type': 'json_schema', 'json_schema': {'name': 'mentor_profile', 'schema': schema, 'strict': True}}
    elif json_object:
        payload['response_format'] = {'type': 'json_object'}
    result = _request('chat/completions', payload, timeout=GENERATION_TIMEOUT)
    choices = result.get('choices')
    if not isinstance(choices, list) or not choices or not isinstance(choices[0], dict):
        raise OllamaError('本地 Ollama 没有返回有效生成结果。', 'ollama_invalid_response')
    message = choices[0].get('message')
    if not isinstance(message, dict) or not isinstance(message.get('content', ''), (str, type(None))):
        raise OllamaError('本地 Ollama 返回的消息格式不正确。', 'ollama_invalid_response')
    content = message.get('content') or ''
    reasoning = message.get('reasoning_content') or message.get('reasoning') or ''
    if not content.strip() and not (isinstance(reasoning, str) and reasoning.strip()):
        raise OllamaError('本地 Ollama 返回了空消息。', 'ollama_invalid_response')
    return content, bool(isinstance(reasoning, str) and reasoning.strip())


def test_model(model):
    validate_model(model)
    # R1 may spend this short budget thinking; any nonempty generated response proves connectivity.
    chat(model, [{'role': 'user', 'content': 'Reply with exactly OK. Do not explain.'}], max_tokens=128)
    return {'ok': True, 'model': model, 'message': '本地模型已响应，生成测试成功。'}


def parse_json_object(content):
    """Strip R1 thinking and a single Markdown fence before parsing the evidence object."""
    if not isinstance(content, str):
        raise OllamaError('本地模型没有返回 JSON 文本。', 'ollama_invalid_response')
    content = re.sub(r'<think\b[^>]*>.*?</think\s*>', '', content, flags=re.S | re.I).strip()
    if re.search(r'</?think\b', content, re.I):
        raise OllamaError('本地模型的思考内容尚未结束，未得到完整识别 JSON。', 'ollama_invalid_response')
    fenced = re.fullmatch(r'```(?:json)?\s*([\s\S]*?)\s*```', content, re.I)
    if fenced:
        content = fenced.group(1)
    try:
        result = json.loads(content)
    except ValueError as error:
        raise OllamaError('本地模型未返回完整有效的识别 JSON；请核对网页直接提取结果。', 'ollama_invalid_response') from error
    if not isinstance(result, dict):
        raise OllamaError('本地模型识别结果必须是 JSON 对象。', 'ollama_invalid_response')
    return result
