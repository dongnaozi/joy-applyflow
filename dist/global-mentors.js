// Additional faculty verified against official university, institute and laboratory sources.
// QS figures below use the 2026 row of the publisher's historical ranking tables.
const unknownTeam=()=>({chineseStudents:null,chineseFaculty:null,note:'暂无完整、可核实的公开统计；不依据姓名或照片推断国籍。'});
export const mentors = [
  {
    id:'berlinguette',name:'Curtis P. Berlinguette',initials:'CB',
    school:'University of British Columbia',schoolShort:'不列颠哥伦比亚大学',country:'加拿大',city:'Vancouver, British Columbia',
    title:'Professor of Chemistry and Chemical and Biological Engineering',
    topics:['捕集与转化','电解槽','气体扩散电极','自动化实验'],
    keywords:['CO2','CO2RR','reactive carbon capture','捕集','bicarbonate','碳酸氢盐','flow cell','流动池','GDE','气体扩散电极','membrane','膜','automation'],
    summary:'把 CO₂ 捕集液直接接入电化学反应器，研究膜、电极与传质，并结合自动化实验优化捕集转化流程。',
    url:'https://www.grad.ubc.ca/researcher/13374-berlinguette',
    researchSource:'https://groups.chem.ubc.ca/cberling/research/',publicationsUrl:'https://groups.chem.ubc.ca/cberling/publications/',
    email:'cberling@chem.ubc.ca',emailSource:'https://solar-energy.ok.ubc.ca/people-and-partners/faculty-staff/curtis-p-berlinguette/',verifiedAt:'2026-10-28',
    papers:[{title:'Visualization of CO2 Electrolysis Using Optical Coherence Tomography',year:2024,journal:'Nature Chemistry',url:'https://doi.org/10.1038/s41557-024-01465-5',source:'https://groups.chem.ubc.ca/cberling/publications/',role:'待核实'}],
    relations:[],team:unknownTeam()
  },
  {
    id:'dinh',name:'Cao Thang Dinh',initials:'CD',school:"Queen's University",schoolShort:'加拿大女王大学',country:'加拿大',city:'Kingston, Ontario',
    title:'Canada Research Chair in Sustainable Fuels and Chemicals (Tier 2)',
    topics:['铜基催化剂','气体扩散电极','电解槽','脉冲电解'],
    keywords:['CO2','CO2RR','copper','Cu','铜','electrode','电极','surface engineering','pulse electrolysis','脉冲','scale-up','放大'],
    summary:'通过电极结构、表面工程和脉冲电解，提高 CO₂ 转化的电流密度、产物选择性与系统稳定性，兼顾材料设计和器件放大。',
    url:'https://www.queensu.ca/research/researchers/cao-thang-dinh',researchSource:'https://www.queensu.ca/research/researchers/cao-thang-dinh',
    email:'caothang.dinh@queensu.ca',emailSource:'https://www.queensu.ca/contaminants-emerging-concern-network/people-search/dinh-cao-thang',verifiedAt:'2026-10-28',
    papers:[],
    relations:[{name:'Edward H. Sargent',type:'博士后导师',source:'https://www.queensu.ca/contaminants-emerging-concern-network/people-search/dinh-cao-thang',evidence:'女王大学人物介绍明确记载博士毕业后加入多伦多大学 Sargent 研究组从事博士后研究。'}],
    team:unknownTeam()
  },
  {
    id:'zhao-chuan',name:'Chuan Zhao',initials:'CZ',school:'UNSW Sydney',schoolShort:'新南威尔士大学',country:'澳大利亚',city:'Sydney, New South Wales',
    title:'Professor of Chemistry; Australian Laureate Fellow',
    topics:['铜基催化剂','单原子催化','电解槽','电解质设计'],
    keywords:['CO2','CO2RR','copper','Cu','铜','single atom','单原子','ionic liquid','离子液体','electrolyte','电解质','flow cell','流动池'],
    summary:'开发电催化材料、电解质和反应器，覆盖 CO₂ 还原与清洁能源转化；近期研究包括铜异质界面促进乙烯生成。',
    url:'https://www.unsw.edu.au/staff/chuan-zhao',researchSource:'https://www.unsw.edu.au/science/our-schools/chemistry/our-research/our-research-groups/zhao-group',publicationsUrl:'https://www.unsw.edu.au/staff/chuan-zhao',
    email:'chuan.zhao@unsw.edu.au',emailSource:'https://www.unsw.edu.au/staff/chuan-zhao',verifiedAt:'2026-10-28',
    recruitment:'课题组官网欢迎研究生联系；具体博士名额与资助待确认。',
    papers:[{title:'Iodine-Modified Cu Heterointerface Enables Efficient CO2-to-C2H4 Conversion',year:2026,journal:'ACS Catalysis',url:'https://doi.org/10.1021/acscatal.6c03153',source:'https://www.unsw.edu.au/staff/chuan-zhao',role:'待核实'}],
    relations:[],team:unknownTeam()
  },
  {
    id:'li-fengwang',name:'Fengwang Li',initials:'FL',school:'The University of Sydney',schoolShort:'悉尼大学',country:'澳大利亚',city:'Sydney, New South Wales',
    title:'Associate Professor; ARC Future Fellow',
    topics:['界面电催化','原位表征','酸性电解','分子修饰'],
    keywords:['CO2','CO2RR','interface','界面','acid','酸性','molecular layer','分子层','operando','原位','hydrogen bond','氢键'],
    summary:'通过分子层、聚合物离子和工作态谱学调节电化学界面，研究酸性 CO₂ 电还原中的质子供给、界面水和反应路径。',
    url:'https://profiles.sydney.edu.au/fengwang.li',researchSource:'https://scmb.uq.edu.au/event/session/13431',publicationsUrl:'https://www.sydney.edu.au/AcademicProfiles/profile/resource?type=cv&urlid=fengwang.li',
    email:'fengwang.li@sydney.edu.au',emailSource:'https://profiles.sydney.edu.au/fengwang.li',verifiedAt:'2026-10-28',
    papers:[{title:'Immobilized Azole Layer Tunes Interfacial Hydrogen Source for CO2 Electroreduction in Strong Acid',year:2025,journal:'Journal of the American Chemical Society',url:'https://doi.org/10.1021/jacs.5c11829',source:'https://www.sydney.edu.au/AcademicProfiles/profile/resource?type=cv&urlid=fengwang.li',role:'待核实'}],
    relations:[],team:unknownTeam()
  },
  {
    id:'burdyny',name:'Thomas Burdyny',initials:'TB',school:'Delft University of Technology',schoolShort:'代尔夫特理工大学',country:'荷兰',city:'Delft',
    title:'Associate Professor of Chemical Engineering',
    topics:['气体扩散电极','电解槽','传质与放大','原位表征'],
    keywords:['CO2','CO2RR','copper','Cu','铜','ethylene','乙烯','GDE','气体扩散电极','electrolyzer','电解槽','mass transport','传质','scale-up'],
    summary:'从工程角度研究 CO₂ 电解槽中的传质、催化剂稳定性和器件放大，并开发适用于实际电流密度的测试与高通量平台。',
    url:'https://www.tudelft.nl/en/faculty-of-applied-sciences/about-faculty/departments/chemical-engineering/principal-investigators/tom-burdyny',
    researchSource:'https://www.burdynyenergylab.com/people.html',publicationsUrl:'https://research.tudelft.nl/en/persons/te-burdyny/',
    email:'T.E.Burdyny@tudelft.nl',emailSource:'https://www.tudelft.nl/en/faculty-of-applied-sciences/about-faculty/departments/chemical-engineering/principal-investigators/tom-burdyny',verifiedAt:'2026-10-28',
    papers:[
      {title:'High-Throughput Screening of Catalysts through Infrared Thermography for CO2 Electrolysis',year:2026,journal:'ACS Catalysis',url:'https://doi.org/10.1021/acscatal.6c00580',source:'https://repository.tudelft.nl/record/uuid%3Ac0a991e6-c514-4dc5-8b96-33191232d436',role:'待核实'},
      {title:'Role of the Copper Microstructure on Ethylene Stability during CO2 Electrolysis',year:2026,journal:'ACS Energy Letters',url:'https://doi.org/10.1021/acsenergylett.6c00513',source:'https://research.tudelft.nl/en/persons/te-burdyny/',role:'待核实'}
    ],
    relations:[{name:'David Sinton',type:'博士导师',source:'https://www.tudelft.nl/en/faculty-of-applied-sciences/about-faculty/departments/chemical-engineering/principal-investigators/tom-burdyny',evidence:'TU Delft 学术背景介绍明确指出在多伦多大学于 David Sinton 指导下研究光/电催化 CO₂ 转化。'}],
    team:unknownTeam()
  },
  {
    id:'hu-xile',name:'Xile Hu',initials:'XH',school:'École Polytechnique Fédérale de Lausanne',schoolShort:'洛桑联邦理工学院',country:'瑞士',city:'Lausanne',
    title:'Full Professor of Chemistry; Director, LSCI',
    topics:['分子催化','电解槽','高温电解','多碳产物'],
    keywords:['CO2','CO2RR','CO reduction','CO还原','copper','Cu','铜','membrane','膜','solid oxide','固体氧化物','C2+','多碳'],
    summary:'围绕催化材料、离子交换膜与电化学器件，研究 CO₂/CO 还原；近期同时涉及高温 CO₂ 电解和铜表面分子修饰促进多碳产物。',
    url:'https://www.epfl.ch/labs/lsci/hu/',researchSource:'https://www.epfl.ch/labs/lsci/',publicationsUrl:'https://www.epfl.ch/labs/lsci/publications/',
    email:'xile.hu@epfl.ch',emailSource:'https://www.epfl.ch/labs/lsci/people/',verifiedAt:'2026-10-28',
    recruitment:'2026-10-28 核验时，课题组主页注明暂无博士或博士后空缺（No PhD or Postdoc positions）。',
    papers:[
      {title:'Encapsulated Co–Ni alloy boosts high-temperature CO2 electroreduction',year:2025,journal:'Nature',url:'https://doi.org/10.1038/s41586-025-08978-0',source:'https://www.epfl.ch/labs/lsci/publications/',role:'待核实'},
      {title:'Cation Dehydration by Surface-Grafted Phenyl Groups for Enhanced C2+ Production in Cu-Catalyzed Electrochemical CO2 Reduction',year:2025,journal:'Journal of the American Chemical Society',url:'https://doi.org/10.1021/jacs.5c11313',source:'https://www.epfl.ch/labs/lsci/publications/',role:'待核实'}
    ],
    relations:[
      {name:'Karsten Meyer',type:'博士导师',source:'https://www.epfl.ch/labs/lsci/hu/',evidence:'EPFL 官方履历明确记载在 UC San Diego 由 Karsten Meyer 指导博士研究。'},
      {name:'Jonas C. Peters',type:'博士后导师',source:'https://www.epfl.ch/labs/lsci/hu/',evidence:'EPFL 官方履历记载 2005 年加入 Caltech 的 Jonas C. Peters 研究组从事博士后。'}
    ],team:unknownTeam()
  },
  {
    id:'strasser',name:'Peter Strasser',initials:'PS',school:'Technische Universität Berlin',schoolShort:'柏林工业大学',country:'德国',city:'Berlin',
    title:'Full Professor of Electrochemistry and Electrocatalysis',
    topics:['界面电催化','单原子催化','串联催化','电解槽'],
    keywords:['CO2','CO2RR','copper','Cu','铜','tandem','串联','single atom','单原子','interface','界面','electrolyzer','电解槽'],
    summary:'研究电极界面的结构与电催化反应，覆盖单原子位点、纳米催化剂以及分级串联 CO₂ 电解，关注多碳产物选择性与系统设计。',
    url:'https://www.tu.berlin/technischechemie/about/prof-dr-peter-strasser',researchSource:'https://www.tu.berlin/en/about/profile/press-releases/recognition-of-scientific-work',
    email:'pstrasser@tu-berlin.de',emailSource:'https://www.tu.berlin/technischechemie/about/prof-dr-peter-strasser',verifiedAt:'2026-10-28',
    papers:[{title:'Tandem architectures for electrochemical CO2 reduction: from coupled atomic sites to tandem electrolysers',year:2026,journal:'Nature Nanotechnology',url:'https://doi.org/10.1038/s41565-025-02117-6',source:'https://www.nature.com/articles/s41565-025-02117-6',role:'通讯作者',roleSource:'https://www.nature.com/articles/s41565-025-02117-6',dateNote:'综述；首次在线发表 2026-02-04'}],
    relations:[{name:'Gerhard Ertl',type:'博士导师',source:'https://www.tu.berlin/technischechemie/about/prof-dr-peter-strasser',evidence:'TU Berlin 官方履历明确记载 1995–1999 年在 Fritz Haber Institute 的 Gerhard Ertl 指导下攻读物理化学博士。'}],
    team:unknownTeam()
  },
  {
    id:'roldan-cuenya',name:'Beatriz Roldán Cuenya',initials:'BR',school:'Fritz Haber Institute of the Max Planck Society',schoolShort:'马克斯普朗克弗里茨哈伯研究所',country:'德国',city:'Berlin',
    title:'Director of the Interface Science Department; Honorary Professor',
    topics:['铜基催化剂','原位表征','界面电催化','脉冲电解'],
    keywords:['CO2','CO2RR','copper','Cu','铜','operando','原位','XAS','XPS','spectroscopy','谱学','pulse','脉冲','nanocubes'],
    summary:'利用工作态 X 射线谱学和显微表征，解析铜基催化剂在 CO₂ 还原中的结构重排、氧化态与电解质效应，研究脉冲电解调控选择性。',
    url:'https://www.fhi.mpg.de/isc-dept/research-groups/operando-catalysis',researchSource:'https://www.fhi.mpg.de/1632589/Roldan_CV_2024-11-15.pdf',
    email:'roldan@fhi-berlin.mpg.de',emailSource:'https://www.fhi.mpg.de/isc-dept/research-groups/operando-catalysis',verifiedAt:'2026-10-28',
    recruitment:'研究所课题组；申请博士时需核实联合培养及学位授予大学。',
    papers:[{title:'Selectivity and Active State Formation During Pulsed CO2 Electroreduction in Cation-Modified Electrolyte',year:2026,journal:'ChemElectroChem',url:'https://doi.org/10.1002/celc.202500459',source:'https://pure.mpg.de/pubman/item/item_3695142_2/component/file_3695143/ChemElectroChem%2B-%2B2026%2B-%2BLiberra%2B-%2BSelectivity%2Band%2BActive%2BState%2BFormation%2BDuring%2BPulsed%2BCO2%2BElectroreduction%2Bin.pdf',role:'共同通讯作者',roleSource:'https://pure.mpg.de/pubman/item/item_3695142_2/component/file_3695143/ChemElectroChem%2B-%2B2026%2B-%2BLiberra%2B-%2BSelectivity%2Band%2BActive%2BState%2BFormation%2BDuring%2BPulsed%2BCO2%2BElectroreduction%2Bin.pdf'}],
    relations:[
      {name:'Werner Keune',type:'博士导师',source:'https://www.fhi.mpg.de/1632589/Roldan_CV_2024-11-15.pdf',evidence:'2026 年更新的官方 CV 明确记载博士导师 Werner Keune，University of Duisburg-Essen。'},
      {name:'Eric McFarland',type:'博士后导师',source:'https://www.fhi.mpg.de/1632589/Roldan_CV_2024-11-15.pdf',evidence:'官方 CV 明确记载 2001–2003 年在 UCSB 由 Eric McFarland 指导博士后研究。'}
    ],team:unknownTeam()
  },
  {
    id:'garcia-de-arquer',name:'F. Pelayo García de Arquer',initials:'PG',school:'ICFO – Institut de Ciències Fotòniques',schoolShort:'ICFO 光子科学研究所',country:'西班牙',city:'Castelldefels, Barcelona',
    title:'ICFO Professor; Group Leader',
    topics:['铜基催化剂','原位表征','电解槽','界面电催化'],
    keywords:['CO2','CO2RR','copper','Cu','铜','operando','原位','Raman','拉曼','interface water','界面水','MEA','膜电极','scale-up','放大'],
    summary:'结合光子学、工作态谱学与计算，解析 CO₂ 电解界面及水结构，并据此设计纳米催化剂和高电流密度电解系统。',
    url:'https://www.icfo.eu/about-icfo/people/directory/?id=1923',researchSource:'https://www.icfo.eu/research-group/30/co2map/home/',
    email:'pelayo.garciadearquer@icfo.eu',emailSource:'https://www.icfo.eu/about-icfo/people/directory/?id=1923',verifiedAt:'2026-10-28',
    recruitment:'课题组官网提供博士申请联系入口；研究所项目、资助和学位授予安排需核实。',
    papers:[{title:'Operando resolution of CO2 electrolysis interfaces at application-relevant current density reveals water gating',year:2026,journal:'Nature Catalysis',url:'https://doi.org/10.1038/s41929-026-01620-w',source:'https://www.nature.com/articles/s41929-026-01620-w',role:'共同通讯作者',roleSource:'https://www.nature.com/articles/s41929-026-01620-w',dateNote:'首次在线发表 2026-10-15'}],
    relations:[],team:unknownTeam()
  },
  {
    id:'reisner',name:'Erwin Reisner',initials:'ER',school:'University of Cambridge',schoolShort:'剑桥大学',country:'英国',city:'Cambridge',
    title:'Professor of Energy and Sustainability; Royal Academy of Engineering Chair in Emerging Technologies',
    topics:['分子催化','人工光合作用','光电催化','生物杂化'],
    keywords:['CO2','CO2RR','photoelectrochemistry','光电催化','molecular','分子','biohybrid','生物杂化','artificial photosynthesis','人工光合','solar fuel'],
    summary:'探索太阳能与可再生电力驱动的 CO₂ 转化，结合分子催化、生物杂化与光电化学器件，并连接塑料和生物质循环利用。',
    url:'https://www.ch.cam.ac.uk/person/er376',researchSource:'https://www.ch.cam.ac.uk/person/er376',publicationsUrl:'https://www.ch.cam.ac.uk/person/er376',
    email:'reisner@ch.cam.ac.uk',emailSource:'https://reisnerlab.com/join-us/',verifiedAt:'2026-10-28',
    recruitment:'课题组欢迎研究生联系；申请者需核对起始时间、研究契合和资助机会。',
    papers:[{title:'Perovskite-driven Solar C2 Hydrocarbon Synthesis from CO2',year:2025,journal:'Nature Catalysis',url:'https://doi.org/10.1038/s41929-025-01292-y',source:'https://nanowires.berkeley.edu/publications/',role:'待核实'}],
    relations:[{name:'Peidong Yang',type:'合作',source:'https://nanowires.berkeley.edu/publications/',evidence:'共同署名 2025 年 Perovskite-driven Solar C2 Hydrocarbon Synthesis from CO2；仅确认论文共著。'}],
    team:unknownTeam()
  }
];

