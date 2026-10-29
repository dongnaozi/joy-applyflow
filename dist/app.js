import { seedMentors, rankings } from './mentor-data.js';
import { extractResume, analyzeProfile, matchMentor } from './profile.js';
import { createLiterature } from './literature.js';
import { defaultResearch, normalizeResearch, researchView, filterMentorPapers } from './research.js';
import { defaultApplication, validateApplication, validateMentorTasks, applicationProgress, mentorProgress, APPLICATION_STEPS, renderApplication } from './application.js';

const $ = s => document.querySelector(s);
const e = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const safeUrl = value => { try { const url = new URL(value); return ['https:','http:'].includes(url.protocol) ? e(url.href) : '#'; } catch { return '#'; } };
const external = (url, label, cls = '') => `<a class="${cls}" href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const paths = {
  grid:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  people:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  network:'M12 10V7 M8 16l-3 2 M16 16l3 2 M15 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M7 20a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M23 20a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  paper:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M8 13h8 M8 17h6',
  school:'M2 10l10-7 10 7 M4 10h16 M5 10v10 M10 10v10 M15 10v10 M20 10v10 M2 21h20',
  bookmark:'M6 3h12v19l-6-4-6 4z',
  profile:'M20 21v-2a7 7 0 0 0-14 0v2 M17 7a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
  search:'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  download:'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5',
  upload:'M12 16V3 M7 8l5-5 5 5 M4 16v5h16v-5',
  arrow:'M4 12h16 M14 6l6 6-6 6',
  plus:'M12 5v14 M5 12h14',
  close:'M6 6l12 12 M18 6L6 18',
  check:'M5 12l4 4L19 6',
  globe:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M3 12h18 M12 3c-5 5-5 13 0 18 M12 3c5 5 5 13 0 18',
  settings:'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8 M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z',
  mail:'M3 5h18v14H3z M3 5l9 8 9-8',
  link:'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2 M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2',
  spark:'M12 3l2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7z',
  chart:'M4 20h17 M7 16v-5 M12 16V5 M17 16V8',
  clock:'M12 8v5l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
};
function icon(name){ return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.paper}"/></svg>`; }
const routes = [ ['overview','grid','工作台'],['profile','profile','我的背景'],['mentors','people','导师'],['schools','school','院校 · QS'],['network','network','关系网'],['papers','paper','导师论文'],['literature','search','文献追踪'],['shortlist','bookmark','申请清单'] ];
const europeanCountries=new Set(['英国','荷兰','丹麦','德国','法国','西班牙','瑞士','比利时','瑞典','挪威','芬兰','意大利','奥地利','爱尔兰','葡萄牙']);
const regions=[['all','全部'],['美国','美国'],['加拿大','加拿大'],['澳大利亚','澳大利亚'],['欧洲','欧洲']];
const inRegion=(m,region)=>!region||region==='all'||(region==='欧洲'?europeanCountries.has(m.country):m.country===region);
const stages = ['待了解','准备联系','已联系','已申请'];
const STORAGE_KEY='catalyst-atlas-v1';
const LOCAL_MODELS=['deepseek-r1:1.5b','deepseek-r1:7b'];
const defaultState=()=>({version:1,ai:{model:LOCAL_MODELS[0]},profile:{name:'',degree:'',school:'',advisor:'',intake:'2027 Fall',background:'',cvText:'',fileName:''},research:defaultResearch(),application:defaultApplication(),saved:{},customMentors:[],paperSaved:[]});
let state=defaultState();
let storageError=false;
let hasModelChoice=false;
try{const raw=localStorage.getItem(STORAGE_KEY);if(raw){const parsed=JSON.parse(raw);state=validateState(parsed);hasModelChoice=LOCAL_MODELS.includes(parsed.ai?.model);}}catch{storageError=true;}
let mentors=[...seedMentors,...state.customMentors];
let query='',country='',topic='',sort='default',scope='all',year='',paperJournal='',paperMentor='',paperOnly=false;
let selectedGraph='jaramillo',relationType='all';
const compare=new Set();
let route=routeFromHash();
let analysis=getAnalysis();
let toastTimer;
let resumeBusy=false;
let resumeDraft=null;

