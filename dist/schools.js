import { QS_YEAR, top100School, top100Coverage } from './qs100.js';

export function schoolRows(mentors,{rankScope='qs100',query='',country='',coverage='',qsFor=()=>null}={}){
  let rows;
  if(rankScope==='qs100')rows=top100Coverage(mentors);
  else{
    const groups=new Map();
    for(const mentor of mentors){
      const listed=top100School(mentor.school),key=listed?.school||mentor.school;
      if(!groups.has(key))groups.set(key,{...(qsFor(mentor)||{}),school:key,schoolShort:listed?.schoolShort||mentor.schoolShort,country:mentor.country,mentors:[]});
      groups.get(key).mentors.push(mentor);
    }
    rows=[...groups.values()].sort((a,b)=>(Number(String(a.rank||'').replace(/\D/g,''))||Infinity)-(Number(String(b.rank||'').replace(/\D/g,''))||Infinity));
  }
  const term=query.trim().toLowerCase();
  return rows.filter(s=>(!term||[s.school,s.schoolShort,...s.mentors.map(m=>m.name)].join(' ').toLowerCase().includes(term))&&(!country||s.country===country)&&(!coverage||(coverage==='covered'?s.mentors.length>0:s.mentors.length===0)));
}

export function renderSchoolsPage({mentors,settings,filters,research,qsFor,e,external,empty}){
  const universe=schoolRows(mentors,{rankScope:settings.rankScope,qsFor}),rows=schoolRows(mentors,{rankScope:settings.rankScope,...filters,qsFor});
  const covered=universe.filter(s=>s.mentors.length).length;
  const keywords=research.keywords.length?research.keywords.join(' OR '):'CO2 electroreduction OR carbon dioxide reduction';
  const searchUrl=s=>'https://www.google.com/search?q='+encodeURIComponent(`"${s.school}" (${keywords}) faculty research group official`);
  return `<header class="page-heading school-heading"><h1>院校</h1><p class="school-summary" role="status"><strong>${mentors.length} 位导师</strong><span>${covered} / ${universe.length} 所院校有记录</span></p></header>
  <section class="school-toolbar card" aria-label="院校筛选"><div class="school-toolbar-head"><button class="school-topic" data-action="research-settings"><strong>${e(research.name)}</strong><span>更改方向</span></button><label class="school-rank-field" for="discovery-rank">院校范围<select id="discovery-rank" data-rank-scope><option value="qs100" ${settings.rankScope==='qs100'?'selected':''}>QS ${QS_YEAR} 前 100</option><option value="all" ${settings.rankScope==='all'?'selected':''}>全部已收录院校</option></select></label></div><div class="school-filters"><label for="school-query">搜索<input id="school-query" value="${e(filters.query)}" placeholder="院校或导师"></label><label for="school-country">地区<select id="school-country" data-school-country><option value="">全部地区</option>${[...new Set(universe.map(s=>s.country))].sort().map(c=>`<option value="${e(c)}" ${filters.country===c?'selected':''}>${e(c)}</option>`).join('')}</select></label><label for="school-coverage">收录<select id="school-coverage" data-school-coverage><option value="">全部院校</option><option value="covered" ${filters.coverage==='covered'?'selected':''}>已有导师</option><option value="pending" ${filters.coverage==='pending'?'selected':''}>待补充</option></select></label></div></section>
  ${rows.length?`<div class="table-wrap card"><table class="table table-vcenter school-coverage-table"><thead><tr><th>院校</th><th>地区</th><th>QS ${QS_YEAR}</th><th>导师</th><th>资料</th></tr></thead><tbody>${rows.map(s=>`<tr><td class="school-cell"><strong>${e(s.schoolShort||s.school)}</strong><small>${e(s.school)}</small></td><td>${e(s.country)}</td><td><span class="rank">${s.rank?'#'+e(s.rank):'—'}</span>${s.source?`<small>${external(s.source,'排名来源 ↗')}</small>`:''}</td><td>${s.mentors.length?s.mentors.map(m=>`<button class="text-button" data-detail="${e(m.id)}">${e(m.name)}</button>`).join('<br>'):'<span class="school-pending">待补充</span>'}</td><td>${external(searchUrl(s),'检索导师 ↗','text-button')}</td></tr>`).join('')}</tbody></table></div>`:empty('没有匹配院校','调整搜索或地区筛选。')}
  <details class="school-help"><summary>收录说明 · 当前显示 ${rows.length} 所</summary><p>采用 QS ${QS_YEAR} 世界大学综合排名，${settings.rankScope==='qs100'?'范围为前 100 院校。':'显示当前方向的已收录院校。'}每校可收录多位相关导师；“待补充”表示尚无已核实条目，不代表没有相关研究者。</p><p>资料按官网证据逐步补齐，尚未宣称覆盖全部教师或完整论文。东京工业大学采用 2026 榜单名称，其机构合并沿革需结合导师现任单位核对。</p></details>`;
}
