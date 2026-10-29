const PREPARATION=[
  ['prep-direction','明确研究方向与申请目标'],
  ['prep-cv','更新英文简历与科研经历'],
  ['prep-records','整理成绩单与学历证明'],
  ['prep-language','核对语言要求并安排考试或豁免'],
  ['prep-writing','核对并准备个人陈述 / 研究计划'],
  ['prep-references','确定推荐人并提前沟通'],
  ['prep-targets','建立目标导师与项目清单'],
  ['prep-deadlines','汇总申请要求与截止日期']
];
export const APPLICATION_STEPS=[
  {id:'read',label:'阅读至少 2 篇代表论文'},
  {id:'fit',label:'写下研究契合点与拟研究问题'},
  {id:'eligibility',label:'核对招生、项目要求与截止日期'},
  {id:'contact',label:'完成联系或确认无需套磁'},
  {id:'submitted',label:'提交正式申请并记录提交凭证'}
];
export function defaultApplication(){return {goal:5,tasks:PREPARATION.map(([id,label])=>({id,label,done:false}))};}
export function validateApplication(raw){
  const base=defaultApplication();
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return base;
  const goal=raw.goal===null||raw.goal===''?NaN:Number(raw.goal);if(Number.isFinite(goal))base.goal=Math.min(100,Math.max(1,Math.round(goal)));
  if(Array.isArray(raw.tasks)){
    const ids=new Set();base.tasks=[];
    for(const task of raw.tasks.slice(0,100)){
      if(!task||typeof task!=='object'||typeof task.id!=='string'||!/^[a-z0-9-]{1,80}$/.test(task.id)||ids.has(task.id)||typeof task.label!=='string'||!task.label.trim())continue;
      ids.add(task.id);base.tasks.push({id:task.id,label:task.label.trim().slice(0,160),done:task.done===true});
    }
  }
  return base;
}
export function validateMentorTasks(raw){return Object.fromEntries(APPLICATION_STEPS.map(({id})=>[id,!!raw&&Object.hasOwn(raw,id)&&raw[id]===true]));}
export function applicationProgress(tasks){
  const items=Array.isArray(tasks)?tasks.filter(x=>x&&typeof x==='object'):[];
  const total=items.length,done=items.filter(x=>x.done===true).length;
  return {done,total,percent:total?Math.round(done/total*100):0};
}
export function mentorProgress(record){const tasks=validateMentorTasks(record?.tasks);return applicationProgress(APPLICATION_STEPS.map(({id})=>({done:tasks[id]})));}