function validateState(raw){
  if(!raw || raw.version!==1 || typeof raw!=='object')throw Error('备份格式不受支持');
  const base=defaultState();
  if(LOCAL_MODELS.includes(raw.ai?.model))base.ai.model=raw.ai.model;
  base.research=normalizeResearch(raw.research);
  base.application=validateApplication(raw.application);
  if(raw.profile && typeof raw.profile==='object')for(const key of Object.keys(base.profile))base.profile[key]=String(raw.profile[key] ?? base.profile[key]).slice(0,key==='cvText'?1000000:20000);
  if(Array.isArray(raw.customMentors))base.customMentors=raw.customMentors.slice(0,500).map(validateMentor);
  const validIds=new Set([...seedMentors,...base.customMentors].map(m=>m.id));
  if(raw.saved && typeof raw.saved==='object')for(const [id,item] of Object.entries(raw.saved)){if(validIds.has(id)&&item&&typeof item==='object')base.saved[id]={stage:stages.includes(item.stage)?item.stage:stages[0],note:String(item.note||'').slice(0,5000),date:/^\d{4}-\d{2}-\d{2}$/.test(item.date)?item.date:'',tasks:validateMentorTasks(item.tasks)};}
  if(Array.isArray(raw.paperSaved))base.paperSaved=raw.paperSaved.filter(x=>typeof x==='string'&&x.length<1000).slice(0,1000);
  return base;
}
function validateMentor(raw){
  if(!raw||typeof raw!=='object'||!raw.name||!raw.school||!/^custom-[a-z0-9-]+$/.test(raw.id||''))throw Error('自定义导师数据不完整');
  const item={id:raw.id,verifiedAt:'待核实',title:'待核实',city:'',emailSource:'',papers:[],relations:[],team:{chineseStudents:null,chineseFaculty:null,note:'待核实'},custom:true};
  for(const key of ['name','school','schoolShort','country','summary','url','email','title','emailSource','researchSource'])item[key]=String(raw[key]||item[key]||'').slice(0,3000);
  item.schoolShort ||= item.school;
  item.country ||= '待核实';
  item.initials=item.name.split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase();
  item.topics=Array.isArray(raw.topics)?raw.topics.filter(x=>typeof x==='string').map(x=>x.slice(0,100)).slice(0,20):[];
  item.keywords=[...item.topics];
  if(['codex','ollama','metadata'].includes(raw.importMethod)){
    item.importMethod=raw.importMethod;item.verifiedAt='官网识别 · 待核对';
    if(LOCAL_MODELS.includes(raw.importModel))item.importModel=raw.importModel;
    item.importSources=Array.isArray(raw.importSources)?raw.importSources.filter(x=>typeof x==='string'&&/^https?:\/\//i.test(x)).slice(0,5):[];
    item.importEvidence=Array.isArray(raw.importEvidence)?raw.importEvidence.slice(0,12).filter(x=>x&&typeof x.field==='string').map(x=>({field:String(x.field).slice(0,40),sourceUrl:String(x.sourceUrl||'').slice(0,2000),excerpt:String(x.excerpt||'').slice(0,800)})):[];
  }
  return item;
}
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));storageError=false;updateStorageStatus();return true;}catch{storageError=true;updateStorageStatus();toast('未保存：浏览器存储不可用或空间不足，请立即导出备份。',true);return false;}}
function updateStorageStatus(){const status=$('.local-status');status.innerHTML='<span class="status-dot"></span>'+(storageError?'未保存 · 请导出':'本地保存');status.classList.toggle('error',storageError);}
function getAnalysis(){return analyzeProfile([state.profile.background,state.profile.cvText].join('\n'));}
function routeFromHash(){const r=location.hash.slice(1);return routes.some(x=>x[0]===r)?r:'overview';}
function go(next){if(route===next){render();window.scrollTo(0,0);}else location.hash=next;}
function toast(message,error=false){clearTimeout(toastTimer);const el=$('#toast');el.textContent=message;el.className='visible';el.style.background=error?'#834536':'';toastTimer=setTimeout(()=>el.classList.remove('visible'),4500);}
function qsFor(m){return m.qs || rankings.find(r=>r.school===m.school);}
function rankNumber(m){return Number(String(qsFor(m)?.rank||'').replace(/[^0-9]/g,''))||99999;}
function rankLabel(m){const q=qsFor(m);return q?`QS ${q.year} · #${q.rank}`:'QS 待核实';}
function currentResearch(){return researchView(mentors,state.research);}
function papers(){return currentResearch().papers;}
function resetDiscovery(){query='';country='';topic='';sort='default';scope='all';year='';paperJournal='';paperMentor='';paperOnly=false;selectedGraph='';relationType='all';compare.clear();$('#global-search').value='';}
function researchContext(){return `<p class="research-filter-note">当前方向：<strong>${e(state.research.name)}</strong> · 导师、院校、关系与论文同步筛选。<button data-action="research-settings">更改方向</button></p>`;}
function filteredMentors({overview=false}={}){
  let list=currentResearch().mentors.filter(m=>overview||((!query||[m.name,m.school,m.schoolShort,m.country,m.summary,...m.topics,...m.keywords].join(' ').toLowerCase().includes(query.toLowerCase()))&&inRegion(m,country)&&(!topic||m.topics.includes(topic))));
  if(overview)list=list.filter(m=>inRegion(m,scope));
  if(sort==='qs')list.sort((a,b)=>rankNumber(a)-rankNumber(b));
  else if(analysis.topics.length || sort==='match')list.sort((a,b)=>(matchMentor(analysis,b).score||0)-(matchMentor(analysis,a).score||0));
  if(overview&&scope==='all'&&!analysis.topics.length){const groups=regions.slice(1).map(([id])=>list.filter(m=>inRegion(m,id)));const spread=[];while(groups.some(g=>g.length)){for(const group of groups)if(group.length)spread.push(group.shift());}list=[...spread,...list.filter(m=>!spread.includes(m))];}
  return overview?list.slice(0,4):list;
}
function options(values,selected,allLabel){return `<option value="">${e(allLabel)}</option>`+values.map(x=>`<option value="${e(x)}" ${selected===String(x)?'selected':''}>${e(x)}</option>`).join('');}
function heading(kicker,title,desc,actions=''){return `<div class="page-heading page-header"><div><div class="eyebrow page-pretitle">${kicker}</div><h1>${title}</h1><p>${desc}</p></div><div class="heading-actions">${actions}</div></div>`;}
function button(action,label,ico='',cls='',extra=''){return `<button class="button btn ${cls.includes('primary')?'btn-primary':'btn-default'} ${cls}" data-action="${action}" ${extra}>${ico?icon(ico):''}${label}</button>`;}
function empty(title,desc,cta=''){return `<div class="empty"><h3>${title}</h3><p>${desc}</p>${cta}</div>`;}
function renderNav(){
  updateStorageStatus();
  $('#ai-model-label').textContent=state.ai.model.endsWith(':7b')?'7B':'1.5B';
  $('.model-launcher').title=`Ollama · ${state.ai.model} · 点击选择模型`;
  const research=state.research,prepProgress=applicationProgress(state.application.tasks);
  $('#research-name').textContent=research.name;$('#research-short').textContent=research.shortName;
  $('#research-chip').title=`${research.name} · 点击定制研究方向`;
  $('#workspace-brand-subtitle').textContent=(research.shortName?research.shortName+' · ':'')+'CATALYST ATLAS';$('#workspace-topic').textContent=research.shortName||research.name;document.title=`${research.shortName||research.name} 博士申请工作台 · 本机版`;
  $('#nav').innerHTML=routes.map(([id,ico,label],i)=>`${i===2||id==='shortlist'?'<div class="nav-separator" aria-hidden="true"></div>':''}<button class="nav-button nav-link ${route===id?'active':''}" data-go="${id}" ${route===id?'aria-current="page"':''}>${icon(ico)}${label}${id==='shortlist'?`<span class="nav-count" title="申请准备完成 ${prepProgress.done}/${prepProgress.total} 项">${prepProgress.done}/${prepProgress.total}</span>`:''}</button>`).join('');
  $('#breadcrumb').textContent=routes.find(x=>x[0]===route)[2];
  $('#intake-label').textContent=`${state.profile.intake||'申请季待定'} · 个人工作台`;
}
function render(){
  renderNav();
  const renderers={overview:renderOverview,mentors:renderMentors,network:renderNetwork,papers:renderPapers,literature:()=>literature.render(),schools:renderSchools,shortlist:renderShortlist,profile:renderProfile};
  $('#main').innerHTML=renderers[route]();
  document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
  $('#main').querySelectorAll('input:not([type=checkbox]):not([type=file]),textarea').forEach(el=>el.classList.add('form-control'));
  $('#main').querySelectorAll('select').forEach(el=>el.classList.add('form-select'));
  renderCompareBar();
}
function mentorCard(m,i){
  const saved=!!state.saved[m.id],match=matchMentor(analysis,m);
  return `<article class="mentor-card card"><div class="mentor-top"><span class="avatar tone-${i%4}">${e(m.initials)}</span><div><button class="mentor-name" data-detail="${e(m.id)}">${e(m.name)}</button><div class="school-name">${e(m.schoolShort)}</div></div><button class="icon-button bookmark ${saved?'saved':''}" data-save="${e(m.id)}" aria-label="${saved?'移出':'加入'}申请清单：${e(m.name)}" aria-pressed="${saved}">${icon('bookmark')}</button></div><div class="mentor-meta">${icon('globe').replace('width="20" height="20"','width="11" height="11"')} ${e(m.country)}<span class="qs">${e(rankLabel(m))}</span></div><div class="tags">${m.topics.slice(0,3).map((t,i)=>`<span class="tag ${i===1?'blue':i===2?'gold':''}">${e(t)}</span>`).join('')}</div><p class="card-summary">${e(m.summary)}</p><div class="mentor-foot"><span class="${match.score!==null?'match':''}">${match.score!==null?`${match.score}% 方向覆盖`:`${m.papers.length} 篇精选论文`}</span><label class="compare-check"><input type="checkbox" data-compare="${e(m.id)}" ${compare.has(m.id)?'checked':''}>对比</label><button class="text-button" data-detail="${e(m.id)}">查看档案 ${icon('arrow')}</button></div></article>`;
}
function renderOverview(){
  const current=currentResearch(),ps=current.papers,schools=new Set(current.mentors.map(m=>m.school)),saved=mentors.filter(m=>state.saved[m.id]);
  const name=state.profile.name?`${e(state.profile.name)}的工作台`:'申请工作台';
  const shown=filteredMentors({overview:true});
  const total=current.mentors.filter(m=>inRegion(m,scope)).length;
  const metrics=[
    [current.mentors.length,'当前方向导师','位','mentors','people','按课题与地区筛选'],
    [schools.size,'目标院校','所','schools','school','查看院校与 QS'],
    [ps.length,'导师近期论文','篇','papers','paper','阅读成果与作者证据'],
    [saved.length,'申请清单','位','shortlist','bookmark','跟进联系与申请']
  ];
  const upcoming=saved.filter(m=>state.saved[m.id].date).sort((a,b)=>state.saved[a.id].date.localeCompare(state.saved[b.id].date)).slice(0,2);
  const profileReady=!!(state.profile.background||state.profile.cvText);
  return heading(e(state.research.shortName||state.research.name)+' · '+e(state.profile.intake||'博士申请'),name,'找导师、读论文、推进申请。',button('add-mentor','添加导师','plus')+button('profile',profileReady?'更新背景':'完善背景','profile','primary'))+
  `<div class="dash-metrics">${metrics.map(([n,label,unit,dest,ico,hint])=>`<a class="dash-metric card" href="#${dest}" data-go="${dest}" aria-label="${label} ${n} ${unit}，${hint}"><div class="dash-metric-label">${label}${icon(ico)}</div><div class="dash-metric-value">${n}<small>${unit}</small></div><div class="dash-metric-link">${hint}${icon('arrow')}</div></a>`).join('')}</div>
  <div class="dash-board"><section class="dash-panel card"><div class="dash-panel-head"><div><h2>${analysis.topics.length?'与你方向相近':'探索导师'}</h2><p>${e(state.research.name)} · 按地区探索</p></div><a class="text-button" href="#mentors" data-go="mentors" data-country="${scope==='all'?'':e(scope)}">导师库 ${icon('arrow')}</a></div><div class="dash-regions" role="group" aria-label="导师地区范围">${regions.map(([id,label])=>`<button class="dash-region ${scope===id?'active':''}" data-scope="${id}" aria-pressed="${scope===id}">${label}<small>${current.mentors.filter(m=>inRegion(m,id)).length}</small></button>`).join('')}</div><div class="dash-mentor-list">${shown.map((m,i)=>`<article class="dash-mentor-row"><span class="avatar tone-${i%4}">${e(m.initials)}</span><div class="dash-mentor-copy"><div class="dash-mentor-name"><button data-detail="${e(m.id)}">${e(m.name)}</button><span>${e(m.country)}</span></div><div class="dash-mentor-school" title="${e(m.summary)}">${e(m.schoolShort||m.school)}</div><div class="tags">${m.topics.slice(0,2).map(t=>`<span class="tag">${e(t)}</span>`).join('')}</div></div><div class="dash-mentor-actions"><button class="icon-button ${state.saved[m.id]?'saved':''}" data-save="${e(m.id)}" aria-label="${state.saved[m.id]?'移出':'加入'}申请清单：${e(m.name)}" aria-pressed="${!!state.saved[m.id]}">${icon('bookmark')}</button><button class="text-button" data-detail="${e(m.id)}">档案 ${icon('arrow')}</button></div></article>`).join('')||empty('这个地区还没有导师','粘贴导师官网链接，补充你的探索清单。',button('add-mentor','从官网添加','plus'))}</div><a class="dash-panel-footer" href="#mentors" data-go="mentors" data-country="${scope==='all'?'':e(scope)}">查看${scope==='all'?'全部':e(scope)} ${total} 位导师 ${icon('arrow')}</a></section>
  <aside class="dash-panel dash-next card"><div class="dash-panel-head"><div><h2>下一步申请</h2><p>把关注变成具体进展</p></div><span class="dash-intake">${e(state.profile.intake||'申请季待定')}</span></div><div class="dash-stage-counts">${stages.map(stage=>`<a href="#shortlist" data-go="shortlist"><strong>${saved.filter(m=>state.saved[m.id].stage===stage).length}</strong><span>${stage}</span></a>`).join('')}</div>${upcoming.length?`<div class="dash-followups"><h3>已安排的跟进</h3>${upcoming.map(m=>`<button data-go="shortlist"><span>${e(m.name)}<small>${e(state.saved[m.id].stage)}</small></span><time>${e(state.saved[m.id].date)}</time></button>`).join('')}</div>`:`<div class="dash-current"><span class="dash-current-icon">${icon('bookmark')}</span><strong>${saved.length?'你的申请清单已建立':'先留意一位适合的导师'}</strong><p>${saved.length?'在清单中记录联系进度、跟进日期和问题。':'点击导师旁的书签，放入清单后再安排联系。'}</p></div>`}<a class="button btn btn-primary dash-open-list" href="#shortlist" data-go="shortlist">打开申请清单 ${icon('arrow')}</a><div class="dash-tasks"><button data-go="profile">${icon('profile')}<span><strong>${profileReady?'核对研究方向':'补充背景与简历'}</strong><small>${profileReady?`${analysis.topics.length} 个已识别方向，继续检查匹配`:'让导师筛选从你的研究经历出发'}</small></span>${icon('arrow')}</button><button data-go="literature">${icon('paper')}<span><strong>读最新文献</strong><small>Nature · Science · Angew · JACS</small></span>${icon('arrow')}</button><button data-go="network">${icon('network')}<span><strong>了解学术联系</strong><small>查看有来源的师承与合作</small></span>${icon('arrow')}</button></div></aside></div>
  <section class="dash-panel dash-papers card"><div class="dash-panel-head"><div><h2>导师近期论文</h2><p>精选成果 · 点击标题阅读原文</p></div><a class="text-button" href="#papers" data-go="papers">全部论文 ${icon('arrow')}</a></div>${ps.slice(0,3).map(p=>`<div class="dash-paper-row"><div><span class="journal-badge">${e(p.journal)}</span><small>${e(p.year)}</small></div><div>${external(p.url,e(p.title),'dash-paper-title')}<p>${p.mentors.map(m=>e(m.name)).join(' · ')} · ${e(p.role||'作者角色待核实')}</p></div><button class="icon-button ${state.paperSaved.includes(p.key)?'saved':''}" data-paper="${e(p.key)}" aria-label="${state.paperSaved.includes(p.key)?'取消收藏':'收藏'}论文：${e(p.title)}" aria-pressed="${state.paperSaved.includes(p.key)}">${icon('bookmark')}</button></div>`).join('')}</section><p class="dash-footnote">公开资料核验于 2026-10-28–29 · 院校、论文和关系均保留来源；未确认的招生与成员信息显示待核实。</p>`;
}
function filters(){const scoped=currentResearch().mentors;return `<div class="filters"><input id="mentor-query" data-filter="query" aria-label="筛选导师" value="${e(query)}" placeholder="搜索姓名、院校或课题关键词"><select data-filter="country" aria-label="国家或地区">${options([...new Set(scoped.map(m=>m.country)),'欧洲'],country,'全部国家 / 地区')}</select><select data-filter="topic" aria-label="研究细分方向">${options([...new Set(scoped.flatMap(m=>m.topics))],topic,'全部研究方向')}</select><select data-filter="sort" aria-label="排序方式"><option value="default" ${sort==='default'?'selected':''}>${analysis.topics.length?'按方向覆盖排序':'默认排序'}</option><option value="qs" ${sort==='qs'?'selected':''}>按 QS 2026 排序</option><option value="match" ${sort==='match'?'selected':''}>按方向覆盖排序</option></select><button class="text-button" data-action="reset-filters">重置</button></div>`;}
function renderMentors(){const list=filteredMentors();return heading('DISCOVER YOUR PEOPLE','发现导师','从细分课题、学校与研究证据，逐步缩小你的选择。',button('add-mentor','添加导师','plus')+button('profile','分析我的研究方向','spark','primary'))+researchContext()+filters()+`<div class="results-heading"><div class="filter-result">找到 ${list.length} 位导师${analysis.topics.length?' · 匹配为研究方向的关键词覆盖率':''}</div><span class="header-tag">种子库 · 可持续补充</span></div>`+(list.length?`<div class="mentor-grid full-grid">${list.map(mentorCard).join('')}</div>`:empty('暂时没有符合条件的导师','调整筛选或研究关键词，也可以从官网添加这个方向的导师。',button('reset-filters','清除筛选','search')));}
function paperTable(list){return list.length?`<div class="table-wrap card"><table class="table table-vcenter"><thead><tr><th>论文 / 研究主题</th><th>期刊</th><th>年份</th><th>相关导师</th><th>阅读</th></tr></thead><tbody>${list.map(p=>`<tr><td>${external(p.url,e(p.title),'paper-title')}<div class="paper-sub">${e(p.role||'作者角色待核实')}${p.dateNote?' · '+e(p.dateNote):''}</div></td><td><span class="journal-badge">${e(p.journal)}</span></td><td class="paper-year">${e(p.year)}</td><td>${p.mentors.map(m=>`<button class="text-button" data-detail="${e(m.id)}">${e(m.name)}</button>`).join('<br>')}</td><td><button class="icon-button ${state.paperSaved.includes(p.key)?'saved':''}" data-paper="${e(p.key)}" aria-label="${state.paperSaved.includes(p.key)?'取消收藏':'收藏'}论文：${e(p.title)}" aria-pressed="${state.paperSaved.includes(p.key)}">${icon(state.paperSaved.includes(p.key)?'check':'bookmark')}</button></td></tr>`).join('')}</tbody></table></div>`:empty('这里还没有论文','调整关键词或年份后再试一次。');}
function renderPapers(){
  const all=papers(),list=filterMentorPapers(all,{query,journal:paperJournal,year,mentor:paperMentor,savedOnly:paperOnly,saved:state.paperSaved});
  const authors=[...new Map(all.flatMap(p=>p.mentors).map(m=>[m.id,m])).values()].sort((a,b)=>a.name.localeCompare(b.name));
  return heading('READ WITH A PURPOSE','导师论文','按期刊、年份和导师组合筛选，阅读与你方向相关的成果。',button('export','导出工作台','download'))+researchContext()+`<div class="section-note">这里是精选论文样本，不能用于比较完整发表量。通讯作者成果需原始角色证据；合作作者、共同通讯与待核实角色分别保留。</div><div class="filters paper-filters"><label class="paper-search" for="paper-query">搜索论文<input id="paper-query" data-filter="query" value="${e(query)}" placeholder="搜索标题、期刊或导师"></label><label for="paper-journal">期刊<select id="paper-journal" data-filter="paperJournal">${options([...new Set(all.map(p=>p.journal))].sort(),paperJournal,'全部期刊')}</select></label><label for="paper-year">年份<select id="paper-year" data-filter="year">${options([...new Set(all.map(p=>String(p.year)))].sort().reverse(),year,'全部年份')}</select></label><label for="paper-mentor">相关导师<select id="paper-mentor" data-filter="paperMentor"><option value="">全部导师</option>${authors.map(m=>`<option value="${e(m.id)}" ${paperMentor===m.id?'selected':''}>${e(m.name)}</option>`).join('')}</select></label><div class="paper-filter-actions"><button class="tab ${paperOnly?'active':''}" data-action="paper-only" aria-pressed="${paperOnly}">仅看已收藏 (${all.filter(p=>state.paperSaved.includes(p.key)).length})</button><button class="text-button" data-action="reset-filters">重置筛选</button></div></div><p class="filter-result" role="status">${list.length} / ${all.length} 篇论文 · 点击标题访问原文</p>${paperTable(list)}`;
}
function renderSchools(){const scoped=currentResearch().mentors,schools=[...new Map(scoped.map(m=>[m.school,m])).values()].sort((a,b)=>rankNumber(a)-rankNumber(b));if(!schools.length)return heading('LOOK BEYOND THE RANKING','院校与排名','把学校、导师方向与公开证据放在一起看。')+researchContext()+empty('当前方向暂无院校','从官网添加相关导师后，这里会同步显示所属院校。',button('add-mentor','添加导师','plus'));return heading('LOOK BEYOND THE RANKING','院校与排名','把学校、导师方向与公开证据放在一起看。')+researchContext()+`<div class="section-note">统一展示 QS 2026 世界大学综合排名，并非当前研究方向的学科排名；排名不代表课题组质量、招生名额或申请难度。并列排名保留“=”标记。</div><div class="table-wrap card"><table class="table table-vcenter"><thead><tr><th>学校</th><th>国家 / 地区</th><th>QS 2026</th><th>已收录导师</th><th>信息来源</th></tr></thead><tbody>${schools.map(m=>{const qs=qsFor(m);return `<tr><td class="school-cell"><strong>${e(qs?.schoolShort||m.schoolShort)}</strong><small>${e(m.school)}</small></td><td>${e(m.country)}</td><td><span class="rank">${qs?'#'+e(qs.rank):'—'}</span></td><td>${scoped.filter(x=>x.school===m.school).map(x=>`<button class="text-button" data-detail="${e(x.id)}">${e(x.name)}</button>`).join('<br>')}</td><td>${qs?external(qs.source,'QS 官方来源 ↗'):e('待核实')}</td></tr>`;}).join('')}</tbody></table></div><p class="micro-note">排名来源为 QS 官方学校档案的历史年度数据；导师、职称与课题分别依据大学或课题组页面核验。</p>`;}
function allRelations(){return currentResearch().mentors.flatMap(m=>(m.relations||[]).map(r=>({...r,from:m})));}
function renderNetwork(){
  const scoped=currentResearch().mentors;
  if(!scoped.length)return heading('CONNECT THE RESEARCH','学术关系','沿着有证据的师承与合作，理解课题组之间的联系。')+researchContext()+empty('当前方向暂无导师关系','先添加相关导师，再依据官方简历和论文补充关系。',button('add-mentor','添加导师','plus'));
  const selected=scoped.find(m=>m.id===selectedGraph)||scoped.find(m=>m.relations.length)||scoped[0];
  const relations=(selected.relations||[]).filter(r=>relationType==='all'||(relationType==='supervisor'?r.type.includes('导师'):r.type==='合作'));
  const cx=350,cy=235,radius=150;
  const nodes=relations.map((r,i)=>{const angle=-Math.PI/2+i*2*Math.PI/relations.length;return {...r,x:cx+Math.cos(angle)*radius,y:cy+Math.sin(angle)*radius};});
  return heading('CONNECT THE RESEARCH','学术关系','沿着有证据的师承与合作，理解课题组之间的联系。')+researchContext()+`<div class="filters"><label for="graph-mentor" class="muted">关系聚焦</label><select id="graph-mentor" data-filter="graph" aria-label="选择中心导师">${scoped.map(m=>`<option value="${e(m.id)}" ${m.id===selected.id?'selected':''}>${e(m.name)}</option>`).join('')}</select><select data-filter="relationType" aria-label="关系类型"><option value="all" ${relationType==='all'?'selected':''}>全部关系</option><option value="supervisor" ${relationType==='supervisor'?'selected':''}>博士 / 博后师承</option><option value="collaboration" ${relationType==='collaboration'?'selected':''}>论文合作</option></select><span class="filter-result" style="margin:0">当前方向 ${allRelations().length} 条有来源的关系记录</span></div><div class="network-layout"><div class="network-canvas"><svg viewBox="0 0 700 480" role="img" aria-label="${e(selected.name)} 的学术关系图，详细关系与证据列于右侧"><defs><radialGradient id="node-gradient"><stop stop-color="#fcfdf7"/><stop offset="1" stop-color="#e8efdc"/></radialGradient></defs>${nodes.map(n=>`<path d="M${cx} ${cy}L${n.x} ${n.y}" stroke="${n.type==='合作'?'#aabb95':'#bc9c70'}" stroke-width="1.5" ${n.type==='合作'?'':'stroke-dasharray="4 5"'}/><text x="${(cx+n.x)/2+7}" y="${(cy+n.y)/2-7}" fill="#879473" font-size="9">${e(n.type)}</text>`).join('')}<g class="network-node" role="button" tabindex="0" data-detail="${e(selected.id)}" aria-label="查看 ${e(selected.name)}"><circle cx="${cx}" cy="${cy}" r="45" fill="#28533b" stroke="#d4e2ba" stroke-width="7"/><text x="${cx}" y="${cy+6}" text-anchor="middle" style="fill:#f0f7de;font:25px Arial,sans-serif">${e(selected.initials)}</text><text x="${cx}" y="${cy+66}" text-anchor="middle" style="font-weight:600;font-size:13px">${e(selected.name)}</text><text x="${cx}" y="${cy+84}" text-anchor="middle" style="font-size:9px;fill:#839074">${e(selected.schoolShort)}</text></g>${nodes.map(n=>{const target=mentors.find(m=>m.name===n.name || m.name.replace(/\s+/g,'')===n.name.replace(/\s+/g,''));return `<g ${target?`class="network-node" role="button" tabindex="0" data-detail="${e(target.id)}" aria-label="查看 ${e(n.name)}"`:''}><circle cx="${n.x}" cy="${n.y}" r="29" fill="url(#node-gradient)" stroke="#bccaab"/><text x="${n.x}" y="${n.y+5}" text-anchor="middle" style="font:16px Arial,sans-serif">${e(n.name.split(' ').map(x=>x[0]).slice(0,2).join(''))}</text><text x="${n.x}" y="${n.y+46}" text-anchor="middle">${e(n.name)}</text></g>`;}).join('')}${!nodes.length?`<text x="350" y="370" text-anchor="middle" fill="#7a886e" font-size="12">当前类型暂无已核实关系</text>`:''}</svg><div class="network-legend"><span><i></i>论文合作</span><span><i class="dashed"></i>博士 / 博后师承</span></div></div><aside class="side-panel card"><h2>关系背后的证据</h2><p class="panel-label">${e(selected.name)} · ${relations.length} 条记录</p><div class="relations-list">${relations.map(r=>`<article class="relation-item"><span class="badge">${e(r.type)}</span><p><strong>${e(selected.name)} ${r.type==='合作'?'↔':'←'} ${e(r.name)}</strong></p><p>${e(r.evidence)}</p>${external(r.source,'查看原始证据 ↗')}</article>`).join('')||'<p class="micro-note">暂无记录，后续可依据官方简历补充。</p>'}</div></aside></div><p class="micro-note">实线只表示论文合作；共同作者不自动视为师生。箭头“←”表示中心导师曾受右侧学者指导。尚未建立你与现任导师的关系时，不推断推荐或引荐路径。</p>`;
}
function renderShortlist(){
  const savedMentors=mentors.filter(m=>state.saved[m.id]);
  return heading('MY APPLICATION PLAN','我的申请清单','勾选完成事项，按准备进度和每位导师的任务量推进申请。',button('export-application','导出勾选清单','download')+`<button class="button btn btn-primary" data-go="mentors">${icon('plus')}添加目标导师</button>`)+renderApplication({application:state.application,savedMentors,saved:state.saved,e,icon,button,external,rankLabel,stages});
}
function renderProfile(){const p={...state.profile,...(resumeDraft||{})};return heading('YOUR RESEARCH IDENTITY','我的学术背景','让研究经历成为匹配的起点，逐步建立属于你的申请画像。')+researchSummary()+`<div class="profile-layout"><form id="profile-form"><section class="form-panel card"><h2>先介绍一下你的研究</h2><p>填写你已有的背景即可，之后随时可以修改。</p><div class="form-grid"><div class="form-field"><label for="profile-name">你的称呼</label><input id="profile-name" name="name" value="${e(p.name)}" placeholder="如何称呼你" maxlength="80"></div><div class="form-field"><label for="profile-degree">当前学历 / 专业</label><input id="profile-degree" name="degree" value="${e(p.degree)}" placeholder="例如：化学工程 · 硕士" maxlength="200"></div><div class="form-field"><label for="profile-school">当前学校</label><input id="profile-school" name="school" value="${e(p.school)}" placeholder="填写你的学校" maxlength="200"></div><div class="form-field"><label for="profile-advisor">现任导师</label><input id="profile-advisor" name="advisor" value="${e(p.advisor)}" placeholder="姓名 / 课题组主页" maxlength="500"></div><div class="form-field wide"><label for="profile-intake">计划申请季</label><input id="profile-intake" name="intake" value="${e(p.intake)}" placeholder="例如：2027 Fall" maxlength="80"></div><div class="form-field wide"><label for="profile-background">研究背景与感兴趣的方向</label><textarea id="profile-background" name="background" placeholder="例如：铜基催化剂的 CO₂ 电还原，研究多碳产物选择性；熟悉流动池、原位 Raman 与气相色谱。" maxlength="20000">${e(p.background)}</textarea></div></div></section><section class="form-panel card"><h2>让简历补充更多细节</h2><p>支持文字版 PDF、DOCX、TXT / MD，最大 10 MB；扫描 PDF 请先 OCR。</p><div class="upload-zone" id="drop-zone"><span class="upload-icon">${icon('upload')}</span><h3>选择简历，或将文件拖到这里</h3><p>文件在本机解析，原文件不会上传到服务器</p><span class="button">选择文件</span><input type="file" id="resume-file" accept=".pdf,.docx,.txt,.md" aria-label="选择简历文件"></div><div id="file-state" class="file-state" role="status">${p.fileName?`${e(p.fileName)} · 已提取 ${p.cvText.length.toLocaleString()} 个字符`:''}</div><div class="form-field" style="margin-top:20px"><label for="profile-cv">简历文字 · 可直接粘贴，也可修正文件提取结果</label><textarea id="profile-cv" name="cvText" style="min-height:170px" maxlength="1000000" placeholder="粘贴简历正文、研究经历、论文与实验技能…">${e(p.cvText)}</textarea></div><div class="form-bottom"><button class="button primary" type="submit">${icon('spark')}保存背景并分析方向</button><small>本机规则分析 · 你可以核对全部结果</small></div></section></form><aside><section class="side-panel card"><h2>你的研究方向画像</h2><p class="panel-label">根据已保存的背景与简历识别</p><div class="profile-insight"><p>${e(analysis.summary)}</p><div class="tags">${analysis.topics.map(t=>`<span class="tag">${e(t.label)}</span>`).join('')}</div></div>${analysis.skills.length?`<h3 style="font-size:11px;margin-top:20px">识别到的技能</h3><div class="tags" style="margin-top:10px">${analysis.skills.map(s=>`<span class="tag blue">${e(s)}</span>`).join('')}</div>`:''}${analysis.topics.length?'<button class="button primary" data-go="mentors">查看方向相近的导师 '+icon('arrow')+'</button>':''}</section><section class="side-panel card"><h2>匹配结果如何理解？</h2><p class="micro-note">方向覆盖率 = 导师公开资料命中的研究方向 ÷ 你被识别出的方向总数。</p><p class="micro-note">例如：你有 4 个方向，其中 3 个与导师重合，覆盖率为 75%。</p><p class="micro-note">成绩、科研贡献、推荐关系与招生名额尚未纳入评分；简历中的否定和意向表达也需你人工核对。</p></section><section class="side-panel card"><h2>由你掌握自己的资料</h2><p class="micro-note">简历文字、背景和清单保存在当前浏览器。更换设备前可导出备份。清除浏览器数据会删除本地记录。</p>${button('export','导出个人备份','download')}${button('delete-cv','清除已保存简历','close','quiet')}</section></aside></div>`;}
function renderCompareBar(){document.querySelector('.compare-bar')?.remove();if(!compare.size)return;const bar=document.createElement('div');bar.className='compare-bar';bar.innerHTML=`<span>已选 ${compare.size} / 3 位导师</span>${button('compare','并排对比','chart','white')}${button('clear-compare','清空','','quiet')}`;document.body.append(bar);}
function showDialog(title,subtitle,body,wide=false){const dialog=$('#modal');dialog.className=wide?'dialog-wide':'';$('#modal-content').innerHTML=`<div class="dialog-head"><div><h2>${title}</h2>${subtitle?`<p>${subtitle}</p>`:''}</div><button class="icon-button" data-action="close-modal" aria-label="关闭弹窗">${icon('close')}</button></div><div class="dialog-body">${body}</div>`;if(!dialog.open)dialog.showModal();}
function showDetail(id){
  const m=currentResearch().mentors.find(x=>x.id===id)||mentors.find(x=>x.id===id);if(!m)return;const q=qsFor(m),match=matchMentor(analysis,m);
  const corresponding=m.papers.filter(p=>/^(共同)?通讯作者/.test(p.role||'')).length;
  showDialog(e(m.name),`${e(m.school)} · ${e(m.country)}`,`<div class="detail-hero"><span class="avatar">${e(m.initials)}</span><div><div class="detail-title">${e(m.title)}</div><div class="tags" style="margin-top:9px">${m.topics.map(t=>`<span class="tag">${e(t)}</span>`).join('')}</div></div></div><p style="margin-top:18px">${e(m.summary)}</p><div class="detail-facts"><div>学校综合排名<strong>${q?external(q.source,e(rankLabel(m))):'待核实'}</strong></div><div>招生状态<strong>${e(m.recruitment||'待核实，请查官方页面')}</strong></div><div>资料核验日期<strong>${e(m.verifiedAt)}</strong></div></div><div class="detail-actions">${external(m.url,icon('globe')+'导师官方主页','button')}${m.publicationsUrl||m.researchSource?external(m.publicationsUrl||m.researchSource,icon('paper')+'研究与发表','button'):''}${button('detail-save',state.saved[id]?'已加入清单 · 点击移除':'加入申请清单','bookmark','primary',`data-id="${e(id)}"`)}</div>${match.score!==null?`<h3>与你的研究方向交集 · ${match.score}%</h3><div class="tags">${match.matches.map(t=>`<span class="tag">${e(t)}</span>`).join('')||'<span class="muted">暂未识别到重合方向</span>'}</div><p class="micro-note">${e(match.explanation)}</p>`:''}${m.importMethod?`<section class="mentor-import-evidence"><strong>${m.importMethod==='ollama'?'本地 AI 整理 · '+e(m.importModel||'Ollama'):m.importMethod==='codex'?'AI 整理的官网资料':'官网公开资料提取'}</strong><p>${(m.importSources||[]).map(url=>external(url,'原始来源 ↗')).join(' · ')}</p>${(m.importEvidence||[]).length?`<details><summary>查看识别依据</summary>${m.importEvidence.map(x=>`<p><strong>${e(({name:'姓名',school:'院校',country:'地区',title:'职称',email:'邮箱',topics:'方向',summary:'简介'})[x.field]||x.field)}：</strong>${e(x.excerpt)} ${external(x.sourceUrl||m.url,'来源 ↗')}</p>`).join('')}</details>`:''}</section>`:''}<h3>公开联系方式</h3><div class="contact-box"><div>${m.email?`<a href="mailto:${e(m.email)}">${e(m.email)}</a>`:'暂无已核实邮箱'}${m.emailSource?`<div>${external(m.emailSource,'邮箱来源 ↗')}</div>`:''}</div>${m.email?button('copy-email','复制邮箱','mail','',`data-id="${e(id)}"`):''}</div><h3>近期精选论文 <span class="badge">${m.papers.length} 篇样本 · ${corresponding} 篇有通讯作者证据</span></h3>${m.papers.map(p=>`<div class="detail-paper">${external(p.url,e(p.title)+' ↗')}<small>${e(p.journal)} · ${p.year} · ${e(p.role||'角色待核实')}${p.dateNote?' · '+e(p.dateNote):''}</small>${(p.roleSource||p.source)?`<div>${external(p.roleSource||p.source,'查看论文与作者角色来源 ↗')}</div>`:''}</div>`).join('')||'<p>尚未补充论文样本。</p>'}<p class="micro-note">“有通讯作者证据”包含共同通讯；此处不将其视为独立完成的研究或完整发表统计。</p><h3>课题组成员与支持环境</h3><div class="detail-facts"><div>中国学生数量<strong>${m.team?.chineseStudents??'待核实'}</strong></div><div>中国教师数量与职称<strong>${m.team?.chineseFaculty??'待核实'}</strong></div><div>成员信息来源<strong>${m.team?.source?external(m.team.source,'课题组成员页 ↗'):'暂无统计来源'}</strong></div></div><p class="micro-note">${e(m.team?.note||'暂无可核实的公开统计。')}</p><h3>师承与学术联系</h3>${(m.relations||[]).map(r=>`<div class="relation-item"><strong>${e(r.type)} · ${e(r.name)}</strong><p>${e(r.evidence)}</p>${external(r.source,'查看证据 ↗')}</div>`).join('')||'<p>暂无已核实关系。</p>'}<p class="warning-note">申请前请核实当年项目要求、招生名额、导师是否接收博士生及最新机构归属。每项公开信息都可能随时间变化。</p>`);
}
function showCompare(){const selected=mentors.filter(m=>compare.has(m.id));if(!selected.length)return;const rows=[['学校',m=>e(m.school)],['地区与排名',m=>`${e(m.country)}<br>${e(rankLabel(m))}`],['职称',m=>e(m.title)],['研究方向',m=>`<div class="tags">${m.topics.map(t=>`<span class="tag">${e(t)}</span>`).join('')}</div><p>${e(m.summary)}</p>`],['方向覆盖',m=>{const v=matchMentor(analysis,m);return v.score===null?'完善背景后分析':`${v.score}%<br><p>${e(v.explanation)}</p>`;}],['论文样本',m=>`${m.papers.length} 篇精选 · 非完整统计`],['中国成员',()=> '待核实'],['联系',m=>`${e(m.email||'待核实')}<br>${external(m.url,'导师官方主页 ↗')}`]];showDialog('把选择放在一起看','按研究契合与证据比较，排名只是参考。',`<div class="table-wrap card"><table class="compare-table"><thead><tr><th>比较维度</th>${selected.map(m=>`<th>${e(m.name)}</th>`).join('')}</tr></thead><tbody>${rows.map(([label,fn])=>`<tr><th>${label}</th>${selected.map(m=>`<td>${fn(m)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`,true);}
function showSources(){showDialog('有来源，也保留未知','Tabler 开源版 · 本机工作台',`<div class="source-grid"><section class="source-card"><h3>导师与关系资料</h3><p>首批 ${seedMentors.length} 位导师由大学主页、课题组页面与论文人工核验。每条关系有独立来源，合作与师承分别记录。</p><p>核验日期：2026-10-28。自建导师条目标记为待核实。</p></section><section class="source-card"><h3>论文与排名</h3><p>论文为 2023–2026 年精选样本，不提供不完整的年度产量比较。通讯作者需额外证据。</p><p>排名统一使用 QS 2026 综合排名；点击院校页来源可复查历史年份。</p></section><section class="source-card"><h3>成员背景与职称</h3><p>仅记录公开可核实的成员自述或官方统计。未核实的中国学生、中国教师数量与职称显示“待核实”，不依据姓名、照片推断。</p></section><section class="source-card"><h3>简历与匹配</h3><p>PDF / DOCX 在浏览器本地提取文字；关键词规则识别研究方向。覆盖率不代表录取概率，也不包含招生名额。</p></section></div><div class="source-card" style="margin-top:16px"><h3>免费开源基础</h3><p>本版本基于 Tabler 的静态 HTML 安装流程搭建，使用本地保存的 Tabler 1.7.1，MIT 许可证。</p><a href="https://github.com/tabler/tabler" target="_blank" rel="noopener noreferrer">Tabler GitHub 项目 ↗</a><a href="https://docs.tabler.io/ui/getting-started/installation" target="_blank" rel="noopener noreferrer">官方安装流程 ↗</a></div><h3>管理你的工作台数据</h3><p>本地保存简历文字、背景、收藏和备注。导出文件包含你的个人资料，请自行妥善保管。</p><div class="data-toolbar" style="margin-top:17px">${button('export','导出 JSON 备份','download')}<label class="button file-import">${icon('upload')}导入备份<input type="file" id="import-backup" accept=".json" aria-label="导入工作台 JSON 备份"></label>${button('export-csv','导出申请表 CSV','download')}</div><p class="micro-note">打开页面无需 ChatGPT 登录；官网 AI 识别使用本机 Ollama 中选择的 DeepSeek 模型。页面、字体与简历解析组件均随本机项目保存。原文和学校主页链接需要联网打开。领域文献追踪通过本机服务读取官方 RSS，缓存超过 6 小时可更新；导师资料仍需人工核实。简历匹配仍采用关键词规则，跨设备同步尚未接入。</p>`);}
function researchSummary(){
  const r=state.research;
  return `<section class="research-summary card"><div><div class="research-caption">我的研究方向</div><h2>${e(r.name)}${r.shortName?` <span class="tag">${e(r.shortName)}</span>`:''}</h2><p>${r.keywords.length?'领域关键词：'+e(r.keywords.join('、')):'使用默认 CO₂RR 主题筛选'}${r.excludedKeywords.length?' · 排除：'+e(r.excludedKeywords.join('、')):''}</p></div>${button('research-settings','个性化设置','settings')}</section>`;
}
function showResearchSettings(){
  const r=state.research;
  showDialog('我的研究方向','按你的课题同步筛选导师、院校、关系和论文。',`<form id="research-settings-form" class="research-form"><div class="research-form-grid"><label for="research-field-name">研究方向名称<input id="research-field-name" name="name" required maxlength="80" value="${e(r.name)}" placeholder="例如：二氧化碳电还原、氧还原、固态电池"></label><label for="research-field-short">简称<input id="research-field-short" name="shortName" maxlength="20" value="${e(r.shortName)}" placeholder="例如：CO₂RR、ORR"></label></div><label for="research-keywords">领域关键词 · 任一匹配<textarea id="research-keywords" name="keywords" maxlength="2000" placeholder="例如：CO2RR, CO2 electroreduction, carbon dioxide electroreduction">${e(r.keywords.join('，'))}</textarea><small>用逗号或换行分隔；建议同时填写中英文同义词。留空沿用默认 CO₂RR 规则，更换研究领域时需填写关键词。</small></label><label for="research-excluded">排除关键词<textarea id="research-excluded" name="excludedKeywords" maxlength="2000" placeholder="例如：urea, nitrate">${e(r.excludedKeywords.join('，'))}</textarea><small>标题、摘要或主题标签含任一排除词的文献会被过滤。</small></label><p class="research-settings-hint">设置保存在当前浏览器，并包含在 JSON 备份中。导师资料库可继续通过官网链接补充其他领域的研究者。</p><div id="research-form-error" class="research-form-error" role="alert"></div><div class="research-form-actions"><button type="button" class="button btn btn-default" data-action="reset-research">恢复 CO₂RR 默认</button><button type="submit" class="button btn btn-primary">${icon('check')}保存研究方向</button></div></form>`);
  $('#research-field-name').focus();
}
async function showAiSettings(){
  showDialog('本地大模型','选择导师官网识别使用的模型。',`<form id="ai-settings-form" class="ai-settings-form"><label for="ai-model">选择模型<select id="ai-model" name="model" class="form-select">${LOCAL_MODELS.map(model=>`<option value="${model}" ${state.ai.model===model?'selected':''}>${model}</option>`).join('')}</select></label><div class="ai-model-notes"><p><strong>1.5B</strong> 参数较少，适合先快速整理。</p><p><strong>7B</strong> 参数较多，加载与识别可能更慢。</p></div><div class="ai-endpoint"><span>Ollama 接口</span><code>http://localhost:11434/v1</code><small>本机连接，无需填写密钥。</small></div><div id="ai-connection-status" class="ai-connection-status" role="status" aria-live="polite">正在检测本机服务与已安装模型…</div><p class="ai-usage-note">导师官网识别使用上方模型；无法连接时会说明原因并保留网页直接提取结果。简历文字仍在浏览器提取，方向覆盖率使用现有关键词规则。</p><div class="ai-settings-actions"><button type="button" class="button btn btn-default" data-action="test-ai">${icon('spark')}测试连接</button><button type="submit" class="button btn btn-primary">${icon('check')}保存选择</button></div></form>`);
  const form=$('#ai-settings-form');form.elements.model.focus();
  try{
    const response=await fetch('/api/models',{signal:AbortSignal.timeout(8000)}),result=await response.json();
    if($('#ai-settings-form')!==form)return;
    if(!response.ok)throw Error(result.error||'检测失败');
    const installed=(result.models||[]).filter(m=>m.installed).map(m=>m.id);
    for(const option of form.elements.model.options)option.textContent=option.value+(installed.includes(option.value)?' · 已安装':' · 未检测到');
    const status=$('#ai-connection-status');status.classList.toggle('error',!result.available);
    status.textContent=result.available?`Ollama 已连接 · ${installed.length} / 2 个模型已安装。点击测试连接可确认所选模型能生成回答。`:(result.error||'无法连接 Ollama，请先启动本机 Ollama。');
  }catch(error){if($('#ai-settings-form')===form){const status=$('#ai-connection-status');status.classList.add('error');status.textContent='检测失败：'+(error.name==='TimeoutError'?'本机服务响应超时':error.message)+'。请确认 Ollama 和工作台服务已启动。';}}
}
async function testLocalAi(){
  const form=$('#ai-settings-form');if(!form||form.elements.model.disabled)return;
  const model=form.elements.model.value,status=$('#ai-connection-status'),trigger=form.querySelector('[data-action="test-ai"]'),save=form.querySelector('[type="submit"]');
  form.elements.model.disabled=true;trigger.disabled=true;save.disabled=true;status.classList.remove('error');
  status.textContent=`正在测试 ${model}，首次加载可能需要几分钟…`;
  try{
    const response=await fetch('/api/models/test',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model}),signal:AbortSignal.timeout(210000)}),result=await response.json();
    if($('#ai-settings-form')!==form)return;
    if(!response.ok||!result.ok)throw Error(result.error||result.message||'模型未返回有效结果');
    status.textContent=`${model} 测试成功 · ${result.message||'本机模型已正常响应。'}`;
  }catch(error){if($('#ai-settings-form')===form){status.classList.add('error');status.textContent=`${model} 测试失败：`+(error.name==='TimeoutError'?'生成超时，请稍后重试或换用 1.5B。':error.message);}}
  finally{if($('#ai-settings-form')===form){form.elements.model.disabled=false;trigger.disabled=false;save.disabled=false;}}
}
function exportApplicationCsv(){
  const prep=state.application.tasks,summary=applicationProgress(prep);
  const rows=[['类型','事项 / 导师','院校','状态','已完成','总任务','完成率','跟进日期','备注 / 任务明细'],
    ...prep.map(task=>['申请准备',task.label,'',task.done?'已完成':'未完成',task.done?1:0,1,task.done?'100%':'0%','','']),
    ...mentors.filter(m=>state.saved[m.id]).map(m=>{const entry=state.saved[m.id],p=mentorProgress(entry);return ['导师申请',m.name,m.school,entry.stage,p.done,p.total,p.percent+'%',entry.date,entry.note+' '+APPLICATION_STEPS.map(step=>`${entry.tasks?.[step.id]?'[x]':'[ ]'} ${step.label}`).join('；')];})];
  downloadFile('博士申请-勾选清单.csv','\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');
  toast(`已导出申请清单，准备事项完成 ${summary.done}/${summary.total}。`);
}
let mentorImportResult=null;
function showAddMentor(){
  mentorImportResult=null;
  showDialog('添加导师','先粘贴官方主页，识别后确认资料。',`<form id="add-mentor-form" class="add-form"><section class="mentor-import-top"><label for="mentor-url">导师官方主页<input id="mentor-url" name="url" type="url" required maxlength="2000" placeholder="https://大学官网/导师主页" autocomplete="url"></label><div class="mentor-import-actions"><button class="button btn btn-primary" type="button" data-action="extract-mentor">${icon('spark')}识别并填写</button><button class="text-button mentor-import-manual" type="button" data-action="manual-mentor">手动填写</button></div><div id="mentor-import-status" class="mentor-import-status" role="status" aria-live="polite">自动整理姓名、院校、地区、研究方向和简介；保存前可以修改。</div></section><details class="mentor-import-paste"><summary>官网无法读取？粘贴页面正文</summary><textarea id="mentor-page-text" maxlength="80000" placeholder="粘贴公开导师主页的简介、研究方向与联系方式，再点击“识别并填写”…" aria-label="导师官方主页正文"></textarea><p>保留上方官网链接，作为资料来源。</p></details><fieldset class="mentor-import-fields" id="mentor-import-fields" hidden disabled><div class="form-grid"><div class="form-field"><label for="mentor-name">姓名</label><input id="mentor-name" name="name" required maxlength="100" placeholder="识别后填写"></div><div class="form-field"><label for="mentor-school">院校 / 机构</label><input id="mentor-school" name="school" required maxlength="250" placeholder="识别后填写"></div><div class="form-field"><label for="mentor-country">国家 / 地区</label><input id="mentor-country" name="country" maxlength="50" placeholder="未识别时可补充"></div><div class="form-field"><label for="mentor-title">职称</label><input id="mentor-title" name="title" maxlength="250" placeholder="未识别时保留待核实"></div><div class="form-field wide"><label for="mentor-topics">研究方向</label><input id="mentor-topics" name="topics" maxlength="500" placeholder="用逗号分隔，例如：铜基催化剂，多碳产物"></div><div class="form-field wide"><label for="mentor-email">公开邮箱</label><input id="mentor-email" name="email" type="email" maxlength="200" placeholder="仅填写公开联系方式"></div><div class="form-field wide"><label for="mentor-summary">研究简介</label><textarea id="mentor-summary" name="summary" maxlength="3000" placeholder="根据官网整理的研究方向与课题…"></textarea></div></div><div id="mentor-import-evidence" class="mentor-import-evidence"></div><div class="mentor-import-save"><button class="button btn btn-default" type="button" data-action="close-modal">取消</button><button class="button btn btn-primary" type="submit">${icon('plus')}确认并保存导师</button></div></fieldset></form>`);
  $('#mentor-url').focus();
}
async function extractMentor(){
  const form=$('#add-mentor-form');if(!form||form.querySelector('[data-action="extract-mentor"]').disabled)return;
  const url=form.elements.url;if(!url.reportValidity())return;
  const status=$('#mentor-import-status'),trigger=form.querySelector('[data-action="extract-mentor"]'),manual=form.querySelector('[data-action="manual-mentor"]'),fields=$('#mentor-import-fields');
  trigger.disabled=true;manual.disabled=true;url.readOnly=true;fields.disabled=true;
  trigger.innerHTML=icon('clock')+'正在识别…';status.classList.remove('error');status.textContent=`正在使用 ${state.ai.model} 读取官网并整理资料，首次加载模型可能需要几分钟。`;
  try{
    const response=await fetch('/api/mentor/import',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:url.value.trim(),page_text:$('#mentor-page-text').value.trim(),model:state.ai.model}),signal:AbortSignal.timeout(210000)});
    const result=await response.json();if(!response.ok)throw Error(result.error||'官网识别失败');
    if($('#add-mentor-form')!==form)return;
    if(!result.mentor||typeof result.mentor!=='object')throw Error('识别结果格式错误');
    mentorImportResult=result;
    if(result.mentor.url)url.value=result.mentor.url;
    for(const key of ['name','school','country','title','email','summary']){const input=form.elements[key];if(input)input.value=String(result.mentor[key]||'');}
    form.elements.topics.value=Array.isArray(result.mentor.topics)?result.mentor.topics.join('，'):'';
    fields.hidden=false;
    const count=['name','school','country','title','email','summary','topics'].filter(k=>String(form.elements[k].value).trim()).length;
    const warnings=(result.warnings||[]).filter(x=>typeof x==='string'&&!/^请核对公开邮箱|^这是依据主页生成/.test(x));
    status.textContent=`${result.method==='ollama'?'本地 AI 已整理 · '+e(result.model||state.ai.model):result.method==='codex'?'AI 已整理官网资料':'已从官网提取公开信息'} · 填写 ${count} 项。请核对后保存。`+(warnings.length?'\n'+warnings.map(x=>x.replace(/[。；]$/,'')).join('；'):'');
    const labels={name:'姓名',school:'院校',country:'地区',title:'职称',email:'邮箱',topics:'方向',summary:'研究简介'};
    const evidence=Object.entries(result.evidence||{}).filter(([,value])=>value&&typeof value==='object');
    $('#mentor-import-evidence').innerHTML=`<p>${(result.sources||[]).map(source=>external(source.url||source,'官网来源 ↗')).join(' · ')}</p>${evidence.length?`<details><summary>查看识别依据</summary>${evidence.map(([field,value])=>`<p><strong>${e(labels[field]||field)}：</strong>${e(value.excerpt||'请在来源页核对')} ${value.sourceUrl?external(value.sourceUrl,'来源 ↗'):''}</p>`).join('')}</details>`:''}`;
    form.elements.name.focus();
  }catch(error){if($('#add-mentor-form')===form){status.classList.add('error');status.textContent=error.name==='TimeoutError'?'本次识别超时。可粘贴官网正文后重试，或选择手动填写。':`${error.message}。可粘贴官网正文后重试，或选择手动填写。`;}}
  finally{if($('#add-mentor-form')===form){trigger.disabled=false;manual.disabled=false;url.readOnly=false;fields.disabled=fields.hidden;trigger.innerHTML=icon('spark')+'重新识别并填写';}}
}
function saveMentor(id){if(state.saved[id])delete state.saved[id];else state.saved[id]={stage:'待了解',date:'',note:'',tasks:validateMentorTasks()};const ok=persist();render();if(ok)toast(state.saved[id]?'已加入申请清单':'已移出申请清单');}
function downloadFile(name,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function exportBackup(){downloadFile(`Catalyst-Atlas-backup-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2),'application/json');toast('已导出个人备份，包含背景与简历文字。');}
function csvCell(v){let t=String(v??'');if(/^[\s]*[=+@-]/.test(t))t="'"+t;return '"'+t.replaceAll('"','""')+'"';}
function exportCsv(){const list=mentors.filter(m=>state.saved[m.id]);if(!list.length){toast('先将感兴趣的导师加入申请清单。');return;}const rows=[['导师','学校','国家地区','QS年份','QS排名','研究方向','公开邮箱','官方主页','申请阶段','跟进日期','备注'],...list.map(m=>{const q=qsFor(m),s=state.saved[m.id];return [m.name,m.school,m.country,q?.year||'',q?.rank||'',m.topics.join(' / '),m.email,m.url,s.stage,s.date,s.note];})];downloadFile('Catalyst-Atlas-申请清单.csv','\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');toast('已导出申请表，可用 Excel 打开。');}
async function readResume(file){
  if(!file)return;
  if(resumeBusy){toast('正在读取上一份简历，请稍候。');return;}
  resumeBusy=true;
  const status=$('#file-state'),input=$('#resume-file'),cv=$('#profile-cv');
  status.textContent=`正在本机读取 ${file.name}…`;status.classList.remove('error');input.disabled=true;
  try{
    const {text,notice}=await extractResume(file);
    resumeDraft={cvText:text,fileName:file.name};
    if(cv.isConnected){cv.value=text;cv.dataset.fileName=file.name;status.textContent=`${file.name} · 已提取 ${text.length.toLocaleString()} 个字符。${notice||''} 请核对并保存分析。`;}
    else toast('简历读取完成，请返回“我的学术背景”核对并保存。');
  }catch(error){if(status.isConnected){status.textContent=error.message||'读取失败，请直接粘贴简历文字。';status.classList.add('error');}else toast(error.message||'简历读取失败，请重新上传。',true);}
  finally{resumeBusy=false;input.disabled=false;input.value='';}
}
async function importBackup(file){try{if(!file||file.size>12*1024*1024)throw Error('备份文件须小于 12 MB。');const next=validateState(JSON.parse(await file.text()));showDialog('导入已就绪','确认后会替换当前浏览器内的个人记录。',`<p>备份包含 ${Object.keys(next.saved).length} 位申请导师、${next.customMentors.length} 个自建条目与 ${next.profile.cvText.length.toLocaleString()} 个简历字符。建议先导出当前记录。</p><div class="detail-actions">${button('export','先导出当前备份','download')}${button('confirm-import','确认替换并导入','check','primary')}</div>`);pendingImport=next;}catch(error){toast(`无法导入：${error.message}`,true);}}
let pendingImport=null;
const literature=createLiterature({e,external,icon,heading,button,empty,showDialog,toast,
  redraw:()=>{if(route==='literature')render();},
  getSaved:()=>state.paperSaved,
  getResearch:()=>state.research,
  toggleSaved:id=>{state.paperSaved=state.paperSaved.includes(id)?state.paperSaved.filter(x=>x!==id):[...state.paperSaved,id];persist();},
  download:downloadFile
});
document.addEventListener('click',async event=>{
  if(event.target.closest('a.skip')){event.preventDefault();$('#main').focus();return;}
  const removal=event.target.closest('[data-remove-app-task]');if(removal){const id=removal.dataset.removeAppTask;if(/^custom-/.test(id)){state.application.tasks=state.application.tasks.filter(task=>task.id!==id);persist();render();}return;}
  const target=event.target.closest('[data-action],[data-go],[data-detail],[data-save],[data-scope],[data-paper]');if(!target)return;
  if(target.dataset.go){event.preventDefault();query='';country=target.dataset.country||'';topic='';$('#global-search').value='';go(target.dataset.go);return;}
  if(target.dataset.detail){showDetail(target.dataset.detail);return;}
  if(target.dataset.save){saveMentor(target.dataset.save);return;}
  if(target.dataset.scope){scope=target.dataset.scope;render();return;}
  if(target.dataset.paper){const key=target.dataset.paper;state.paperSaved=state.paperSaved.includes(key)?state.paperSaved.filter(k=>k!==key):[...state.paperSaved,key];const ok=persist();render();if(ok)toast(state.paperSaved.includes(key)?'论文已收藏':'已取消论文收藏');return;}
  switch(target.dataset.action){
    case 'profile':go('profile');break;
    case 'shortlist':go('shortlist');break;
    case 'sources':showSources();break;
    case 'export':exportBackup();break;
    case 'export-csv':exportCsv();break;
    case 'export-application':exportApplicationCsv();break;
    case 'research-settings':showResearchSettings();break;
    case 'ai-settings':showAiSettings();break;
    case 'test-ai':await testLocalAi();break;
    case 'reset-research':{const defaults=defaultResearch(),form=$('#research-settings-form');for(const key of ['name','shortName'])form.elements[key].value=defaults[key];form.elements.keywords.value='';form.elements.excludedKeywords.value='';$('#research-form-error').textContent='已恢复默认，点击保存后生效。';break;}
    case 'close-modal':$('#modal').close();break;
    case 'reset-filters':query='';country='';topic='';sort='default';year='';paperJournal='';paperMentor='';paperOnly=false;$('#global-search').value='';render();break;
    case 'paper-only':paperOnly=!paperOnly;render();break;
    case 'compare':showCompare();break;
    case 'clear-compare':compare.clear();render();break;
    case 'add-mentor':showAddMentor();break;
    case 'extract-mentor':await extractMentor();break;
    case 'manual-mentor':$('#mentor-import-fields').hidden=false;$('#mentor-import-fields').disabled=false;$('#mentor-import-status').textContent='按官网资料填写；无法确认的项目可以留空。';$('#mentor-name').focus();break;
    case 'detail-save':saveMentor(target.dataset.id);showDetail(target.dataset.id);break;
    case 'copy-email':{const m=mentors.find(m=>m.id===target.dataset.id);try{await navigator.clipboard.writeText(m.email);toast('邮箱已复制');}catch{toast('复制不可用，可直接选择邮箱文字复制。');}break;}
    case 'delete-cv':showDialog('清除已保存的简历','学术背景与申请清单会继续保留。',`<p>这会删除本浏览器里保存的简历正文和文件名。可以先导出个人备份。</p><div class="detail-actions">${button('export','先导出备份','download')}${button('confirm-delete-cv','清除简历正文','close','primary')}</div>`);break;
    case 'confirm-delete-cv':state.profile.cvText='';state.profile.fileName='';persist();analysis=getAnalysis();$('#modal').close();render();toast('已清除保存的简历正文');break;
    case 'confirm-import':if(pendingImport){state=pendingImport;hasModelChoice=true;pendingImport=null;mentors=[...seedMentors,...state.customMentors];analysis=getAnalysis();resetDiscovery();resumeDraft=null;const ok=persist();$('#modal').close();render();if(ok)toast('备份已导入');}break;
  }
});
document.addEventListener('change',event=>{
  const t=event.target;
  if(t.id==='ai-model'){const status=$('#ai-connection-status');status.classList.remove('error');status.textContent=`已选择 ${t.value}。可测试连接，或保存后用于导师官网识别。`;return;}
  if(t.hasAttribute('data-app-task')){const id=t.dataset.appTask,task=state.application.tasks.find(x=>x.id===id);if(task){task.done=t.checked;persist();render();document.querySelector(`[data-app-task="${CSS.escape(id)}"]`)?.focus();}return;}
  if(t.hasAttribute('data-mentor-task')){const id=t.dataset.mentorTask,step=t.dataset.step,entry=state.saved[id];if(entry&&APPLICATION_STEPS.some(x=>x.id===step)){entry.tasks=validateMentorTasks(entry.tasks);entry.tasks[step]=t.checked;persist();render();document.querySelector(`[data-mentor-task="${CSS.escape(id)}"][data-step="${CSS.escape(step)}"]`)?.focus();}return;}
  if(t.hasAttribute('data-app-goal')){if(!t.reportValidity())return;state.application=validateApplication({...state.application,goal:Number(t.value)});persist();render();return;}
  if(t.matches('[data-filter]')){const key=t.dataset.filter;if(key==='country')country=t.value;if(key==='topic')topic=t.value;if(key==='sort')sort=t.value;if(key==='year')year=t.value;if(key==='paperJournal')paperJournal=t.value;if(key==='paperMentor')paperMentor=t.value;if(key==='graph')selectedGraph=t.value;if(key==='relationType')relationType=t.value;render();return;}
  if(t.dataset.compare){if(t.checked&&compare.size>=3){t.checked=false;toast('最多同时比较 3 位导师。');return;}if(t.checked)compare.add(t.dataset.compare);else compare.delete(t.dataset.compare);renderCompareBar();return;}
  if(t.dataset.stage){state.saved[t.dataset.stage].stage=t.value;const ok=persist();render();if(ok)toast('申请阶段已保存');return;}
  if(t.dataset.date){state.saved[t.dataset.date].date=t.value;persist();return;}
  if(t.id==='resume-file')readResume(t.files[0]);
  if(t.id==='import-backup')importBackup(t.files[0]);
});
document.addEventListener('input',event=>{
  const t=event.target;
  if(t.id==='mentor-url'&&mentorImportResult){mentorImportResult=null;$('#mentor-import-evidence').innerHTML='';$('#mentor-import-status').textContent='官网链接已改变，请重新识别或按新来源修正资料。';}
  if(t.dataset.note){state.saved[t.dataset.note].note=t.value.slice(0,5000);persist();return;}
  if(t.id==='global-search'){query=t.value;if(route!=='mentors')go('mentors');else render();return;}
  if(t.dataset.filter==='query'){const start=t.selectionStart;query=t.value;render();const next=$('#'+t.id);next?.focus();next?.setSelectionRange(start,start);}
});
document.addEventListener('submit',event=>{
  if(event.target.id==='ai-settings-form'){event.preventDefault();const model=event.target.elements.model.value;if(!LOCAL_MODELS.includes(model))return;const previous=state.ai.model;state.ai.model=model;hasModelChoice=true;if(!persist()){state.ai.model=previous;return;}$('#modal').close();render();toast(`已选择本地模型 ${model}`);return;}
  if(event.target.id==='research-settings-form'){event.preventDefault();try{const next=normalizeResearch(Object.fromEntries(new FormData(event.target)));state.research=next;resetDiscovery();if(!persist()){ $('#research-form-error').textContent='设置尚未写入浏览器，请导出备份后重试。';return;}$('#modal').close();render();toast('研究方向已保存，导师、院校、关系与论文已同步切换。');}catch(error){$('#research-form-error').textContent=error.message;}return;}
  if(event.target.id==='add-application-task'){event.preventDefault();const input=event.target.elements.label,label=input.value.trim();if(!label)return;if(state.application.tasks.length>=100){toast('最多保存 100 项准备事项。',true);return;}state.application.tasks.push({id:'custom-'+crypto.randomUUID(),label:label.slice(0,160),done:false});persist();render();document.querySelector('#add-application-task input')?.focus();return;}
  if(event.target.id==='profile-form'){
    event.preventDefault();const values=new FormData(event.target);const cv=$('#profile-cv');for(const key of Object.keys(state.profile))if(values.has(key))state.profile[key]=String(values.get(key)).slice(0,key==='cvText'?1000000:20000);
    state.profile.fileName=cv.dataset.fileName||resumeDraft?.fileName||state.profile.fileName;resumeDraft=null;analysis=getAnalysis();const ok=persist();render();if(ok)toast(analysis.topics.length?`背景已保存，识别到 ${analysis.topics.length} 个研究方向。`:'背景已保存；请补充具体课题与实验方法。');
  }
  if(event.target.id==='add-mentor-form'){
    event.preventDefault();if($('#mentor-import-fields').hidden){extractMentor();return;}if($('#mentor-import-fields').disabled)return;const f=Object.fromEntries(new FormData(event.target));const existing=mentors.find(m=>m.url.replace(/\/$/,'')===f.url.replace(/\/$/,''));if(existing){showDetail(existing.id);toast('这位导师已经在资料库中，已打开档案。');return;}const info=mentorImportResult||{};const item=validateMentor({...f,id:'custom-'+crypto.randomUUID(),schoolShort:f.school,topics:f.topics.split(/[,，、;；]/).map(t=>t.trim()).filter(Boolean),importMethod:info.method,importModel:info.model,importSources:(info.sources||[]).map(s=>s.url||s),importEvidence:Object.entries(info.evidence||{}).map(([field,value])=>({field,...value})),emailSource:f.email?f.url:'',researchSource:f.url});state.customMentors.push(item);mentors=[...seedMentors,...state.customMentors];const ok=persist();$('#modal').close();country='';topic='';query='';go('mentors');if(ok)toast('导师已添加，资料标记为待核实。');
  }
});
document.addEventListener('dragover',event=>{if(event.target.closest('#drop-zone')){event.preventDefault();$('#drop-zone').classList.add('drag');}});
document.addEventListener('dragleave',event=>{if(event.target.closest('#drop-zone'))$('#drop-zone').classList.remove('drag');});
document.addEventListener('drop',event=>{if(event.target.closest('#drop-zone')){event.preventDefault();$('#drop-zone').classList.remove('drag');readResume(event.dataTransfer.files[0]);}});
document.addEventListener('keydown',event=>{if(event.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){event.preventDefault();$('#global-search').focus();}if((event.key==='Enter'||event.key===' ')&&event.target.matches('g[data-detail]')){event.preventDefault();showDetail(event.target.dataset.detail);}});
$('#modal').addEventListener('click',event=>{if(event.target===$('#modal')){const rect=$('#modal').getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)$('#modal').close();}});
window.addEventListener('hashchange',()=>{route=routeFromHash();render();window.scrollTo(0,0);});
render();
if(storageError)setTimeout(()=>toast('无法读取原有本地记录；可导入备份恢复。',true),500);

// Browser choices override the server default; older backups without a choice use .env.
fetch('/api/models',{signal:AbortSignal.timeout(8000)}).then(response=>response.json()).then(settings=>{
  if(!hasModelChoice&&LOCAL_MODELS.includes(settings.defaultModel)){
    state.ai.model=settings.defaultModel;
    renderNav();
    const form=$('#ai-settings-form');if(form)form.elements.model.value=settings.defaultModel;
  }
}).catch(()=>{});
