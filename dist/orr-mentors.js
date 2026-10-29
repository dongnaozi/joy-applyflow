// ORR seed cohort verified 2026-10-29 from official institutional/publisher sources.
const unknownTeam=()=>({chineseStudents:null,chineseFaculty:null,note:'暂无完整、可核实的公开统计；不依据姓名或照片推断国籍。'});
const orrTopics=['ORR','氧还原'];
const orrKeywords=['ORR','oxygen reduction','氧还原'];
export const mentors=[
  {
    id:'shao-horn',name:'Yang Shao-Horn',initials:'YS',school:'Massachusetts Institute of Technology',schoolShort:'MIT 麻省理工学院',country:'美国',city:'Cambridge, Massachusetts',
    title:'JR East Professor of Engineering; Professor of Mechanical Engineering, Materials Science and Engineering, and Chemistry',
    topics:[...orrTopics,'氧电催化','界面电催化','金属氧化物'],keywords:[...orrKeywords,'oxygen electrocatalysis','metal oxide','金属氧化物','fuel cell','燃料电池','interface','界面'],
    summary:'研究表面电子结构、界面反应与离子传输，将材料设计原则用于氧还原等氧电催化反应，并关注燃料电池中的性能评价。',
    url:'https://chemistry.mit.edu/profile/yang-shao-horn/',researchSource:'https://eel.mit.edu/',publicationsUrl:'https://eel.mit.edu/',email:'shaohorn@mit.edu',emailSource:'https://chemistry.mit.edu/profile/yang-shao-horn/',verifiedAt:'2026-10-29',
    recruitment:'2026-10-29 核验时，MIT 化学系官方主页注明不接收 2026–2027 学年研究生；其他年份须另行确认。',
    papers:[{title:'Best practices for oxygen electrocatalysis',year:2024,journal:'Nature Sustainability',url:'https://doi.org/10.1038/s41893-024-01285-y',source:'https://www.nature.com/articles/s41893-024-01285-y',role:'待核实',topics:orrTopics,keywords:orrKeywords,dateNote:'Comment，讨论 ORR/OER 活性与稳定性评价；2024-02-22 发表。'}],
    relations:[{name:'Zhichuan J. Xu',type:'合作',source:'https://personal.ntu.edu.sg/xuzc/Publications.html',evidence:'共同署名 2024 年 Best practices for oxygen electrocatalysis；仅确认论文共著。'}],team:unknownTeam()
  },
  {
    id:'abruna',name:'Héctor D. Abruña',initials:'HA',school:'Cornell University',schoolShort:'康奈尔大学',country:'美国',city:'Ithaca, New York',title:'Emile M. Chamot Professor',
    topics:[...orrTopics,'原位表征','非贵金属催化','燃料电池'],keywords:[...orrKeywords,'fuel cell','燃料电池','spinel','尖晶石','XAS','原位','in situ'],
    summary:'将电化学、原位 X 射线谱学与理论结合，研究燃料电池阴极氧还原机理及非贵金属催化剂的活性位点。',
    url:'https://chemistry.cornell.edu/hector-d-abruna',researchSource:'https://www.chess.cornell.edu/new-oxygen-reduction-electrocatalysts-alkaline-fuel-cells',email:'hda1@cornell.edu',emailSource:'https://chemistry.cornell.edu/hector-d-abruna',verifiedAt:'2026-10-29',
    papers:[{title:'Oxygen Reduction Pathway for Spinel Metal Oxides in Alkaline Media: An Experimentally Supported Ab Initio Study',year:2024,journal:'Journal of the American Chemical Society',url:'https://doi.org/10.1021/jacs.3c11977',source:'https://pubs.acs.org/doi/abs/10.1021/jacs.3c11977',role:'共同通讯作者',roleSource:'https://pubs.acs.org/doi/abs/10.1021/jacs.3c11977',topics:orrTopics,keywords:orrKeywords}],
    relations:[],team:unknownTeam()
  },
  {
    id:'shao-minhua',name:'Minhua Shao',initials:'MS',school:'The Hong Kong University of Science and Technology',schoolShort:'香港科技大学',country:'中国香港',city:'Hong Kong',title:'Head and Chair Professor of Chemical and Biological Engineering; Cheong Ying Chan Professor of Energy Engineering and Environment',
    topics:[...orrTopics,'单原子催化','原位表征','燃料电池'],keywords:[...orrKeywords,'Fe-N-C','single atom','单原子','fuel cell','燃料电池','electrocatalysis'],
    summary:'开发燃料电池氧还原电催化剂，并以原位谱学解析反应机理；近期工作涵盖曲面 Fe–N4 位点及多级孔结构。',
    url:'https://facultyprofiles.hkust.edu.hk/profiles.php?profile=minhua-shao-kemshao',researchSource:'https://researchportal.hkust.edu.hk/en/persons/minhua-shao/',publicationsUrl:'https://facultyprofiles.hkust.edu.hk/profiles.php?profile=minhua-shao-kemshao',email:'kemshao@ust.hk',emailSource:'https://facultyprofiles.hkust.edu.hk/profiles.php?profile=minhua-shao-kemshao',verifiedAt:'2026-10-29',
    papers:[{title:'Meso/Microporous Single-Atom Catalysts Featuring Curved Fe–N4 Sites Boost the Oxygen Reduction Reaction Activity',year:2025,journal:'Angewandte Chemie International Edition',url:'https://doi.org/10.1002/anie.202415691',source:'https://onlinelibrary.wiley.com/doi/pdfdirect/10.1002/anie.202415691',role:'共同通讯作者',roleSource:'https://onlinelibrary.wiley.com/doi/pdfdirect/10.1002/anie.202415691',topics:orrTopics,keywords:orrKeywords,dateNote:'2025 年卷 64，e202415691；2024 年先行在线发表。'}],
    relations:[],team:unknownTeam()
  },
  {
    id:'jaouen',name:'Frédéric Jaouen',initials:'FJ',school:'Université de Montpellier / CNRS (ICGM)',schoolShort:'蒙彼利埃大学 / CNRS ICGM',country:'法国',city:'Montpellier',title:'CNRS Research Director, Institut Charles Gerhardt Montpellier',
    topics:[...orrTopics,'单原子催化','非贵金属催化','燃料电池'],keywords:[...orrKeywords,'Fe-N-C','M-N-C','single atom','单原子','PEMFC','fuel cell','燃料电池'],
    summary:'专注质子交换膜燃料电池的非贵金属氧还原催化，研究 Fe–N–C 单原子位点、活性位点结构与工作稳定性。',
    url:'https://www.icgm.fr/Frederic-Jaouen/',researchSource:'https://www.icgm.fr/Frederic-Jaouen/',publicationsUrl:'https://esploro.umontpellier.fr/esploro/profile/frederic_jaouen',email:'frederic.jaouen@umontpellier.fr',emailSource:'https://www.icgm.fr/Frederic-Jaouen/',verifiedAt:'2026-10-29',
    recruitment:'CNRS / ICGM 研究组；博士学位授予与具体项目须向蒙彼利埃大学及课题组核实。',
    papers:[{title:'Single-Site-Level Deciphering of the Complexity of Electrochemical Oxygen Reduction on Fe–N–C Catalysts',year:2024,journal:'ACS Catalysis',url:'https://doi.org/10.1021/acscatal.4c01640',source:'https://pubs.acs.org/accacs/article/14/11/8184/487028/Single-Site-Level-Deciphering-of-the-Complexity-of',role:'共同通讯作者',roleSource:'https://pubs.acs.org/accacs/article/14/11/8184/487028/Single-Site-Level-Deciphering-of-the-Complexity-of',topics:orrTopics,keywords:orrKeywords}],
    relations:[
      {name:'Peter Strasser',type:'合作',source:'https://hal.umontpellier.fr/hal-04182585/document',evidence:'共同署名 2023 年 JACS 论文 Structural and Reactivity Effects of Secondary Metal Doping into Iron-Nitrogen-Carbon Catalysts for Oxygen Electroreduction；仅确认论文共著。'},
      {name:'Gang Wu',type:'合作',source:'https://impact.ornl.gov/en/publications/unravelling-the-stability-stressors-of-atomically-dispersed-fenc-/',evidence:'共同署名 2025 年 JACS 论文 Unravelling the Stability Stressors of Atomically Dispersed Fe–N–C Oxygen Reduction Catalysts；仅确认论文共著。'}
    ],team:unknownTeam()
  },
  {
    id:'wu-gang',name:'Gang Wu',initials:'GW',school:'Washington University in St. Louis',schoolShort:'圣路易斯华盛顿大学',country:'美国',city:'St. Louis, Missouri',title:'Elvera and William R. Stuckenberg Professor of Energy, Environmental & Chemical Engineering',
    topics:[...orrTopics,'单原子催化','非贵金属催化','燃料电池'],keywords:[...orrKeywords,'M-N-C','Fe-N-C','single atom','单原子','PGM-free','PEMFC','fuel cell','燃料电池'],
    summary:'研究氢燃料电池中的低贵金属和无贵金属电催化剂，关注 M–N–C 单原子位点的氧还原活性、结构和耐久性。',
    url:'https://engineering.washu.edu/faculty/Gang-Wu.html',researchSource:'https://engineering.washu.edu/news/2024/Wu-joins-Energy-Environmental-Chemical-Engineering-faculty.html',email:'gangw@wustl.edu',emailSource:'https://engineering.washu.edu/faculty/Gang-Wu.html',verifiedAt:'2026-10-29',
    papers:[
      {title:'Activity versus stability of atomically dispersed transition-metal electrocatalysts',year:2024,journal:'Nature Reviews Materials',url:'https://doi.org/10.1038/s41578-024-00703-z',source:'https://www.nature.com/articles/s41578-024-00703-z',role:'待核实',topics:orrTopics,keywords:orrKeywords,dateNote:'Perspective；主要讨论无贵金属 M–N–C 氧还原催化剂，2024-07-31 发表。'},
      {title:'Unravelling the Stability Stressors of Atomically Dispersed Fe–N–C Oxygen Reduction Catalysts',year:2025,journal:'Journal of the American Chemical Society',url:'https://doi.org/10.1021/jacs.5c15451',source:'https://pubs.acs.org/doi/10.1021/jacs.5c15451',role:'待核实',topics:orrTopics,keywords:orrKeywords}
    ],
    relations:[{name:'Frédéric Jaouen',type:'合作',source:'https://impact.ornl.gov/en/publications/unravelling-the-stability-stressors-of-atomically-dispersed-fenc-/',evidence:'共同署名 2025 年 JACS 论文 Unravelling the Stability Stressors of Atomically Dispersed Fe–N–C Oxygen Reduction Catalysts；仅确认论文共著。'}],team:unknownTeam()
  },
  {
    id:'xu-zhichuan',name:'Zhichuan J. Xu',initials:'ZX',school:'Nanyang Technological University',schoolShort:'南洋理工大学',country:'新加坡',city:'Singapore',title:"President's Chair Professor in Materials Science and Engineering",
    topics:[...orrTopics,'氧电催化','金属氧化物','燃料电池'],keywords:[...orrKeywords,'oxygen electrocatalysis','spinel','尖晶石','metal oxide','金属氧化物','fuel cell','燃料电池'],
    summary:'研究过渡金属氧化物的氧还原与氧析出，关注电子结构、自旋及催化性能的联系，并推动氧电催化的规范评价。',
    url:'https://www.ntu.edu.sg/mse/about-us/leadership-team',researchSource:'https://personal.ntu.edu.sg/xuzc/',publicationsUrl:'https://personal.ntu.edu.sg/xuzc/Publications.html',email:'xuzc@ntu.edu.sg',emailSource:'https://www.ntu.edu.sg/erian/about-us/our-people/cluster-directors/jason-xu',verifiedAt:'2026-10-29',
    papers:[{title:'Best practices for oxygen electrocatalysis',year:2024,journal:'Nature Sustainability',url:'https://doi.org/10.1038/s41893-024-01285-y',source:'https://personal.ntu.edu.sg/xuzc/Publications.html',role:'待核实',topics:orrTopics,keywords:orrKeywords,dateNote:'Comment，讨论 ORR/OER 活性与稳定性评价；2024-02-22 发表。'}],
    relations:[{name:'Yang Shao-Horn',type:'合作',source:'https://personal.ntu.edu.sg/xuzc/Publications.html',evidence:'共同署名 2024 年 Best practices for oxygen electrocatalysis；仅确认论文共著。'}],team:unknownTeam()
  }
];

// Append these arrays to the existing record. Do not create a second Strasser.
export const mentorPatches=[{
  id:'strasser',topics:[...orrTopics,'燃料电池'],keywords:[...orrKeywords,'Fe-N-C','M-N-C','fuel cell'],
  papers:[{title:'Structural and Reactivity Effects of Secondary Metal Doping into Iron-Nitrogen-Carbon Catalysts for Oxygen Electroreduction',year:2023,journal:'Journal of the American Chemical Society',url:'https://doi.org/10.1021/jacs.3c03033',source:'https://hal.umontpellier.fr/hal-04182585/document',role:'共同通讯作者',roleSource:'https://hal.umontpellier.fr/hal-04182585/document',topics:orrTopics,keywords:orrKeywords}],
  relations:[{name:'Frédéric Jaouen',type:'合作',source:'https://hal.umontpellier.fr/hal-04182585/document',evidence:'共同署名 2023 年 JACS 论文 Structural and Reactivity Effects of Secondary Metal Doping into Iron-Nitrogen-Carbon Catalysts for Oxygen Electroreduction；仅确认论文共著。'}]
}];

// Rank remains unknown until a QS 2026 historical row has been independently checked.
export const rankings=[];
