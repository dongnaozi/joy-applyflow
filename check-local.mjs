import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { seedMentors as mentors, rankings } from './dist/mentor-data.js';
const root = fileURLToPath(new URL('./dist/', import.meta.url));
const html = readFileSync(root + 'index.html', 'utf8');
for (const [, url] of html.matchAll(/(?:src|href)="([^"#]+\.(?:css|js|svg)(?:\?[^"#]*)?)"/g)) {
  const asset=url.split('?')[0];
  assert(!asset.startsWith('http'), '页面启动依赖必须随项目保存');
  assert(existsSync(root + asset), `缺少资源：${asset}`);
}
for (const name of ['styles.css', 'workbench.css', 'literature.css', 'dashboard.css', 'planning.css', 'obsidian.css', 'appearance.css', 'vendor/tabler/tabler.min.css']) {
  const css = readFileSync(root + name, 'utf8');
  assert(!/@import/.test(css), `样式不得依赖外部导入：${name}`);
  for (const [, url] of css.matchAll(/url\(([^)]+)\)/g)) {
    const asset = url.trim().replace(/^['"]|['"]$/g, '');
    assert(asset.startsWith('data:') || !/^https?:\/\//.test(asset), '启动字体与图标必须本地可用');
  }
}
const sources = JSON.parse(readFileSync(root + 'vendor/tabler/sources.json', 'utf8'));
assert.equal(sources.version, '1.7.1');
for (const item of sources.files) assert.equal(createHash('sha256').update(readFileSync(root + 'vendor/tabler/' + item.file)).digest('hex'), item.sha256);
assert.equal(new Set(mentors.map(m => m.id)).size, mentors.length);
assert(mentors.filter(m=>m.country==='澳大利亚').length>=2);
assert(mentors.filter(m=>m.country==='加拿大').length>=3);
for(const ranking of rankings){assert.equal(ranking.year,2026);assert(ranking.source.startsWith('https://www.topuniversities.com/'));}
for (const mentor of mentors) {
  assert(mentor.url.startsWith('https://'));
  assert.equal(mentor.team.chineseStudents, null);
  assert.equal(mentor.team.chineseFaculty, null);
}
assert(!html.includes('chatgpt.site'), '本机入口不得依赖旧托管站');
console.log('Local workspace checks passed: offline assets, Tabler provenance, unique records, unknown team counts.');
