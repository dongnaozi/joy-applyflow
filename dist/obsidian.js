import { APPLICATION_STEPS } from './application.js';
import { matchesResearch } from './research.js';
import {managedContent,personalContent,validateVault,previewVault,writeVaultPlan,readVaultNote} from './obsidian-vault.js';

const DEFAULT_FOLDER='JoyApplyFlow';
const scalar=value=>JSON.stringify(String(value??''));
const text=value=>String(value??'').replace(/\r/g,'');
const line=value=>text(value).replace(/[\n\u0000-\u001f]/g,' ').trim();
const safeLink=value=>{try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)?url.href:'';}catch{return '';}};
const md=value=>line(value).replace(/[\\`*_[\]<>|]/g,'\\$&');
const array=value=>value==null?[]:Array.isArray(value)?value:[value];
const recordName=value=>{if(typeof value!=='object'||!value)return String(value??'');const name=value.name||value.display_name||value.label||value.institution?.name||value.institution;return typeof name==='string'?name:'';};

export function validateObsidianSettings(raw){
  const vault=line(raw?.vault).trim();
  const folder=text(raw?.folder??DEFAULT_FOLDER).trim().replace(/\\/g,'/');
  if(vault.length>120)throw Error('仓库名称请控制在 120 个字符以内。');
  if(!folder||folder.length>180||folder.startsWith('/')||folder.split('/').some(part=>!part||part.startsWith('.')||/[\u0000-\u001f<>:"|?*#^[\]]/.test(part)||/[. ]$/.test(part)||/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part)))throw Error('笔记目录请填写仓库内的相对路径，例如 JoyApplyFlow。');
  return {vault,folder};
}
export function normalizeObsidian(raw){try{return validateObsidianSettings(raw);}catch{return {vault:'',folder:DEFAULT_FOLDER};}}
function hash(value){let result=14695981039346656037n;for(const code of new TextEncoder().encode(String(value))){result^=BigInt(code);result=BigInt.asUintN(64,result*1099511628211n);}return result.toString(16);}
function segment(value){let name=line(value).replace(/[\\/:*?"<>|#^[\]]/g,' ').replace(/\s+/g,' ').replace(/[. ]+$/g,'').slice(0,55).trim();if(/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name))name='_'+name;return name||'未命名';}
function paperKey(p){const doi=line(p.doi||'').toLowerCase()||((safeLink(p.url).match(/10\.\d{4,9}\/[^?#]+/i)||[])[0]||'').toLowerCase();return doi||line(p.id||p.key||p.url||p.title);}
function wiki(path,label){return `[[${path.replace(/\.md$/,'')}|${line(label).replace(/[\]|\n]/g,' ')}]]`;}
function header(kind,id,source=''){return `---\njoy_applyflow_type: ${scalar(kind)}\njoy_applyflow_id: ${scalar(id)}\nsource: ${scalar(safeLink(source))}\ntags: [joy-applyflow]\n---\n\n`;}
function associated(p,mentor){return array(p.mentors).some(item=>(typeof item==='string'?item:item?.id)===mentor.id)||array(mentor.papers).some(item=>paperKey(item)===paperKey(p));}

export function buildObsidianNotes(data,{scope='saved'}={}){
  const settings=normalizeObsidian(data.state?.obsidian),folder=settings.folder;
  const saved=data.state?.saved||{},savedPapers=new Set(data.state?.paperSaved||[]);
  const mentors=(scope==='saved'?data.allMentors||data.mentors||[]:data.mentors||[]).filter(m=>scope==='all'||Object.hasOwn(saved,m.id));
  const research=data.state?.research||{},criteria={keywords:research.keywords?.length?research.keywords:['CO2RR','CO2','carbon dioxide','二氧化碳'],excludedKeywords:research.excludedKeywords||[]};
  const literature=(data.literaturePapers||[]).filter(p=>scope==='saved'||matchesResearch([p.title,p.abstract,p.summaryZh,...array(p.topics)].join(' '),criteria));
  const mentorPapers=scope==='saved'?data.allPapers||data.papers||[]:data.papers||[];
  const byPaper=new Map();
  for(const p of [...mentorPapers,...literature]){
    const key=paperKey(p);if(!key)continue;
    const wanted=scope==='all'||[p.id,p.key,p.url,key].some(value=>savedPapers.has(value));
    const previous=byPaper.get(key);
    byPaper.set(key,{...previous,...p,_wanted:wanted||previous?._wanted});
  }
  const papers=[...byPaper.values()].filter(p=>p._wanted);
  const mentorPaths=new Map(mentors.map(m=>[m.id,`${folder}/导师/${segment(m.name)}-${hash(m.id)}.md`]));
  const paperPaths=new Map(papers.map(p=>[paperKey(p),`${folder}/论文/${segment(p.title)}-${hash(paperKey(p))}.md`]));
  const overviewPath=`${folder}/工作台.md`,applicationPath=`${folder}/申请概览.md`;
  const notes=[];
  for(const m of mentors){
    const source=safeLink(m.url),related=papers.filter(p=>associated(p,m));
    let body=header('mentor',m.id,source)+`# ${md(m.name)}\n\n- 单位：${md(m.school)}\n- 地区：${md(m.country)}\n- 职称：${md(m.title||'待核实')}\n- 研究方向：${array(m.topics).map(md).join('、')}\n`;
    if(source)body+=`- 官网：<${source}>\n`;
    if(safeLink(m.researchSource))body+=`- 研究证据：<${safeLink(m.researchSource)}>\n`;
    body+=`\n${text(m.summary)}\n\n## 相关论文\n\n${related.map(p=>'- '+wiki(paperPaths.get(paperKey(p)),p.title)).join('\n')||'本次导出未包含相关论文。'}\n\n## 申请\n\n${wiki(applicationPath,'申请概览')}\n\n${wiki(overviewPath,'工作台')}\n`;
    notes.push({kind:'mentor',id:m.id,title:m.name,path:mentorPaths.get(m.id),content:body});
  }
  for(const p of papers){
    const key=paperKey(p),source=safeLink(p.url),related=mentors.filter(m=>associated(p,m));
    let body=header('paper',key,source)+`# ${md(p.title)}\n\n- 期刊：${md(p.journal)}\n- 发表时间：${md(p.date||p.year||'待核实')}\n- DOI：${md(p.doi||'待核实')}\n- 作者：${array(p.authors).map(recordName).filter(Boolean).map(md).join('、')||'来源未提供'}\n`;
    if(source)body+=`- 原文：<${source}>\n`;
    body+=`- 作者角色证据：${md(p.evidenceStatus||p.role||'待核实')}\n`;
    if(safeLink(p.roleSource))body+=`- 角色证据来源：<${safeLink(p.roleSource)}>\n`;
    const ca=array(p.correspondingAuthors).filter(a=>a&&a.verified===true&&safeLink(a.sourceUrl));
    body+=`\n## 通讯作者\n\n${ca.map(a=>`- ${md(a.name)} · ${array(a.affiliations).map(recordName).filter(Boolean).map(md).join('；')||'单位待核实'}（<${safeLink(a.sourceUrl)}>）`).join('\n')||'当前记录未提供已核实的通讯作者与单位。'}\n\n## 相关导师\n\n${related.map(m=>'- '+wiki(mentorPaths.get(m.id),m.name)).join('\n')||'本次导出未包含相关导师。'}\n\n## 阅读笔记\n\n\n${wiki(overviewPath,'工作台')}\n`;
    notes.push({kind:'paper',id:key,title:p.title,path:paperPaths.get(key),content:body});
  }
  const tasks=data.state?.application?.tasks||[];
  let application=header('application','application')+'# 申请概览\n\n> 包含个人准备事项、阶段、日期和备注，请保存在自己的仓库中。\n\n## 准备事项\n\n'+tasks.map(task=>`- [${task.done?'x':' '}] ${md(task.label)}`).join('\n');
  application+='\n\n## 目标导师\n\n';
  for(const m of mentors.filter(m=>Object.hasOwn(saved,m.id))){const entry=saved[m.id];application+=`### ${md(m.name)}\n\n${wiki(mentorPaths.get(m.id),m.name)}\n\n- 阶段：${md(entry.stage)}\n- 跟进日期：${md(entry.date||'未设置')}\n\n${APPLICATION_STEPS.map(step=>`- [${entry.tasks?.[step.id]?'x':' '}] ${md(step.label)}`).join('\n')}\n\n备注：\n\n${text(entry.note)||'暂无'}\n\n`;}
  application+=wiki(overviewPath,'工作台')+'\n';
  notes.push({kind:'application',id:'application',title:'申请概览',path:applicationPath,content:application});
  const overview=header('index','index')+`# Joy ApplyFlow\n\n- 当前研究方向：${md(data.state?.research?.name||'未设置')}\n- 范围：${scope==='all'?'当前方向':'跨方向收藏；文献仅包含已加载记录'}\n- ${mentors.length} 位导师 · ${papers.length} 篇论文\n\n## 导师\n\n${mentors.map(m=>'- '+wiki(mentorPaths.get(m.id),m.name)).join('\n')||'暂无导师。'}\n\n## 论文\n\n${papers.map(p=>'- '+wiki(paperPaths.get(paperKey(p)),p.title)).join('\n')||'暂无论文。'}\n\n## 申请\n\n${wiki(applicationPath,'申请概览')}\n`;
  notes.unshift({kind:'index',id:'index',title:'工作台',path:overviewPath,content:overview});
  const paths=new Set();for(const note of notes){if(paths.has(note.path))throw Error('导出文件名冲突，请检查条目 ID。');paths.add(note.path);}
  return notes.map(note=>{
    const body=note.content.replace('## 阅读笔记\n\n\n','');
    const personal=note.kind==='paper'?'## 我的阅读笔记\n\n### 研究问题\n\n### 催化剂与实验条件\n\n### 关键证据与局限\n\n### 与我的课题的联系\n\n- [ ] 阅读全文\n- [ ] 核对实验条件与性能比较\n- [ ] 写下可跟进的问题\n':note.kind==='mentor'?'## 我的导师笔记\n\n### 研究契合点\n\n### 联系记录\n\n### 下一步\n\n':'## 我的笔记\n\n';
    return {...note,content:managedContent(body,personal)};
  });
}

