// Native local-file handles stay in memory; reconnect after a page reload.
const START='<!-- joy-applyflow:generated:start ';
const END='<!-- joy-applyflow:generated:end -->';
const hash=value=>{let n=14695981039346656037n;for(const byte of new TextEncoder().encode(value)){n^=BigInt(byte);n=BigInt.asUintN(64,n*1099511628211n);}return n.toString(16);};
const missing=error=>error?.name==='NotFoundError';

export function validateVaultPath(path,folder){
  if(typeof path!=='string'||path.length>320||!path.endsWith('.md')||!path.startsWith(folder+'/'))throw Error('笔记路径不在指定目录内。');
  if(path.split('/').some(p=>!p||p.startsWith('.')||/[\\\u0000-\u001f<>:"|?*#^[\]]/.test(p)||/[. ]$/.test(p)||/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(p)))throw Error('笔记目录或文件名无效。');
  return path.split('/');
}

export function managedContent(content,personal='## 我的笔记\n\n'){
  const header=content.match(/^---\n[\s\S]*?\n---\n*/)?.[0]||'';
  const body=content.slice(header.length).trimEnd().replaceAll('<!-- joy-applyflow:','&lt;!-- joy-applyflow:');
  return header+`${START}${hash(body)} -->\n${body}\n${END}\n\n${personal}`;
}
function block(content){
  const lines=content.replace(/\r\n/g,'\n');
  const begins=[...lines.matchAll(/^<!-- joy-applyflow:generated:start ([a-f0-9]+) -->\n/gm)];
  const ends=[...lines.matchAll(/^<!-- joy-applyflow:generated:end -->$/gm)];
  if(begins.length!==1||ends.length!==1||ends[0].index<=begins[0].index)throw Error('没有完整的工作台受管区，保留原文件。');
  const start=begins[0],end=ends[0],body=lines.slice(start.index+start[0].length,end.index).replace(/\n$/,'');
  if(hash(body)!==start[1])throw Error('受管区已被手动修改，保留原文件。');
  return {content:lines,start:start.index,end:end.index+END.length,body};
}
export function mergeManagedNote(existing,incoming){
  const next=block(incoming);
  if(existing===null)return incoming;
  const old=block(existing);
  const identity=value=>{
    const header=value.match(/^---\n([\s\S]*?)\n---/)?.[1]||'';
    return ['type','id'].map(key=>header.match(new RegExp('^joy_applyflow_'+key+': (.+)$','m'))?.[1]).join('\n');
  };
  if(!identity(incoming).trim()||identity(old.content)!==identity(next.content))throw Error('文件属于其他条目或身份属性已修改，保留原文件。');
  return old.content.slice(0,old.start)+next.content.slice(next.start,next.end)+old.content.slice(old.end);
}
export function personalContent(content){const b=block(content);return b.content.slice(b.end).trim();}

export async function validateVault(handle){
  if(!handle||handle.kind!=='directory')throw Error('请选择 Obsidian 仓库根目录。');
  try{await handle.getDirectoryHandle('.obsidian');}catch{throw Error('这个目录没有 .obsidian 文件夹，请选择已由 Obsidian 打开过的仓库根目录。');}
  return handle;
}
async function fileHandle(vault,path,folder,create=false){
  const parts=validateVaultPath(path,folder),name=parts.pop();
  let directory=vault;
  for(const part of parts)directory=await directory.getDirectoryHandle(part,{create});
  return directory.getFileHandle(name,{create});
}
export async function readVaultNote(vault,path,folder){
  try{const handle=await fileHandle(vault,path,folder);const file=await handle.getFile();if(file.size>2*1024*1024)throw Error('笔记超过 2 MB，请在 Obsidian 中查看。');return await file.text();}catch(error){if(missing(error))return null;throw error;}
}
export async function previewVault(vault,notes,folder){
  await validateVault(vault);
  const paths=new Set(),plan=[];
  for(const note of notes){
    validateVaultPath(note.path,folder);
    if(paths.has(note.path))throw Error('笔记路径重复，未进行写入。');paths.add(note.path);
    let before=null,after=null,status='conflict',reason='';
    try{before=await readVaultNote(vault,note.path,folder);after=mergeManagedNote(before,note.content);status=before===null?'create':before.replace(/\r\n/g,'\n')===after?'same':'update';}catch(error){reason=error.message;}
    plan.push({path:note.path,title:note.title,status,reason,before,after});
  }
  return plan;
}
export async function writeVaultPlan(vault,plan,folder){
  await validateVault(vault);
  const result={written:0,unchanged:0,conflicts:[]};
  for(const entry of plan){
    validateVaultPath(entry.path,folder);
    if(entry.status==='conflict'){result.conflicts.push({path:entry.path,reason:entry.reason});continue;}
    if(entry.status==='same'){result.unchanged++;continue;}
    try{
      const current=await readVaultNote(vault,entry.path,folder);
      if(current!==entry.before)throw Error('预览后笔记发生变化，请重新预览。');
      // The generated block is checked again; never replace unmarked or edited notes.
      const content=mergeManagedNote(current,entry.after);
      const handle=await fileHandle(vault,entry.path,folder,true);
      const writable=await handle.createWritable({mode:'exclusive'});
      try{
        const locked=await (await handle.getFile()).text();
        if(locked!==(current??''))throw Error('写入前笔记发生变化，已跳过。');
        await writable.write(content);await writable.close();
      }catch(error){await writable.abort?.();throw error;}
      result.written++;
    }catch(error){result.conflicts.push({path:entry.path,reason:error.message});}
  }
  return result;
}