export const rankings=[
  {school:'University of British Columbia',schoolShort:'不列颠哥伦比亚大学',year:2026,rank:'40',source:'https://www.topuniversities.com/universities/university-british-columbia'},
  {school:"Queen's University",schoolShort:'加拿大女王大学',year:2026,rank:'=191',source:'https://www.topuniversities.com/universities/queens-university-kingston'},
  {school:'UNSW Sydney',schoolShort:'新南威尔士大学',year:2026,rank:'20',source:'https://www.topuniversities.com/universities/university-new-south-wales-unsw-sydney'},
  {school:'The University of Sydney',schoolShort:'悉尼大学',year:2026,rank:'=25',source:'https://www.topuniversities.com/universities/university-sydney'},
  {school:'Delft University of Technology',schoolShort:'代尔夫特理工大学',year:2026,rank:'=47',source:'https://www.topuniversities.com/universities/delft-university-technology'},
  {school:'École Polytechnique Fédérale de Lausanne',schoolShort:'洛桑联邦理工学院',year:2026,rank:'=22',source:'https://www.topuniversities.com/universities/epfl-ecole-polytechnique-federale-de-lausanne'},
  {school:'Technische Universität Berlin',schoolShort:'柏林工业大学',year:2026,rank:'145',source:'https://www.topuniversities.com/universities/technische-universitat-berlin-tu-berlin'},
  {school:'University of Cambridge',schoolShort:'剑桥大学',year:2026,rank:'6',source:'https://www.topuniversities.com/universities/university-cambridge'}
];
