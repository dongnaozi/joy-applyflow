import assert from 'node:assert/strict';
import {PALETTES,normalizeAppearance,applyAppearance,profileInitials,renderAppearance} from './dist/appearance.js';

function channels(value){return value.match(/[\d.]+/g).map(Number);}
function luminance(color){const s=color.map(n=>n/255).map(n=>n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4));return s[0]*.2126+s[1]*.7152+s[2]*.0722;}
function contrast(a,b){const first=luminance(a),second=luminance(b);return (Math.max(first,second)+.05)/(Math.min(first,second)+.05);}
assert.equal(PALETTES.length,9);
assert.deepEqual(normalizeAppearance({theme:'<script>'}),{theme:'lake'});
assert.deepEqual(normalizeAppearance(null),{theme:'lake'});
for(const palette of PALETTES){
  const tokens=new Map();let selected='';
  applyAppearance({theme:palette.id},{style:{setProperty:(name,value)=>tokens.set(name,value)},setAttribute:(name,value)=>{if(name==='data-theme')selected=value;}});
  assert.equal(selected,palette.id);
  assert.deepEqual(channels(tokens.get('--accent')),palette.rgb,'User color must remain exact');
  assert(contrast(channels(tokens.get('--accent')),channels(tokens.get('--on-accent')))>=4.5,`${palette.id}: button contrast`);
  assert(contrast(channels(tokens.get('--accent-hover')),channels(tokens.get('--on-accent-hover')))>=4.5,`${palette.id}: hover contrast`);
  assert(contrast(channels(tokens.get('--accent-link')),[255,255,255])>=4.5,`${palette.id}: link contrast`);
  assert(contrast(channels(tokens.get('--accent-link')),channels(tokens.get('--accent-soft')))>=4.5,`${palette.id}: selected text contrast`);
}
assert.equal(profileInitials(' joy '),'J');
assert.equal(profileInitials(' 李明'),'李');
assert.equal(profileInitials(''),'J');
assert.equal(profileInitials('e\u0301lodie'),'É');
assert.equal(profileInitials('👩‍🔬 Joy'),'👩‍🔬');
const html=renderAppearance({settings:{theme:'rose'},e:String,icon:()=>'<svg></svg>'});
assert.equal((html.match(/data-theme=/g)||[]).length,9);
assert.equal((html.match(/aria-pressed="true"/g)||[]).length,1);
assert(html.includes('data-theme="rose" aria-pressed="true"'));
console.log('Appearance checks passed: exact palettes, accessible button/link contrast, safe defaults and Unicode initials.');
