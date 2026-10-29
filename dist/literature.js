import { defaultResearch, matchesResearch, researchQuery } from './research.js';
export const JOURNALS=['Nature','Science','Nature Energy','Nature Catalysis','Nature Chemistry','Nature Synthesis','Nature Nanotechnology','Nature Materials','Nature Communications','Science Advances','Angewandte Chemie International Edition','Journal of the American Chemical Society'];

export function filterLiterature(papers,f,saved=[],now=new Date()){
  const term=(f.query||'').trim().toLowerCase();
  return papers.filter(p=>{
    const corresponding=(p.correspondingAuthors||[]).filter(a=>a.verified===true);
    const fields={title:p.title,author:[...(p.authors||[]),...corresponding.map(a=>a.name)].join(' '),abstract:[p.abstract,p.summaryZh].join(' '),institution:corresponding.flatMap(a=>a.affiliations||[]).join(' ')};
    const text=f.field&&f.field!=='all'?fields[f.field]:Object.values(fields).join(' ');
    const age=(new Date(new Date(now.getTime()+8*3600000).toISOString().slice(0,10)+'T00:00:00Z')-new Date(p.date+'T00:00:00Z'))/86400000;
    return JOURNALS.includes(p.journal)&&Number.isFinite(age)&&age>=0&&(!term||String(text||'').toLowerCase().includes(term))&&(!f.journal||p.journal===f.journal)&&(!f.topic||(p.topics||[]).includes(f.topic))&&(!f.days||age<=Number(f.days))&&(!f.onlySaved||saved.includes(p.id))&&(!f.evidence||(f.evidence==='verified'?corresponding.some(a=>a.affiliations?.length):!corresponding.some(a=>a.affiliations?.length)));
  }).sort((a,b)=>f.sort==='oldest'?a.date.localeCompare(b.date):f.sort==='journal'?a.journal.localeCompare(b.journal)||b.date.localeCompare(a.date):b.date.localeCompare(a.date));
}

export function paperRelations(paper){
  return (paper.correspondingAuthors||[]).filter(a=>a.verified===true).flatMap(a=>(a.affiliations?.length?a.affiliations:['单位待核实']).map(unit=>({paperId:paper.id,title:paper.title,author:a.name,unit,source:a.sourceUrl||paper.url})));
}