export function renderApplication({application,savedMentors,saved,e,icon,rankLabel,stages=['待了解','准备联系','已联系','已申请']}){
  const prep=applicationProgress(application.tasks);
  const done=savedMentors.reduce((n,m)=>n+mentorProgress(saved[m.id]).done,0),total=savedMentors.length*APPLICATION_STEPS.length,percent=total?Math.round(done/total*100):0;
  const progress=(value,label)=>`<progress class="app-progress" max="100" value="${value}" aria-label="${e(label)}">${value}%</progress>`;
  return `<div class="app-summary-grid"><section class="app-stat card"><div class="app-stat-label">申请准备<span>${prep.percent}%</span></div><strong>${prep.done}<small>/ ${prep.total} 项</small></strong>${progress(prep.percent,'申请准备完成率')}<p>按已勾选的准备事项计算</p></section><section class="app-stat card"><div class="app-stat-label">导师任务<span>${percent}%</span></div><strong>${done}<small>/ ${total} 项</small></strong>${progress(percent,'导师任务完成率')}<p>${total?`${savedMentors.length} 位导师，每位 ${APPLICATION_STEPS.length} 项任务`:'添加导师后显示逐位任务进度'}</p></section><section class="app-stat card"><div class="app-stat-label">目标导师数量</div><strong>${savedMentors.length}<small>/ ${application.goal} 位</small></strong><label class="app-goal-label" for="application-goal">我的目标<input id="application-goal" data-app-goal type="number" min="1" max="100" step="1" required value="${application.goal}" aria-label="目标导师数量"><span class="app-goal-unit">位</span></label><p>导师数量目标与任务完成率分别记录</p></section></div>
  <section class="app-preparation card"><div class="app-section-head"><div><h2>申请准备 · 可以逐项打勾</h2><p>已完成 ${prep.done} / ${prep.total} 项 · 每项等权计算</p></div><span class="app-percent">${prep.percent}%</span></div><div class="app-task-grid">${application.tasks.map(task=>`<div class="app-task-item ${task.done?'is-done':''}"><label class="app-check-row" for="app-task-${e(task.id)}"><input id="app-task-${e(task.id)}" type="checkbox" data-app-task="${e(task.id)}" ${task.done?'checked':''}><span>${e(task.label)}</span></label>${task.id.startsWith('custom-')?`<button class="icon-button" data-remove-app-task="${e(task.id)}" aria-label="删除准备事项：${e(task.label)}">${icon('close')}</button>`:''}</div>`).join('')||'<p class="app-empty-tasks">还没有准备事项，可以在下方添加。</p>'}</div><form id="add-application-task" class="app-add-task"><label for="application-task-label">添加自己的准备事项<input id="application-task-label" name="label" required maxlength="160" placeholder="例如：完成一页研究计划初稿"></label><button class="button btn btn-default" type="submit">${icon('plus')}添加事项</button></form></section>
  <section class="app-mentor-section"><div class="app-section-head"><div><h2>逐位推进导师申请</h2><p>${savedMentors.length?`共 ${savedMentors.length} 位导师 · 已完成 ${done} / ${total} 项`:'收藏导师后，自动生成每位导师的 5 项申请任务。'}</p></div><a class="text-button" href="#mentors" data-go="mentors">添加目标导师 ${icon('arrow')}</a></div>${savedMentors.length?`<div class="app-mentor-grid">${savedMentors.map(m=>{const entry=saved[m.id],tasks=validateMentorTasks(entry.tasks),p=mentorProgress(entry);return `<article class="app-mentor card"><div class="app-mentor-head"><div><button class="mentor-name" data-detail="${e(m.id)}">${e(m.name)}</button><p>${e(m.schoolShort||m.school)} · ${e(m.country)}</p><small>${e(rankLabel(m))}</small></div><span class="app-percent">${p.percent}%</span></div><div class="app-mentor-progress"><span>已完成 ${p.done} / ${p.total} 项</span>${progress(p.percent,m.name+' 的任务完成率')}</div><div class="app-mentor-tasks">${APPLICATION_STEPS.map(step=>`<label class="app-check-row ${tasks[step.id]?'is-done':''}" for="app-mentor-${e(m.id)}-${step.id}"><input id="app-mentor-${e(m.id)}-${step.id}" type="checkbox" data-mentor-task="${e(m.id)}" data-step="${step.id}" ${tasks[step.id]?'checked':''}><span>${e(step.label)}</span></label>`).join('')}</div><div class="app-mentor-options"><label>申请阶段<select data-stage="${e(m.id)}" aria-label="${e(m.name)} 的申请阶段">${stages.map(stage=>`<option ${entry.stage===stage?'selected':''}>${e(stage)}</option>`).join('')}</select></label><label>跟进日期<input type="date" data-date="${e(m.id)}" aria-label="${e(m.name)} 的跟进日期" value="${e(entry.date)}"></label></div><label class="app-note-label">申请备注<textarea data-note="${e(m.id)}" aria-label="${e(m.name)} 的申请备注" placeholder="记录问题、联系结果或下一步…">${e(entry.note)}</textarea></label><div class="app-mentor-foot"><button class="text-button" data-detail="${e(m.id)}">查看导师档案 ${icon('arrow')}</button><button class="text-button" data-save="${e(m.id)}">移出申请清单</button></div></article>`;}).join('')}</div>`:'<div class="app-no-mentors card"><span>'+icon('people')+'</span><div><h3>先选导师，准备事项可以先完成</h3><p>在导师卡片上点击书签，即可在这里逐位跟进。</p></div><a class="button btn btn-primary" href="#mentors" data-go="mentors">去选导师 '+icon('arrow')+'</a></div>'}</section><p class="app-progress-note">完成率表示你手动确认的事项进度。申请阶段、日期和备注独立保存。</p>`;
}
