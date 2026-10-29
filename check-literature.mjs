import assert from 'node:assert/strict';
import { JOURNALS, filterLiterature, paperRelations, createLiterature } from './dist/literature.js';

const now = new Date('2026-10-28T12:00:00Z');
const make = (id, journal, date, extra={}) => ({
  id, journal, date, title:`Paper ${id}`, url:`https://doi.org/10.1234/${id}`,
  authors:[], abstract:'', correspondingAuthors:[], topics:[], ...extra
});
const a=make('a','Nature Catalysis','2026-10-27',{
  title:'Operando CO2 electroreduction at copper interfaces',authors:['Alex First','Alice Corresponding','Dan Last'],
  abstract:'A flow-cell experiment measures ethylene selectivity.',summaryZh:'原位测量多碳产物选择性。',topics:['铜基催化'],
  correspondingAuthors:[
    {name:'Alice Corresponding',affiliations:['Institute A','Laboratory X'],verified:true,sourceUrl:'https://example.org/paper-a'},
    {name:'Dan Last',affiliations:['Unverified University'],verified:false}
  ]
});
const b=make('b','Journal of the American Chemical Society','2026-10-20',{
  title:'Molecular catalyst for CO2 electroreduction',authors:['Bob Second'],topics:['分子与单原子'],
  correspondingAuthors:[{name:'Bob Corresponding',affiliations:[],verified:true}]
});
const c=make('c','Science','2026-10-28',{authors:['Mystery Last']});
const d=make('d','Nature Energy','2026-06-01',{
  correspondingAuthors:[{name:'Dee Corresponding',affiliations:['Institute D'],verified:true}]
});
const forbidden=make('x','Applied Catalysis B','2026-10-28');
const papers=[a,b,c,d,forbidden];
const ids=(f={},saved=[],input=papers)=>filterLiterature(input,f,saved,now).map(p=>p.id);

assert.equal(JOURNALS.length,12);
assert.deepEqual(ids(),['c','a','b','d'],'allowlist and newest ordering');
assert.deepEqual(ids({sort:'oldest'}),['d','b','a','c']);
assert.deepEqual(ids({sort:'journal'}),['b','a','d','c']);
assert.deepEqual(ids({field:'title',query:' OPERANDO '}),['a']);
assert.deepEqual(ids({field:'author',query:'alex first'}),['a'],'ordinary authors searchable');
assert.deepEqual(ids({field:'author',query:'bob corresponding'}),['b'],'verified corresponding name searchable');
assert.deepEqual(ids({field:'abstract',query:'flow-cell'}),['a']);
assert.deepEqual(ids({field:'abstract',query:'原位'}),['a'],'Chinese summary searchable');
assert.deepEqual(ids({field:'institution',query:'INSTITUTE A'}),['a']);
assert.deepEqual(ids({field:'institution',query:'Unverified University'}),[],'unverified affiliation must not enter search');
assert.deepEqual(ids({field:'title',query:'flow-cell'}),[],'field filters stay separate');
assert.deepEqual(ids({query:'Laboratory X'}),['a'],'all-field search includes verified units');
assert.deepEqual(ids({journal:'Science'}),['c']);
assert.deepEqual(ids({topic:'铜基催化'}),['a']);
assert.deepEqual(ids({evidence:'verified'}),['a','d'],'verified evidence requires an affiliation');
assert.deepEqual(ids({evidence:'pending'}),['c','b']);
assert.deepEqual(ids({onlySaved:true},['b','x']),['b'],'saved filter still enforces journal allowlist');
assert.deepEqual(ids({days:'7'}),['c','a','b','d'],'removed time filter must not hide previously collected records');
assert.deepEqual(papers.map(p=>p.id),['a','b','c','d','x'],'filter must not mutate source order');

const relations=paperRelations(a);
assert.deepEqual(relations.map(r=>[r.author,r.unit]),[
  ['Alice Corresponding','Institute A'],['Alice Corresponding','Laboratory X']
]);
assert(relations.every(r=>r.paperId==='a'&&r.source==='https://example.org/paper-a'));
assert.deepEqual(paperRelations(c),[],'last author must not become corresponding author');
assert.deepEqual(paperRelations({...c,correspondingAuthors:[{name:'Unproven',verified:'true',affiliations:['X']}]}),[],'verified must be boolean true');
assert.equal(paperRelations(b)[0].unit,'单位待核实','unknown unit explicitly marked');
assert.equal(paperRelations(b)[0].source,b.url,'article URL is evidence fallback');
const future=make('future','Nature','2026-10-29');
assert.deepEqual(ids({days:'7'},[],[future]),[],'tomorrow must not be treated as a latest published article');
assert.deepEqual(ids({},[],[future]),[],'all-record view still excludes future publications');
const boundary=make('boundary','Nature','2026-10-21');
const outside=make('outside','Nature','2026-10-20');
const invalid=make('invalid','Nature','not-a-date');
assert.equal(filterLiterature([make('plain-search','Nature','2026-10-20',{title:'CO₂ and C₂H₄'})],{query:'CO2'},[],now).length,1,'Plain text search must still find source titles with chemical subscripts');
assert.deepEqual(ids({days:'7'},[],[boundary,outside,invalid]),['boundary','outside'],'old day options are ignored while invalid dates remain excluded');

const originalDocument=globalThis.document,originalQueue=globalThis.queueMicrotask;
try{
  globalThis.document={addEventListener(){}};
  globalThis.queueMicrotask=()=>{};
  const escape=value=>String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  const literature=createLiterature({e:escape,external:()=>'',icon:()=>'',button:(action,label)=>`<button data-action="${action}">${label}</button>`,empty:()=>'',showDialog(){},toast(){},redraw(){},getSaved:()=>[],toggleSaved(){},download(){}});
  const html=literature.render();
  assert(html.includes('<h1>文献</h1>')&&html.includes('data-lit-advanced'),'compact view retains optional advanced search');
  assert(!html.includes('data-lit-filter="days"')&&!html.includes('lit-intro'),'time selector and duplicate hero removed');
  assert.deepEqual(literature.getPapers(),[],'Obsidian can read loaded papers without UI filtering');
}finally{globalThis.document=originalDocument;globalThis.queueMicrotask=originalQueue;}

console.log('Literature UI checks passed: search fields, strict journals, dates, evidence, saved filters, ordering and paper relations.');
