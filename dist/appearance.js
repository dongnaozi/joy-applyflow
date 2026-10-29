export const PALETTES = [
  {id:'lake',name:'蓝色青蓝湖色',rgb:[90,184,184]},
  {id:'forest',name:'森系墨绿',rgb:[100,149,82]},
  {id:'lilac',name:'灰紫丁香',rgb:[146,122,184]},
  {id:'rose',name:'豆沙玫瑰',rgb:[219,170,187]},
  {id:'olive',name:'橄榄黄绿',rgb:[184,184,66]},
  {id:'brick',name:'砖红暖棕',rgb:[232,124,82]},
  {id:'slate',name:'中性灰蓝',rgb:[138,154,168]},
  {id:'amber',name:'暖橙金棕',rgb:[244,136,66]},
  {id:'ocean',name:'深海蓝系',rgb:[90,135,184]},
];

export function normalizeAppearance(raw){
  return {theme:PALETTES.some(p=>p.id===raw?.theme)?raw.theme:'lake'};
}

const rgb = color => `rgb(${color.join(', ')})`;
const mix = (color,target,amount) => color.map((value,i)=>Math.round(value*(1-amount)+target[i]*amount));
const luminance = color => color.map(value=>{const s=value/255;return s<=.04045?s/12.92:((s+.055)/1.055)**2.4;}).reduce((sum,value,i)=>sum+value*[.2126,.7152,.0722][i],0);
const contrast = (a,b) => {const first=luminance(a),second=luminance(b);return (Math.max(first,second)+.05)/(Math.min(first,second)+.05);};
const foreground = background => contrast(background,[16,24,32])>=4.5?[16,24,32]:contrast(background,[0,0,0])>=4.5?[0,0,0]:[255,255,255];

export function applyAppearance(settings,root=document.documentElement){
  const {theme}=normalizeAppearance(settings),palette=PALETTES.find(p=>p.id===theme),accent=palette.rgb;
  let link=[...accent];
  // Keep the chosen hue while making links readable on the light surfaces.
  while(contrast(link,[255,255,255])<5)link=mix(link,[0,0,0],.04);
  const hover=mix(accent,[0,0,0],.08),soft=mix(accent,[255,255,255],.89);
  const properties={
    '--accent':rgb(accent),'--accent-rgb':accent.join(', '),'--accent-hover':rgb(hover),
    '--on-accent':rgb(foreground(accent)),'--on-accent-hover':rgb(foreground(hover)),
    '--accent-link':rgb(link),'--accent-border':rgb(mix(accent,[255,255,255],.56)),
    '--accent-soft':rgb(soft),'--accent-faint':rgb(mix(accent,[255,255,255],.96)),
    '--green':rgb(link),'--green-dark':rgb(mix(link,[0,0,0],.14)),
    '--soft':rgb(soft),'--lime':rgb(mix(accent,[255,255,255],.66)),
    '--focus':rgb(link),'--bg':'#f6f7f9','--ink':'#263445','--muted':'#5e6c7b',
    '--line':'#e2e7ed','--tblr-primary':rgb(accent),'--tblr-primary-rgb':accent.join(', '),
    '--tblr-body-bg':'#f6f7f9','--tblr-body-color':'#263445','--tblr-border-color':'#e2e7ed',
  };
  for(const [key,value] of Object.entries(properties))root.style.setProperty(key,value);
  root.setAttribute('data-theme',theme);
  return {theme};
}

export function profileInitials(name){
  const text=String(name||'').trim().normalize('NFC');
  if(!text)return 'J';
  const first=typeof Intl.Segmenter==='function'?new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(text)[Symbol.iterator]().next().value.segment:Array.from(text)[0];
  return first.toLocaleUpperCase();
}

export function renderAppearance({settings,e,icon}){
  const {theme}=normalizeAppearance(settings);
  return `<div class="appearance-options" role="group" aria-label="工作台配色">${PALETTES.map(p=>`<button type="button" class="appearance-choice" data-theme="${p.id}" aria-pressed="${p.id===theme}" title="${e(p.name)} · RGB(${p.rgb.join(', ')})"><span class="appearance-swatch" style="--swatch:${rgb(p.rgb)}" aria-hidden="true">${p.id===theme?icon('check'):''}</span><span>${e(p.name)}</span></button>`).join('')}</div><p class="appearance-note">配色自动保存。文字会随底色调整，保持清晰。</p>`;
}
