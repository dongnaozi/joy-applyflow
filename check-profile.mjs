import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Import as a data URL so this buildless project needs no package.json module setting.
const code = await readFile(new URL('./dist/profile.js', import.meta.url), 'utf8');
const { analyzeProfile, matchMentor, extractResume } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const profile = analyzeProfile('CO2RR copper C2+ with operando Raman and density functional theory DFT');
assert.equal(profile.topics.length, 4);
assert.deepEqual(profile.skills, ['理论计算']);
const match = matchMentor(profile, { topics: ['铜基催化与多碳产物', '理论计算与 DFT'], keywords: ['CO2 reduction', 'copper', 'DFT'] });
assert.equal(match.score, 75);
assert.equal(match.matches.length, 3);
assert.equal(matchMentor(analyzeProfile(''), {}).score, null);
assert.equal(analyzeProfile('my corrugation work and MEAN value').topics.length, 0);
assert.equal(analyzeProfile('CO₂RR 和原位拉曼，铜基催化多碳产物').topics.length, 3);
assert.equal(matchMentor(analyzeProfile('CO2RR'), { name: 'Jan Rossmeisl', topics: ['CO₂ 还原'], summary: 'CO₂ 还原', keywords: ['CO2', 'CO₂'] }).score, 100);
await assert.rejects(extractResume({ name: 'large.pdf', size: 11 * 1024 * 1024, arrayBuffer() {} }), /10 MB/);
await assert.rejects(extractResume({ name: 'resume.doc', size: 20, arrayBuffer() {} }), /DOCX/);
await assert.rejects(extractResume({ name: 'resume.txt', size: 5, arrayBuffer() {}, async text() { return 'short'; } }), /足够文字/);
const extracted = await extractResume({ name: 'resume.txt', size: 80, arrayBuffer() {}, async text() { return 'CO2RR  copper\t C2+\n\n\nResearch and publications'; } });
assert.ok(extracted.text.includes('CO2RR copper C2+'));
console.log('profile checks passed: bilingual topics, acronym boundaries, coverage, empty profile, file validation, text extraction');
