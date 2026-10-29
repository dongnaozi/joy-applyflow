export function defaultResearch(){return {name:'CO₂ 电还原',shortName:'CO₂RR',keywords:[],excludedKeywords:[]};}

export function normalizeResearchText(value){
  return String(value??'').normalize('NFKC').toLowerCase().replace(/\bco\s*2\s*rr\b/g,'co2rr').replace(/\bco\s*2\b/g,'co2').replace(/\s+/g,' ').trim();
}
function terms(value){
  const input=Array.isArray(value)?value:typeof value==='string'?value.split(/[,，;；、\n\r]+/):[];
  const seen=new Set(),out=[];
  for(const item of input){
    if(typeof item!=='string')continue;
    const word=item.trim();if(!word)continue;
    if(word.length>80)throw Error('每个关键词最多 80 个字符。');
    const key=normalizeResearchText(word);if(seen.has(key))continue;seen.add(key);out.push(word);
  }
  if(out.length>20)throw Error('领域关键词和排除词分别最多 20 项。');
  return out;
}
export function normalizeResearch(raw){
  const defaults=defaultResearch();
  if(raw==null)return defaults;
  if(typeof raw!=='object'||Array.isArray(raw))throw Error('研究方向设置格式不正确。');
  const name=typeof raw.name==='string'?raw.name.trim():defaults.name;
  if(!name||name.length>80)throw Error('研究方向名称需为 1–80 个字符。');
  const isDefault=/^(?:co2(?:rr|电还原)|二氧化碳电还原)$/.test(normalizeResearchText(name).replace(/\s/g,''));
  const shortName=typeof raw.shortName==='string'?raw.shortName.trim():isDefault?defaults.shortName:'';
  if(shortName.length>20)throw Error('简称最多 20 个字符。');
  const keywords=terms(raw.keywords),excludedKeywords=terms(raw.excludedKeywords);
  if(!isDefault&&!keywords.length)throw Error('更换研究领域时，请至少填写一个领域关键词。');
  return {name,shortName,keywords,excludedKeywords};
}
function includesTerm(text,value){
  const term=normalizeResearchText(value);
  if(!term)return false;
  if(/^[a-z][a-z0-9+-]{0,5}$/.test(term))return new RegExp('(^|[^a-z0-9])'+term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=$|[^a-z0-9])').test(text);
  return text.includes(term);
}
export function matchesResearch(text,research){
  const value=normalizeResearchText(text);
  const included=research?.keywords||[],excluded=research?.excludedKeywords||[];
  // ponytail: literal keyword matching; add semantic search only when synonyms exceed saved keyword lists.
  return (!included.length||included.some(term=>includesTerm(value,term)))&&!excluded.some(term=>includesTerm(value,term));
}
export function researchQuery(research){
  const params=new URLSearchParams();
  for(const term of research.keywords||[])params.append('kw',term);
  for(const term of research.excludedKeywords||[])params.append('exclude',term);
  return params.toString();
}

const areaTerms={co2rr:['CO2RR','CO2','carbon dioxide','二氧化碳'],orr:['ORR','oxygen reduction','oxygen electroreduction','氧还原']};
const rawRecordText=record=>[record.title,record.name,record.summary,...record.topics||[],...record.keywords||[]].filter(Boolean).join(' ');
function recordText(record){
  const text=rawRecordText(record);
  // Only expand synonyms grounded in this record, never from a mentor's other papers.
  const areas=new Set(record.researchAreas||[]);
  for(const [area,words] of Object.entries(areaTerms))if(matchesResearch(text,{keywords:words}))areas.add(area);
  return [text,...[...areas].flatMap(area=>areaTerms[area]||[])].join(' ');
}
const matchesRecord=(record,criteria)=>matchesResearch(recordText(record),{keywords:criteria.keywords})&&matchesResearch(rawRecordText(record),{excludedKeywords:criteria.excludedKeywords});
export function researchView(allMentors,research){
  const criteria=research.keywords.length?research:{...research,keywords:areaTerms.co2rr};
  const map=new Map(),visible=[];
  for(const mentor of allMentors){
    const matchingPapers=(mentor.papers||[]).filter(p=>matchesRecord(p,criteria));
    if(!matchesRecord(mentor,criteria)&&!matchingPapers.length)continue;
    const relations=(mentor.relations||[]).filter(r=>(r.type!=='合作'&&!r.researchAreas?.length)||matchesRecord({...r,summary:r.evidence},criteria));
    const areas=(mentor.researchAreas||[]).filter(area=>matchesResearch((areaTerms[area]||[]).join(' '),{keywords:criteria.keywords}));
    const summary=areas.length===1?mentor.researchSummaries?.[areas[0]]||mentor.summary:mentor.summary;
    const topics=[...(mentor.topics||[])].sort((a,b)=>Number(matchesRecord({title:b},criteria))-Number(matchesRecord({title:a},criteria)));
    const item={...mentor,summary,topics,papers:matchingPapers,relations};visible.push(item);
    for(const paper of matchingPapers){
      const key=paper.url||paper.title,entry=map.get(key);
      if(entry){if(!entry.mentors.some(m=>m.id===item.id))entry.mentors.push(item);}
      else map.set(key,{...paper,key,mentors:[item]});
    }
  }
  return {mentors:visible,papers:[...map.values()].sort((a,b)=>b.year-a.year)};
}
export function filterMentorPapers(papers,{query='',journal='',year='',mentor='',savedOnly=false,saved=[]}={}){
  return papers.filter(p=>(!query||[p.title,p.journal,...p.mentors.map(m=>m.name)].join(' ').normalize('NFKC').toLowerCase().includes(query.normalize('NFKC').toLowerCase()))&&(!journal||p.journal===journal)&&(!year||String(p.year)===String(year))&&(!mentor||p.mentors.some(m=>m.id===mentor))&&(!savedOnly||saved.includes(p.key)));
}