export function obsidianUri(action,settings,note){
  settings=validateObsidianSettings(settings);
  if(!settings.vault)throw Error('请先填写并保存 Obsidian 仓库名称。');
  if(!['open','new'].includes(action))throw Error('不支持的 Obsidian 操作。');
  const params={vault:settings.vault};
  if(note){if(!note.path.startsWith(settings.folder+'/')||note.path.split('/').some(p=>p==='..'||p==='.'))throw Error('笔记路径无效。');params.file=note.path;}
  if(action==='new'){if(!note)throw Error('没有可创建的笔记。');params.content=note.content;}
  const uri='obsidian://'+action+'?'+Object.entries(params).map(([key,value])=>key+'='+encodeURIComponent(value)).join('&');
  // ponytail: a short native URI avoids OS/browser command limits; use the ZIP for long notes.
  if(uri.length>7000)throw Error('这篇笔记较长，请下载 Markdown 包后放入 Obsidian 仓库。');
  return uri;
}
export async function createObsidianZip(notes){await import('./vendor/jszip.min.js');const zip=new globalThis.JSZip();for(const note of notes)zip.file(note.path,note.content);return zip.generateAsync({type:'uint8array',compression:'DEFLATE'});}

export function createObsidian({e,icon,getData,saveSettings,toast}){
  let scope='saved',busy=false,vault=null,plan=null,plannedData='',query='',reading=null,lastResult='';
  const build=()=>buildObsidianNotes(getData(),{scope});
  const redraw=()=>{if(globalThis.location&&location.hash!=='#obsidian')return;const main=document.querySelector('#main');if(main)main.innerHTML=render();};
  const invalidate=()=>{plan=null;plannedData='';reading=null;lastResult='';};
  const action=(id,label,ico='',extra='')=>`<button type="button" class="button btn btn-default" data-ob-action="${id}" ${busy?'disabled':''} ${extra}>${ico?icon(ico):''}${label}</button>`;
  const counts=entries=>Object.fromEntries(['create','update','same','conflict'].map(status=>[status,entries.filter(item=>item.status===status).length]));
  function render(){
    const settings=normalizeObsidian(getData().state?.obsidian),notes=build(),mentors=notes.filter(n=>n.kind==='mentor').length,papers=notes.filter(n=>n.kind==='paper').length;
    const rows=notes.map((note,index)=>({...note,index})).filter(note=>!query||[note.title,note.path].join(' ').toLowerCase().includes(query.toLowerCase()));
    const stats=plan?counts(plan):null;
    return `<div class="page-heading page-header"><div><h1>Obsidian</h1><p>同步资料，保留自己的阅读与申请笔记。</p></div><div class="heading-actions">${action('vault','打开仓库','link')}${action('export','下载笔记包','download')}</div></div><div class="ob-layout"><section class="card ob-settings"><h2>我的仓库</h2><div class="ob-connect"><p class="ob-connection">${vault?`已连接 · ${e(vault.name)}`:'尚未连接本地目录'}</p>${action('connect',vault?'更换仓库':'选择本地仓库','link')}${vault?'<button class="text-button" data-ob-action="disconnect">断开</button>':''}</div><form id="obsidian-settings-form"><label for="ob-vault">仓库名称<input id="ob-vault" name="vault" maxlength="120" value="${e(settings.vault)}" placeholder="用于在 Obsidian 中打开笔记"></label><label for="ob-folder">笔记目录<input id="ob-folder" name="folder" maxlength="180" required value="${e(settings.folder)}"></label><button class="button btn btn-default" type="submit">保存设置</button></form><p class="ob-muted">目录连接仅在本次页面有效。选择含 .obsidian 的仓库根目录；Chrome / Edge 可直接同步，其他浏览器可下载笔记包。</p><details class="ob-help"><summary>同步与笔记如何保留</summary><ol><li>连接自己的 Obsidian 仓库。</li><li>点击“预览同步”，查看新增、更新与冲突。</li><li>确认后写入指定笔记目录。</li></ol><p>每篇笔记分为工作台受管区与个人笔记区。同步更新受管区，保留个人笔记；受管区被手改、旧文件无标记或预览后文件改变时，跳过并提示冲突。</p><p>ZIP 可手动导入。旧版笔记请先备份、整理为其他名称后再同步；不会自动覆盖。</p></details><details class="ob-help"><summary>参考的开源功能</summary><p><a href="https://github.com/coddingtonbear/obsidian-local-rest-api" target="_blank" rel="noopener noreferrer">Local REST API</a>：资料读写与分段更新。</p><p><a href="https://github.com/Vinzent03/obsidian-advanced-uri" target="_blank" rel="noopener noreferrer">Advanced URI</a>：笔记深链接与快速打开。</p><p><a href="https://github.com/community-archive/obsidian-zotero-integration/blob/main/docs/Templating.md" target="_blank" rel="noopener noreferrer">Zotero Integration</a>：论文模板与保留手写笔记。</p><p>本工作台用浏览器本地目录权限实现相应流程，无需安装这些插件。</p></details></section><section class="card ob-library"><div class="ob-library-head"><div><h2>资料与笔记</h2><p>${mentors} 位导师 · ${papers} 篇论文</p></div><label for="ob-scope" class="ob-scope">范围<select id="ob-scope" data-ob-scope ${busy?'disabled':''}><option value="saved" ${scope==='saved'?'selected':''}>我的收藏</option><option value="all" ${scope==='all'?'selected':''}>当前研究方向</option></select></label></div><div class="ob-toolbar"><label class="ob-search">查找笔记<input data-ob-query value="${e(query)}" placeholder="导师、论文或文件名"></label><button class="button btn btn-primary" data-ob-action="preview" ${!vault||busy?'disabled':''}>${icon('check')}${busy?'处理中…':'预览同步'}</button></div>${stats?`<section class="ob-sync-preview" aria-label="同步预览"><p><strong>${stats.create} 新增</strong><span>${stats.update} 更新</span><span>${stats.same} 无变化</span><span>${stats.conflict} 冲突</span></p>${stats.create+stats.update?`<button class="button btn btn-primary" data-ob-action="sync" ${busy?'disabled':''}>确认同步 ${stats.create+stats.update} 篇</button>`:''}<details><summary>查看逐项变化</summary><ul>${plan.map(item=>`<li><span>${e(({create:'新增',update:'更新',same:'无变化',conflict:'冲突'})[item.status])}</span> ${e(item.title)}${item.reason?`<small>${e(item.reason)}</small>`:''}</li>`).join('')}</ul></details></section>`:''}${lastResult?`<p class="ob-result" role="status">${e(lastResult)}</p>`:''}${reading?`<section class="ob-reading"><div><h3>${e(reading.title)}</h3><button class="text-button" data-ob-action="close-reading">收起</button></div><pre>${e(reading.content)}</pre></section>`:''}${scope==='saved'&&!mentors&&!papers?'<p class="ob-empty">先收藏导师或论文，或选择“当前研究方向”。</p>':''}<div class="ob-note-list">${rows.slice(0,40).map(note=>`<div class="ob-note"><div><span class="ob-kind">${({index:'索引',application:'清单',mentor:'导师',paper:'论文'})[note.kind]}</span><strong>${e(note.title)}</strong><small>${e(note.path)}</small></div><div class="ob-note-actions">${vault?`<button class="text-button" data-ob-action="read" data-ob-note="${note.index}">我的笔记</button>`:''}<button class="text-button" data-ob-action="open" data-ob-note="${note.index}">打开</button>${!vault?`<button class="text-button" data-ob-action="new" data-ob-note="${note.index}">新建</button>`:''}</div></div>`).join('')}</div>${rows.length>40?`<p class="ob-muted">显示前 40 / ${rows.length} 篇，搜索可定位其余笔记。同步包含所选范围的全部资料。</p>`:''}<p class="ob-muted ob-privacy">同步与导出含申请备注和任务，不含简历原文。收藏文献仅包含已加载记录。“我的笔记”从连接的仓库读取；文件内容不上传。</p></section></div>`;
  }
  async function click(event){
    const target=event.target.closest?.('[data-ob-action]');if(!target)return false;
    event.preventDefault();
    try{
      const action=target.dataset.obAction,settings=normalizeObsidian(getData().state?.obsidian);
      if(busy)return true;
      if(action==='connect'){
        if(typeof globalThis.showDirectoryPicker!=='function')throw Error('当前浏览器不支持本地目录连接，请用 Chrome / Edge，或下载笔记包。');
        const selected=await globalThis.showDirectoryPicker({id:'joy-applyflow-obsidian',mode:'read'});
        await validateVault(selected);vault=selected;invalidate();
        if(saveSettings({...settings,vault:selected.name})===false){vault=null;throw Error('仓库设置未能保存。');}
        redraw();toast('仓库已连接。点击“预览同步”检查变化。');
      }else if(action==='disconnect'){vault=null;invalidate();redraw();
      }else if(action==='preview'){
        if(!vault)throw Error('请先连接本地仓库。');
        busy=true;redraw();
        try{const notes=build();plan=await previewVault(vault,notes,settings.folder);plannedData=JSON.stringify(notes);lastResult='预览完成，尚未写入文件。';}finally{busy=false;redraw();}
      }else if(action==='sync'){
        if(!vault||!plan)throw Error('请先预览同步。');
        if(plannedData!==JSON.stringify(build())){invalidate();redraw();throw Error('工作台资料已变化，请重新预览。');}
        const permission=await vault.requestPermission({mode:'readwrite'});
        if(permission!=='granted')throw Error('未获得目录写入权限，可以继续下载笔记包。');
        busy=true;redraw();
        try{const result=await writeVaultPlan(vault,plan,settings.folder);lastResult=`已同步 ${result.written} 篇 · ${result.unchanged} 篇无变化${result.conflicts.length?` · ${result.conflicts.length} 篇冲突已跳过`:'。'}`;plan=result.conflicts.length?result.conflicts.map(item=>({...item,title:item.path,status:'conflict'})):null;plannedData='';toast(lastResult);}finally{busy=false;redraw();}
      }else if(action==='read'){
        const note=build()[Number(target.dataset.obNote)];if(!vault||!note)throw Error('请重新连接仓库并选择笔记。');
        const content=await readVaultNote(vault,note.path,settings.folder);if(content===null)throw Error('这篇笔记尚未同步，请先预览同步。');
        try{reading={title:note.title,content:personalContent(content)||'还没有个人笔记。请在 Obsidian 中编辑受管区下方的笔记。'};}catch{throw Error('这是旧版或手动修改的笔记，请直接在 Obsidian 打开查看。');}redraw();
      }else if(action==='close-reading'){reading=null;redraw();
      }else if(action==='export'){
        if(busy)return true;busy=true;target.disabled=true;
        try{const bytes=await createObsidianZip(build()),url=URL.createObjectURL(new Blob([bytes],{type:'application/zip'})),link=document.createElement('a');link.href=url;link.download='JoyApplyFlow-Obsidian.zip';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已下载笔记包，解压后放入你的 Obsidian 仓库。');}finally{busy=false;target.disabled=false;}
      }else if(action==='vault'||action==='open'||action==='new'){
        const note=action==='vault'?undefined:build()[Number(target.dataset.obNote)];
        if(action!=='vault'&&!note)throw Error('笔记已变化，请重新选择。');
        const link=document.createElement('a');link.href=obsidianUri(action==='vault'?'open':action,settings,note);link.click();toast('已请求打开 Obsidian，请在应用中确认结果。');
      }
    }catch(error){if(error.name!=='AbortError')toast(error.message||'Obsidian 操作失败，请重试。',true);}
    return true;
  }
  function submit(event){if(event.target.id!=='obsidian-settings-form')return false;event.preventDefault();if(busy)return true;try{const form=new FormData(event.target),settings=validateObsidianSettings({vault:form.get('vault'),folder:form.get('folder')});invalidate();if(saveSettings(settings)!==false)toast('Obsidian 设置已保存。');}catch(error){toast(error.message,true);}return true;}
  document.addEventListener('change',event=>{if(event.target.hasAttribute?.('data-ob-scope')&&!busy){scope=event.target.value==='all'?'all':'saved';invalidate();redraw();}});
  document.addEventListener('input',event=>{if(!event.target.hasAttribute?.('data-ob-query'))return;const start=event.target.selectionStart;query=event.target.value;redraw();const input=document.querySelector('[data-ob-query]');input?.focus();input?.setSelectionRange(start,start);});
  return {render,click,submit};
}
