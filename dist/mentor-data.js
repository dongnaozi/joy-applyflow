import {mentors as initialMentors, rankings as initialRankings} from './data.js';
import {mentors as globalMentors, rankings as globalRankings} from './global-mentors.js';
import {mentors as orrMentors, mentorPatches} from './orr-mentors.js';

const tagged=(m,area)=>({...m,researchAreas:[area],papers:(m.papers||[]).map(p=>({...p,researchAreas:[area]})),relations:(m.relations||[]).map(r=>({...r,researchAreas:r.type==='合作'?[area]:[]}))});
export const seedMentors=[...initialMentors,...globalMentors].map(m=>tagged(m,'co2rr'));
seedMentors.push(...orrMentors.map(m=>tagged(m,'orr')));
for(const patch of mentorPatches){
  const mentor=seedMentors.find(m=>m.id===patch.id);if(!mentor)continue;
  mentor.researchAreas.push('orr');
  mentor.researchSummaries={orr:'研究燃料电池的氧还原电催化，关注铁–氮–碳催化剂中次级金属掺杂对结构和反应活性的影响。'};
  for(const key of ['topics','keywords'])mentor[key]=[...new Set([...mentor[key],...patch[key]||[]])];
  mentor.papers.push(...(patch.papers||[]).map(p=>({...p,researchAreas:['orr']})));
  mentor.relations.push(...(patch.relations||[]).map(r=>({...r,researchAreas:['orr']})));
}
// These verified coauthorships also belong in the related-mentor paper filter.
const jaouen=seedMentors.find(m=>m.id==='jaouen');
for(const id of ['strasser','wu-gang']){
  const source=seedMentors.find(m=>m.id===id);
  const paper=source.papers.find(p=>/jacs\.(3c03033|5c15451)/.test(p.url));
  if(paper)jaouen.papers.push({...paper,role:'合作作者；通讯身份待核实',roleSource:''});
}
export const rankings=[...initialRankings,...globalRankings];
