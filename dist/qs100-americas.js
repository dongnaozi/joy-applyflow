// Active faculty checked against university/laboratory sources on 2026-10-29.
// This is a sourced expansion, not a claim that every eligible PI has been found.
import {top100School} from './qs100.js';

const records=[
  {
    id:'surendranath',name:'Yogesh Surendranath',school:'Massachusetts Institute of Technology',
    title:'Donner Professor of Science; Professor of Chemistry and Chemical Engineering',
    topics:['分子与材料界面','多组分催化剂','反应机理'],researchAreas:['co2rr'],
    summary:'研究分子与固体催化之间的界面反应，通过多组分薄膜、纳米晶和有机无机界面调节 CO₂ 电还原活性、选择性与燃料生成路径。',
    url:'https://chemistry.mit.edu/profile/yogesh-surendranath/',
    researchSource:'https://chemistry.mit.edu/profile/yogesh-surendranath/',
    email:'yogi@mit.edu',emailSource:'https://chemistry.mit.edu/profile/yogesh-surendranath/',
    recruitment:'官网注明接受 2026–2027 学年研究生；实际博士名额与资助请联系确认。'
  },
  {
    id:'brushett',name:'Fikile R. Brushett',school:'Massachusetts Institute of Technology',
    title:'Ralph Landau Professor of Chemical Engineering Practice; Director of the Practice School',
    topics:['电解槽','传质与稳定性','微流控','器件设计'],researchAreas:['co2rr'],
    summary:'开发把 CO₂ 转为燃料与化学品的催化剂和电解槽，结合微流控、成像与电化学方法研究动力学、传质和器件衰减。',
    url:'https://cheme.mit.edu/profile/fikile-r-brushett/',
    researchSource:'https://brushettresearchgroup.mit.edu/research/',
    email:'brushett@mit.edu',emailSource:'https://ilpstex.mit.edu/content/faculty-profiles/fikile-r-brushett'
  },
  {
    id:'kanan',name:'Matthew W. Kanan',school:'Stanford University',
    title:'Professor of Chemistry; Senior Fellow, Precourt Institute for Energy',
    topics:['晶界与缺陷','CO 电还原','碳管理'],researchAreas:['co2rr'],
    summary:'曾系统研究氧化物衍生铜、金属晶界与 CO₂/CO 电还原。当前课题组还开展电化学酸碱共生产、CO₂ 移除和可持续聚合物研究，申请前应确认仍开放的具体课题。',
    url:'https://profiles.stanford.edu/matthew-kanan',
    researchSource:'https://biox.stanford.edu/people/matthew-kanan',
    publicationsUrl:'https://profiles.stanford.edu/matthew-kanan?tab=research-and-scholarship',
    email:'mkanan@stanford.edu',emailSource:'https://kananlab.stanford.edu/'
  },
  {
    id:'chueh',name:'William Chueh',school:'Stanford University',
    title:'Kimmelman Professor; Director, Precourt Institute for Energy',
    topics:['高温 CO₂ 电解','氧化铈','原位表征','缺陷化学'],researchAreas:['co2rr'],
    summary:'研究氧化物中的离子电子耦合与界面反应；CO₂ 方向包括高温电解、氧空位及氧化碳中间体如何影响生成 CO 和积碳的选择性。',
    url:'https://mse.stanford.edu/people/william-chueh',
    researchSource:'https://chuehlab.stanford.edu/research',
    publicationsUrl:'https://chuehlab.stanford.edu/publications-0',
    email:'wchueh@stanford.edu',emailSource:'https://chuehlab.stanford.edu/people/will-chueh'
  },
  {
    id:'peters',name:'Jonas C. Peters',school:'California Institute of Technology',
    title:'Bren Professor of Chemistry; Director, Resnick Sustainability Institute',
    topics:['分子催化','铜电极修饰','多碳产物','太阳能燃料'],researchAreas:['co2rr'],
    summary:'结合配位化学与电催化研究可再生燃料，与 Agapie 团队研究有机膜修饰铜电极对 CO₂ 还原生成乙烯等产物的影响。',
    url:'https://cce.caltech.edu/faculty/jonas-c-peters',
    researchSource:'https://scienceexchange.caltech.edu/topics/sustainability/ask-expert-sustainability/sustainable-manufacturing-jonas-peters',
    publicationsUrl:'https://jcpgroup.caltech.edu/publications'
  },
  {
    id:'agapie',name:'Theodor Agapie',school:'California Institute of Technology',
    title:'John Stauffer Professor of Chemistry; Executive Officer for Chemistry',
    topics:['分子催化','铜电极修饰','串联转化'],researchAreas:['co2rr'],
    summary:'从无机及有机金属化学设计多电子转化催化体系，并与 Peters 团队将铜电极上的 CO₂ 电还原连接到后续有机金属合成。',
    url:'https://directory.caltech.edu/personnel/agapie',
    researchSource:'https://scienceexchange.caltech.edu/topics/sustainability/ask-expert-sustainability/sustainable-manufacturing-jonas-peters',
    publicationsUrl:'https://agapie.caltech.edu/',
    email:'agapie@caltech.edu',emailSource:'https://solarfuelshub.org/theo-agapie',
    relations:[{name:'Jonas C. Peters',type:'合作',source:'https://scienceexchange.caltech.edu/topics/sustainability/ask-expert-sustainability/sustainable-manufacturing-jonas-peters',evidence:'Caltech 访谈明确记载二人合作修饰铜电极以把 CO₂ 转为乙烯；此处确认研究合作。'}]
  },
  {
    id:'manthiram',name:'Karthish Manthiram',school:'California Institute of Technology',
    title:'Bren Professor of Chemical Engineering and Chemistry; Executive Officer for Chemical Engineering',
    topics:['分子电催化','CO₂ 到 CO','电化学合成','生物电化学'],researchAreas:['co2rr'],
    summary:'利用可再生电力驱动化学合成，发展 CO₂ 到 CO、电化学羧化及电极与活细胞间的电子转移。现任单位为 Caltech。',
    url:'https://cce.caltech.edu/faculty/karthish-manthiram',
    researchSource:'https://manthiramlab.com/research/',
    publicationsUrl:'https://manthiramlab.com/'
  },
  {
    id:'nocera',name:'Daniel G. Nocera',school:'Harvard University',
    title:'Patterson Rockwood Professor of Energy',
    topics:['人工光合作用','串联催化','碳酸盐管理','分子催化'],researchAreas:['co2rr'],
    summary:'研究人工叶片及太阳能燃料。CO₂ 方向包括还原催化剂、串联催化和清除反应中碳酸氢盐/碳酸盐的策略，以改善碳和能量利用。',
    url:'https://www.nocera.harvard.edu/daniel-nocera',
    researchSource:'https://www.nocera.harvard.edu/energy-catalysis',
    publicationsUrl:'https://www.nocera.harvard.edu/publications',
    email:'dnocera@fas.harvard.edu',emailSource:'https://www.nocera.harvard.edu/daniel-nocera'
  },
  {
    id:'bocarsly',name:'Andrew B. Bocarsly',school:'Princeton University',
    title:'Professor of Chemistry',
    topics:['异相电催化','光电还原','多碳产物','配位催化'],researchAreas:['co2rr'],
    summary:'研究表面电荷转移与 CO₂ 电化学、光电化学转化，目标包含多碳产物以及配位复合物驱动的 CO₂ 还原。',
    url:'https://chemistry.princeton.edu/faculty-research/faculty/andrew-b-bocarsly/',
    researchSource:'https://chemistry.princeton.edu/faculty-research/faculty/andrew-b-bocarsly/'
  },
  {
    id:'wang-hailiang',name:'Hailiang Wang',school:'Yale University',
    title:'Professor of Chemistry; Director, Energy Sciences Institute',
    topics:['异相分子催化','协同位点','甲醇','太阳能燃料'],researchAreas:['co2rr'],
    summary:'通过结构反应性关联设计 CO₂ 电转化催化剂，研究异相分子位点与纳米尺度协同催化；近期工作包含 CO₂ 到甲醇的耦合转化。',
    url:'https://chem.yale.edu/profile/hailiang-wang',
    researchSource:'https://chem.yale.edu/profile/hailiang-wang',
    publicationsUrl:'https://wanglab.yale.edu/',
    email:'hailiang.wang@yale.edu',emailSource:'https://chem.yale.edu/profile/hailiang-wang'
  },
  {
    id:'mayer-james',name:'James M. Mayer',school:'Yale University',
    title:'Professor of Chemistry',
    topics:['质子耦合电子转移','分子催化','氧还原 ORR','光电还原'],researchAreas:['co2rr','orr'],
    summary:'以质子耦合电子转移解释分子及电极界面反应，研究 O₂ 四电子还原到水的分子电催化，并参与光电 CO₂ 还原和太阳能燃料体系。',
    url:'https://chem.yale.edu/profile/james-mayer',
    researchSource:'https://chem.yale.edu/profile/james-mayer',
    publicationsUrl:'https://mayerlab.chem.yale.edu/',
    email:'james.mayer@yale.edu',emailSource:'https://chem.yale.edu/profile/james-mayer'
  },
  {
    id:'hazari',name:'Nilay Hazari',school:'Yale University',
    title:'Professor of Chemistry',
    topics:['分子催化','光电还原','甲酸与甲醇','反应机理'],researchAreas:['co2rr'],
    summary:'设计均相过渡金属催化剂，研究 CO₂ 与金属复合物反应及分子催化剂半导体界面的光电还原；课题也包括 CO₂ 氢化与甲酸脱氢。',
    url:'https://chem.yale.edu/profile/nilay-hazari',
    researchSource:'https://chem.yale.edu/profile/nilay-hazari',
    publicationsUrl:'https://hazarigroup.yale.edu/',
    email:'nilay.hazari@yale.edu',emailSource:'https://chem.yale.edu/profile/nilay-hazari'
  },
  {
    id:'batista',name:'Victor S. Batista',school:'Yale University',
    title:'John Gamble Kirkwood Professor of Chemistry',
    topics:['理论计算','分子反应机理','人工光合作用','机器学习'],researchAreas:['co2rr'],
    summary:'发展量子动力学、第一性原理和机器学习方法研究人工光合作用及催化机理；CO₂ 相关研究关注溶液和表面固定分子催化剂的机理与光谱。',
    url:'https://chem.yale.edu/profile/victor-batista',
    researchSource:'https://www.osti.gov/servlets/purl/1577490',
    publicationsUrl:'https://medicine.yale.edu/profile/victor-batista/',
    email:'victor.batista@yale.edu',emailSource:'https://chem.yale.edu/profile/victor-batista'
  },
  {
    id:'sargent',name:'Edward H. Sargent',school:'Northwestern University',
    title:'Lynn Hopton Davis and Greg Davis Professor',
    topics:['CO₂ 电解','器件放大','催化界面','多碳产物'],researchAreas:['co2rr'],
    summary:'结合材料化学、界面物理与器件工程，研究 CO₂ 捕集及电还原制燃料，推动催化剂、膜电极与工业规模电解性能的协同提升。',
    url:'https://chemistry.northwestern.edu/people/faculty/profiles/ted-sargent.html',
    researchSource:'https://light.northwestern.edu/wp-content/uploads/2026/02/s41560-025-01953-z.pdf',
    publicationsUrl:'https://light.northwestern.edu/',
    email:'ted.sargent@northwestern.edu',emailSource:'https://chemistry.northwestern.edu/people/faculty/profiles/ted-sargent.html'
  },
  {
    id:'huang-yu',name:'Yu Huang',school:'University of California, Los Angeles',
    title:'Professor; Traugott and Dorothea Frederking Endowed Chair in Engineering',
    topics:['氧还原 ORR','铂纳米结构','铜基催化剂','晶界工程'],researchAreas:['co2rr','orr'],
    summary:'通过纳米结构、表面与晶界设计提高燃料电池氧还原性能，同时研究铜基 CO₂ 电还原催化剂及多碳产物选择性。',
    url:'https://www.chemistry.ucla.edu/directory/huang-y/',
    researchSource:'https://xduan.chem.ucla.edu/publications/',
    publicationsUrl:'https://www.chemistry.ucla.edu/directory/huang-y/',
    email:'yu2003@ucla.edu',emailSource:'https://www.chemistry.ucla.edu/directory/huang-y/'
  },
  {
    id:'duan-xiangfeng',name:'Xiangfeng Duan',school:'University of California, Los Angeles',
    title:'Professor; Raymond A. and Dorothy A. Wilson Endowed Term Chair',
    topics:['氧还原 ORR','异质纳米界面','铜基催化剂','燃料电池'],researchAreas:['co2rr','orr'],
    summary:'开发异质集成纳米结构与催化界面，相关研究包含燃料电池 ORR 稳定性、铂纳米结构和铜表面 CO₂ 电还原。',
    url:'https://www.chemistry.ucla.edu/directory/duan-xiangfeng/',
    researchSource:'https://xduan.chem.ucla.edu/publications/',
    publicationsUrl:'https://xduan.chem.ucla.edu/publications/',
    email:'xduan@ucla.edu',emailSource:'https://www.chemistry.ucla.edu/directory/duan-xiangfeng/',
    recruitment:'官网列出接受 2027–2028 学年研究生；具体项目与名额请联系确认。'
  },
  {
    id:'liu-chong-ucla',name:'Chong Liu',school:'University of California, Los Angeles',
    title:'Associate Professor; Jeffery and Helo Zink Development Chair',
    topics:['生物电化学','CO 电还原','串联转化','自动化电化学'],researchAreas:['co2rr'],
    summary:'将无机催化、纳米材料与微生物结合，研究 CO₂/CO 电转化和生物升级；同时开发自动化电化学与机理分析工具。',
    url:'https://www.chemistry.ucla.edu/directory/liu-chong/',
    researchSource:'https://www.chemistry.ucla.edu/directory/liu-chong/',
    publicationsUrl:'https://www.chemistry.ucla.edu/directory/liu-chong/',
    email:'chongliu@g.ucla.edu',emailSource:'https://www.chemistry.ucla.edu/directory/liu-chong/',
    recruitment:'官网列出接受 2027–2028 学年研究生；具体项目与名额请联系确认。',
    relations:[{name:'Peidong Yang',type:'博士导师',source:'https://www.chemistry.ucla.edu/directory/liu-chong/',evidence:'UCLA 官方履历明确记载在 UC Berkeley 跟随 Peidong Yang 攻读博士。'}]
  },
  {
    id:'wang-chao',name:'Chao Wang',school:'Johns Hopkins University',
    title:'Professor of Chemical and Biomolecular Engineering',
    topics:['纳米催化剂','CO₂ 捕集转化','电化学器件'],researchAreas:['co2rr'],
    summary:'通过精确纳米结构设计改善催化活性、选择性与稳定性，并开发 CO₂ 捕集转化和低碳电化学过程。',
    url:'https://engineering.jhu.edu/faculty/chao-wang/',
    researchSource:'https://engineering.jhu.edu/faculty/chao-wang/',
    publicationsUrl:'https://engineering.jhu.edu/faculty/chao-wang/',
    email:'chaowang@jhu.edu',emailSource:'https://engineering.jhu.edu/faculty/chao-wang/'
  },
  {
    id:'sun-shouheng',name:'Shouheng Sun',school:'Brown University',
    title:'Vernon K. Krieble Professor of Chemistry; Professor of Engineering',
    topics:['纳米颗粒','CO₂ 电还原','氧还原 ORR','有序合金'],researchAreas:['co2rr','orr'],
    summary:'合成和调控功能纳米颗粒，研究 CO₂ 电还原及燃料电池氧还原中的颗粒组成、尺寸、有序结构与催化性能。',
    url:'https://chemistry.brown.edu/people/shouheng-sun',
    researchSource:'https://sunlab.brown.edu/author/sunlab/',
    publicationsUrl:'https://vivo.brown.edu/display/ssun',
    email:'shouheng_sun@brown.edu',emailSource:'https://chemistry.brown.edu/people/shouheng-sun'
  },
  {
    id:'chen-jingguang',name:'Jingguang G. Chen',school:'Columbia University',
    title:'Thayer Lindsley Professor of Chemical Engineering',
    topics:['双金属催化','串联转化','原位同步辐射','反应器'],researchAreas:['co2rr'],
    summary:'研究双金属、碳化物和氮化物催化剂，结合原位同步辐射与反应器测试，把 CO₂ 电还原及热催化过程串联以合成高价值化学品。',
    url:'https://www.cheme.columbia.edu/faculty-staff/directory/jingguang-chen',
    researchSource:'https://studentresearch.engineering.columbia.edu/sites/default/files/content/Tandem%20Catalysis%20for%20Sustainable%20CO2%20Conversion%20%28closed%29.pdf',
    publicationsUrl:'https://energy.columbia.edu/publications',
    email:'jgchen@columbia.edu',emailSource:'https://studentresearch.engineering.columbia.edu/sites/default/files/content/Tandem%20Catalysis%20for%20Sustainable%20CO2%20Conversion%20%28closed%29.pdf'
  },
  {
    id:'kenis',name:'Paul J. A. Kenis',school:'University of Illinois Urbana-Champaign',
    title:'Elio Eliakim Tarika Endowed Chair and Professor',
    topics:['流动电解槽','电极结构','传质','微流控'],researchAreas:['co2rr'],
    summary:'以微尺度传质控制优化 CO₂ 电还原的电流、选择性和能效，开发催化剂层、电解质及气体扩散电极与反应器。',
    url:'https://chbe.illinois.edu/research/paul-kenis',
    researchSource:'https://chbe.illinois.edu/research/paul-kenis',
    publicationsUrl:'https://chbe.illinois.edu/research/paul-kenis',
    email:'kenis@illinois.edu',emailSource:'https://bioengineering.illinois.edu/people/kenis'
  },
  {
    id:'rodriguez-lopez',name:'Joaquín Rodríguez-López',school:'University of Illinois Urbana-Champaign',
    title:'Professor of Chemistry',
    topics:['原位电化学','扫描电化学显微','自动化','界面反应'],researchAreas:['co2rr'],
    summary:'发展扫描电化学显微、光谱电化学和自动化方法，研究局部界面、催化位点与反应中间体；参与可再生电力驱动的 CO₂ 转化研究。',
    url:'https://chemistry.illinois.edu/joaquinr',
    researchSource:'https://chemistry.illinois.edu/news/2020-11-01/scientists-receive-2-million-develop-ways-use-renewable-energy',
    publicationsUrl:'https://chemistry.illinois.edu/joaquinr',
    email:'joaquinr@illinois.edu',emailSource:'https://chemistry.illinois.edu/joaquinr'
  },
  {
    id:'yu-guihua',name:'Guihua Yu',school:'University of Texas at Austin',
    title:'Professor; Ernest Cockrell, Jr. Centennial Chair in Engineering',
    topics:['单原子催化','酸性电解','氧还原 ORR','功能凝胶'],researchAreas:['co2rr','orr'],
    summary:'设计纳米结构、单原子催化剂和功能凝胶，近期电催化工作覆盖酸性 CO₂ 还原、位点密度及氧还原中位点间距效应。',
    url:'https://me.utexas.edu/person/guihua-yu/',
    researchSource:'https://yugroup.me.utexas.edu/',
    publicationsUrl:'https://yugroup.me.utexas.edu/index.php/publications/',
    email:'ghyu@austin.utexas.edu',emailSource:'https://me.utexas.edu/person/guihua-yu/'
  },
  {
    id:'resasco',name:'Joaquin Resasco',school:'University of Texas at Austin',
    title:'Assistant Professor; Lyondell Chemical Company Endowed Faculty Fellowship in Engineering',
    topics:['电解质阳离子','界面电场','原位红外','反应机理'],researchAreas:['co2rr'],
    summary:'研究催化位点周围微环境如何决定反应速率与选择性，结合原位红外和第一性原理模拟分析阳离子、界面电场与 CO₂ 电还原。',
    url:'https://che.utexas.edu/person/joaquin-resasco/',
    researchSource:'https://cockrell.utexas.edu/news/carbon-reduction-gets-a-spark-in-new-research/',
    publicationsUrl:'https://che.utexas.edu/person/joaquin-resasco/',
    email:'resasco@utexas.edu',emailSource:'https://che.utexas.edu/person/joaquin-resasco/'
  },
  {
    id:'henkelman',name:'Graeme Henkelman',school:'University of Texas at Austin',
    title:'George W. Watt Centennial Professor of Chemistry',
    topics:['氧还原 ORR','理论计算','纳米催化','表面动力学'],researchAreas:['orr'],
    summary:'开发原子尺度动力学与电子结构计算方法，研究纳米颗粒与载体相互作用、催化标度关系及低成本氧还原催化剂。',
    url:'https://chemistry.utexas.edu/directory/graeme-henkelman',
    researchSource:'https://oden.utexas.edu/media/research/grand-challenge-awardees/final-reports/Grand_Challenge_Final_Reports_23_24_Henkelman_2.pdf',
    publicationsUrl:'https://theory.cm.utexas.edu/henkelman/',
    email:'henkelman@utexas.edu',emailSource:'https://chemistry.utexas.edu/directory/graeme-henkelman'
  },
  {
    id:'kim-dohyung',name:'Dohyung Kim',school:'University of Pennsylvania',
    title:'Assistant Professor of Chemical and Biomolecular Engineering',
    topics:['电化学界面','双电层','纳米催化','碳材料'],researchAreas:['co2rr'],
    summary:'研究固体催化剂与界面液体的耦合，设计异质界面及电化学方法来还原 CO₂，并探索将碳固定到纳米结构碳材料。',
    url:'https://viest.upenn.edu/people/dohyung-kim',
    researchSource:'https://viest.upenn.edu/people/dohyung-kim',
    publicationsUrl:'https://kimlab.seas.upenn.edu/',
    email:'dohyungk@seas.upenn.edu',emailSource:'https://kimlab.seas.upenn.edu/wp-content/uploads/2024/07/Curriculum-Vitae-Dohyung-Kim-Jul-2024.pdf',
    relations:[{name:'Peidong Yang',type:'博士导师',source:'https://kimlab.seas.upenn.edu/wp-content/uploads/2024/07/Curriculum-Vitae-Dohyung-Kim-Jul-2024.pdf',evidence:'官方实验室 CV 明确列出 UC Berkeley 博士导师为 Peidong Yang。'}]
  },
  {
    id:'mallouk',name:'Thomas E. Mallouk',school:'University of Pennsylvania',
    title:'Vagelos Professor of Energy Research',
    topics:['双极膜','CO₂ 电解','碱性燃料电池','纳米材料'],researchAreas:['co2rr'],
    summary:'研究纳米无机材料、CO₂ 电还原和碱性燃料电池，重点之一是双极膜中的质子平衡、离子传输及其在电解与分离中的作用。',
    url:'https://viest.upenn.edu/people/thomas-e-mallouk',
    researchSource:'https://www.nims.go.jp/mana/manadigest/2024/satellite-principal-investigator/thomas-e-mallouk.html',
    publicationsUrl:'https://web.sas.upenn.edu/mallouk-lab/'
  },
  {
    id:'wang-xiaolei',name:'Xiaolei Wang',school:'University of Alberta',
    title:'Professor of Chemical Engineering; Canada Research Chair in Batteries for Sustainability',
    topics:['纳米结构','CO₂ 电还原','氧还原 ORR','过氧化氢'],researchAreas:['co2rr','orr'],
    summary:'将材料形貌、微结构与电化学性能关联，研究 CO₂ 电还原、二电子 ORR 制过氧化氢、四电子 ORR 燃料电池和金属空气电池。',
    url:'https://apps.ualberta.ca/directory/person/xiaolei1',
    researchSource:'https://apps.ualberta.ca/directory/person/xiaolei1',
    publicationsUrl:'https://sites.google.com/view/nanofacelab/home',
    email:'xiaolei.wang@ualberta.ca',emailSource:'https://apps.ualberta.ca/directory/person/xiaolei1'
  },
  {
    id:'yu-sunmoon',name:'Sunmoon Yu',school:'University of Toronto',
    title:'Assistant Professor of Materials Science and Engineering',
    topics:['分子催化','CO₂ 到甲醇','电化学界面','原位表征'],researchAreas:['co2rr'],
    summary:'以原子级可调电活性材料、基本电化学和原位表征研究 CO₂ 捕集转化；代表工作包括分子钴催化剂上的 CO₂ 到甲醇及其再活化。',
    url:'https://mse.utoronto.ca/faculty-staff/professors/yu/',
    researchSource:'https://mse.utoronto.ca/faculty-staff/professors/yu/',
    publicationsUrl:'https://eclipse.mse.utoronto.ca/publications',
    email:'sunmoon.yu@utoronto.ca',emailSource:'https://eclipse.mse.utoronto.ca/team',
    recruitment:'课题组网站招募 2–3 名研究生；申请层次、名额与资助请联系确认。'
  },
  {
    id:'gyenge',name:'Elod Lajos Gyenge',school:'University of British Columbia',
    title:'Professor of Chemical and Biological Engineering',
    topics:['气体扩散电极','氧还原 ORR','甲酸盐','CO₂ 液流电池'],researchAreas:['co2rr','orr'],
    summary:'研究气体扩散电极、两相流和反应器，在 CO₂ 还原制甲酸盐、ORR 制过氧化氢及可逆 CO₂/甲酸盐液流体系中连接催化与工程。',
    url:'https://www.grad.ubc.ca/researcher/14706-gyenge',
    researchSource:'https://www.grad.ubc.ca/researcher/14706-gyenge',
    publicationsUrl:'https://www.grad.ubc.ca/researcher/14706-gyenge'
  },
  {
    id:'janik',name:'Michael J. Janik',school:'Pennsylvania State University',
    title:'Distinguished Professor of Chemical Engineering',
    topics:['理论电催化','双电层','微观动力学','氧还原 ORR'],researchAreas:['co2rr','orr'],
    summary:'以 DFT、微观动力学和多尺度模型研究电极与电解液界面，覆盖 CO₂/CO 电还原及燃料电池 ORR；近期工作分析双电层近似对铜上 CO 还原动力学预测的影响。',
    url:'https://www.che.psu.edu/department/directory-detail-g.aspx?q=MJJ13',
    researchSource:'https://www.che.psu.edu/faculty/janik/group/research.htm',
    publicationsUrl:'https://www.che.psu.edu/department/directory-detail-g.aspx?q=MJJ13',
    email:'mjj13@psu.edu',emailSource:'https://www.mri.psu.edu/mri/personnel-directory/mjj13'
  },
  {
    id:'hupp',name:'Joseph T. Hupp',school:'Northwestern University',
    title:'Charles E. and Emma H. Morrison Professor of Chemistry',
    topics:['金属有机框架','分子催化','CO₂ 电还原','太阳能转化'],researchAreas:['co2rr'],
    summary:'设计功能金属有机框架及相关多孔材料，用于太阳能转化、电催化和 CO₂ 捕集还原；已开展仿生金属硫化物与多孔网络促进 CO₂ 电还原的研究。',
    url:'https://chemistry.northwestern.edu/people/faculty/profiles/joseph-hupp.html',
    researchSource:'https://sites.northwestern.edu/huppgroup/',
    publicationsUrl:'https://chemistry.northwestern.edu/people/faculty/profiles/joseph-hupp.html',
    email:'j-hupp@northwestern.edu',emailSource:'https://chemistry.northwestern.edu/people/faculty/profiles/joseph-hupp.html'
  },
  {
    id:'kitchin',name:'John R. Kitchin',school:'Carnegie Mellon University',
    title:'John E. Swearingen Professor of Chemical Engineering',
    topics:['氧还原 ORR','理论计算','机器学习','电解液 pH'],researchAreas:['orr'],
    summary:'结合电子结构计算、机器学习与数据方法研究催化和材料；2025 年合作研究电解液 pH 对 ORR 的影响，可从理论电催化与反应环境切入。',
    url:'https://mse.engineering.cmu.edu/directory/bios/kitchin-john.html',
    researchSource:'https://kitchingroup.cheme.cmu.edu/publications.html',
    publicationsUrl:'https://kitchingroup.cheme.cmu.edu/publications.html',
    email:'jkitchin@andrew.cmu.edu',emailSource:'https://mse.engineering.cmu.edu/directory/bios/kitchin-john.html'
  },
  {
    id:'seifitokaldani',name:'Ali Seifitokaldani',school:'McGill University',
    title:'Assistant Professor of Chemical Engineering; Canada Research Chair in Electrocatalysis for Renewable Energy Production and Conversion',
    topics:['CO₂ 电还原','原位光谱','反应机理','DFT 计算'],researchAreas:['co2rr'],
    summary:'围绕可再生能源转化研究 CO₂ 和 CO 电还原，结合原位光谱、催化剂设计与 DFT 来解释反应机理和产物选择性。',
    url:'https://www.mcgill.ca/energy-centre/ali-seifitokaldani',
    researchSource:'https://www.mcgill.ca/engineering/students/undergraduate/research/student-section/past-projects/chemical-projects',
    publicationsUrl:'https://electrocatalysislab.com/publications/',
    email:'ali.seifitokaldani@mcgill.ca',emailSource:'https://www.mcgill.ca/energy-centre/ali-seifitokaldani'
  },
  {
    id:'wuttig',name:'Anna Wuttig',school:'University of Chicago',
    title:'Neubauer Family Assistant Professor of Chemistry',
    topics:['电极界面','非共价组装','CO₂ 到甲酸','二电子 ORR'],researchAreas:['co2rr','orr'],
    summary:'研究催化剂与电极界面的非共价作用和电荷转移；合作探索铁硫配位聚合物上 CO₂ 到甲酸的电还原，并开发选择性二电子 ORR 制过氧化氢的可回收自组装催化剂。',
    url:'https://chemistry.uchicago.edu/faculty/anna-wuttig',
    researchSource:'https://chemistry.uchicago.edu/news/anderson-gagliardi-and-wuttig-groups-collaborate-on-cd4dc-initiative',
    publicationsUrl:'https://wuttiglab.uchicago.edu/',
    email:'awuttig@uchicago.edu',emailSource:'https://chemistry.uchicago.edu/faculty/anna-wuttig',
    additionalResearchSources:['https://polsky.uchicago.edu/technologies/25-t-133/']
  },
  {
    id:'fenning',name:'David P. Fenning',school:'University of California, San Diego',
    title:'Professor of NanoEngineering; Francine Berman Endowed Chair',
    topics:['太阳能 CO₂ 转化','光电化学','原位 X 射线','缺陷与界面'],researchAreas:['co2rr'],
    summary:'将光伏与电化学耦合以实现 CO₂ 还原及太阳能燃料合成，使用原位 X 射线等手段研究材料缺陷、界面和反应动力学。',
    url:'https://nanoengineering.ucsd.edu/node/909',
    researchSource:'https://matsci.ucsd.edu/faculty/david-fenning',
    publicationsUrl:'https://fenningresearchgroup.com/',
    email:'dfenning@ucsd.edu',emailSource:'https://matsci.ucsd.edu/faculty/david-fenning'
  },
  {
    id:'hammes-schiffer',name:'Sharon Hammes-Schiffer',school:'Princeton University',
    title:'A. Barton Hepburn Professor of Chemistry',
    topics:['质子耦合电子转移','分子钴催化剂','理论电催化','氧还原 ORR'],researchAreas:['co2rr','orr'],
    summary:'发展质子耦合电子转移的量子理论和计算方法；研究表面固定酞菁钴将 CO₂ 电还原为甲醇的机理，以及 Fe–N–C 催化剂中轴向配体对 ORR 的作用。',
    url:'https://chemistry.princeton.edu/faculty-research/faculty/sharon-hammes-schiffer/',
    researchSource:'https://pubmed.ncbi.nlm.nih.gov/38984971/',
    publicationsUrl:'https://collaborate.princeton.edu/en/persons/sharon-hammes-schiffer',
    email:'shs566@princeton.edu',emailSource:'https://researchcomputing.princeton.edu/about/people-directory/sharon-hammes-schiffer',
    additionalResearchSources:['https://pubmed.ncbi.nlm.nih.gov/36001092/']
  },
  {
    id:'dinca',name:'Mircea Dincă',school:'Princeton University',
    title:'Alexander Stewart 1886 Professor of Chemistry',
    topics:['导电金属有机框架','氧还原 ORR','配体中心催化','多孔材料'],researchAreas:['orr'],
    summary:'研究导电金属有机框架的电子结构、传输与小分子反应；已发表 Ni₃(HITP)₂ 中配体中心 ORR 的机理研究，申请时可进一步确认当前电催化课题。',
    url:'https://chemistry.princeton.edu/faculty-research/faculty/mircea-dinca/',
    researchSource:'https://collaborate.princeton.edu/en/publications/mechanistic-evidence-for-ligand-centered-electrocatalytic-oxygen-/',
    publicationsUrl:'https://dinca.chemistry.princeton.edu/',
    email:'mdinca@princeton.edu',emailSource:'https://chemistry.princeton.edu/wp-content/uploads/2025/08/2025-2026-Handbook-V2.pdf'
  },
  {
    id:'anderson-john',name:'John S. Anderson',school:'University of Chicago',
    title:'Professor of Chemistry; Associate Chair',
    topics:['配位聚合物','铁硫簇','CO₂ 到甲酸','无机合成'],researchAreas:['co2rr'],
    summary:'以合成无机化学调节金属中心与配位网络的反应性；与理论和界面电化学团队合作，将铁硫簇配位聚合物用于 CO₂ 选择性电还原制甲酸。',
    url:'https://chemistry.uchicago.edu/faculty/john-anderson',
    researchSource:'https://chemistry.uchicago.edu/news/anderson-gagliardi-and-wuttig-groups-collaborate-on-cd4dc-initiative',
    publicationsUrl:'https://andersonlab.uchicago.edu/',
    email:'jsanderson@uchicago.edu',emailSource:'https://chemistry.uchicago.edu/faculty/john-anderson'
  },
  {
    id:'gagliardi',name:'Laura Gagliardi',school:'University of Chicago',
    title:'Richard and Kathy Leventhal Professor of Chemistry and Molecular Engineering',
    topics:['理论催化','多参考电子结构','配位聚合物','CO₂ 电还原'],researchAreas:['co2rr'],
    summary:'以量子化学、电子结构和材料模型研究脱碳催化；参与铁硫簇配位聚合物催化 CO₂ 电还原制甲酸的机理研究，将计算与实验催化设计衔接。',
    url:'https://chemistry.uchicago.edu/laura-gagliardi',
    researchSource:'https://chemistry.uchicago.edu/news/anderson-gagliardi-and-wuttig-groups-collaborate-on-cd4dc-initiative',
    publicationsUrl:'https://gagliardigroup.uchicago.edu/',
    email:'lgagliardi@uchicago.edu',emailSource:'https://chemistry.uchicago.edu/laura-gagliardi'
  },
  {
    id:'li-christina',name:'Christina W. Li',school:'Purdue University',
    title:'Associate Professor of Inorganic and Materials Chemistry',
    topics:['合金纳米催化剂','胶体合成','CO₂ 多碳产物','氧还原 ORR'],researchAreas:['co2rr','orr'],
    summary:'利用可控胶体合成、表面配体和金属组成调节催化剂；已开展 CO₂ 到正丙醇的合金纳米棒合作研究，以及 Co–S 配位环境与 Au/Pd 结构控制 ORR 的研究，课题组亦覆盖热催化和光电材料。',
    url:'https://www.chem.purdue.edu/people/profile/li2281.html',
    researchSource:'https://www.chem.purdue.edu/li/publications.html',
    publicationsUrl:'https://www.chem.purdue.edu/li/publications.html',
    email:'christinawli@purdue.edu',emailSource:'https://www.chem.purdue.edu/people/profile/li2281.html'
  },
  {
    id:'kubiak',name:'Clifford P. Kubiak',school:'University of California, San Diego',
    title:'Distinguished Professor of Chemistry and Biochemistry; Harold C. Urey Chair',
    topics:['分子电催化','CO₂ 电还原','质子耦合电子转移','红外光谱'],researchAreas:['co2rr'],
    summary:'研究分子金属配合物上的 CO₂ 电化学和光化学还原，结合红外光谱、电子转移动力学及催化剂固定化解析反应路径。',
    url:'https://prod.chem.ucsd.edu/faculty/profiles/kubiak_clifford_p.html',
    researchSource:'https://prod.chem.ucsd.edu/faculty/profiles/kubiak_clifford_p.html',
    publicationsUrl:'https://profiles.ucsd.edu/clifford.kubiak',
    email:'ckubiak@ucsd.edu',emailSource:'https://prod.chem.ucsd.edu/faculty/profiles/kubiak_clifford_p.html'
  }
];

export const mentors=records.map(record=>{
  const qs=top100School(record.school);
  if(!qs)throw Error('QS 2026 top-100 school not found: '+record.school);
  return {city:'',email:'',emailSource:'',papers:[],relations:[],verifiedAt:'2026-10-29',
    ...record,schoolShort:qs.schoolShort,country:qs.country,
    initials:record.name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>Array.from(part)[0]).join('').toUpperCase(),
    keywords:[...record.topics,...record.researchAreas.flatMap(area=>area==='orr'?['ORR','oxygen reduction','oxygen electroreduction','氧还原']:['CO2','CO2RR','carbon dioxide electroreduction','CO reduction','二氧化碳电还原'])],
    publicationsUrl:record.publicationsUrl||record.url,
    team:{chineseStudents:null,chineseFaculty:null,note:'暂无完整、可核实的公开统计；不依据姓名、教育经历或照片推断国籍。'},
    qs
  };
});
export const rankings=[...new Map(mentors.map(mentor=>[mentor.school,mentor.qs])).values()];