export function createLiterature(ui){
  const {e,external,icon,heading,button,empty,showDialog,toast,redraw,getSaved,toggleSaved,download,getResearch=defaultResearch}=ui;
  let data={papers:[],sources:[],updatedAt:null,refreshing:false},loaded=false,attempted=false,lastLoaded=0,busy=false,error='',polls=0,timer;
  let activeResearch=null,requestVersion=0;
  const f={query:'',field:'all',journal:'',topic:'',days:'90',evidence:'',onlySaved:false,sort:'newest'};
  let view='list',graphId='',limit=20;
  const choices=(values,selected,placeholder)=>`<option value="">${e(placeholder)}</option>`+values.map(x=>`<option value="${e(x)}" ${x===selected?'selected':''}>${e(x)}</option>`).join('');
  const shortJournal=j=>j==='Journal of the American Chemical Society'?'JACS':j==='Angewandte Chemie International Edition'?'Angew. Chem. Int. Ed.':j;
  const dateTime=value=>{const d=new Date(value);return !value||Number.isNaN(d.valueOf())?'尚未成功更新':d.toLocaleString('zh-CN',{hour12:false});};
  const verified=p=>(p.correspondingAuthors||[]).filter(a=>a.verified===true);
  const list=()=>filterLiterature(data.papers,f,getSaved());
  function accept(payload){
    if(!payload||!Array.isArray(payload.papers))throw Error('文献数据格式错误');
    data={...payload,papers:payload.papers.filter(p=>p&&typeof p.id==='string'&&typeof p.title==='string'&&typeof p.date==='string'&&JOURNALS.includes(p.journal)&&matchesResearch([p.title,p.abstract,p.summaryZh,...(p.topics||[])].join(' '),getResearch())).map(p=>({...p,topics:[...new Set((p.topics||[]).map(t=>({'机理与原位':'界面与机理','界面微环境':'界面与机理','界面水':'界面与机理','界面电场':'界面与机理','器件工程':'电解槽与反应器','酸性电解':'酸性体系','分子催化':'分子与单原子'})[t]||t))]}))};
  }
  async function load(refresh=false){
    if(busy)return;
    const initial=!loaded,version=requestVersion,params=new URLSearchParams(activeResearch||'');
    if(refresh)params.set('refresh','1');
    attempted=true;lastLoaded=Date.now();busy=true;error='';if(refresh)polls=0;if(refresh||initial)redraw();
    try{
      const res=await fetch('/api/literature'+(params.size?'?'+params.toString():''),{cache:'no-store',signal:AbortSignal.timeout(12000)});
      if(!res.ok)throw Error(`本机更新接口返回 ${res.status}`);
      const payload=await res.json();if(version!==requestVersion)return;accept(payload);loaded=true;
    }catch(err){
      if(version!==requestVersion)return;
      error='在线更新暂不可用：'+err.message;
      if(!loaded){try{const res=await fetch('./literature-seed.json',{cache:'no-store'});if(!res.ok)throw Error();const seeds=await res.json();if(version!==requestVersion)return;accept({papers:seeds,sources:[],refreshing:false,updatedAt:null});loaded=true;}catch{error+='；核验文献库也未能加载，请用“打开工作台.cmd”启动。';}}
    }finally{
      if(version===requestVersion){
      busy=false;clearTimeout(timer);
      if(data.refreshing&&polls++<40)timer=setTimeout(()=>load(),2500);
      else if(data.refreshing){data.refreshing=false;error='更新用时较长，已有结果仍可使用。点击“立即更新文献”可重新检查进度。';}
      if(initial||!data.refreshing){const input=document.activeElement?.id==='lit-query'?document.activeElement:null,start=input?.selectionStart;redraw();if(input){const next=document.querySelector('#lit-query');next?.focus();next?.setSelectionRange(start,start);}}
      }
    }
  }
  function render(){
    const research=getResearch(),key=researchQuery(research);
    if(key!==activeResearch){activeResearch=key;requestVersion++;loaded=false;attempted=false;busy=false;polls=0;limit=20;f.query='';f.topic='';data={papers:[],sources:[],refreshing:false,updatedAt:null};clearTimeout(timer);}
    if((!attempted||Date.now()-lastLoaded>6*3600000)&&!busy)queueMicrotask(()=>load());
    const rows=list(),authors=new Set(rows.flatMap(p=>verified(p).map(a=>a.name))),units=new Set(rows.flatMap(p=>paperRelations(p).map(r=>r.unit)).filter(x=>x!=='单位待核实'));
    const failed=(data.sources||[]).filter(s=>s.status==='error'||s.status==='failed'||s.status==='stale');
    return heading(e(research.shortName||research.name)+' · LITERATURE RADAR','领域文献追踪','从论文出发，找到正在做这件事的人。独立于已收录的导师库。',button('lit-sources','来源与更新状态','settings')+`<button class="button btn btn-primary" data-lit-refresh ${busy||data.refreshing?'disabled':''}>${icon('clock')}${busy||data.refreshing?'正在更新…':'立即更新文献'}</button>`)+
    `<section class="lit-intro card"><div><span class="badge bg-green-lt">精选期刊 · 官方来源</span><h2>聚焦${e(research.name)}的新进展</h2><p>Nature / Science 及所列子刊 · Angew · JACS。按发表日期排序，通讯作者归属以论文发表时的信息为准。</p><p class="research-filter-note">${research.keywords.length?`按 ${research.keywords.length} 个领域关键词筛选`:'使用默认 CO₂RR 主题规则'}${research.excludedKeywords.length?` · 排除 ${research.excludedKeywords.length} 项关键词`:''} · <button data-action="research-settings">定制方向</button></p></div><a class="button btn btn-default" href="https://www.x-mol.com/?from_en=true" target="_blank" rel="noopener noreferrer">打开 X-MOL ↗</a></section>
    <div class="lit-status ${error||failed.length?'is-warning':''}" role="status"><span>${busy||data.refreshing?'正在检查期刊更新，已有文献可继续阅读。':`最近成功更新：${e(dateTime(data.updatedAt))}`}${failed.length?` · ${failed.length} 个来源暂不可用，保留已有记录`:''}</span><small>${e([error||'打开本页时检查缓存；联网更新按 DOI 去重。RSS 不保证完整覆盖。',data.coverageNote].filter(Boolean).join(' '))}</small></div>
    <div class="lit-metrics"><div><strong>${rows.length}</strong><span>筛选后论文</span></div><div><strong>${authors.size}</strong><span>已核实通讯作者</span></div><div><strong>${units.size}</strong><span>论文署名单位</span></div><div><strong>${JOURNALS.length}</strong><span>限定期刊</span></div></div>
    <section class="lit-filters card" aria-label="领域文献筛选"><div class="lit-search-row"><label>搜索范围<select data-lit-filter="field"><option value="all" ${f.field==='all'?'selected':''}>全部字段</option>${[['title','文章标题'],['author','作者'],['abstract','摘要'],['institution','通讯作者单位']].map(([v,t])=>`<option value="${v}" ${f.field===v?'selected':''}>${t}</option>`).join('')}</select></label><label class="lit-query-label">关键词<input id="lit-query" data-lit-query value="${e(f.query)}" placeholder="搜索文章、作者、摘要或通讯单位…" autocomplete="off"></label></div><div class="lit-filter-row"><label>期刊<select data-lit-filter="journal">${choices(JOURNALS,f.journal,'全部指定期刊')}</select></label><label>时间范围<select data-lit-filter="days">${[['7','最近 7 天'],['30','最近 30 天'],['90','最近 90 天'],['365','最近一年'],['','全部已收录']].map(([v,t])=>`<option value="${v}" ${f.days===v?'selected':''}>${t}</option>`).join('')}</select></label><label>细分方向<select data-lit-filter="topic">${choices([...new Set(data.papers.flatMap(p=>p.topics||[]))].sort(),f.topic,'全部方向')}</select></label><label>作者证据<select data-lit-filter="evidence"><option value="">全部证据状态</option><option value="verified" ${f.evidence==='verified'?'selected':''}>通讯作者及单位已核实</option><option value="pending" ${f.evidence==='pending'?'selected':''}>通讯信息待补充</option></select></label></div><div class="lit-filter-foot"><label class="lit-check"><input type="checkbox" data-lit-saved ${f.onlySaved?'checked':''}>只看我收藏的文献</label><button class="text-button" data-lit-reset>清空筛选</button><label class="lit-sort">排序<select data-lit-filter="sort">${[['newest','发表日期：从新到旧'],['oldest','发表日期：从旧到新'],['journal','按期刊']].map(([v,t])=>`<option value="${v}" ${f.sort===v?'selected':''}>${t}</option>`).join('')}</select></label></div></section>
    <div class="lit-viewbar"><div class="tabs" role="group" aria-label="文献展示方式"><button class="tab ${view==='list'?'active':''}" data-lit-view="list" aria-pressed="${view==='list'}">${icon('paper')}文献列表</button><button class="tab ${view==='network'?'active':''}" data-lit-view="network" aria-pressed="${view==='network'}">${icon('network')}作者与机构网络</button></div><span>${rows.length} 篇 · ${f.days?'所选时间内':'全部已收录'}</span></div>
    ${!rows.length?empty(busy?'正在加载文献':'没有符合条件的文献','可扩大时间范围或清空关键词。来源失败或近期没有相关论文时，不会用旧论文冒充最新结果。',`<button class="button btn btn-default" data-lit-reset>清空筛选，查看已收录文献</button>`):view==='network'?network(rows):`<div class="lit-list">${rows.slice(0,limit).map(card).join('')}</div>${rows.length>limit?`<button class="button btn btn-default lit-more" data-lit-more>继续显示 ${Math.min(20,rows.length-limit)} 篇</button>`:''}`}
    <div class="lit-bottom"><p>通讯身份以出版社明确标注为依据；共同通讯逐位保留。“作者 → 单位”表示该论文署名关系，不表示师承、任职现状或招生名额。</p><button class="text-button" data-lit-export>${icon('download')}导出当前筛选 JSON</button></div>`;
  }
  function card(p){
    const ca=verified(p),saved=getSaved().includes(p.id);
    return `<article class="lit-paper card"><div class="lit-paper-meta"><span class="journal-badge">${e(shortJournal(p.journal))}</span><time datetime="${e(p.date)}">${e(p.date)}</time><span class="lit-evidence ${ca.length?'is-verified':''}">${ca.length?'通讯作者有来源':'通讯信息待核实'}</span></div><h2>${external(p.url,e(p.title))}</h2><p class="lit-authors"><strong>作者</strong> ${e((p.authors||[]).join(' · ')||'来源未提供作者列表')}</p>${p.authorsNote?`<p class="lit-authors-note">${e(p.authorsNote)}</p>`:''}<div class="tags">${(p.topics||[]).map(t=>`<span class="tag">${e(t)}</span>`).join('')}</div><div class="lit-abstract"><span>${e(p.summaryZh?'中文摘要（据来源整理）':p.abstractSource||'来源摘要')}</span><p>${e(p.summaryZh||p.abstract||'当前 RSS 未提供摘要，请到出版社页面核对。')}</p></div><div class="lit-correspondence"><strong>通讯作者 · 论文署名单位</strong>${ca.length?ca.map(a=>`<div><b>${e(a.name)}</b><span>${e((a.affiliations||[]).join('；')||'单位待核实')}</span></div>`).join(''):'<p>当前来源未明确标注；不依据作者排序推断。</p>'}</div><div class="lit-card-foot"><button class="text-button" data-lit-detail="${e(p.id)}">摘要与作者证据 ${icon('arrow')}</button><button class="text-button" data-lit-network="${e(p.id)}">${icon('network')}查看关系</button><button class="text-button ${saved?'saved':''}" data-lit-save="${e(p.id)}" aria-pressed="${saved}">${icon(saved?'check':'bookmark')}${saved?'已收藏':'收藏'}</button></div></article>`;
  }
  function network(rows){
    const p=rows.find(p=>p.id===graphId)||rows.find(p=>verified(p).length)||rows[0];graphId=p.id;
    const ca=verified(p),links=paperRelations(p),units=[...new Set(links.map(r=>r.unit))];
    const n=Math.max(ca.length,units.length,1),h=Math.max(280,n*100+80),y=(i,total)=>70+(h-120)*(i+.5)/total;
    const abbreviate=(s,n=36)=>s.length>n?s.slice(0,n-1)+'…':s;
    // ponytail: focus one paper; a searchable relationship table covers larger networks without a graph dependency.
    const svg=ca.length?`<div class="lit-network-scroll" tabindex="0" aria-label="论文通讯作者机构关系图，可横向滚动"><svg viewBox="0 0 960 ${h}" class="lit-network-svg" role="img" aria-label="选中论文到通讯作者，再到论文署名单位的关系图"><defs><marker id="lit-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#87a99d"/></marker></defs><text x="150" y="27" text-anchor="middle">论文</text><text x="480" y="27" text-anchor="middle">已核实通讯作者</text><text x="810" y="27" text-anchor="middle">论文署名单位</text>${ca.map((a,i)=>`<path d="M280 ${h/2} C320 ${h/2},340 ${y(i,ca.length)},370 ${y(i,ca.length)}" class="lit-edge" marker-end="url(#lit-arrow)"/>${(a.affiliations?.length?a.affiliations:['单位待核实']).map(unit=>`<path d="M590 ${y(i,ca.length)} C630 ${y(i,ca.length)},650 ${y(units.indexOf(unit),units.length)},680 ${y(units.indexOf(unit),units.length)}" class="lit-edge" marker-end="url(#lit-arrow)"/>`).join('')}`).join('')}<rect x="20" y="${h/2-42}" width="260" height="84" rx="8" class="lit-graph-paper"/><text x="150" y="${h/2-7}" text-anchor="middle" class="lit-graph-title"><title>${e(p.title)}</title>${e(abbreviate(p.title,30))}</text><text x="150" y="${h/2+18}" text-anchor="middle">${e(shortJournal(p.journal))} · ${e(p.date)}</text>${ca.map((a,i)=>`<rect x="370" y="${y(i,ca.length)-30}" width="220" height="60" rx="8" class="lit-graph-author"/><text x="480" y="${y(i,ca.length)+5}" text-anchor="middle" class="lit-graph-title"><title>${e(a.name)}</title>${e(abbreviate(a.name,27))}</text>`).join('')}${units.map((u,i)=>`<rect x="680" y="${y(i,units.length)-35}" width="260" height="70" rx="8" class="lit-graph-unit"/><text x="810" y="${y(i,units.length)-3}" text-anchor="middle"><title>${e(u)}</title>${e(abbreviate(u,33))}</text><text x="810" y="${y(i,units.length)+17}" text-anchor="middle">${e(u.length>33?abbreviate(u.slice(32),34):'论文发表时署名')}</text>`).join('')}</svg></div>`:empty('这篇论文的通讯信息尚未核实','点击原文检查 Correspondence 或 Author information；核实后才建立通讯作者与机构的边。');
    return `<section class="lit-network card"><label class="lit-network-picker">选择一篇论文<select data-lit-graph>${rows.map(x=>`<option value="${e(x.id)}" ${x.id===p.id?'selected':''}>${e(x.title)}</option>`).join('')}</select></label>${svg}<p class="micro-note">关系仅来自选中论文的通讯作者声明。同名作者不自动合并为同一个人。</p><div class="table-wrap"><table class="table table-vcenter lit-relations"><caption>关系明细与证据（图的文字版本）</caption><thead><tr><th>通讯作者</th><th>论文署名单位</th><th>关系来源</th></tr></thead><tbody>${links.map(r=>`<tr><td>${e(r.author)}</td><td>${e(r.unit)}</td><td>${external(r.source,'出版社证据 ↗')}</td></tr>`).join('')||'<tr><td colspan="3">通讯作者与单位待核实</td></tr>'}</tbody></table></div><button class="text-button" data-lit-detail="${e(p.id)}">查看这篇论文的完整信息 ${icon('arrow')}</button></section>`;
  }
  function detail(p){
    const ca=verified(p);
    showDialog(e(p.title),`${e(p.journal)} · ${e(p.date)}`,`<h3>作者</h3><p>${e((p.authors||[]).join(' · ')||'来源未提供')}</p>${p.authorsNote?`<p class="micro-note">${e(p.authorsNote)}</p>`:''}<h3>${e(p.summaryZh?'中文摘要（据来源整理）':p.abstractSource||'来源摘要')}</h3><p class="lit-detail-abstract">${e(p.summaryZh||p.abstract||'摘要待补充，请查阅原文。')}</p>${p.summaryZh&&p.abstract&&p.summaryZh!==p.abstract?`<details><summary>来源摘要 / 摘录</summary><p>${e(p.abstract)}</p></details>`:''}<h3>通讯作者与论文署名单位</h3>${ca.map(a=>`<div class="relation-item"><strong>${e(a.name)}</strong><p>${(a.affiliations||[]).map(e).join('<br>')||'单位待核实'}</p>${a.email?`<p>${e(a.email)}</p>`:''}${external(a.sourceUrl||p.url,'通讯身份与单位来源 ↗')}</div>`).join('')||'<p>当前来源未明确标注通讯身份；暂不构建此项关系。</p>'}<h3>文献来源</h3><p>${e(p.evidenceStatus||'RSS 候选，作者角色需核验')}</p><p>DOI：${e(p.doi||'未提供')}</p><div class="detail-actions">${external(p.url,'打开出版社原文 ↗','button btn btn-primary')}${(p.sourceUrls||[]).filter(url=>url!==p.url).map(url=>external(url,'其他来源 ↗','button btn btn-default')).join('')}</div><p class="micro-note">摘要仅用于筛选；阅读完整论文请访问出版社。文章归属不等于导师现任单位。</p>`,true);
  }
  function sources(){
    showDialog('文献来源与更新状态','官方期刊 RSS · 本机缓存',`<p>只收录以下 ${JOURNALS.length} 本期刊；“大子刊”采用明确名单，可按你的要求继续调整。</p><div class="tags">${JOURNALS.map(j=>`<span class="tag">${e(shortJournal(j))}</span>`).join('')}</div><p>进入本页时检查缓存，超过 6 小时自动更新；也可点“立即更新文献”。服务关闭期间不会持续抓取。更新仅访问固定官方地址，不发送你的简历或申请信息。</p><p>X-MOL 当前访问受限，作为手动补查入口；自动更新使用出版社 RSS。通讯作者未明确标注时保持待核实。</p><div class="table-wrap"><table class="table table-vcenter lit-source-table"><thead><tr><th>期刊 / RSS</th><th>状态</th><th>最近成功</th></tr></thead><tbody>${(data.sources||[]).map(s=>`<tr><td>${external(s.url,e(s.journal))}${s.error?`<small>${e(s.error)}</small>`:''}</td><td>${e(({ok:'成功',success:'成功',error:'失败',failed:'失败',stale:'失败 · 保留缓存',pending:'待更新',updating:'更新中'})[s.status]||s.status||'待更新')}<small>${Number(s.count)||0} 篇候选</small></td><td>${e(dateTime(s.lastSuccess))}</td></tr>`).join('')||'<tr><td colspan="3">当前仅加载人工核验库；实时接口不可用。</td></tr>'}</tbody></table></div><p class="micro-note">RSS 是近期目录，可能只包含标题或一部分摘要；没有新增匹配论文和来源获取失败会分别显示。未承诺完整覆盖，也不把网页更新时间作为论文发表日期。</p>`,true);
  }
  document.addEventListener('click',event=>{
    const t=event.target.closest('[data-lit-refresh],[data-lit-reset],[data-lit-view],[data-lit-save],[data-lit-detail],[data-lit-network],[data-lit-more],[data-lit-export],[data-action="lit-sources"]');if(!t)return;
    if(t.hasAttribute('data-lit-refresh')){load(true);return;}
    if(t.hasAttribute('data-lit-reset')){Object.assign(f,{query:'',journal:'',topic:'',days:'',evidence:'',onlySaved:false});limit=20;redraw();return;}
    if(t.dataset.litView){view=t.dataset.litView;redraw();return;}
    if(t.dataset.litSave){toggleSaved(t.dataset.litSave);redraw();return;}
    if(t.dataset.litDetail){const p=data.papers.find(x=>x.id===t.dataset.litDetail);if(p)detail(p);return;}
    if(t.dataset.litNetwork){graphId=t.dataset.litNetwork;view='network';redraw();return;}
    if(t.hasAttribute('data-lit-more')){limit+=20;redraw();return;}
    if(t.hasAttribute('data-lit-export')){download(`Research-literature-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify({research:getResearch(),exportedAt:new Date().toISOString(),filters:f,papers:list()},null,2),'application/json');toast('已导出筛选文献及作者机构证据。');return;}
    if(t.dataset.action==='lit-sources')sources();
  });
  document.addEventListener('change',event=>{const t=event.target;if(t.dataset.litFilter){f[t.dataset.litFilter]=t.value;limit=20;redraw();}if(t.hasAttribute('data-lit-saved')){f.onlySaved=t.checked;redraw();}if(t.hasAttribute('data-lit-graph')){graphId=t.value;redraw();}});
  document.addEventListener('input',event=>{const t=event.target;if(!t.hasAttribute('data-lit-query'))return;const start=t.selectionStart;f.query=t.value;limit=20;redraw();const next=document.querySelector('#lit-query');next?.focus();next?.setSelectionRange(start,start);});
  return {render};
}
