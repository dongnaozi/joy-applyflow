import assert from 'node:assert/strict';
import { normalizeObsidian, validateObsidianSettings, buildObsidianNotes, obsidianUri, createObsidianZip } from './dist/obsidian.js';
import {validateVault,previewVault,writeVaultPlan,mergeManagedNote,personalContent,validateVaultPath} from './dist/obsidian-vault.js';

assert.deepEqual(normalizeObsidian(),{vault:'',folder:'JoyApplyFlow'});
for(const folder of ['../private','/absolute','C:\\data','a/../b','a//b','NUL','a/[x]','.obsidian','Apply/.git'])assert.throws(()=>validateObsidianSettings({folder}),/相对路径/);
assert.deepEqual(validateObsidianSettings({vault:'研究 & # 申请',folder:'Apply/研究'}),{vault:'研究 & # 申请',folder:'Apply/研究'});
const mentor={id:'m1',name:'Dr Same',school:'Example University',url:'https://example.edu/group',topics:['CO2RR'],papers:[{url:'https://doi.org/10.1000/paper'}]};
const data={state:{obsidian:{vault:'研究 & # 申请',folder:'Apply/研究'},profile:{cvText:'PRIVATE CV MUST NOT LEAK'},research:{name:'CO2RR'},application:{tasks:[{label:'Prepare CV',done:true}]},saved:{m1:{stage:'已联系',note:'Follow up next month',date:'2026-11-01',tasks:{read:true}}},paperSaved:['https://doi.org/10.1000/paper']},mentors:[mentor,{...mentor,id:'m2'}],papers:[{key:'https://doi.org/10.1000/paper',url:'https://doi.org/10.1000/paper',title:'A paper',mentors:[mentor]}],literaturePapers:[{id:'10.1000/paper',doi:'10.1000/paper',url:'https://doi.org/10.1000/paper',title:'A paper'}]};
const notes=buildObsidianNotes(data);
assert.equal(notes.filter(n=>n.kind==='mentor').length,1);
assert.equal(notes.filter(n=>n.kind==='paper').length,1,'DOI duplicate merged without losing saved status');
const paths=new Set(notes.map(n=>n.path.replace(/\.md$/,'')));
for(const note of notes){assert.ok(!note.content.includes('PRIVATE CV MUST NOT LEAK'));for(const match of note.content.matchAll(/\[\[([^|\]]+)/g))assert.ok(paths.has(match[1]),'Every wiki link resolves inside export: '+match[1]);}
const all=buildObsidianNotes(data,{scope:'all'});assert.equal(new Set(all.map(n=>n.path)).size,all.length,'same-name mentor notes keep unique paths');
const across={...data,mentors:[],papers:[],allMentors:data.mentors,allPapers:data.papers};
assert.equal(buildObsidianNotes(across).filter(n=>n.kind==='mentor').length,1,'saved mentor exports across research directions');
assert.equal(buildObsidianNotes(across).filter(n=>n.kind==='paper').length,1,'saved mentor paper exports across research directions');
assert.equal(buildObsidianNotes(across,{scope:'all'}).filter(n=>n.kind==='mentor').length,0,'current direction stays scoped');
const shapes={...data,state:{...data.state,research:{name:'ORR',keywords:['oxygen reduction'],excludedKeywords:['exclude-me']},paperSaved:[]},papers:[],literaturePapers:[{id:'orr',title:'Oxygen reduction catalyst',authors:'A Author; B Author',correspondingAuthors:[{name:'A Author',verified:true,sourceUrl:'https://example.edu/paper',affiliations:[{name:'Test Institute'},{institution:{name:'Other Institute'}}]}]},{id:'co2rr',title:'CO2 reduction catalyst'},{id:'excluded',title:'Oxygen reduction exclude-me'}]};
const shapeNotes=buildObsidianNotes(shapes,{scope:'all'}).filter(n=>n.kind==='paper');
assert.equal(shapeNotes.length,1,'literature export respects included and excluded research keywords');
assert.ok(shapeNotes[0].content.includes('A Author; B Author')&&shapeNotes[0].content.includes('Test Institute；Other Institute'),'string authors and object affiliations supported');
const uri=obsidianUri('new',data.state.obsidian,notes[0]);const parsed=new URL(uri);
assert.equal(parsed.searchParams.get('vault'),'研究 & # 申请');assert.equal(parsed.searchParams.get('content'),notes[0].content);assert.ok(!parsed.searchParams.has('overwrite')&&!parsed.searchParams.has('append'));
assert.throws(()=>obsidianUri('new',data.state.obsidian,{...notes[0],content:'x'.repeat(8000)}),/较长/);
assert.throws(()=>obsidianUri('open',{vault:'',folder:'a'}),/仓库名称/);
const zipBytes=await createObsidianZip(notes);const zip=await globalThis.JSZip.loadAsync(zipBytes);
for(const note of notes)assert.equal(await zip.file(note.path).async('string'),note.content);
assert.equal(zip.file(/\.md$/).length,notes.length);
const missing=()=>new DOMException('Missing','NotFoundError');
let writes=0,creates=0;
class Directory{
  kind='directory';directories=new Map();files=new Map();
  constructor(name){this.name=name;}
  async getDirectoryHandle(name,{create=false}={}){if(!this.directories.has(name)){if(!create)throw missing();creates++;this.directories.set(name,new Directory(name));}return this.directories.get(name);}
  async getFileHandle(name,{create=false}={}){
    if(!this.files.has(name)){if(!create)throw missing();creates++;this.files.set(name,'');}
    const files=this.files;
    return {getFile:async()=>({size:new TextEncoder().encode(files.get(name)).length,text:async()=>files.get(name)}),createWritable:async()=>{let draft='';return {write:async value=>{draft=value;},close:async()=>{writes++;files.set(name,draft);},abort:async()=>{}};}};
  }
}
const vault=new Directory('Test Vault');vault.directories.set('.obsidian',new Directory('.obsidian'));
await assert.rejects(()=>validateVault(new Directory('not a vault')),/\.obsidian/);
for(const path of ['Apply/研究/../secret.md','Apply/研究/.obsidian/settings.md','other/note.md','Apply/研究/note.txt'])assert.throws(()=>validateVaultPath(path,'Apply/研究'));
const plan=await previewVault(vault,notes,'Apply/研究');
assert.equal(writes,0,'Preview must never write any file');assert.equal(creates,0,'Preview must never create a directory or file');
assert.ok(plan.every(p=>p.status==='create'));
assert.equal((await writeVaultPlan(vault,plan,'Apply/研究')).written,notes.length);
assert.ok((await previewVault(vault,notes,'Apply/研究')).every(p=>p.status==='same'),'Repeated sync is incremental');
const first=notes[0],getFile=async path=>{const parts=path.split('/'),name=parts.pop();let dir=vault;for(const part of parts)dir=await dir.getDirectoryHandle(part);return {dir,name};};
const {dir,name}=await getFile(first.path);dir.files.set(name,dir.files.get(name)+'\nMy handwritten research plan.\n');
const updated=buildObsidianNotes({...data,state:{...data.state,research:{name:'Updated research direction'}}});
const changes=await previewVault(vault,updated,'Apply/研究');
assert.equal(changes.find(p=>p.path===first.path).status,'update');
assert.equal((await writeVaultPlan(vault,changes,'Apply/研究')).written,1);
assert.ok(dir.files.get(name).includes('Updated research direction')&&personalContent(dir.files.get(name)).includes('My handwritten research plan.'),'Generated updates preserve handwritten notes');
const altered=dir.files.get(name).replace('Updated research direction','Manually edited generated data');
assert.throws(()=>mergeManagedNote(altered,updated[0].content),/手动修改/);
assert.throws(()=>mergeManagedNote('Legacy unmarked note',updated[0].content),/受管区/);
dir.files.set(name,altered);
assert.equal((await previewVault(vault,updated,'Apply/研究')).find(p=>p.path===first.path).status,'conflict');
dir.files.set(name,updated[0].content);
const changedAgain=buildObsidianNotes({...data,state:{...data.state,research:{name:'Next revision'}}});
const beforeRace=await previewVault(vault,changedAgain,'Apply/研究');
dir.files.set(name,dir.files.get(name)+'\nConcurrent note edit.');
const raced=await writeVaultPlan(vault,beforeRace,'Apply/研究');
assert.equal(raced.written,0);assert.equal(raced.conflicts.length,1);assert.ok(dir.files.get(name).includes('Concurrent note edit.'),'Concurrent edits are skipped');
console.log('Obsidian checks passed: linked Markdown ZIP, current research, safe URI, local vault validation, read-only preview, incremental writes, preserved personal notes, concurrent-edit conflicts and CV exclusion.');
