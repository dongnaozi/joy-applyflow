// Official faculty/group sources reviewed 2026-10-29; research cohort, not an exhaustive faculty census.
import {top100School} from './qs100.js';

const areaKeywords={co2rr:['CO2','CO2RR','carbon dioxide','二氧化碳电还原'],orr:['ORR','oxygen reduction','氧还原']};
function faculty(item){
  const qs=top100School(item.school);
  if(!qs)throw Error('New faculty must belong to the QS 2026 top 100: '+item.school);
  return {city:'',email:'',emailSource:'',papers:[],relations:[],verifiedAt:'2026-10-29',...item,
    school:qs.school,schoolShort:qs.schoolShort,country:qs.country,qs,
    initials:item.name.replace(/\([^)]*\)/g,'').split(/\s+/).filter(Boolean).map(x=>x[0]).slice(0,2).join('').toUpperCase(),
    keywords:[...new Set([...(item.researchAreas||[]).flatMap(area=>areaKeywords[area]||[]),...item.topics,...item.keywords||[]])],
    team:{chineseStudents:null,chineseFaculty:null,note:'暂无可核实的完整公开统计；不依据姓名或照片推断国籍。'},
    recruitment:item.recruitment||'博士招生名额与资助情况待向学校及导师核实。'};
}

export const mentors=[
  {
    id:'buonsanti',name:'Raffaella Buonsanti',school:'École Polytechnique Fédérale de Lausanne',title:'Full Professor of Chemical Engineering',researchAreas:['co2rr'],
    topics:['铜纳米晶','胶体合成','工作态重构'],summary:'利用可控胶体纳米晶合成研究 CO₂ 电还原，关注铜催化剂形貌、配体与反应中结构变化之间的关系。',
    url:'https://www.epfl.ch/labs/lnce/buonsanti/',researchSource:'https://www.epfl.ch/labs/lnce/publications/',publicationsUrl:'https://www.epfl.ch/labs/lnce/publications/',email:'raffaella.buonsanti@epfl.ch',emailSource:'https://people.epfl.ch/raffaella.buonsanti'
  },
  {
    id:'schmidt-thomas',name:'Thomas J. Schmidt',school:'ETH Zurich',title:'Full Professor and Chair for Electrochemistry; PSI Center Head',researchAreas:['co2rr','orr'],
    topics:['燃料电池','CO₂共电解','原位诊断'],summary:'研究聚合物电解质燃料电池、电催化和 CO₂ 共电解，结合器件工程与同步辐射、中子等原位诊断方法。',
    url:'https://chab.ethz.ch/en/the-department/people/a-z/person-detail.thschmidt.html',researchSource:'https://chab.ethz.ch/en/the-department/people/a-z/person-detail.thschmidt.html',email:'thomas.schmidt@phys.chem.ethz.ch',emailSource:'https://chab.ethz.ch/en/the-department/people/a-z/person-detail.thschmidt.html'
  },
  {
    id:'gasteiger',name:'Hubert A. Gasteiger',school:'Technical University of Munich',title:'Professor; Chair of Technical Electrochemistry',researchAreas:['orr'],
    topics:['ORR','铂合金','质子交换膜燃料电池'],summary:'开发用于 PEM 燃料电池的高活性、耐久氧还原催化剂，研究碳载铂合金纳米颗粒、腐蚀与实际电极性能。',
    url:'https://www.crc.tum.de/crc/crc-researchers/principal-investigators/hubert-a-gasteiger/',researchSource:'https://www.crc.tum.de/crc/crc-researchers/principal-investigators/hubert-a-gasteiger/'
  },
  {
    id:'bandarenka',name:'Aliaksandr S. Bandarenka',school:'Technical University of Munich',title:'Professor of Physics of Energy Conversion and Storage',researchAreas:['orr'],
    topics:['ORR','电化学表面科学','界面结构'],summary:'从模型表面和电化学表面科学出发设计催化剂，研究铂纳米颗粒缺陷、带电界面与氧还原活性。',
    url:'https://www.crc.tum.de/en/crc/crc-researchers/principal-investigators/aliaksandr-s-bandarenka/',researchSource:'https://www.crc.tum.de/en/crc/crc-researchers/principal-investigators/aliaksandr-s-bandarenka/'
  },
  {
    id:'weatherup',name:'Robert Weatherup',school:'University of Oxford',title:'Professor of Energy Materials',researchAreas:['co2rr'],
    topics:['原位X射线','铜基催化剂','电解质与界面'],summary:'开发可在工作条件下观测材料界面的 X 射线方法；CO₂ 电解课题关注铜催化剂、阳离子作用和多碳产物选择性。',
    url:'https://www.materials.ox.ac.uk/peoplepages/weatherup.html',researchSource:'https://www.materials.ox.ac.uk/article/investigating-the-role-of-anions-and-cations-in-the-electrochemical-reduction-of-carbon-diox',email:'robert.weatherup@materials.ox.ac.uk',emailSource:'https://www.materials.ox.ac.uk/peoplepages/weatherup.html'
  },
  {
    id:'stamatakis',name:'Michail Stamatakis',school:'University of Oxford',title:'Professor of Computational Inorganic Chemistry',researchAreas:['co2rr'],
    topics:['理论催化','动力学蒙特卡罗','钙钛矿电极'],summary:'通过多尺度计算与动力学模型研究催化反应，参与钙钛矿铜基材料 CO₂ 电还原的活性位点与产物选择性研究。',
    url:'https://www.chem.ox.ac.uk/people/michail-stamatakis',researchSource:'https://www.chem.ox.ac.uk/sitefiles/advert-imat-projects-2024-25.pdf-0',email:'michail.stamatakis@chem.ox.ac.uk',emailSource:'https://www.chem.ox.ac.uk/people/michail-stamatakis'
  },
  {
    id:'cobb-sam',name:'Sam Cobb',school:'The University of Manchester',title:'Lecturer in Electrochemistry',researchAreas:['co2rr'],
    topics:['电解槽原型','多物理场模型','捕集与转化'],summary:'研究 CO₂ 电还原的电极微环境与电解槽结构，将实验、多物理场模型、生物催化和快速器件原型开发结合。',
    url:'https://www.scieng.manchester.ac.uk/tomorrowlabs/sustainable-electrochemical-technologies-lab/',researchSource:'https://www.scieng.manchester.ac.uk/tomorrowlabs/sustainable-electrochemical-technologies-lab/'
  },
  {
    id:'dryfe',name:'Robert Dryfe',school:'The University of Manchester',title:'Professor of Physical Chemistry',researchAreas:['co2rr','orr'],
    topics:['电化学界面','分子催化','碳材料'],summary:'研究石墨烯与液液界面电化学；公开研究与论文涉及分子催化 CO₂ 还原和碳材料氧还原。具体博士课题须核实。',
    url:'https://research.manchester.ac.uk/en/persons/robert.dryfe',researchSource:'https://www.mub.eps.manchester.ac.uk/robert-dryfe-electrochemistry/publications/',email:'robert.dryfe@manchester.ac.uk',emailSource:'https://www.mub.eps.manchester.ac.uk/robert-dryfe-electrochemistry/enquiries/'
  },
  {
    id:'symes',name:'Mark D. Symes',school:'University of Glasgow',title:'Professor of Electrochemistry and Electrochemical Technology',researchAreas:['co2rr'],
    topics:['分子催化','多金属电极','超声电化学'],summary:'研究 CO₂ 电还原、电合成和新型电化学技术，课题包括酞菁分子催化、多金属电极及超声促进传质。',
    url:'https://www.gla.ac.uk/schools/chemistry/staff/marksymes/',researchSource:'https://www.gla.ac.uk/schools/chemistry/staff/marksymes/',email:'Mark.Symes@glasgow.ac.uk',emailSource:'https://www.gla.ac.uk/schools/chemistry/staff/marksymes/'
  },
  {
    id:'fermin',name:'David J. Fermin',school:'University of Bristol',title:'Professor of Electrochemistry',researchAreas:['co2rr','orr'],
    topics:['局部反应环境','氧电催化','金属氧化物'],summary:'研究电极材料电子结构与催化行为；公开博士课题包括 CO₂ 电还原局部环境和钙钛矿氧电催化。',
    url:'https://www.bristol.ac.uk/people/person/David-Fermin-6af10906-eefc-446a-98c7-b2e99b1c435b/',researchSource:'https://www.bristol.ac.uk/people/person/David-Fermin-6af10906-eefc-446a-98c7-b2e99b1c435b/',email:'David.Fermin@bristol.ac.uk',emailSource:'https://www.bristol.ac.uk/people/person/David-Fermin-6af10906-eefc-446a-98c7-b2e99b1c435b/'
  },
  {
    id:'wang-feng-ryan',name:'Feng Ryan Wang',school:'University College London',title:'Professor of Chemical Engineering',researchAreas:['co2rr','orr'],
    topics:['原位X射线','催化剂稳定性','铂基催化'],summary:'以工作态和时间分辨 X 射线谱学研究催化材料，公开成果涉及 CO₂ 转化及氧还原催化剂的氧化稳定性。',
    url:'https://www.ucl.ac.uk/engineering/chemical-engineering/research/materials-and-catalysis-laboratory/mcl-people',researchSource:'https://www.ucl.ac.uk/engineering/events/2026/apr/engineering-net-zero-materials-through-x-ray-diagnostics-professor-feng-ryan-wang',email:'ryan.wang@ucl.ac.uk',emailSource:'https://www.ucl.ac.uk/soft-materials/people'
  },
  {
    id:'brett',name:'Dan J. L. Brett',school:'University College London',title:'Professor of Electrochemical Engineering',researchAreas:['orr'],
    topics:['ORR','燃料电池','器件诊断'],summary:'研究电化学能源器件和诊断方法，参与铂基及钯合金氧还原催化剂、燃料电池性能与稳定性研究。',
    url:'https://www.ucl.ac.uk/engineering/news/2020/jul/scientists-develop-new-catalyst-material-longer-lasting-fuel-cells',researchSource:'https://discovery.ucl.ac.uk/id/eprint/10159627/1/1-s2.0-S0021951722004456-main.pdf'
  },
  {
    id:'zhang-jie',name:'Jie Zhang',school:'Monash University',title:'Professor, School of Chemistry',researchAreas:['co2rr'],
    topics:['零间隙电解槽','分子催化','电化学数据分析'],summary:'开发小分子电化学转化和零间隙 CO₂ 电解槽，研究催化剂、电极架构、定量电化学与机器学习分析。',
    url:'https://research.monash.edu/en/persons/jie-zhang/',researchSource:'https://research.monash.edu/en/persons/jie-zhang/',email:'jie.zhang@monash.edu',emailSource:'https://www.monash.edu/science/schools/chemistry/about-us/leadership-team',recruitment:'2026-10-29 核验时，Monash 研究者主页标注 Accepting PhD Students；具体项目和资助待确认。'
  },
  {
    id:'qiao-shizhang',name:'Shizhang Qiao',school:'Adelaide University',title:'Professor; ARC Industry Laureate Fellow',researchAreas:['co2rr','orr'],
    topics:['铜基催化剂','局部反应环境','氧还原'],summary:'设计能源电催化纳米材料，研究 CO₂ 向多碳产物的转化、铜氧化态及界面环境，同时涉及氧还原催化。',
    url:'https://researchers.adelaide.edu.au/profile/s.qiao',researchSource:'https://researchers.adelaide.edu.au/profile/s.qiao',email:'s.qiao@adelaide.edu.au',emailSource:'https://adelaide.edu.au/people/s.qiao'
  },
  {
    id:'zheng-yao',name:'Yao Zheng',school:'Adelaide University',title:'Grant-Funded Research Professor',researchAreas:['co2rr','orr'],
    topics:['局部反应环境','铜基催化剂','理论与实验'],summary:'结合计算和原位表征研究 CO₂ 转化与氧还原，关注催化剂局部反应环境、反应机理和电催化炼制。',
    url:'https://researchers.adelaide.edu.au/profile/yao.zheng01',researchSource:'https://researchers.adelaide.edu.au/profile/yao.zheng01',email:'yao.zheng01@adelaide.edu.au',emailSource:'https://adelaide.edu.au/people/yao.zheng01'
  },
  {
    id:'jiao-yan',name:'Yan Jiao',school:'Adelaide University',title:'Professor; Dean, School of Chemical Engineering',researchAreas:['co2rr'],
    topics:['计算电化学','界面溶剂化','机器学习'],summary:'利用分子模拟、第一性原理和机器学习研究 CO₂ 电还原催化剂与反应微环境，关注多碳产物路径和电极界面。',
    url:'https://researchers.adelaide.edu.au/profile/yan.jiao',researchSource:'https://researchers.adelaide.edu.au/profile/yan.jiao',email:'yan.jiao@adelaide.edu.au',emailSource:'https://researchers.adelaide.edu.au/profile/yan.jiao'
  },
  {
    id:'dai-liming',name:'Liming Dai',school:'UNSW Sydney',title:'Scientia Professor; ARC Laureate Fellow',researchAreas:['orr'],
    topics:['ORR','无金属碳催化','掺杂碳材料'],summary:'研究功能化碳材料和无金属电催化剂，公开成果涵盖氮、磷掺杂碳材料的氧还原与能源器件应用。',
    url:'https://research.unsw.edu.au/people/scientia-professor-liming-dai',researchSource:'https://www.dgfi.unsw.edu.au/liming-dai',email:'l.dai@unsw.edu.au',emailSource:'https://www.dgfi.unsw.edu.au/liming-dai'
  },
  {
    id:'zhang-xiwang',name:'Xiwang Zhang',school:'The University of Queensland',title:'Endowed Dow Chair in Sustainable Engineering; GETCO2 Centre Director',researchAreas:['co2rr'],
    topics:['膜与分离','捕集与转化','电解槽'],summary:'领导 GETCO2 中心，围绕膜、资源回收与 CO₂ 电化学转化开发过程和器件，包括捕集 CO₂ 制甲酸盐。',
    url:'https://about.uq.edu.au/experts/33830',researchSource:'https://news.uq.edu.au/2026-05-uq-tech-turns-captured-co2-valuable-chemicals',email:'xiwang.zhang@uq.edu.au',emailSource:'https://about.uq.edu.au/experts/33830?page=1'
  },
  {
    id:'rufford',name:'Tom Rufford',school:'The University of Queensland',title:'Professor, School of Chemical Engineering',researchAreas:['co2rr'],
    topics:['气体扩散电极','电解槽放大','稳定性'],summary:'研究 CO₂ 电解、电极材料与过程放大，公开博士项目涉及气体扩散电极、界面工程和加速耐久性测试。',
    url:'https://about.uq.edu.au/experts/930',researchSource:'https://about.uq.edu.au/experts/930',recruitment:'2026-10-29 核验时，UQ 主页标注 Not available for supervision；请勿视为当前有招生名额。'
  },
  {
    id:'wang-ziyun',name:'Ziyun Wang',school:'The University of Auckland',title:'Associate Professor; PhD/Doctoral Accredited Supervisor',researchAreas:['co2rr'],
    topics:['理论催化','溶剂与电场','机器学习'],summary:'用计算化学和机器学习研究 CO₂ 电还原，关注真实固液界面的溶剂、电场与催化剂设计。',
    url:'https://profiles.auckland.ac.nz/ziyun-wang',researchSource:'https://profiles.auckland.ac.nz/ziyun-wang',email:'ziyun.wang@auckland.ac.nz',emailSource:'https://profiles.auckland.ac.nz/ziyun-wang'
  },
  {
    id:'yeo',name:'Boon Siang Jason Yeo',school:'National University of Singapore',title:'Associate Professor, Department of Chemistry',researchAreas:['co2rr'],
    topics:['多碳产物','原位拉曼','铜与镍催化'],summary:'研究 CO₂/CO 向多碳化学品的电还原，通过原位谱学和催化材料设计分析吸附 CO、界面环境与碳链增长。',
    url:'https://chemistry.nus.edu.sg/people/yeo-boon-siang-jason/',researchSource:'https://chemistry.nus.edu.sg/people/yeo-boon-siang-jason/',publicationsUrl:'https://chemistry.nus.edu.sg/people/yeo-boon-siang-jason/'
  },
  {
    id:'wong-andrew',name:'Andrew Barnabas Wong',school:'National University of Singapore',title:'Assistant Professor; Presidential Young Professor',researchAreas:['co2rr'],
    topics:['反应微环境','碳酸氢盐还原','生物电化学'],summary:'研究 CO₂ 电还原的局部微环境，开发纳米材料、生物聚合物界面与碳酸氢盐转化体系，改善多碳产物选择性。',
    url:'https://cde.nus.edu.sg/chbe/staff/wong-andrew-barnabas/',researchSource:'https://cde.nus.edu.sg/chbe/staff/wong-andrew-barnabas/',publicationsUrl:'https://cde.nus.edu.sg/chbe/staff/wong-andrew-barnabas/'
  },
  {
    id:'wang-lei-nus',name:'Lei Wang',school:'National University of Singapore',title:'Assistant Professor; Presidential Young Professor',researchAreas:['co2rr'],
    topics:['局部水与CO₂比例','铜银催化','工作态结构'],summary:'研究高反应速率 CO₂ 电还原，调控催化层局部水与 CO₂ 比例，并跟踪铜银材料在 CO 电还原中的结构演变。',
    url:'https://cde.nus.edu.sg/chbe/staff/wang-lei/',researchSource:'https://cde.nus.edu.sg/chbe/staff/wang-lei/',publicationsUrl:'https://cde.nus.edu.sg/chbe/staff/wang-lei/'
  },
  {
    id:'guo-zhengxiao',name:'Zheng Xiao Guo',school:'The University of Hong Kong',title:'Chair Professor of Chemistry and Materials Science',researchAreas:['co2rr','orr'],
    topics:['理论与实验','单原子催化','氧还原'],summary:'开展材料合成、模拟与电催化研究，涵盖 CO₂ 分子转化、燃料电池及分子铜配合物氧还原反应。',
    url:'https://mse.hku.hk/people/zxguo/',researchSource:'https://zxguo.hku.hk/research/',publicationsUrl:'https://zxguo.hku.hk/publications/',email:'zxguo@hku.hk',emailSource:'https://zxguo.hku.hk/'
  },
  {
    id:'ye-ruquan',name:'Ruquan Ye',school:'City University of Hong Kong',title:'Professor, Department of Chemistry',researchAreas:['co2rr'],
    topics:['分子催化','酸性CO₂还原','微环境调控'],summary:'研究 CO₂ 电化学转化与催化材料，近期官方成果包括微环境调控钴酞菁在酸性介质中制甲醇。',
    url:'https://www.cityu.edu.hk/en/chem/people/academic-staff/rqye',researchSource:'https://www.cityu.edu.hk/en/chem/people/academic-staff/rqye',email:'ruquanye@cityu.edu.hk',emailSource:'https://www.cityu.edu.hk/en/chem/people/academic-staff/rqye'
  },
  {
    id:'lau-daniel',name:'Daniel Lau',school:'The Hong Kong Polytechnic University',title:'Chair Professor of Nanomaterials',researchAreas:['co2rr'],
    topics:['CO₂制乙烯','电解系统','器件稳定性'],summary:'开发将 CO₂ 电还原为乙烯的催化材料和系统，推进器件稳定性与工业应用研究。',
    url:'https://www.polyu.edu.hk/pair/news-and-events/news/2025/20250228-pair-research-impact-video-series--episode-3/',researchSource:'https://www.polyu.edu.hk/pair/news-and-events/news/2025/20250228-pair-research-impact-video-series--episode-3/'
  },
  {
    id:'xu-bingjun',name:'Bingjun Xu',school:'Peking University',title:'Professor of Physical Chemistry',researchAreas:['co2rr','orr'],
    topics:['原位谱学','电双层','催化层传质'],summary:'结合原位红外和拉曼研究 CO₂/CO 电还原，解析铜位点、阳离子效应和气体扩散电极催化层；也研究氧还原界面。',
    url:'https://www.chem.pku.edu.cn/bingjunxu/xbjlsgrym/index.htm',researchSource:'https://www.chem.pku.edu.cn/bingjunxu/publications/index.htm',publicationsUrl:'https://www.chem.pku.edu.cn/bingjunxu/publications/index.htm',email:'b_xu@pku.edu.cn',emailSource:'https://www.chem.pku.edu.cn/bingjunxu/xbjlsgrym/index.htm'
  },
  {
    id:'chang-xiaoxia',name:'Xiaoxia Chang',school:'Peking University',title:'Associate Researcher, College of Chemistry and Molecular Engineering',researchAreas:['co2rr'],
    topics:['原位界面表征','电堆','光电催化'],summary:'研究 CO₂ 还原与光电化学反应体系，关注工作态界面、反应机理以及高效电化学反应堆。',
    url:'https://www.chem.pku.edu.cn/szll/zzjs/wlhxyjs1/9hxyzww146705.htm',researchSource:'https://www.chem.pku.edu.cn/szll/zzjs/wlhxyjs1/9hxyzww146705.htm',email:'changxx@pku.edu.cn',emailSource:'https://www.chem.pku.edu.cn/szll/zzjs/wlhxyjs1/9hxyzww146705.htm'
  },
  {
    id:'guo-shaojun',name:'Shaojun Guo',school:'Peking University',title:'Boya Distinguished Professor; Tenured Professor; PhD Supervisor',researchAreas:['co2rr','orr'],
    topics:['应变催化','界面水','燃料电池'],summary:'研究纳米催化材料应变与界面调控，公开成果包括 CO₂ 电制甲酸盐的图灵结构催化剂和低铂氧还原催化剂。',
    url:'https://www.mse.pku.edu.cn/info/1204/1242.htm',researchSource:'https://www.mse.pku.edu.cn/info/1012/3833.htm',publicationsUrl:'https://faculty.pku.edu.cn/guoshaojun/zh_CN/zhym/49154/list/index.htm',email:'guosj@pku.edu.cn',emailSource:'https://www.mse.pku.edu.cn/info/1204/1242.htm'
  },
  {
    id:'wang-dingsheng',name:'Dingsheng Wang',school:'Tsinghua University',title:'Professor of Chemistry',researchAreas:['co2rr','orr'],
    topics:['单原子催化','配位结构','氧还原'],summary:'设计单原子、原子簇和纳米催化材料，研究配位结构对氧还原及甲烷电合成等反应的影响。',
    url:'https://www.chem.tsinghua.edu.cn/info/1097/2293.htm',researchSource:'https://www.chem.tsinghua.edu.cn/info/1097/2293.htm',publicationsUrl:'https://www.chem.tsinghua.edu.cn/info/1097/2293.htm',email:'wangdingsheng@mail.tsinghua.edu.cn',emailSource:'https://www.chem.tsinghua.edu.cn/info/1097/2293.htm'
  },
  {
    id:'zheng-gengfeng',name:'Gengfeng Zheng',school:'Fudan University',title:'Professor; PhD Supervisor',researchAreas:['co2rr'],
    topics:['铜基催化剂','碳基分子','光电催化'],summary:'设计纳米催化材料，研究 CO₂ 向燃料及多碳产物的光、电化学转化与催化剂结构调控。',
    url:'https://lam.fudan.edu.cn/53/88/c27493a283528/page.htm',researchSource:'https://news.fudan.edu.cn/2017/0912/c5a54984/page.htm',publicationsUrl:'https://nanolab.fudan.edu.cn/'
  },
  {
    id:'jiang-kun',name:'Kun Jiang',school:'Fudan University',title:'Junior Professor / Principal Investigator; PhD Supervisor',researchAreas:['co2rr','orr'],
    topics:['原位红外与拉曼','脉冲电解','膜电极'],summary:'研究 CO₂/CO 电解及氧还原，用原位红外、拉曼和在线质谱解析反应机理，并设计膜电极与电堆。2025 年起任职复旦。',
    url:'https://echem.fudan.edu.cn/jkyjy/list.htm',researchSource:'https://echem.fudan.edu.cn/00/a0/c27186a721056/page.htm',publicationsUrl:'https://elab.fudan.edu.cn/',email:'kunjiang@fudan.edu.cn',emailSource:'https://echem.fudan.edu.cn/jkyjy/list.htm'
  },
  {
    id:'cai-wenbin',name:'Wen-Bin Cai',school:'Fudan University',title:'Professor; Independent PI; PhD Supervisor',researchAreas:['co2rr','orr'],
    topics:['原位红外','甲酸盐','钯与铂催化'],summary:'发展 ATR-SEIRAS 等界面谱学方法，研究 CO₂ 电还原制甲酸盐的反应机理，以及铂、钯催化剂的氧还原等过程。',
    url:'https://echem.fudan.edu.cn/tdcy/list.htm',researchSource:'https://echem.fudan.edu.cn/caigroup/45278/list.htm',publicationsUrl:'https://echem.fudan.edu.cn/zxfb/list.htm'
  },
  {
    id:'li-yuhang',name:'Yuhang Li',school:'Shanghai Jiao Tong University',title:'Professor',researchAreas:['co2rr'],
    topics:['界面配体','级联电催化','工业电流密度'],summary:'研究 CO₂ 级联电催化过程强化，通过配位团簇、富氧界面、电解液和耦合反应器促进高电流密度化学品生产。',
    url:'https://scce.sjtu.edu.cn/teachers/4775.html',researchSource:'https://scce.sjtu.edu.cn/teachers/4775.html',email:'yh.li@sjtu.edu.cn',emailSource:'https://scce.sjtu.edu.cn/teachers/4775.html'
  },
  {
    id:'zhong-heng',name:'Heng Zhong',school:'Shanghai Jiao Tong University',title:'Associate Professor',researchAreas:['co2rr'],
    topics:['水热与电化学耦合','CO₂资源化','生物质转化'],summary:'研究水热、热催化与电催化 CO₂ 还原和生物质转化，探索高附加值有机产物及甲酸储氢体系。',
    url:'https://fmjin.sjtu.edu.cn/Member-zhong.html',researchSource:'https://fmjin.sjtu.edu.cn/Member-zhong.html',email:'zhong.h@sjtu.edu.cn',emailSource:'https://fmjin.sjtu.edu.cn/Member-zhong.html'
  },
  {
    id:'zhang-bing-zju',name:'Bing Zhang',school:'Zhejiang University',title:'Researcher; PhD Supervisor',researchAreas:['co2rr'],
    topics:['纳米材料','CO₂电还原','原位表征'],summary:'研究纳米材料合成及 CO₂ 电还原、电催化有机合成，结合原位表征分析电催化材料的工作行为。',
    url:'https://hic.zju.edu.cn/2024/0920/c85903a3017806/page.htm',researchSource:'https://hic.zju.edu.cn/2024/0920/c85903a3017806/page.htm',email:'bzhang219@zju.edu.cn',emailSource:'https://hic.zju.edu.cn/2024/0920/c85903a3017806/page.htm',recruitment:'2026-10-29 核验时，官网介绍欢迎联系联合培养硕博生；学位授予与招生路径需另行确认。'
  },
  {
    id:'lu-yingying',name:'Yingying Lu',school:'Zhejiang University',title:'Full-Rank Research Professor; PhD Supervisor',researchAreas:['co2rr'],
    topics:['电解质设计','离子液体','纳米杂化材料'],summary:'研究电解质材料、离子液体和无机有机纳米杂化体系，公开研究方向包括 CO₂ 电化学还原及电化学储能。',
    url:'https://hic.zju.edu.cn/2024/0920/c85903a3017841/page.htm',researchSource:'https://hic.zju.edu.cn/2024/0920/c85903a3017841/page.htm',email:'yingyinglu@zju.edu.cn',emailSource:'https://hic.zju.edu.cn/2024/0920/c85903a3017841/page.htm'
  },
  {
    id:'nam-ki-tae',name:'Ki Tae Nam',school:'Seoul National University',title:'Professor of Materials Science and Engineering',researchAreas:['co2rr'],
    topics:['耦合电合成','反应器设计','CO₂制碳酸酯'],summary:'研究材料与能源电化学，公开 CO₂ 转化成果涉及氧化还原中性电化学路线及碳酸二甲酯合成。',
    url:'https://mse.snu.ac.kr/nam-ki-tae/',researchSource:'https://en.snu.ac.kr/research/highlights?bbsidx=132659&md=v',email:'nkitae@snu.ac.kr',emailSource:'https://mse.snu.ac.kr/nam-ki-tae/'
  },
  {
    id:'sung-yung-eun',name:'Yung-Eun Sung',school:'Seoul National University',title:'Professor, School of Chemical and Biological Engineering',researchAreas:['orr'],
    topics:['ORR','燃料电池','过氧化氢电合成'],summary:'研究燃料电池低贵金属催化材料及两电子氧还原，公开成果包括仿生单原子催化剂电合成过氧化氢。',
    url:'https://peel.snu.ac.kr/professor/',researchSource:'https://eng.snu.ac.kr/en/research/research-achievements?bbsidx=2694&md=v&sc=y',email:'ysung@snu.ac.kr',emailSource:'https://peel.snu.ac.kr/professor/'
  },
  {
    id:'chen-hao-ming',name:'Hao Ming Chen',school:'National Taiwan University',title:'Professor; Deputy Chair, Department of Chemistry',researchAreas:['co2rr','orr'],
    topics:['原位X射线','铜结构重构','氧还原制过氧化氢'],summary:'以工作态 X 射线谱学研究催化剂与固液界面，公开工作覆盖 CO₂ 电还原活性位点、铜重构和两电子氧还原。',
    url:'https://www.ch.ntu.edu.tw/haomingchen.html',researchSource:'https://ntubeats.ntu.edu.tw/enews/010/10.html',publicationsUrl:'https://www.ch.ntu.edu.tw/haomingchen.html',email:'haomingchen@ntu.edu.tw',emailSource:'https://www.ch.ntu.edu.tw/haomingchen.html'
  },
  {
    id:'reek',name:'Joost N. H. Reek',school:'University of Amsterdam',title:'Professor of Supramolecular Catalysis; Distinguished Faculty Professor',researchAreas:['co2rr'],
    topics:['分子催化剂','超分子笼','气体扩散电极'],summary:'研究分子与超分子催化，将铁配合物等固定到气体扩散电极开展 CO₂ 电还原；2025 年公开项目将分子催化与直接空气捕集 CO₂ 的转化结合。',
    url:'https://www.uva.nl/profiel/r/e/j.n.h.reek/j.n.h.reek.html',researchSource:'https://hims.uva.nl/content/news/2025/09/hims-researchers-contribute-to-hycarb-project-developing-sustainable-carbon-based-chemistry.html',publicationsUrl:'https://www.uva.nl/profiel/r/e/j.n.h.reek/j.n.h.reek.html',email:'j.n.h.reek@uva.nl',emailSource:'https://www.uva.nl/profiel/r/e/j.n.h.reek/j.n.h.reek.html'
  },
  {
    id:'fransaer',name:'Jan Fransaer',school:'KU Leuven',title:'Full Professor, Department of Materials Engineering',researchAreas:['co2rr','orr'],
    topics:['纳米限域电极','传质','两电子氧还原'],summary:'研究电沉积与电合成，校方项目涵盖纳米限域催化电极中的 CO₂ 电还原传质，以及经氧还原进行无机电合成。',
    url:'https://www.kuleuven.be/wieiswie/EN/person/00002698',researchSource:'https://research.kuleuven.be/portal/en/user/U0002698',publicationsUrl:'https://www.mtm.kuleuven.be/english/research/siem/MNF/team-materials-with-novel-functionality/00002698/view?fromnr=211&pubsonpage=10&pubtype=&sortby=screator',email:'jan.fransaer@kuleuven.be',emailSource:'https://lirias.kuleuven.be/retrieve/ce4dfc17-a108-4c27-a655-82f769aa0c51'
  },
  {
    id:'unwin',name:'Patrick R. Unwin',school:'University of Warwick',title:'Professor of Chemistry; Director, Hartnoll Centre for Experimental Fuel Technologies',researchAreas:['co2rr','orr'],
    topics:['扫描电化学池显微镜','单实体电化学','构效关系'],summary:'发展 SECCM 等纳米电化学成像技术，解析铜电极 CO₂ 电还原的表面构效关系，也研究导电 MOF 的氧还原活性。',
    url:'https://warwick.ac.uk/fac/sci/chemistry/staff/patrickunwin/',researchSource:'https://warwick.ac.uk/fac/sci/chemistry/staff/patrickunwin/',publicationsUrl:'https://warwick.ac.uk/fac/sci/chemistry/staff/patrickunwin/',email:'P.R.Unwin@warwick.ac.uk',emailSource:'https://warwick.ac.uk/fac/sci/chemistry/staff/patrickunwin/'
  },
  {
    id:'denuault',name:'Guy Denuault',school:'University of Southampton',title:'Associate Professor of Electrochemistry',researchAreas:['orr'],
    topics:['氧还原动力学','微纳电极','扫描电化学显微镜'],summary:'结合微纳电极、扫描电化学显微镜和建模研究氧还原动力学，公开成果包括金表面结构及铂氧化层对 ORR 的影响。',
    url:'https://www.southampton.ac.uk/people/5wyh7m/doctor-guy-denuault',researchSource:'https://www.southampton.ac.uk/people/5wyh7m/doctor-guy-denuault',publicationsUrl:'https://www.southampton.ac.uk/people/5wyh7m/doctor-guy-denuault',email:'G.Denuault@soton.ac.uk',emailSource:'https://www.southampton.ac.uk/people/5wyh7m/doctor-guy-denuault',recruitment:'2026-10-29 核验时，校方主页明确接受博士申请；具体课题、名额和资助待直接确认。'
  },
  {
    id:'du-shangfeng',name:'Shangfeng Du',school:'University of Birmingham',title:'Professor of Electrochemical Engineering; Director of School PGR',researchAreas:['co2rr','orr'],
    topics:['催化电极','电极传质','燃料电池与CO₂电解'],summary:'研究燃料电池及 CO₂ 电还原的催化材料、电极传质、膜与电堆工程；2026 年公开成果涉及碳纳米管与碳球催化剂的氧还原。',
    url:'https://www.birmingham.ac.uk/staff/profiles/chemical-engineering/du-shangfeng',researchSource:'https://www.birmingham.ac.uk/staff/profiles/chemical-engineering/du-shangfeng',publicationsUrl:'https://research.birmingham.ac.uk/en/persons/shangfeng-du/',email:'s.du@bham.ac.uk',emailSource:'https://www.birmingham.ac.uk/staff/profiles/chemical-engineering/du-shangfeng',recruitment:'2026-10-29 核验时，校方主页欢迎 CO₂ 电还原等方向的博士咨询；自费、外部资助及 UK 费率资助的适用条件须直接确认。'
  },
  {
    id:'rees-neil',name:'Neil V. Rees',school:'University of Birmingham',title:'Senior Lecturer / Associate Professor',researchAreas:['orr'],
    topics:['纳米电化学','非质子溶剂ORR','掺杂碳材料'],summary:'研究纳米电化学、传质和电荷转移动力学；氧还原相关公开成果涉及非质子溶剂，以及多元素掺杂石墨烯在碱性介质中的电催化。',
    url:'https://www.birmingham.ac.uk/staff/profiles/chemical-engineering/rees-neil',researchSource:'https://www.birmingham.ac.uk/staff/profiles/chemical-engineering/rees-neil',publicationsUrl:'https://www.birmingham.ac.uk/staff/profiles/chemical-engineering/rees-neil',email:'n.rees@bham.ac.uk',emailSource:'https://www.birmingham.ac.uk/staff/profiles/chemical-engineering/rees-neil'
  },
  {
    id:'walsh-darren',name:'Darren A. Walsh',school:'The University of Nottingham',title:'Professor of Chemistry',researchAreas:['co2rr','orr'],
    topics:['离子液体','CO₂电还原电解液','铂碳氧还原催化剂'],summary:'研究能源电化学与电解液。校方成果库收录离子液体缓冲电解液促进 CO₂ 电还原，以及受限铂碳纳米结构的 ORR 稳定性；近年研究也涉及电池。',
    url:'https://nottingham-repository.worktribe.com/person/231820/professor-darren-walsh',researchSource:'https://nottingham-repository.worktribe.com/index.php/person/231820/darren-walsh/outputs?Organisation=Chemistry+Dept&page=2',publicationsUrl:'https://nottingham-repository.worktribe.com/person/231820/professor-darren-walsh',email:'darren.walsh@nottingham.ac.uk',emailSource:'https://www.nottingham.ac.uk/research/groups/advanced-materials-research-group/documents/8703-uon-amm-irc-brochure-v8-singlepage.pdf'
  },
  {
    id:'schmitt-wolfgang',name:'Wolfgang Schmitt',school:'Trinity College Dublin',title:'Professor; Head of Inorganic and Materials Chemistry Division',researchAreas:['co2rr'],
    topics:['金属有机框架','配位笼','CO₂电化学与光电化学转化'],summary:'研究 MOF 和超分子配位笼用于可持续能源与催化；校方 2025/26 项目手册明确列出 MOF 电极的 CO₂ 电化学及光电化学还原。',
    url:'https://chemistry.tcd.ie/staff/schmittw/',researchSource:'https://chemistry.tcd.ie/assets/pdf/Capstone/SS%20Chemistry%20Supervisors%20Booklet%202025-26.pdf',publicationsUrl:'https://chemistry.tcd.ie/staff/schmittw/',email:'schmittw@tcd.ie',emailSource:'https://chemistry.tcd.ie/staff/schmittw/'
  },
  {
    id:'meng-lingcong',name:'Lingcong Meng',school:'University of Edinburgh',title:'Lecturer in Bioanalytical/Biophysical Chemistry',researchAreas:['co2rr'],
    topics:['界面电子转移','功能电催化材料','CO₂转化'],summary:'研究界面电子与离子转移及功能电催化材料，校方可持续化学目录列出 CO₂ 转化与制氢催化剂；课题组同时开展生物传感，申请时需确认具体方向。',
    url:'https://edwebprofiles.ed.ac.uk/profile/dr-lingcong-meng',researchSource:'https://chem.ed.ac.uk/sustainability/environmental-sustainable-chemistry-research',publicationsUrl:'https://www.research.ed.ac.uk/en/persons/lingcong-meng/',email:'L.meng@ed.ac.uk',emailSource:'https://edwebprofiles.ed.ac.uk/profile/dr-lingcong-meng',recruitment:'2026-10-29 核验时，校方个人页及研究门户表示接受博士咨询；CO₂ 具体课题与资助待直接确认。'
  }
].map(faculty);

export const rankings=[...new Map(mentors.map(m=>[m.school,m.qs])).values()];
