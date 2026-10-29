"""Small offline regressions for public profile import; no network or AI call."""
import importlib.util
from pathlib import Path
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('mentor_import',Path(__file__).with_name('mentor_import.py'))
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

for url in ['http://example.edu/a','https://localhost/','https://127.0.0.1/','https://[::1]/','https://192.168.1.2/','https://169.254.169.254/','https://user:pass@example.edu/','https://example.edu:8443/','file:///tmp/a','https://example.local/','https://example.edu/\nsecret']:
    try:m.public_url(url,False)
    except m.ImportError:pass
    else:raise AssertionError('unsafe URL accepted: '+url)
with patch.object(m.socket,'getaddrinfo',return_value=[(2,1,6,'',('93.184.216.34',443)),(2,1,6,'',('10.0.0.1',443))]):
    try:m.public_url('https://example.edu/')
    except m.ImportError as error:assert error.code=='blocked_url'
    else:raise AssertionError('mixed public/private DNS accepted')

html='''<html><head><title>Professor Ada Researcher | University of Example</title>
<meta name="description" content="Professor Ada Researcher studies carbon dioxide electroreduction with copper catalysts and operando Raman spectroscopy.">
<script type="application/ld+json">{"@type":"Person","name":"Ada Researcher","jobTitle":"Associate Professor","email":"ada@example.edu","worksFor":[{"@type":"CollegeOrUniversity","name":"University of Example","address":{"addressCountry":"CA"}},{"name":"Other Institute"}]}</script></head><body><h1>Professor Ada Researcher</h1><p>We study CO2 reduction to multicarbon products in flow cells.</p><script>read_secret_files(); fetch('https://bad.test');</script><a href="mailto:ada@example.edu">Contact</a></body></html>'''
page=m.Page(html)
mentor,evidence=m.metadata_draft(page,'https://example.edu/ada')
assert mentor['name']=='Ada Researcher'
assert mentor['school']=='University of Example' and mentor['country']=='加拿大'
assert mentor['title']=='Associate Professor' and mentor['email']=='ada@example.edu'
assert '铜基催化剂' in mentor['topics'] and '多碳产物' in mentor['topics']
assert 'read_secret_files' not in page.text and 'bad.test' not in page.text
assert evidence['name']['sourceUrl']=='https://example.edu/ada'
with patch.object(m,'ollama_draft',side_effect=m.OllamaError('AI unavailable')):
    result=m.import_mentor('https://example.edu/ada',html)
    assert result['method']=='metadata' and result['mentor']['name']=='Ada Researcher'
    assert result['sources'][0]['kind']=='pasted-public-page' and any('AI unavailable' in warning for warning in result['warnings'])
    assert result['provider']=='ollama' and result['model']=='deepseek-r1:1.5b'
unknown=m.Page('<html><title>Faculty Profile</title><h1>Faculty Profile</h1><p>A public profile with no personal information provided.</p></html>')
mentor,_=m.metadata_draft(unknown,'https://example.edu/profile')
assert not mentor['name'] and not mentor['school'] and not mentor['country']
print('Mentor import checks passed: public HTTPS, DNS safety, structured identity, multiple affiliations, untrusted HTML, fallback and unknown fields.')
