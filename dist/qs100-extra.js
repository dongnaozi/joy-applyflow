import {top100School} from './qs100.js';

// Additional QS 2026 institutions; research and appointment evidence is recorded in qs100-extra-research.md.
const rows=[
  {
    id:'nohira-toshiyuki',name:'Toshiyuki Nohira',initials:'TN',school:'Kyoto University',city:'Uji, Kyoto',title:'Professor; Director, Integrated Research Center for Carbon Negative Science',
    researchAreas:['co2rr'],topics:['CO₂ 电还原','熔盐电解','碳材料','碳负排放'],keywords:['CO2RR','CO2 electrolysis','molten salt','carbonate','carbon materials','熔盐','碳酸盐'],
    summary:'研究高温熔盐中的 CO₂ 电解，将捕集的二氧化碳转化为碳材料等有用物质；侧重电解质、碳固定过程与碳负排放系统。',
    url:'https://kdb.iimc.kyoto-u.ac.jp/profile/en.8f0b957bead656f0.html',researchSource:'https://www.iae.kyoto-u.ac.jp/researcher-en/organization-en/center2/main/',publicationsUrl:'https://kdb.iimc.kyoto-u.ac.jp/profile/en.8f0b957bead656f0.html',
    email:'nohira.toshiyuki.8r@kyoto-u.ac.jp',emailSource:'https://www.iae.kyoto-u.ac.jp/faculty-list/'
  },
  {
    id:'kamiya-kazuhide',name:'Kazuhide Kamiya',initials:'KK',school:'The University of Osaka',city:'Toyonaka, Osaka',title:'Associate Professor, Graduate School of Engineering Science',
    researchAreas:['co2rr'],topics:['CO₂ 电还原','多碳产物','界面工程','电解槽'],keywords:['CO2RR','CO2 electrolysis','CORR','carbon monoxide reduction','multicarbon','gas diffusion electrode','GDE','气体扩散电极'],
    summary:'研究 CO₂ 电解与 CO 还原制多碳产物，通过催化剂及多尺度界面设计改进反应选择性，并将材料接入气体扩散电极与电解系统。',
    url:'https://rd.iai.osaka-u.ac.jp/ja/745e5f8f68c396d8.html',researchSource:'https://ocnc.eng.osaka-u.ac.jp/en/researchers',publicationsUrl:'https://rd.iai.osaka-u.ac.jp/ja/745e5f8f68c396d8.html',
    email:'kamiya.kazuhide.es@osaka-u.ac.jp',emailSource:'https://ir.library.osaka-u.ac.jp/repo/ouka/all/93525/AdvMaterInterfaces.pdf'
  },
  {
    id:'maeda-kazuhiko',name:'Kazuhiko Maeda',initials:'KM',school:'Tokyo Institute of Technology',schoolShort:'东京科学大学（原东京工业大学）',city:'Tokyo',title:'Professor, Department of Chemistry, Institute of Science Tokyo',
    researchAreas:['co2rr'],topics:['CO₂ 电还原','分子催化','光电催化','配位高分子'],keywords:['CO2RR','CO2 reduction','photoelectrochemical','coordination polymer','oxyhydride','光阴极','配位聚合物'],
    summary:'研究金属配合物与半导体复合体系的 CO₂ 转化，同时探索配位高分子和氧氢化物的电化学 CO₂ 还原；光催化与电催化均有布局。当前单位为东京科学大学，QS 2026 榜单仍使用原东京工业大学名称。',
    url:'https://strdb.s.isct.ac.jp/html/100001243_en.html',researchSource:'https://www.maeda.chem.sci.isct.ac.jp/',publicationsUrl:'https://www.maeda.chem.sci.isct.ac.jp/publications.html',
    email:'maeda@chem.sci.isct.ac.jp',emailSource:'https://www.maeda.chem.sci.isct.ac.jp/',recruitment:'课题组官网接受校内外硕士、博士进学咨询；名额、资格和资助需另行确认。'
  },
  {
    id:'lee-kwangyeol',name:'Kwangyeol Lee',initials:'KL',school:'Korea University',city:'Seoul',title:'Professor, Department of Chemistry',
    researchAreas:['orr'],topics:['ORR','氧还原','铂合金','纳米晶体'],keywords:['ORR','oxygen reduction','Pt','intermetallic','nanocrystal','lattice mismatch','氧还原','晶格失配'],
    summary:'通过纳米晶体组成、形貌及晶格匹配设计氧还原催化剂，研究铂基合金与纳米片结构对反应活性和稳定性的影响。',
    url:'https://pure.korea.ac.kr/en/persons/kwangyeol-lee/',researchSource:'https://pure.korea.ac.kr/en/persons/kwangyeol-lee/',publicationsUrl:'https://pure.korea.ac.kr/en/persons/kwangyeol-lee/',
    email:'kylee1@korea.ac.kr',emailSource:'https://science.korea.edu/science_en/faculty/chemistry.do'
  },
  {
    id:'ahlquist-marten',name:'Mårten Ahlquist',initials:'MA',school:'KTH Royal Institute of Technology',city:'Stockholm',title:'Professor, Theoretical Chemistry and Biology',
    researchAreas:['co2rr'],topics:['CO₂ 电还原','理论电化学','双电层','分子催化'],keywords:['CO2RR','CO2 electroreduction','DFT','multiscale modeling','electric double layer','cation effects','双电层','阳离子'],
    summary:'用量子化学与多尺度模型解析 CO₂ 电还原，关注电极电解质界面、双电层和离子环境对铜表面及分子催化位点的作用。',
    url:'https://www.kth.se/profile/ahlqui?l=en',researchSource:'https://www.kth.se/profile/ahlqui/publications/?l=en',publicationsUrl:'https://www.kth.se/profile/ahlqui/publications/?l=en',
    email:'ahlqui@kth.se',emailSource:'https://www.kth.se/profile/ahlqui?l=en'
  },
  {
    id:'ott-sascha',name:'Sascha Ott',initials:'SO',school:'Uppsala University',city:'Uppsala',title:'Professor of Synthetic Molecular Chemistry',
    researchAreas:['co2rr'],topics:['CO₂ 电还原','MOF','分子催化','气体扩散电极'],keywords:['CO2RR','CO2 reduction','metal organic framework','MOF','GDE','zero-gap electrolyzer','methanol','ethylene'],
    summary:'将分子催化位点整合到金属有机框架，研究电极结构、气体扩散层与流动电解槽参数协同调控 CO₂ 电还原选择性，包括甲醇和乙烯方向。',
    url:'https://www.uu.se/kontakt-och-organisation/personal?query=N4-1199',researchSource:'https://www.uu.se/en/research/research-projects/project?query=2022-00733_Formas',publicationsUrl:'https://www.uu.se/en/department/chemistry-angstrom-laboratory/research/synthetic-molecular-chemistry/ott-group',
    email:'Sascha.Ott@kemi.uu.se',emailSource:'https://www.uu.se/kontakt-och-organisation/personal?query=N4-1199'
  },
  {
    id:'patzke-greta',name:'Greta R. Patzke',initials:'GP',school:'University of Zurich',city:'Zurich',title:'Full Professor, Department of Chemistry',
    researchAreas:['orr'],topics:['ORR','氧还原','单原子催化','原位表征'],keywords:['ORR','oxygen reduction','single atom','coordination environment','Cu-S','operando','氧还原','配位环境'],
    summary:'结合无机材料合成、谱学与理论研究氧电催化，包含单原子位点局部配位环境对氧还原的影响，以及结构与反应机理的关联。',
    url:'https://www.chem.uzh.ch/en/research/groups/patzke/curriculumVitae.html',researchSource:'https://www.chem.uzh.ch/en/research/groups/patzke/publications.html',publicationsUrl:'https://www.chem.uzh.ch/en/research/groups/patzke/publications.html',
    email:'greta.patzke@chem.uzh.ch',emailSource:'https://www.chem.uzh.ch/en/research/groups/patzke/curriculumVitae.html'
  },
  {
    id:'studt-felix',name:'Felix Studt',initials:'FS',school:'Karlsruhe Institute of Technology',city:'Karlsruhe',title:'Professor of Applied Computational Catalysis',
    researchAreas:['co2rr'],topics:['CO₂ 电还原','DFT 计算','微观动力学','催化剂筛选'],keywords:['CO2RR','CO2 electroreduction','DFT','computational hydrogen electrode','microkinetic','CuZn','电催化'],
    summary:'通过密度泛函理论与动力学模型研究 CO₂ 转化催化，覆盖热催化与电化学过程；电还原相关研究包括铜锌表面的吸附、电势及反应机理。',
    url:'https://www.ikft.kit.edu/english/775_624.php',researchSource:'https://publikationen.bibliothek.kit.edu/1000189796',publicationsUrl:'https://www.ikft.kit.edu/232.php',
    email:'felix.studt@kit.edu',emailSource:'https://www.itcp.kit.edu/downloads/ITCP-Research%20and%20WorkingGroups%20Brosch%C3%BCre%202023.pdf'
  },
  {
    id:'robert-marc',name:'Marc Robert',initials:'MR',school:'Sorbonne University',city:'Paris',title:'Distinguished Professor of Chemistry; eMOCA group leader',
    researchAreas:['co2rr'],topics:['CO₂ 电还原','分子催化','质子耦合电子转移','C₁ 产物'],keywords:['CO2RR','CO2 reduction','molecular catalysis','PCET','methanol','carbon monoxide','molecular catalyst','分子催化'],
    summary:'研究分子催化剂中的电子与质子转移，调控 CO₂ 还原为 CO、甲醇、烃及更复杂产物的选择性。2024 年夏加入索邦大学，现任 eMOCA 组负责人。',
    url:'https://ipcm.fr/en/en-research/en-presentation-emoca-group/en-emoca-group-members/en-marc-robert/',researchSource:'https://ipcm.fr/en/en-research/en-presentation-emoca-group/en-emoca-group-members/en-marc-robert/',publicationsUrl:'https://ipcm.fr/en/en-research/en-presentation-emoca-group/en-emoca-group-members/en-marc-robert/',
    email:'marc.robert@sorbonne-universite.fr',emailSource:'https://www.uu.se/download/18.184cd93719c750f45381503e/1771833199574/2nd%20A%CC%8AEI%20Workshop_program_20-02.pdf',
    relations:[{name:'Claude Andrieux',type:'博士导师',source:'https://ipcm.fr/en/en-research/en-presentation-emoca-group/en-emoca-group-members/en-marc-robert/',evidence:'IPCM 个人简历明确列出博士研究由 Claude Andrieux 与 Jean-Michel Savéant 指导。'},{name:'Jean-Michel Savéant',type:'博士导师',source:'https://ipcm.fr/en/en-research/en-presentation-emoca-group/en-emoca-group-members/en-marc-robert/',evidence:'IPCM 个人简历明确列出博士导师。'}]
  },
  {
    id:'nicolas-emmanuel',name:'Emmanuel Nicolas',initials:'EN',school:'Université Paris-Saclay',schoolShort:'巴黎萨克雷大学 · CEA/NIMBE',city:'Gif-sur-Yvette',title:'CEA Research Director; Head of LCMCE (NIMBE)',
    researchAreas:['co2rr'],topics:['CO₂ 电还原','分子催化','串联催化','C₁ 分子'],keywords:['CO2RR','CO2 electrocatalysis','electrocatalytic','tandem catalysis','carbonylation','formic acid','methanol','电催化'],
    summary:'研究 CO₂ 转化和 C₁ 分子串联催化，结合有机金属化学、机理分析与 DFT；2026 年博士课题包括 CO₂ 与烯烃电催化耦合。任职 CEA/NIMBE，属于巴黎萨克雷大学研究体系，并非大学教授职称。',
    url:'https://iramis.cea.fr/en/pisp/emmanuel-nicolas/',researchSource:'https://iramis.cea.fr/wp-content/uploads/2026/02/Couplage-Electrocatalyse-dOlefines-et-de-CO2-pour-la-Synthese-de-Molecules-Durables.pdf',publicationsUrl:'https://iramis.cea.fr/en/pisp/emmanuel-nicolas/',
    affiliationSource:'https://iramis.cea.fr/nimbe/presentation-nimbe/'
  },
  {
    id:'li-gang-kevin',name:'Gang (Kevin) Li',initials:'GL',school:'The University of Melbourne',city:'Melbourne',title:'Associate Professor, Department of Chemical Engineering',
    researchAreas:['co2rr'],topics:['CO₂ 电还原','液态金属','碳捕集','过程工程'],keywords:['CO2RR','CO2 electroreduction','liquid metal','gallium','indium','carbon capture','液态金属','镓铟合金'],
    summary:'研究碳捕集、低碳过程及 CO₂ 利用，电还原相关工作包括调控液态镓铟合金的表面富集，构建可促进 CO₂ 电化学转化的催化界面。',
    url:'https://findanexpert.unimelb.edu.au/profile/488233-gang-li',researchSource:'https://advanced.onlinelibrary.wiley.com/doi/abs/10.1002/adfm.202316435',publicationsUrl:'https://chemical.eng.unimelb.edu.au/clean-energy',
    email:'li.g@unimelb.edu.au',emailSource:'https://chemical.eng.unimelb.edu.au/research/electrochemical-engineering'
  },
  {
    id:'yin-zongyou',name:'Zongyou Yin',initials:'ZY',school:'Australian National University',city:'Canberra',title:'Professor, Research School of Chemistry',
    researchAreas:['co2rr'],topics:['CO₂ 电还原','纳米催化','多碳产物','材料设计'],keywords:['CO2RR','CO2 electroreduction','C3+','nanocatalyst','copper','indium','machine learning','多碳产物'],
    summary:'研究纳米材料结构与催化性能，覆盖电化学和光催化 CO₂ 转化；CO₂ 电还原包括铟位点制甲酸盐，以及铜基催化剂制 C₃+ 含氧产物的机理与设计。',
    url:'https://researchportalplus.anu.edu.au/en/persons/zongyou-yin/',researchSource:'https://openresearch-repository.anu.edu.au/entities/publication/7d985681-35af-429b-a957-0cde817d2e15',publicationsUrl:'https://researchportalplus.anu.edu.au/en/persons/zongyou-yin/',
    email:'Zongyou.Yin@anu.edu.au',emailSource:'https://chemistry.anu.edu.au/research/research-projects/advanced-nanocatalysts-energy-conversion',recruitment:'官方研究项目接受博士方向咨询；具体课题、名额与资助需导师确认。'
  },
  {
    id:'yang-dan-uwa',name:'Dan Yang',initials:'DY',school:'The University of Western Australia',city:'Perth',title:'Lecturer, School of Engineering',
    researchAreas:['co2rr','orr'],topics:['CO₂ 电还原','ORR','液态金属','电解槽'],keywords:['CO2RR','CO2 reduction','ORR','oxygen reduction','liquid metal','recyclable catalyst','electrolyzer','液态金属'],
    summary:'研究液态金属电催化与可回收催化材料，官网明确覆盖 CO₂ 还原、氧还原及析氢，并探索可放大的电解槽与碳负排放技术。',
    url:'https://research-repository.uwa.edu.au/en/persons/dan-yang/',researchSource:'https://research-repository.uwa.edu.au/en/persons/dan-yang/',publicationsUrl:'https://research-repository.uwa.edu.au/en/persons/dan-yang/',
    recruitment:'官方人物页标注接受 PhD/HDR 学生；具体项目、共同导师安排和资助需另行确认。'
  },
  {
    id:'wang-guoxiu',name:'Guoxiu Wang',initials:'GW',school:'University of Technology Sydney',city:'Sydney',title:'Distinguished Professor; Director, Centre for Clean Energy Technology',
    researchAreas:['co2rr'],topics:['CO₂ 电还原','配对电解','甲酸','多功能电极'],keywords:['CO2RR','CO2 electroreduction','paired electrolysis','methanol oxidation','formic acid','CuBi','配对电解','甲酸'],
    summary:'研究能源材料与电化学，CO₂ 转化工作包括 CO₂ 阴极还原与甲醇阳极氧化的配对体系，利用合金及复合电极提高甲酸联产效率；同时有 CO₂/硝酸盐耦合电合成研究。',
    url:'https://profiles.uts.edu.au/Guoxiu.Wang',researchSource:'https://www.uts.edu.au/research/centres/centre-clean-energy-technology/our-research/research-highlights/contentassets/ccet-research-highlights-2025.pdf',publicationsUrl:'https://profiles.uts.edu.au/Guoxiu.Wang',
    email:'Guoxiu.Wang@uts.edu.au',emailSource:'https://profiles.uts.edu.au/Guoxiu.Wang'
  },
  {
    id:'lu-yi-chun',name:'Yi-Chun Lu',initials:'YL',school:'The Chinese University of Hong Kong',city:'Hong Kong',title:'Professor, Department of Mechanical and Automation Engineering',
    researchAreas:['co2rr','orr'],topics:['ORR','金属空气电池','原位表征','Li–CO₂ 电池'],keywords:['ORR','oxygen reduction','CO2RR','CO2 electroreduction','Li-CO2','metal oxygen battery','APXPS','金属空气电池','锂二氧化碳电池'],
    researchSummaries:{co2rr:'以储能电池为应用场景，利用原位环境压 X 射线光电子谱研究离子液体中的 CO₂ 电化学还原与 Li–CO₂ 电池机理；与常规流动电解槽制燃料方向有所区别。',orr:'研究金属空气电池中的氧还原/析氧、电极电解液界面与反应稳定性，关注催化剂评价、原位表征和电解液设计。'},
    summary:'以电化学储能为主要应用，研究金属空气电池中的氧反应及界面机理，并有 Li–CO₂ 电池中 CO₂ 电还原的原位表征研究。其重点包含电池和液流储能，申请时需确认具体 ORR 或 CO₂ 课题。',
    url:'https://www4.mae.cuhk.edu.hk/peoples/lu-yi-chun/',researchSource:'https://www.yclueeil.com/publications',publicationsUrl:'https://www.yclueeil.com/publications',
    email:'yichunlu@mae.cuhk.edu.hk',emailSource:'https://www4.mae.cuhk.edu.hk/peoples/lu-yi-chun/'
  }
];
export const mentors=rows.map(row=>{
  const qs=top100School(row.school);
  if(!qs)throw Error('Additional faculty has no QS 2026 top-100 institution: '+row.school);
  return {schoolShort:qs.schoolShort,country:qs.country,email:'',emailSource:'',recruitment:'具体博士名额、申请资格、导师权限和资助情况待官网进一步确认。',verifiedAt:'2026-10-29',papers:[],relations:[],team:{chineseStudents:null,chineseFaculty:null,note:'没有完整公开统计；不根据姓名或照片推断国籍。'},...row,qs};
});
export const rankings=[...new Set(mentors.map(m=>m.school))].map(top100School);
