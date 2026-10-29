// ponytail: 规则匹配只衡量方向覆盖；需要理解研究贡献与方法迁移时升级为有证据的语义匹配。
const TOPICS = [
  { label: '氧还原与燃料电池', keywords: ['ORR', 'oxygen reduction', 'oxygen electroreduction', '氧还原'] },
  { label: 'CO₂ / CO 电还原', keywords: ['CO2RR', 'CO₂RR', 'CORR', 'CO2 reduction', 'CO₂ reduction', 'CO₂ 还原', 'CO2 还原', 'CO₂电还原', 'CO2电还原', 'carbon dioxide reduction', 'CO electroreduction', 'CO2 electroreduction', '二氧化碳电还原', '一氧化碳电还原', '电催化还原二氧化碳'] },
  { label: '铜基催化与多碳产物', keywords: ['copper', 'Cu-based', 'C2+', 'C₂+', 'multicarbon', 'multi-carbon', 'ethylene', 'ethanol', 'C-C coupling', '铜基', '铜催化', '多碳', '乙烯', '乙醇', '碳碳偶联'] },
  { label: '分子与单原子催化', keywords: ['molecular catalysis', 'molecular catalyst', 'single-atom', 'single atom', 'porphyrin', 'phthalocyanine', '分子催化', '单原子', '卟啉', '酞菁'] },
  { label: '原位光谱与反应机理', keywords: ['operando', 'in situ', 'in-situ', 'spectroscopy', 'Raman', 'FTIR', 'XAS', 'XANES', 'EXAFS', '原位', '拉曼', '光谱', '反应机理'] },
  { label: '理论计算与 DFT', keywords: ['DFT', 'density functional', 'first-principles', 'computational catalysis', 'VASP', 'Quantum ESPRESSO', '密度泛函', '第一性原理', '理论计算', '计算催化'] },
  { label: '反应器与电解槽', keywords: ['reactor', 'electrolyzer', 'electrolyser', 'GDE', 'gas diffusion', 'gas-diffusion', 'MEA', 'membrane electrode', 'flow cell', '反应器', '电解槽', '气体扩散', '膜电极', '流动池'] },
  { label: '界面与电解液', keywords: ['electrolyte', 'electrode interface', 'interfacial', 'cation', 'microenvironment', 'ionomer', '界面', '电解液', '阳离子', '微环境', '离聚物'] }
];

const SKILLS = [
  ['电化学测试', ['cyclic voltammetry', 'chronoamperometry', 'electrochemical impedance', '循环伏安', '恒电位', '电化学阻抗', '电化学测试']],
  ['产物定量分析', ['gas chromatography', 'GC-MS', 'HPLC', 'NMR', '气相色谱', '液相色谱', '核磁']],
  ['材料合成与表征', ['synthesis', 'XRD', 'SEM', 'TEM', 'XPS', '材料合成', '材料表征']],
  ['Python / 数据分析', ['Python', 'data analysis', '数据分析']],
  ['理论计算', ['DFT', 'VASP', 'density functional', '理论计算', '密度泛函']]
];

function normalized(text) { return String(text || '').normalize('NFKC').toLowerCase(); }
function contains(text, keyword) {
  const needle = normalized(keyword);
  if (/^[a-z][a-z0-9-]{0,6}$/.test(needle)) {
    return new RegExp(`(^|[^a-z0-9])${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^a-z0-9])`).test(text);
  }
  return text.includes(needle);
}

export function analyzeProfile(text) {
  const value = normalized(text);
  const topics = TOPICS.map(topic => ({ label: topic.label, keywords: topic.keywords.filter(word => contains(value, word)) })).filter(topic => topic.keywords.length);
  const skills = SKILLS.filter(([, words]) => words.some(word => contains(value, word))).map(([label]) => label);
  return { topics, skills, summary: topics.length ? `识别到 ${topics.length} 个研究方向：${topics.map(topic => topic.label).join('、')}。请核对提取结果，再用于导师筛选。` : '暂未识别到具体研究方向。可补充研究课题、实验方法与目标产物后重新分析。' };
}

