import assert from 'node:assert/strict';
import {mentors,rankings} from './dist/qs100-global.js';
import {top100School} from './dist/qs100.js';
import {mentors as initial} from './dist/data.js';
import {mentors as global} from './dist/global-mentors.js';
import {mentors as orr} from './dist/orr-mentors.js';

const existing=new Set([...initial,...global,...orr].map(m=>m.id));
assert.equal(new Set(mentors.map(m=>m.id)).size,mentors.length);
assert.equal(new Set(mentors.map(m=>m.name.toLowerCase())).size,mentors.length);
for(const m of mentors){
  assert(!existing.has(m.id),'New cohort must not duplicate existing IDs');
  assert.equal(top100School(m.school)?.school,m.school);
  assert.equal(m.qs.year,2026);
  assert(Number(m.qs.rank.replace('=',''))<=100);
  assert(m.url.startsWith('https://')&&m.researchSource.startsWith('https://'));
  assert(m.researchAreas.length&&m.researchAreas.every(x=>['co2rr','orr'].includes(x)));
  assert(m.topics.length&&m.keywords.length);
  assert.equal(m.team.chineseStudents,null);
  assert.equal(m.team.chineseFaculty,null);
  assert(!m.email||m.emailSource,'Public email requires a source');
}
assert.equal(mentors.find(m=>m.id==='jiang-kun').school,'Fudan University','Current affiliation, not the former SJTU position');
assert(mentors.find(m=>m.id==='rufford').recruitment.includes('Not available for supervision'));
assert(rankings.every(r=>r.year===2026));
console.log(`QS100 global cohort passed: ${mentors.length} sourced faculty at ${rankings.length} universities, correct year, unique IDs, unknown demographics and current-affiliation corrections.`);
