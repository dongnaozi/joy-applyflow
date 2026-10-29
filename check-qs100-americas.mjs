import assert from 'node:assert/strict';
import {mentors,rankings} from './dist/qs100-americas.js';
import {mentors as initial} from './dist/data.js';
import {mentors as global} from './dist/global-mentors.js';
import {mentors as orr} from './dist/orr-mentors.js';
import {top100School} from './dist/qs100.js';
import {researchView,defaultResearch} from './dist/research.js';

const prior=[...initial,...global,...orr];
assert.equal(new Set([...prior,...mentors].map(m=>m.id)).size,prior.length+mentors.length);
assert.equal(new Set([...prior,...mentors].map(m=>m.name.toLowerCase())).size,prior.length+mentors.length);
for(const mentor of mentors){
  assert(top100School(mentor.school),'every new supervisor belongs to the QS 2026 top-100 universe');
  assert(Number(mentor.qs.rank.replace(/=/g,''))<=100);
  assert(['美国','加拿大'].includes(mentor.country));
  for(const field of ['url','researchSource','publicationsUrl'])assert(new URL(mentor[field]).protocol==='https:');
  assert(mentor.summary&&mentor.title&&mentor.verifiedAt==='2026-10-29');
  assert.equal(mentor.team.chineseStudents,null);
  assert.equal(mentor.team.chineseFaculty,null);
  if(mentor.email)assert(mentor.emailSource.startsWith('https://'));
  assert(Array.isArray(mentor.papers)&&Array.isArray(mentor.relations));
}
assert.equal(rankings.length,new Set(mentors.map(m=>m.school)).size);
const co2=researchView(mentors,defaultResearch()).mentors;
const oxygen=researchView(mentors,{name:'氧还原',shortName:'ORR',keywords:['ORR'],excludedKeywords:[]}).mentors;
assert(co2.some(m=>m.id==='yu-sunmoon')&&co2.some(m=>m.id==='resasco'));
assert(oxygen.some(m=>m.id==='gyenge')&&oxygen.some(m=>m.id==='henkelman'));
assert(!oxygen.some(m=>m.id==='bocarsly'),'CO2-only faculty must not leak into the ORR view');
assert(!co2.some(m=>m.id==='henkelman'),'ORR-only faculty must not leak into the CO2 view');
console.log(`QS Americas checks passed: ${mentors.length} sourced faculty, ${rankings.length} schools, ${co2.length} CO2RR and ${oxygen.length} ORR matches.`);