export function matchMentor(profile, mentor) {
  if (!profile?.topics?.length) return { score: null, matches: [], explanation: '完善研究背景后显示方向覆盖率。' };
  const mentorText = [mentor.name, mentor.summary, ...(mentor.topics || []), ...(mentor.keywords || [])].filter(Boolean).join(' ');
  const mentorLabels = new Set(analyzeProfile(mentorText).topics.map(topic => topic.label));
  const matches = profile.topics.map(topic => typeof topic === 'string' ? topic : topic.label).filter(label => mentorLabels.has(label) || (mentor.topics || []).includes(label));
  const score = Math.round(matches.length / profile.topics.length * 100);
  return { score, matches, explanation: `你的 ${profile.topics.length} 个已识别方向中，${matches.length} 个与导师公开研究方向重合。仅为关键词方向覆盖率，不代表招生意向或录取概率。` };
}

const MAX_SIZE = 10 * 1024 * 1024;
const MAX_TEXT = 1_000_000;
function usableText(text) {
  if (text.length > MAX_TEXT) throw new Error('提取文字超过 100 万字符，请上传精简版简历。');
  const cleaned = text.replace(/\u0000/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  if (cleaned.length < 15) throw new Error('未提取到足够文字。扫描版 PDF 请先进行 OCR，或直接粘贴简历文字。');
  return cleaned;
}

async function extractPdf(file) {
  const pdfjs = await import('./vendor/pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdf.worker.min.mjs', import.meta.url).href;
  const task = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    cMapUrl: new URL('./vendor/cmaps/', import.meta.url).href,
    cMapPacked: true,
    standardFontDataUrl: new URL('./vendor/standard_fonts/', import.meta.url).href,
    isEvalSupported: false,
    useWasm: false
  });
  try {
    const doc = await task.promise;
    if (doc.numPages > 100) throw new Error('PDF 超过 100 页，请上传精简版简历；未进行部分读取。');
    const parts = [];
    for (let index = 1; index <= doc.numPages; index++) {
      const page = await doc.getPage(index);
      const content = await page.getTextContent();
      parts.push(content.items.map(item => (item.str || '') + (item.hasEOL ? '\n' : ' ')).join(''));
      page.cleanup();
    }
    return { text: usableText(parts.join('\n\n')), notice: `已在本机提取 ${doc.numPages} 页 PDF。请核对阅读顺序，双栏版式可能交错。` };
  } catch (error) {
    if (error?.name === 'PasswordException') throw new Error('PDF 已加密，请先移除密码，或粘贴简历文字。');
    throw error;
  } finally { await task.destroy(); }
}

async function extractDocx(file) {
  await import('./vendor/jszip.min.js');
  const zip = await globalThis.JSZip.loadAsync(await file.arrayBuffer());
  const documentFile = zip.file('word/document.xml');
  if (!documentFile) throw new Error('未找到 DOCX 正文，请确认文件格式，或另存为 PDF / TXT。');
  if (documentFile._data?.uncompressedSize > 8 * 1024 * 1024) throw new Error('DOCX 正文过大，请上传精简版简历。');
  const xml = await documentFile.async('string');
  if (xml.length > 8 * 1024 * 1024) throw new Error('DOCX 正文过大，请上传精简版简历。');
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.getElementsByTagName('parsererror').length) throw new Error('DOCX 正文格式损坏，请另存为 PDF 或粘贴文字。');
  const paragraphs = Array.from(doc.getElementsByTagNameNS('*', 'p')).map(paragraph => Array.from(paragraph.getElementsByTagNameNS('*', 't')).map(node => node.textContent).join(''));
  return { text: usableText(paragraphs.join('\n')), notice: '已在本机提取 DOCX 正文。页眉、页脚、图片和批注不参与分析，请核对正文。' };
}

export async function extractResume(file) {
  if (!file || typeof file.arrayBuffer !== 'function') throw new Error('请先选择一份简历文件。');
  if (!file.size) throw new Error('文件为空，请重新选择。');
  if (file.size > MAX_SIZE) throw new Error('文件超过 10 MB，请上传精简版简历。');
  const extension = file.name.toLowerCase().split('.').pop();
  if (!['pdf', 'docx', 'txt', 'md'].includes(extension)) throw new Error('支持 PDF、DOCX、TXT 和 Markdown；旧版 DOC 请先另存为 DOCX。');
  if (extension === 'pdf') return extractPdf(file);
  if (extension === 'docx') return extractDocx(file);
  return { text: usableText(await file.text()), notice: '已在本机读取文本文件。' };
}
