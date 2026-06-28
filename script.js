/* =====================================================
   DUMINDU DILSHAN PORTFOLIO — script.js
   Full feature set:
   · DataManager with localStorage (profile, skills, experience, projects, designs, docs)
   · Admin Panel: Projects, Designs, About, Skills, Experience tabs
   · Project Detail Panel with 15 engineering doc sections
   · Project Docs Editor with per-section image upload
   · Designs Gallery with Lightbox
   · Typed text animation, scroll reveal, navbar
===================================================== */
'use strict';

// =====================================================
// STORAGE KEYS
// =====================================================
const STORAGE_PROJECTS  = 'dd_portfolio_projects';
const STORAGE_DESIGNS   = 'dd_portfolio_designs';
const STORAGE_PROFILE   = 'dd_portfolio_profile';
const STORAGE_SKILLS    = 'dd_portfolio_skills';
const STORAGE_EXPERIENCE= 'dd_portfolio_experience';
const STORAGE_PROJ_DOCS = 'dd_portfolio_proj_docs';
const ADMIN_PASSWORD    = 'DumiFab@2003';

// =====================================================
// DOC SECTIONS (15 engineering sections per project)
// =====================================================
const DOC_SECTIONS = [
  { key:'overview',     icon:'📋', title:'Project Overview'      },
  { key:'problem',      icon:'❓', title:'Problem Statement'      },
  { key:'objectives',   icon:'🎯', title:'Objectives'            },
  { key:'hardware',     icon:'🔧', title:'Hardware Selection'     },
  { key:'architecture', icon:'🏗️', title:'System Architecture'   },
  { key:'circuit',      icon:'⚡', title:'Circuit Diagram'       },
  { key:'pcb',          icon:'🔌', title:'PCB Design'            },
  { key:'mechanical',   icon:'⚙️', title:'Mechanical Design'     },
  { key:'software',     icon:'💻', title:'Software Architecture'  },
  { key:'flowchart',    icon:'🔄', title:'Flowchart'             },
  { key:'testing',      icon:'🧪', title:'Testing Methodology'   },
  { key:'results',      icon:'📊', title:'Results'               },
  { key:'challenges',   icon:'⚠️', title:'Challenges'            },
  { key:'lessons',      icon:'📚', title:'Lessons Learned'       },
  { key:'future',       icon:'🚀', title:'Future Improvements'   },
];

// =====================================================
// CATEGORY MAPS
// =====================================================
const CAT_BADGE = {
  uwb:     { label:'📡 UWB',       cls:'badge-uwb'     },
  lidar:   { label:'🗺️ LiDAR',    cls:'badge-lidar'   },
  robotics:{ label:'🤖 Robotics',  cls:'badge-robot'   },
  desktop: { label:'🖥️ Desk Bot',  cls:'badge-desktop' },
  sensor:  { label:'📊 Sensors',   cls:'badge-sensor'  },
  web:     { label:'🌐 Web',        cls:'badge-web'     },
  ai:      { label:'🧠 AI/Vision', cls:'badge-ai'      },
};
const DESIGN_BADGE = {
  pcb:      { label:'🔌 PCB',       cls:'dbadge-pcb'       },
  cad:      { label:'🖨️ 3D CAD',   cls:'dbadge-cad'       },
  schematic:{ label:'📐 Schematic', cls:'dbadge-schematic'  },
  other:    { label:'🎨 Other',     cls:'dbadge-other'     },
};
const PILL_CLASS = { lang:'pill-lang', robot:'pill-robot', sensor:'pill-sensor', ai:'pill-ai', tool:'pill-tool' };

// =====================================================
// DEFAULT DATA
// =====================================================
const DEFAULT_PROFILE = {
  name:      'Dumindu Dilshan',
  role:      'Electronics & Telecom Undergraduate @ KDU',
  company:   'Co-Founder @ Fabnest',
  website:   'Fabnest3D.com',
  websiteUrl:'https://Fabnest3D.com',
  location:  'Colombo, Sri Lanka 🇱🇰',
  email:     'dumindudilshan66@gmail.com',
  github:    'https://github.com/DuminduDilshan',
  linkedin:  'https://www.linkedin.com/in/dumindu-dilshan',
  photo:     'https://avatars.githubusercontent.com/u/165763174?v=4',
  bio1:      "I'm an Electronics & Telecommunication undergraduate at KDU and Co-Founder of Fabnest, passionate about turning imagination into innovation.",
  bio2:      "From real-time indoor positioning systems using UWB technology to LiDAR SLAM robots, custom PCB designs, and 3D CAD models — I build projects that live at the intersection of hardware and intelligence.",
  statRepos: 42,
  statYears: '2+',
  focusTags: ['📡 UWB Indoor RTLS','🗺️ LiDAR SLAM','🐭 Micro-Mouse v4','🏭 Fabnest Platform'],
};

const DEFAULT_SKILLS = [
  { id:'s1', title:'💻 Languages',         type:'lang',   skills:['Python','C++','C','JavaScript','Java','HTML5','CSS3'] },
  { id:'s2', title:'🤖 Robotics & Embedded',type:'robot', skills:['Arduino','ESP32','STM32','Raspberry Pi','ROS / ROS2','FreeRTOS'] },
  { id:'s3', title:'📡 Sensors & Protocols',type:'sensor', skills:['UWB (DWM3000)','LiDAR (LDS02RR)','IMU (BMI160)','I2C / SPI / UART','MQTT / WiFi / BLE'] },
  { id:'s4', title:'🧠 AI & ML',            type:'ai',    skills:['TensorFlow','PyTorch','OpenCV','Keras','NumPy','Pandas'] },
  { id:'s5', title:'🔧 Design & Tools',     type:'tool',  skills:['KiCad (PCB)','Fusion 360','Blender','Proteus','Git & GitHub','Linux / Ubuntu','VS Code'] },
];

const DEFAULT_EXPERIENCE = [
  { id:'exp1', year:'2024 – Present', title:'Co-Founder · Fabnest',                    desc:'Co-founded Fabnest, a 3D printing and fabrication services company. Built the billing system, cost calculator, and web platforms from scratch.', tags:['3D Printing','Web Dev','Business'],           dot:'cyan'   },
  { id:'exp2', year:'2024 – Present', title:'Electronics & Telecom Undergraduate · KDU', desc:'Pursuing a degree in Electronics & Telecommunication Engineering. Focused on embedded systems, signal processing, control systems, and sensor fusion.', tags:['KDU','Embedded Systems','Signal Processing'], dot:'purple' },
  { id:'exp3', year:'2024 – Present', title:'Open-Source Contributor · RoboticGen Labs', desc:'Collaborating on obo-mouse-v4, an open-source micro-mouse robot project for competition robotics.',                                                tags:['Micro-Mouse','Open Source','Robotics'],         dot:'cyan'   },
  { id:'exp4', year:'2025',           title:'UWB Indoor Positioning Research',           desc:'Developed a real-time indoor positioning system using ESP32 and Qorvo DWM3000 UWB modules for centimeter-level accuracy RTLS.',                     tags:['UWB','ESP32','RTLS','DWM3000'],                  dot:'purple' },
];

const DEFAULT_PROJECTS = [
  { id:'p1',  name:'ESP32-DWM3000-UWB-Indoor-RTLS-Tracker',  cat:'uwb',      emoji:'📡', featured:true,  desc:'Real-time indoor positioning system using ESP32 & Qorvo DWM3000 UWB modules. Achieves centimeter-level accuracy for indoor RTLS.',  url:'https://github.com/DuminduDilshan/ESP32-DWM3000-UWB-Indoor-RTLS-Tracker' },
  { id:'p2',  name:'UWB-module-translator',                   cat:'uwb',      emoji:'📡', featured:false, desc:'UWB signal translation and protocol bridge module for inter-device communication.',                                               url:'https://github.com/DuminduDilshan/UWB-module-translator' },
  { id:'p3',  name:'UWB-with-motors',                         cat:'uwb',      emoji:'📡', featured:false, desc:'UWB-guided autonomous motor control — closed-loop positioning with real-time feedback.',                                         url:'https://github.com/DuminduDilshan/UWB-with-motors' },
  { id:'p4',  name:'Lidar_Slam',                              cat:'lidar',    emoji:'🗺️', featured:true,  desc:'Robot for mapping a room with LDS02RR LiDAR. Full SLAM pipeline on embedded hardware.',                                        url:'https://github.com/DuminduDilshan/Lidar_Slam' },
  { id:'p5',  name:'LDS',                                     cat:'lidar',    emoji:'🗺️', featured:false, desc:'Arduino LiDAR library supporting YDLIDAR X2/X3/X4, RPLIDAR A1, and Xiaomi LDS02RR sensors.',                                   url:'https://github.com/DuminduDilshan/LDS' },
  { id:'p6',  name:'Lidar-adpter',                            cat:'lidar',    emoji:'🗺️', featured:false, desc:'Custom PCB boards for robots compatible with the Kaia.ai robotics platform.',                                                    url:'https://github.com/DuminduDilshan/Lidar-adpter' },
  { id:'p7',  name:'vacuum_robot_lidar',                      cat:'lidar',    emoji:'🗺️', featured:false, desc:'LiDAR-equipped vacuum robot with obstacle mapping and autonomous navigation.',                                                  url:'https://github.com/DuminduDilshan/vacuum_robot_lidar' },
  { id:'p8',  name:'lds02rr_lidar',                           cat:'lidar',    emoji:'🗺️', featured:false, desc:'Low-level driver and interface library for the LDS02RR LiDAR sensor.',                                                          url:'https://github.com/DuminduDilshan/lds02rr_lidar' },
  { id:'p9',  name:'Lidar-Test',                              cat:'lidar',    emoji:'🗺️', featured:false, desc:'LiDAR sensor testing, calibration, and benchmarking toolset.',                                                                  url:'https://github.com/DuminduDilshan/Lidar-Test' },
  { id:'p10', name:'lidar-worked',                            cat:'lidar',    emoji:'🗺️', featured:false, desc:'Working LiDAR integration prototype — confirmed stable scan & parse pipeline.',                                                 url:'https://github.com/DuminduDilshan/lidar-worked' },
  { id:'p11', name:'lidarread',                               cat:'lidar',    emoji:'🗺️', featured:false, desc:'LiDAR data reading and real-time visualization tool.',                                                                          url:'https://github.com/DuminduDilshan/lidarread' },
  { id:'p12', name:'obo-mouse-v4',                            cat:'robotics', emoji:'🐭', featured:true,  desc:'Open-source micro-mouse robot developed with RoboticGen Labs for competition robotics.',                                        url:'https://github.com/DuminduDilshan/obo-mouse-v4' },
  { id:'p13', name:'Maze-Solver-Robot',                       cat:'robotics', emoji:'🤖', featured:false, desc:'Autonomous maze-solving robot with flood-fill algorithm and PID motor control.',                                                url:'https://github.com/DuminduDilshan/Maze-Solver-Robot' },
  { id:'p14', name:'maze-solver',                             cat:'robotics', emoji:'🤖', featured:false, desc:'Software implementation of maze solving algorithms (flood-fill, right-hand, A*).',                                              url:'https://github.com/DuminduDilshan/maze-solver' },
  { id:'p15', name:'proxymaze',                               cat:'robotics', emoji:'🤖', featured:false, desc:'Proximity sensor-based maze navigation — obstacle avoidance without mapping.',                                                 url:'https://github.com/DuminduDilshan/proxymaze' },
  { id:'p16', name:'Localization',                            cat:'robotics', emoji:'🤖', featured:false, desc:'Full robot localization system combining sensor data for accurate position estimation.',                                         url:'https://github.com/DuminduDilshan/Localization' },
  { id:'p17', name:'Localization-with-motors-only',           cat:'robotics', emoji:'🤖', featured:false, desc:'Dead-reckoning localization using motor encoder data alone — no external sensors.',                                              url:'https://github.com/DuminduDilshan/Localization-with-motors-only' },
  { id:'p18', name:'Werehouse-Robot',                         cat:'robotics', emoji:'🏭', featured:false, desc:'Intelligent warehouse robot (IDP project) for automated inventory and navigation.',                                             url:'https://github.com/DuminduDilshan/Werehouse-Robot' },
  { id:'p19', name:'Dual-Core-System',                        cat:'robotics', emoji:'🤖', featured:false, desc:'Dual-core embedded control architecture for real-time task separation.',                                                        url:'https://github.com/DuminduDilshan/Dual-Core-System' },
  { id:'p20', name:'DESKBUDDY-1.0',                           cat:'desktop',  emoji:'🐾', featured:true,  desc:'A cute animated desk pet bot with expressive face display and interactive behaviors.',                                          url:'https://github.com/DuminduDilshan/DESKBUDDY-1.0' },
  { id:'p21', name:'Desk-Robot-Faces',                        cat:'desktop',  emoji:'😊', featured:false, desc:'Animated face display system for desk robots — customizable expressions and moods.',                                            url:'https://github.com/DuminduDilshan/Desk-Robot-Faces' },
  { id:'p22', name:'ASHU',                                    cat:'desktop',  emoji:'🤖', featured:false, desc:'Personal robot companion project with interactive response system.',                                                            url:'https://github.com/DuminduDilshan/ASHU' },
  { id:'p23', name:'Python-IMU-Data-Sampling-App',            cat:'sensor',   emoji:'📊', featured:true,  desc:'Desktop data sampling tool for IMU motion tracking — real-time graphs and CSV export.',                                        url:'https://github.com/DuminduDilshan/Python-IMU-Data-Sampling-App' },
  { id:'p24', name:'BMI160-Arduino',                          cat:'sensor',   emoji:'📊', featured:false, desc:'Arduino library for the BMI160 6-axis IMU sensor (accelerometer + gyroscope).',                                                url:'https://github.com/DuminduDilshan/BMI160-Arduino' },
  { id:'p25', name:'STM32F103-BU0x_SDK',                      cat:'sensor',   emoji:'⚙️', featured:false, desc:'AI Thinker BU0x SDK port and integration for STM32F103 microcontrollers.',                                                   url:'https://github.com/DuminduDilshan/STM32F103-BU0x_SDK' },
  { id:'p26', name:'Air-Qulity-Checker',                      cat:'sensor',   emoji:'🌱', featured:false, desc:'Real-time air quality monitoring system using multiple environmental sensors.',                                                 url:'https://github.com/DuminduDilshan/Air-Qulity-Checker' },
  { id:'p27', name:'Mine-Safty-system',                       cat:'sensor',   emoji:'⛏️', featured:false, desc:'Mine safety monitoring system with gas detection and emergency alert features.',                                               url:'https://github.com/DuminduDilshan/Mine-Safty-system' },
  { id:'p28', name:'tea-measure-system',                      cat:'sensor',   emoji:'🍵', featured:false, desc:'Automated tea quantity measurement system with precision load cell integration.',                                              url:'https://github.com/DuminduDilshan/tea-measure-system' },
  { id:'p29', name:'fabnest-calculator',                      cat:'web',      emoji:'🧮', featured:true,  desc:"Professional fabric & production cost estimation calculator for Fabnest's manufacturing workflow.",                            url:'https://github.com/DuminduDilshan/fabnest-calculator' },
  { id:'p30', name:'Fabnest',                                 cat:'web',      emoji:'🏭', featured:false, desc:'Main Fabnest platform — 3D printing and fabrication services web application.',                                              url:'https://github.com/DuminduDilshan/Fabnest' },
  { id:'p31', name:'Fabnest-new-billing-system',              cat:'web',      emoji:'🧾', featured:false, desc:'Modern billing and invoicing system for Fabnest operations.',                                                                url:'https://github.com/DuminduDilshan/Fabnest-new-billing-system' },
  { id:'p32', name:'fabnest3d',                               cat:'web',      emoji:'🖨️', featured:false, desc:'Fabnest3D.com — web platform for 3D printing services and project submission.',                                             url:'https://github.com/DuminduDilshan/fabnest3d' },
  { id:'p33', name:'Lankamesh',                               cat:'web',      emoji:'🌐', featured:false, desc:'Lankamesh project — Sri Lankan tech mesh network platform.',                                                                 url:'https://github.com/DuminduDilshan/Lankamesh' },
  { id:'p34', name:'Lankamesh-web',                           cat:'web',      emoji:'🌐', featured:false, desc:'Lankamesh web frontend — modern UI for the Lankamesh platform.',                                                              url:'https://github.com/DuminduDilshan/Lankamesh-web' },
  { id:'p35', name:'Thermal-Elephant-detection-',             cat:'ai',       emoji:'🐘', featured:true,  desc:'Thermal imaging-based elephant detection system for wildlife conservation.',                                                   url:'https://github.com/DuminduDilshan/Thermal-Elephant-detection-' },
  { id:'p36', name:'Image-Processing',                        cat:'ai',       emoji:'👁️', featured:false, desc:'Computer vision & image processing experiments — filters, edge detection, feature extraction.',                               url:'https://github.com/DuminduDilshan/Image-Processing' },
  { id:'p37', name:'box-box-box',                             cat:'ai',       emoji:'🏎️', featured:false, desc:'F1 pit strategy optimization challenge — reverse-engineer the race simulation algorithm.',                                   url:'https://github.com/DuminduDilshan/box-box-box' },
  { id:'p38', name:'Slicer',                                  cat:'ai',       emoji:'🔪', featured:false, desc:'3D model slicing tool project for FDM printing workflow.',                                                                  url:'https://github.com/DuminduDilshan/Slicer' },
  { id:'p39', name:'CrealityPrint',                           cat:'ai',       emoji:'🖨️', featured:false, desc:'Creality 3D printer integration and custom print management tools.',                                                         url:'https://github.com/DuminduDilshan/CrealityPrint' },
  { id:'p40', name:'Assigment-02',                            cat:'ai',       emoji:'📝', featured:false, desc:'Academic assignment project covering embedded systems concepts.',                                                             url:'https://github.com/DuminduDilshan/Assigment-02' },
];

// =====================================================
// DATA MANAGER
// =====================================================
const DM = {
  get(key, def)  { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; } },
  set(key, val)  { localStorage.setItem(key, JSON.stringify(val)); },
  genId()        { return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2,6); },

  getProjects()  { return this.get(STORAGE_PROJECTS,  DEFAULT_PROJECTS.map(p => ({...p}))); },
  saveProjects(v){ this.set(STORAGE_PROJECTS, v); },
  getDesigns()   { return this.get(STORAGE_DESIGNS,   []); },
  saveDesigns(v) { this.set(STORAGE_DESIGNS, v); },
  getProfile()   { return { ...DEFAULT_PROFILE, ...this.get(STORAGE_PROFILE, {}) }; },
  saveProfile(v) { this.set(STORAGE_PROFILE, v); },
  getSkills()    { return this.get(STORAGE_SKILLS,    DEFAULT_SKILLS.map(c => ({...c, skills:[...c.skills]}))); },
  saveSkills(v)  { this.set(STORAGE_SKILLS, v); },
  getExperience(){ return this.get(STORAGE_EXPERIENCE, DEFAULT_EXPERIENCE.map(e => ({...e, tags:[...e.tags]}))); },
  saveExperience(v){ this.set(STORAGE_EXPERIENCE, v); },
  getAllDocs()    { return this.get(STORAGE_PROJ_DOCS, {}); },
  saveAllDocs(v) { this.set(STORAGE_PROJ_DOCS, v); },
  getProjectDocs(id){ const all = this.getAllDocs(); return all[id] || {}; },
};

// =====================================================
// HELPERS
// =====================================================
function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function nl2br(s) { return esc(s).replace(/\n/g,'<br>'); }

// =====================================================
// TYPED TEXT
// =====================================================
const ROLES = ['Robots 🤖','UWB Trackers 📡','LiDAR SLAM 🗺️','Embedded Systems 💻','IoT Devices 🌐','AI Solutions 🧠','PCB Boards 🔧'];
let roleIdx = 0, charIdx = 0, deleting = false;
function typeLoop() {
  const cur = ROLES[roleIdx];
  const el  = document.getElementById('typed-text');
  if (!el) return;
  if (!deleting) {
    el.textContent = cur.slice(0, ++charIdx);
    if (charIdx === cur.length) { deleting = true; setTimeout(typeLoop, 2200); return; }
  } else {
    el.textContent = cur.slice(0, --charIdx);
    if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % ROLES.length; }
  }
  setTimeout(typeLoop, deleting ? 55 : 85);
}

// =====================================================
// NAVBAR
// =====================================================
let currentProjectFilter = 'all';
let currentDesignFilter  = 'all';

function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    const sects = ['home','about','skills','projects','designs','experience','contact'];
    let cur = 'home';
    sects.forEach(id => { const s = document.getElementById(id); if (s && window.scrollY >= s.offsetTop - 200) cur = id; });
    document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#'+cur));
  });
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));
}

// =====================================================
// RENDER PROFILE (Hero + About + Contact + Footer)
// =====================================================
function renderProfile() {
  const p = DM.getProfile();
  // Hero
  const nameEl = document.getElementById('hero-name');
  if (nameEl) nameEl.textContent = p.name;
  const subEl  = document.getElementById('hero-sub');
  if (subEl)  subEl.innerHTML  = `${esc(p.role)} · Co-Founder <a href="${esc(p.websiteUrl)}" target="_blank" rel="noopener" class="hero-link">@${esc(p.website)}</a> · ${esc(p.location)}`;
  // Nav logo (initials)
  const logoEl = document.getElementById('nav-logo-link');
  if (logoEl) { const initials = p.name.split(' ').map(n=>n[0]).join('').slice(0,2); logoEl.innerHTML = `<span class="logo-bracket">&lt;</span>${initials}<span class="logo-bracket">/&gt;</span>`; }
  // Avatar
  const avatarEl = document.getElementById('about-avatar');
  if (avatarEl) { avatarEl.src = p.photo; avatarEl.alt = p.name; }
  // Stats
  const sr = document.getElementById('stat-repos');  if (sr) sr.textContent = p.statRepos || DM.getProjects().length;
  const sy = document.getElementById('stat-years');  if (sy) sy.textContent = p.statYears;
  // About content
  const contentEl = document.getElementById('about-content-container');
  if (contentEl) contentEl.innerHTML = `
    <p class="about-text">${nl2br(p.bio1)}</p>
    <p class="about-text">${nl2br(p.bio2)}</p>
    <div class="about-facts">
      <div class="fact-item"><span class="fact-icon">🎓</span><div><strong>Education</strong><span>${esc(p.role)}</span></div></div>
      <div class="fact-item"><span class="fact-icon">🏭</span><div><strong>Company</strong><span>${esc(p.company)} — <a href="${esc(p.websiteUrl)}" target="_blank" rel="noopener">${esc(p.website)}</a></span></div></div>
      <div class="fact-item"><span class="fact-icon">📍</span><div><strong>Location</strong><span>${esc(p.location)}</span></div></div>
      <div class="fact-item"><span class="fact-icon">📧</span><div><strong>Email</strong><span><a href="mailto:${esc(p.email)}">${esc(p.email)}</a></span></div></div>
    </div>
    <div class="about-focus">
      <h4>🔭 Currently Focused On</h4>
      <div class="focus-tags">${p.focusTags.map(t=>`<span class="focus-tag">${esc(t)}</span>`).join('')}</div>
    </div>`;
  // Contact cards
  const cl = document.getElementById('contact-linkedin');
  if (cl) { cl.href = p.linkedin; const t=document.getElementById('contact-linkedin-text'); if(t) t.textContent = p.linkedin.replace('https://www.linkedin.com/in/',''); }
  const cg = document.getElementById('contact-gmail');
  if (cg) { cg.href = 'mailto:'+p.email; const t=document.getElementById('contact-email-text'); if(t) t.textContent = p.email; }
  const cgh = document.getElementById('contact-github');
  if (cgh) { cgh.href = p.github; const t=document.getElementById('contact-github-text'); if(t) t.textContent = p.github.replace('https://github.com/',''); }
  const cw = document.getElementById('contact-website');
  if (cw) { cw.href = p.websiteUrl; const t=document.getElementById('contact-website-text'); if(t) t.textContent = p.website; }
  // Footer
  const fg = document.getElementById('footer-github-link');
  if (fg) { fg.href = p.github; fg.textContent = p.name; }
  const fs = document.getElementById('footer-sub');
  if (fs) fs.textContent = `${p.role} · ${p.company} · ${p.location}`;
}

// =====================================================
// RENDER SKILLS
// =====================================================
function renderSkills() {
  const skills    = DM.getSkills();
  const container = document.getElementById('skills-container');
  if (!container) return;
  container.innerHTML = skills.map(cat => `
    <div class="skill-category reveal">
      <h3 class="skill-cat-title">${esc(cat.title)}</h3>
      <div class="skill-pills">${cat.skills.map(s=>`<span class="pill ${PILL_CLASS[cat.type]||'pill-lang'}">${esc(s)}</span>`).join('')}</div>
    </div>`).join('');
  attachReveal();
}

// =====================================================
// RENDER EXPERIENCE
// =====================================================
function renderExperience() {
  const experiences = DM.getExperience();
  const container   = document.getElementById('experience-container');
  if (!container) return;
  container.innerHTML = experiences.map(exp => `
    <div class="timeline-item reveal">
      <div class="timeline-dot dot-${exp.dot||'cyan'}"></div>
      <div class="timeline-card">
        <span class="timeline-year">${esc(exp.year)}</span>
        <h3>${esc(exp.title)}</h3>
        <p>${nl2br(exp.desc)}</p>
        <div class="timeline-tags">${exp.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div>
      </div>
    </div>`).join('');
  attachReveal();
}

// =====================================================
// RENDER PROJECTS
// =====================================================
function renderProjects(filter) {
  currentProjectFilter = filter;
  const grid     = document.getElementById('projects-grid');
  const label    = document.getElementById('projects-count-label');
  const projects = DM.getProjects();
  const filtered = filter === 'all' ? projects : projects.filter(p => p.cat === filter);
  grid.innerHTML = '';
  if (label) label.textContent = filter === 'all'
    ? `${projects.length} repositories across robotics, positioning, AI, and web`
    : `${filtered.length} project${filtered.length!==1?'s':''} in this category`;
  filtered.forEach(p => {
    const b     = CAT_BADGE[p.cat] || { label:p.cat, cls:'badge-uwb' };
    const url   = p.url || `https://github.com/DuminduDilshan/${p.name}`;
    const short = url.replace('https://github.com/','github.com/');
    const card  = document.createElement('div');
    card.className  = 'project-card reveal';
    card.dataset.id = p.id;
    card.innerHTML  = `
      <div class="project-card-header">
        <span class="project-cat-badge ${b.cls}">${b.label}</span>
        ${p.featured?'<span class="project-cat-badge badge-featured">⭐ Featured</span>':''}
      </div>
      <a href="${url}" target="_blank" rel="noopener" class="project-card-link">${esc(p.emoji||'📁')} ${esc(p.name)}</a>
      <p class="project-desc">${esc(p.desc)}</p>
      <div class="project-footer">
        <button class="project-detail-btn" onclick="openProjectDetail('${p.id}')">📖 View Details</button>
        <a href="${url}" target="_blank" rel="noopener" class="project-github-link">${short} ↗</a>
      </div>`;
    grid.appendChild(card);
  });
  attachReveal();
}

function initProjectFilters() {
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.filter);
    });
  });
}

// =====================================================
// RENDER DESIGNS
// =====================================================
function renderDesigns(filter) {
  currentDesignFilter = filter;
  const grid    = document.getElementById('designs-grid');
  const emptyTpl = document.getElementById('designs-empty');
  const designs = DM.getDesigns();
  const filtered= filter==='all' ? designs : designs.filter(d=>d.cat===filter);
  grid.innerHTML = '';
  if (filtered.length === 0) {
    const clone = emptyTpl.cloneNode(true); clone.removeAttribute('id'); clone.style.display='';
    grid.appendChild(clone); return;
  }
  filtered.forEach((d,idx) => {
    const b    = DESIGN_BADGE[d.cat] || { label:d.cat, cls:'dbadge-other' };
    const card = document.createElement('div');
    card.className  = 'design-card reveal';
    card.dataset.id = d.id;
    const catIcon   = d.cat==='pcb'?'🔌':d.cat==='cad'?'🖨️':d.cat==='schematic'?'📐':'🎨';
    card.innerHTML  = `
      <div class="design-card-img-wrap">
        ${d.image?`<img class="design-card-img" src="${d.image}" alt="${esc(d.title)}" loading="lazy" />`:`<div class="design-card-placeholder"><span class="p-icon">${catIcon}</span><span>No image</span></div>`}
        <div class="design-card-overlay"><span class="view-btn">🔍 View</span></div>
      </div>
      <div class="design-card-body">
        <div class="design-card-badges"><span class="design-badge ${b.cls}">${b.label}</span></div>
        <div class="design-card-title">${esc(d.title)}</div>
        ${d.desc?`<p class="design-card-desc">${esc(d.desc)}</p>`:''}
        ${d.tool?`<span class="design-card-tool">🔧 ${esc(d.tool)}</span>`:''}
      </div>`;
    card.addEventListener('click', () => openLightbox(idx, filtered));
    grid.appendChild(card);
  });
  attachReveal();
}

function initDesignFilters() {
  document.querySelectorAll('[data-design-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-design-filter]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderDesigns(btn.dataset.designFilter);
    });
  });
}

// =====================================================
// LIGHTBOX (Designs)
// =====================================================
let lbList=[], lbIdx=0;
function openLightbox(idx, list) { lbList=list; lbIdx=idx; showLightboxItem(); document.getElementById('lightbox').classList.add('open'); document.body.style.overflow='hidden'; }
function showLightboxItem() {
  const d=lbList[lbIdx]; if(!d) return;
  const b=DESIGN_BADGE[d.cat]||{label:d.cat};
  const img=document.getElementById('lightbox-img');
  img.src=d.image||''; img.alt=d.title; img.style.display=d.image?'block':'none';
  document.getElementById('lightbox-title').textContent=d.title;
  document.getElementById('lightbox-desc').textContent=d.desc||'';
  document.getElementById('lightbox-tool').textContent=d.tool?'🔧 '+d.tool:'';
  document.getElementById('lightbox-cat').textContent=b.label;
  const showArrows=lbList.length>1;
  document.getElementById('lightbox-prev').style.display=showArrows?'':'none';
  document.getElementById('lightbox-next').style.display=showArrows?'':'none';
}
function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); document.body.style.overflow=''; }
function initLightbox() {
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox').addEventListener('click', e => { if(e.target===document.getElementById('lightbox')) closeLightbox(); });
  document.getElementById('lightbox-prev').addEventListener('click', () => { lbIdx=(lbIdx-1+lbList.length)%lbList.length; showLightboxItem(); });
  document.getElementById('lightbox-next').addEventListener('click', () => { lbIdx=(lbIdx+1)%lbList.length; showLightboxItem(); });
  document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key==='Escape') closeLightbox();
    if (e.key==='ArrowLeft')  { lbIdx=(lbIdx-1+lbList.length)%lbList.length; showLightboxItem(); }
    if (e.key==='ArrowRight') { lbIdx=(lbIdx+1)%lbList.length; showLightboxItem(); }
  });
}

// =====================================================
// PROJECT DETAIL PANEL
// =====================================================
let currentDetailProjectId = null;

function openProjectDetail(id) {
  const p = DM.getProjects().find(x=>x.id===id);
  if (!p) return;
  currentDetailProjectId = id;
  const docs  = DM.getProjectDocs(id);
  const b     = CAT_BADGE[p.cat]||{label:p.cat,cls:'badge-uwb'};
  const url   = p.url||`https://github.com/DuminduDilshan/${p.name}`;
  // Header
  document.getElementById('pd-name').textContent = p.name;
  document.getElementById('pd-meta').innerHTML   = `
    <span class="project-cat-badge ${b.cls}">${b.label}</span>
    <a href="${url}" target="_blank" rel="noopener" class="pd-github-link">GitHub ↗</a>`;
  document.getElementById('pd-edit-btn').style.display = adminAuthed ? '' : 'none';
  // Nav
  const navEl = document.getElementById('proj-detail-nav');
  navEl.innerHTML = DOC_SECTIONS.map(s => {
    const filled = docs[s.key] && (docs[s.key].text||docs[s.key].image);
    return `<a href="#pd-sec-${s.key}" class="pd-nav-link${filled?'':' pd-nav-empty'}" onclick="scrollToDetailSection('${s.key}',event)">${s.icon} ${s.title}</a>`;
  }).join('');
  // Content
  const contentEl = document.getElementById('proj-detail-content');
  const totalFilled = DOC_SECTIONS.filter(s=>docs[s.key]&&(docs[s.key].text||docs[s.key].image)).length;
  contentEl.innerHTML = `
    <div class="pd-intro">
      <p class="pd-desc">${esc(p.desc)}</p>
      ${totalFilled===0?`<div class="pd-empty-section" style="margin-top:24px">
        <p>📖 No engineering documentation added yet.</p>
        ${adminAuthed?'<p style="margin-top:8px;font-size:.85rem">Use the <strong>✏️ Edit Docs</strong> button above to add project documentation.</p>':''}
      </div>`:''}
    </div>
    ${DOC_SECTIONS.map(s => {
      const sec    = docs[s.key] || {text:'',image:''};
      const filled = sec.text || sec.image;
      if (!filled) return `<div class="pd-section pd-section-empty" id="pd-sec-${s.key}"><h2 class="pd-section-title">${s.icon} ${s.title}</h2><div class="pd-empty-section">${adminAuthed?'✏️ Not documented — click Edit Docs to add content.':'Not documented yet.'}</div></div>`;
      return `<div class="pd-section" id="pd-sec-${s.key}">
        <h2 class="pd-section-title">${s.icon} ${s.title}</h2>
        ${sec.text?`<div class="pd-section-text">${nl2br(sec.text)}</div>`:''}
        ${sec.image?`<div class="pd-section-img-wrap"><img src="${sec.image}" alt="${esc(s.title)}" class="pd-section-img" onclick="openSingleImageLightbox('${sec.image.replace(/'/g,'\\\'')}')" /></div>`:''}
      </div>`;
    }).join('')}`;
  // Open panel
  document.getElementById('proj-detail-panel').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function scrollToDetailSection(key, e) {
  if (e) e.preventDefault();
  const el = document.getElementById('pd-sec-'+key);
  if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  document.querySelectorAll('.pd-nav-link').forEach(l => l.classList.remove('active'));
  const link = document.querySelector(`.pd-nav-link[href="#pd-sec-${key}"]`);
  if (link) link.classList.add('active');
}

function closeProjectDetail() {
  document.getElementById('proj-detail-panel').classList.remove('open');
  document.body.style.overflow = '';
}

function openSingleImageLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-img').style.display = 'block';
  document.getElementById('lightbox-title').textContent = '';
  document.getElementById('lightbox-desc').textContent  = '';
  document.getElementById('lightbox-tool').textContent  = '';
  document.getElementById('lightbox-cat').textContent   = '';
  document.getElementById('lightbox-prev').style.display = 'none';
  document.getElementById('lightbox-next').style.display = 'none';
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function initProjectDetailPanel() {
  document.getElementById('proj-detail-close').addEventListener('click', closeProjectDetail);
  document.addEventListener('keydown', e => {
    if (e.key==='Escape' && document.getElementById('proj-detail-panel').classList.contains('open')) {
      closeProjectDetail();
    }
  });
}

// =====================================================
// PROJECT DOCS EDITOR (Admin)
// =====================================================
let currentDocsProjectId = null;

function openProjDocs(id) {
  const p = DM.getProjects().find(x=>x.id===id);
  if (!p) return;
  currentDocsProjectId = id;
  const docs = DM.getProjectDocs(id);
  document.getElementById('proj-docs-panel-title').textContent = p.name;
  // Build nav
  const navEl = document.getElementById('proj-docs-nav');
  navEl.innerHTML = DOC_SECTIONS.map(s => {
    const filled = docs[s.key] && (docs[s.key].text||docs[s.key].image);
    return `<button class="docs-nav-btn${filled?' active':''}" onclick="scrollToDocSection('${s.key}')">${s.icon} ${s.title}</button>`;
  }).join('');
  // Build section editors
  const sectEl = document.getElementById('proj-docs-sections');
  sectEl.innerHTML = DOC_SECTIONS.map(s => {
    const sec  = docs[s.key] || {text:'', image:''};
    const imgUrl = (sec.image && sec.image.startsWith('http')) ? sec.image : '';
    return `
      <div class="doc-sec-editor" id="doc-editor-${s.key}">
        <div class="doc-sec-editor-header"><span>${s.icon}</span><h4>${s.title}</h4></div>
        <textarea class="admin-input doc-textarea" id="doc-text-${s.key}" placeholder="Describe the ${s.title.toLowerCase()}..." rows="5">${esc(sec.text||'')}</textarea>
        <div class="doc-image-row">
          <div class="doc-img-preview" id="doc-img-preview-${s.key}">
            ${sec.image?`<img src="${sec.image}" alt="${s.title}" />`:`<div class="doc-no-img"><span>📷</span><span>No image — click Upload or paste a URL</span></div>`}
          </div>
          <div class="doc-img-actions">
            <input type="file" id="doc-img-file-${s.key}" accept="image/*" style="display:none" onchange="handleDocImageUpload(event,'${s.key}')" />
            <button type="button" class="btn btn-ghost btn-sm" onclick="document.getElementById('doc-img-file-${s.key}').click()">📂 Upload</button>
            <input type="url" class="admin-input url-input" id="doc-img-url-${s.key}" placeholder="or paste image URL..." value="${esc(imgUrl)}" oninput="handleDocImageUrl(this.value,'${s.key}')" />
            ${sec.image?`<button type="button" class="btn btn-danger btn-sm" onclick="clearDocImage('${s.key}')">🗑️</button>`:''}
          </div>
          <input type="hidden" id="doc-img-data-${s.key}" value="${esc(sec.image||'')}" />
        </div>
      </div>`;
  }).join('');
  document.getElementById('proj-docs-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjDocs() {
  document.getElementById('proj-docs-overlay').classList.remove('open');
  if (!document.getElementById('proj-detail-panel').classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

function scrollToDocSection(key) {
  const el = document.getElementById('doc-editor-'+key);
  if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  document.querySelectorAll('.docs-nav-btn').forEach(b=>b.classList.remove('active'));
}

function saveProjDocs() {
  const id  = currentDocsProjectId;
  const all = DM.getAllDocs();
  const projDoc = {};
  DOC_SECTIONS.forEach(s => {
    projDoc[s.key] = {
      text:  (document.getElementById(`doc-text-${s.key}`)?.value || '').trim(),
      image: document.getElementById(`doc-img-data-${s.key}`)?.value || '',
    };
  });
  all[id] = projDoc;
  DM.saveAllDocs(all);
  closeProjDocs();
  showToast('💾 Documentation saved!');
  // Refresh detail panel if open for same project
  if (document.getElementById('proj-detail-panel').classList.contains('open') && currentDetailProjectId===id) {
    openProjectDetail(id);
  }
}

function handleDocImageUpload(e, key) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const data = ev.target.result;
    document.getElementById(`doc-img-data-${key}`).value = data;
    const prev = document.getElementById(`doc-img-preview-${key}`);
    if (prev) prev.innerHTML = `<img src="${data}" alt="section image" />`;
    document.getElementById(`doc-img-url-${key}`).value = '';
  };
  reader.readAsDataURL(file);
}

function handleDocImageUrl(url, key) {
  if (!url) return;
  document.getElementById(`doc-img-data-${key}`).value = url;
  const prev = document.getElementById(`doc-img-preview-${key}`);
  if (prev) prev.innerHTML = `<img src="${url}" alt="section image" />`;
}

function clearDocImage(key) {
  document.getElementById(`doc-img-data-${key}`).value = '';
  const prev = document.getElementById(`doc-img-preview-${key}`);
  if (prev) prev.innerHTML = `<div class="doc-no-img"><span>📷</span><span>No image</span></div>`;
  document.getElementById(`doc-img-url-${key}`).value = '';
}

// =====================================================
// ADMIN PANEL
// =====================================================
let adminAuthed = false;

function openAdmin() {
  document.getElementById('admin-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  adminAuthed ? showDashboard() : showLogin();
}
function closeAdmin() {
  document.getElementById('admin-overlay').classList.remove('open');
  if (!document.getElementById('proj-detail-panel').classList.contains('open')) document.body.style.overflow = '';
}
function showLogin() {
  document.getElementById('admin-login').style.display     = '';
  document.getElementById('admin-dashboard').style.display = 'none';
  document.getElementById('login-error').textContent = '';
  document.getElementById('admin-password').value    = '';
  setTimeout(() => document.getElementById('admin-password').focus(), 100);
}
function showDashboard() {
  document.getElementById('admin-login').style.display     = 'none';
  document.getElementById('admin-dashboard').style.display = '';
  switchAdminTab('projects');
}
function handleLogin(e) {
  e.preventDefault();
  const pw = document.getElementById('admin-password').value;
  if (pw === ADMIN_PASSWORD) { adminAuthed = true; showDashboard(); }
  else { document.getElementById('login-error').textContent = '❌ Incorrect password.'; document.getElementById('admin-password').value=''; }
}
function adminLogout() { adminAuthed = false; showLogin(); }

function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab[data-tab]').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display='none');
  const tabBtn = document.getElementById('tab-'+tab);
  const tabCnt = document.getElementById('tab-content-'+tab);
  if (tabBtn) tabBtn.classList.add('active');
  if (tabCnt) tabCnt.style.display = '';
  if (tab === 'projects')   refreshProjectsTable();
  if (tab === 'designs')    refreshDesignsAdminGrid();
  if (tab === 'about')      populateAboutForm();
  if (tab === 'skills')     renderSkillsAdmin();
  if (tab === 'experience') renderExperienceAdmin();
}

function initAdminPanel() {
  document.getElementById('admin-close').addEventListener('click', closeAdmin);
  document.getElementById('admin-hint-btn').addEventListener('click', openAdmin);
  document.getElementById('admin-overlay').addEventListener('click', e => { if(e.target===document.getElementById('admin-overlay')) closeAdmin(); });
  document.addEventListener('keydown', e => { if (e.ctrlKey&&e.shiftKey&&e.key==='A') { e.preventDefault(); openAdmin(); } });
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.querySelectorAll('.admin-tab[data-tab]').forEach(btn => btn.addEventListener('click', () => switchAdminTab(btn.dataset.tab)));
}

// =====================================================
// ADMIN — PROJECTS TABLE
// =====================================================
function refreshProjectsTable() {
  const tbody    = document.getElementById('projects-admin-tbody');
  const projects = DM.getProjects();
  tbody.innerHTML = '';
  projects.forEach(p => {
    const b  = CAT_BADGE[p.cat]||{label:p.cat,cls:''};
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="tbl-name" title="${esc(p.name)}">${esc(p.emoji||'')} ${esc(p.name)}</td>
      <td><span class="project-cat-badge ${b.cls}" style="font-size:11px">${b.label}</span></td>
      <td>${p.featured?'<span class="featured-star">⭐</span>':'—'}</td>
      <td class="tbl-actions">
        <button class="tbl-btn docs" onclick="openProjDocs('${p.id}')">📖 Docs</button>
        <button class="tbl-btn" onclick="editProject('${p.id}')">✏️ Edit</button>
        <button class="tbl-btn del" onclick="confirmDelete('project','${p.id}','${p.name.replace(/'/g,"\\'")}')">🗑️</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// =====================================================
// PROJECT FORM (Add/Edit)
// =====================================================
let currentProjectId = null;
function openProjectForm(id) {
  currentProjectId = id || null;
  document.getElementById('project-form-title').textContent = id ? 'Edit Project' : 'Add Project';
  document.getElementById('project-edit-id').value = '';
  if (id) {
    const p = DM.getProjects().find(x=>x.id===id); if(!p) return;
    document.getElementById('p-name').value     = p.name;
    document.getElementById('p-desc').value     = p.desc;
    document.getElementById('p-cat').value      = p.cat;
    document.getElementById('p-emoji').value    = p.emoji||'';
    document.getElementById('p-url').value      = p.url||'';
    document.getElementById('p-featured').checked = !!p.featured;
    document.getElementById('project-edit-id').value = id;
  } else { document.getElementById('project-form').reset(); }
  document.getElementById('project-form-modal').classList.add('open');
}
function closeProjectForm() { document.getElementById('project-form-modal').classList.remove('open'); currentProjectId=null; }
function saveProject(e) {
  e.preventDefault();
  const projects = DM.getProjects();
  const editId   = document.getElementById('project-edit-id').value;
  const data = { name:document.getElementById('p-name').value.trim(), desc:document.getElementById('p-desc').value.trim(), cat:document.getElementById('p-cat').value, emoji:document.getElementById('p-emoji').value.trim()||'📁', url:document.getElementById('p-url').value.trim(), featured:document.getElementById('p-featured').checked };
  if (editId) { const idx=projects.findIndex(p=>p.id===editId); if(idx!==-1) projects[idx]={...projects[idx],...data}; }
  else projects.push({ id:DM.genId(), ...data });
  DM.saveProjects(projects);
  closeProjectForm(); renderProjects(currentProjectFilter); refreshProjectsTable();
  showToast(editId?'✅ Project updated!':'✅ Project added!');
}
function editProject(id) { openProjectForm(id); }

// =====================================================
// ADMIN — DESIGNS GRID
// =====================================================
function refreshDesignsAdminGrid() {
  const grid    = document.getElementById('designs-admin-grid');
  const designs = DM.getDesigns();
  grid.innerHTML = '';
  if (!designs.length) { grid.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:40px;grid-column:1/-1">No designs yet. Click "+ Add Design".</p>'; return; }
  designs.forEach(d => {
    const card = document.createElement('div');
    card.className = 'design-admin-card';
    card.innerHTML = `
      <div class="design-admin-thumb">${d.image?`<img src="${d.image}" alt="${esc(d.title)}" />`:`<div class="no-img">${d.cat==='pcb'?'🔌':d.cat==='cad'?'🖨️':'📐'}</div>`}</div>
      <div class="design-admin-body">
        <div class="design-admin-title" title="${esc(d.title)}">${esc(d.title)}</div>
        <div class="design-admin-actions">
          <button class="tbl-btn" onclick="editDesign('${d.id}')">✏️</button>
          <button class="tbl-btn del" onclick="confirmDelete('design','${d.id}','${d.title.replace(/'/g,"\\'")}')">🗑️</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

// =====================================================
// DESIGN FORM
// =====================================================
let currentDesignImageData = '';
function openDesignForm(id) {
  currentDesignImageData = '';
  document.getElementById('design-form-title').textContent = id?'Edit Design':'Add Design';
  document.getElementById('design-form').reset();
  document.getElementById('design-edit-id').value  = '';
  document.getElementById('d-image-data').value    = '';
  document.getElementById('image-preview').style.display = 'none';
  document.getElementById('upload-placeholder').style.display = '';
  if (id) {
    const d = DM.getDesigns().find(x=>x.id===id); if(!d) return;
    document.getElementById('d-title').value        = d.title;
    document.getElementById('d-desc').value         = d.desc||'';
    document.getElementById('d-cat').value          = d.cat;
    document.getElementById('d-tool').value         = d.tool||'';
    document.getElementById('design-edit-id').value = id;
    document.getElementById('d-image-data').value   = d.image||'';
    currentDesignImageData = d.image||'';
    if (d.image) {
      document.getElementById('image-preview').src = d.image;
      document.getElementById('image-preview').style.display  = 'block';
      document.getElementById('upload-placeholder').style.display = 'none';
      if (d.image.startsWith('http')) document.getElementById('d-image-url').value = d.image;
    }
  }
  document.getElementById('design-form-modal').classList.add('open');
}
function closeDesignForm() { document.getElementById('design-form-modal').classList.remove('open'); currentDesignImageData=''; }
function handleImageUpload(e) {
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev => {
    currentDesignImageData=ev.target.result;
    document.getElementById('d-image-data').value=currentDesignImageData;
    document.getElementById('image-preview').src=currentDesignImageData;
    document.getElementById('image-preview').style.display='block';
    document.getElementById('upload-placeholder').style.display='none';
    document.getElementById('d-image-url').value='';
  };
  reader.readAsDataURL(file);
}
function handleImageUrl(url) {
  if (!url) return;
  currentDesignImageData=url;
  document.getElementById('d-image-data').value=url;
  document.getElementById('image-preview').src=url;
  document.getElementById('image-preview').style.display='block';
  document.getElementById('upload-placeholder').style.display='none';
}
function saveDesign(e) {
  e.preventDefault();
  const designs = DM.getDesigns();
  const editId  = document.getElementById('design-edit-id').value;
  const imgData = document.getElementById('d-image-data').value||currentDesignImageData;
  const data = { title:document.getElementById('d-title').value.trim(), desc:document.getElementById('d-desc').value.trim(), cat:document.getElementById('d-cat').value, tool:document.getElementById('d-tool').value.trim(), image:imgData };
  if (editId) { const idx=designs.findIndex(d=>d.id===editId); if(idx!==-1) designs[idx]={...designs[idx],...data}; }
  else designs.push({ id:DM.genId(), ...data });
  DM.saveDesigns(designs);
  closeDesignForm(); renderDesigns(currentDesignFilter); refreshDesignsAdminGrid();
  showToast(editId?'✅ Design updated!':'✅ Design added!');
}
function editDesign(id) { openDesignForm(id); }

// =====================================================
// ADMIN — ABOUT FORM
// =====================================================
function populateAboutForm() {
  const p = DM.getProfile();
  document.getElementById('ab-name').value      = p.name;
  document.getElementById('ab-role').value      = p.role;
  document.getElementById('ab-company').value   = p.company;
  document.getElementById('ab-website').value   = p.website;
  document.getElementById('ab-websiteUrl').value= p.websiteUrl;
  document.getElementById('ab-location').value  = p.location;
  document.getElementById('ab-email').value     = p.email;
  document.getElementById('ab-github').value    = p.github;
  document.getElementById('ab-linkedin').value  = p.linkedin;
  document.getElementById('ab-bio1').value      = p.bio1;
  document.getElementById('ab-bio2').value      = p.bio2;
  document.getElementById('ab-statRepos').value = p.statRepos;
  document.getElementById('ab-statYears').value = p.statYears;
  // Photo
  document.getElementById('ab-photo').value = p.photo;
  const prevEl = document.getElementById('ab-photo-preview');
  if (prevEl) prevEl.src = p.photo;
  const urlEl = document.getElementById('ab-photo-url-input');
  if (urlEl && p.photo.startsWith('http')) urlEl.value = p.photo;
  // Focus tags
  renderFocusTagsEditor([...p.focusTags]);
}
// Temp state for focus tags editing
let _focusTags = [];
function renderFocusTagsEditor(tags) {
  _focusTags = tags;
  const container = document.getElementById('about-focus-tags-container');
  if (!container) return;
  container.innerHTML = tags.map((t,i) => `
    <span class="focus-tag-editable">
      ${esc(t)}
      <button class="focus-tag-remove" onclick="removeFocusTag(${i})" type="button">×</button>
    </span>`).join('');
}
function removeFocusTag(idx) { _focusTags.splice(idx,1); renderFocusTagsEditor(_focusTags); }
function addFocusTag() {
  const input = document.getElementById('new-focus-tag-input');
  const val   = input.value.trim(); if (!val) return;
  _focusTags.push(val); renderFocusTagsEditor(_focusTags); input.value='';
}
function handleAboutPhotoUpload(e) {
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev => {
    const data=ev.target.result;
    document.getElementById('ab-photo').value=data;
    document.getElementById('ab-photo-preview').src=data;
    document.getElementById('ab-photo-url-input').value='';
  };
  reader.readAsDataURL(file);
}
function handleAboutPhotoUrl(url) {
  if (!url) return;
  document.getElementById('ab-photo').value=url;
  document.getElementById('ab-photo-preview').src=url;
}
function saveAbout() {
  const profile = {
    name:       document.getElementById('ab-name').value.trim(),
    role:       document.getElementById('ab-role').value.trim(),
    company:    document.getElementById('ab-company').value.trim(),
    website:    document.getElementById('ab-website').value.trim(),
    websiteUrl: document.getElementById('ab-websiteUrl').value.trim(),
    location:   document.getElementById('ab-location').value.trim(),
    email:      document.getElementById('ab-email').value.trim(),
    github:     document.getElementById('ab-github').value.trim(),
    linkedin:   document.getElementById('ab-linkedin').value.trim(),
    bio1:       document.getElementById('ab-bio1').value.trim(),
    bio2:       document.getElementById('ab-bio2').value.trim(),
    photo:      document.getElementById('ab-photo').value,
    statRepos:  parseInt(document.getElementById('ab-statRepos').value)||42,
    statYears:  document.getElementById('ab-statYears').value.trim(),
    focusTags:  [..._focusTags],
  };
  DM.saveProfile(profile);
  renderProfile();
  showToast('✅ Profile saved!');
}

// =====================================================
// ADMIN — SKILLS
// =====================================================
function renderSkillsAdmin() {
  const skills    = DM.getSkills();
  const container = document.getElementById('skills-admin-container');
  if (!container) return;
  container.innerHTML = skills.map((cat) => `
    <div class="skill-cat-admin-card">
      <div class="skill-cat-admin-header">
        <input type="text" class="admin-input skill-cat-title-input" value="${esc(cat.title)}" id="scat-title-${cat.id}" onchange="updateSkillCat('${cat.id}')" placeholder="Category title" />
        <select class="admin-input skill-type-select" id="scat-type-${cat.id}" onchange="updateSkillCat('${cat.id}')">
          <option value="lang"   ${cat.type==='lang'   ?'selected':''}>💻 lang</option>
          <option value="robot"  ${cat.type==='robot'  ?'selected':''}>🤖 robot</option>
          <option value="sensor" ${cat.type==='sensor' ?'selected':''}>📡 sensor</option>
          <option value="ai"     ${cat.type==='ai'     ?'selected':''}>🧠 ai</option>
          <option value="tool"   ${cat.type==='tool'   ?'selected':''}>🔧 tool</option>
        </select>
        <button class="btn btn-danger btn-sm" onclick="confirmDelete('skillcat','${cat.id}','${cat.title.replace(/'/g,"\\'")}')">🗑️</button>
      </div>
      <div class="skill-pills-admin" id="spills-${cat.id}">
        ${cat.skills.map((s,si) => `<span class="pill ${PILL_CLASS[cat.type]||'pill-lang'} pill-admin">${esc(s)}<button class="pill-remove-btn" type="button" onclick="removeSkill('${cat.id}',${si})">×</button></span>`).join('')}
      </div>
      <div class="add-skill-row">
        <input type="text" class="admin-input" id="new-skill-${cat.id}" placeholder="Add skill..." onkeydown="if(event.key==='Enter'){event.preventDefault();addSkill('${cat.id}')}" />
        <button class="btn btn-secondary btn-sm" type="button" onclick="addSkill('${cat.id}')">+ Add</button>
      </div>
    </div>`).join('');
}
function updateSkillCat(id) {
  const skills = DM.getSkills();
  const idx    = skills.findIndex(c=>c.id===id); if(idx===-1) return;
  skills[idx].title = document.getElementById(`scat-title-${id}`)?.value||skills[idx].title;
  skills[idx].type  = document.getElementById(`scat-type-${id}`)?.value||skills[idx].type;
  DM.saveSkills(skills); renderSkills(); renderSkillsAdmin();
}
function addSkill(catId) {
  const input  = document.getElementById(`new-skill-${catId}`);
  const val    = input?.value.trim(); if(!val) return;
  const skills = DM.getSkills();
  const cat    = skills.find(c=>c.id===catId); if(!cat) return;
  cat.skills.push(val);
  DM.saveSkills(skills); renderSkills(); renderSkillsAdmin();
  showToast(`✅ "${val}" added!`);
}
function removeSkill(catId, skillIdx) {
  const skills = DM.getSkills();
  const cat    = skills.find(c=>c.id===catId); if(!cat) return;
  cat.skills.splice(skillIdx, 1);
  DM.saveSkills(skills); renderSkills(); renderSkillsAdmin();
}
function addSkillCategory() {
  const skills = DM.getSkills();
  skills.push({ id:DM.genId(), title:'New Category', type:'lang', skills:[] });
  DM.saveSkills(skills); renderSkills(); renderSkillsAdmin();
  showToast('✅ New category added!');
}

// =====================================================
// ADMIN — EXPERIENCE
// =====================================================
function renderExperienceAdmin() {
  const exps      = DM.getExperience();
  const container = document.getElementById('experience-admin-list');
  if (!container) return;
  if (!exps.length) { container.innerHTML='<p style="color:var(--text-muted);text-align:center;padding:32px">No entries yet.</p>'; return; }
  container.innerHTML = `<div class="exp-admin-list">${exps.map(exp=>`
    <div class="exp-admin-item">
      <div class="exp-admin-dot dot-${exp.dot||'cyan'}"></div>
      <div class="exp-admin-content">
        <div class="exp-admin-year">${esc(exp.year)}</div>
        <div class="exp-admin-title">${esc(exp.title)}</div>
      </div>
      <div class="exp-admin-actions">
        <button class="tbl-btn" onclick="editExperience('${exp.id}')">✏️ Edit</button>
        <button class="tbl-btn del" onclick="confirmDelete('experience','${exp.id}','${exp.title.replace(/'/g,"\\'")}')">🗑️</button>
      </div>
    </div>`).join('')}</div>`;
}

let currentExpId = null;
function openExperienceForm(id) {
  currentExpId = id || null;
  document.getElementById('experience-form-title').textContent = id?'Edit Entry':'Add Entry';
  document.getElementById('experience-form').reset();
  document.getElementById('exp-edit-id').value = '';
  if (id) {
    const exp = DM.getExperience().find(e=>e.id===id); if(!exp) return;
    document.getElementById('exp-year').value  = exp.year;
    document.getElementById('exp-title').value = exp.title;
    document.getElementById('exp-desc').value  = exp.desc||'';
    document.getElementById('exp-dot').value   = exp.dot||'cyan';
    document.getElementById('exp-tags').value  = (exp.tags||[]).join(', ');
    document.getElementById('exp-edit-id').value = id;
  }
  document.getElementById('experience-form-modal').classList.add('open');
}
function closeExperienceForm() { document.getElementById('experience-form-modal').classList.remove('open'); currentExpId=null; }
function editExperience(id) { openExperienceForm(id); }
function saveExperience(e) {
  e.preventDefault();
  const exps   = DM.getExperience();
  const editId = document.getElementById('exp-edit-id').value;
  const tags   = document.getElementById('exp-tags').value.split(',').map(t=>t.trim()).filter(Boolean);
  const data = { year:document.getElementById('exp-year').value.trim(), title:document.getElementById('exp-title').value.trim(), desc:document.getElementById('exp-desc').value.trim(), dot:document.getElementById('exp-dot').value, tags };
  if (editId) { const idx=exps.findIndex(e=>e.id===editId); if(idx!==-1) exps[idx]={...exps[idx],...data}; }
  else exps.push({ id:DM.genId(), ...data });
  DM.saveExperience(exps);
  closeExperienceForm(); renderExperience(); renderExperienceAdmin();
  showToast(editId?'✅ Entry updated!':'✅ Entry added!');
}

// =====================================================
// DELETE CONFIRM
// =====================================================
let confirmCallback = null;
function confirmDelete(type, id, name) {
  document.getElementById('confirm-title').textContent = `Delete "${name}"?`;
  document.getElementById('confirm-msg').textContent   = 'This action cannot be undone.';
  confirmCallback = () => {
    if (type==='project') {
      DM.saveProjects(DM.getProjects().filter(p=>p.id!==id));
      renderProjects(currentProjectFilter); refreshProjectsTable(); showToast('🗑️ Project deleted.');
    } else if (type==='design') {
      DM.saveDesigns(DM.getDesigns().filter(d=>d.id!==id));
      renderDesigns(currentDesignFilter); refreshDesignsAdminGrid(); showToast('🗑️ Design deleted.');
    } else if (type==='skillcat') {
      DM.saveSkills(DM.getSkills().filter(c=>c.id!==id));
      renderSkills(); renderSkillsAdmin(); showToast('🗑️ Category deleted.');
    } else if (type==='experience') {
      DM.saveExperience(DM.getExperience().filter(e=>e.id!==id));
      renderExperience(); renderExperienceAdmin(); showToast('🗑️ Entry deleted.');
    }
    closeConfirm();
  };
  document.getElementById('confirm-modal').classList.add('open');
}
function closeConfirm() { document.getElementById('confirm-modal').classList.remove('open'); confirmCallback=null; }
function initConfirmModal() {
  document.getElementById('confirm-ok-btn').addEventListener('click', () => { if(confirmCallback) confirmCallback(); });
  document.getElementById('confirm-modal').addEventListener('click', e => { if(e.target===document.getElementById('confirm-modal')) closeConfirm(); });
}

// =====================================================
// CONTACT FORM
// =====================================================
function handleFormSubmit(e) {
  e.preventDefault();
  const p = DM.getProfile();
  const name=document.getElementById('form-name').value, email=document.getElementById('form-email').value, msg=document.getElementById('form-message').value;
  window.location.href=`mailto:${p.email}?subject=${encodeURIComponent('Portfolio Contact from '+name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`)}`;
  const note=document.getElementById('form-note');
  note.textContent='✅ Opening your email client...';
  setTimeout(()=>{note.textContent='';},3000);
}

// =====================================================
// TOAST
// =====================================================
function showToast(msg) {
  let t = document.getElementById('dd-toast');
  if (!t) {
    t = document.createElement('div'); t.id='dd-toast';
    t.style.cssText='position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--bg2);border:1px solid var(--border);color:var(--text);padding:12px 24px;border-radius:10px;font-size:.9rem;font-weight:500;z-index:99999;opacity:0;transition:all .3s ease;box-shadow:0 8px 32px rgba(0,0,0,.4);white-space:nowrap;font-family:Inter,sans-serif';
    document.body.appendChild(t);
  }
  t.textContent=msg;
  requestAnimationFrame(()=>{ t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)'; });
  setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(20px)'; },2500);
}

// =====================================================
// SCROLL REVEAL
// =====================================================
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold:0.08 });
function attachReveal() { document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObs.observe(el)); }

// =====================================================
// INIT
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  // Init localStorage if first visit
  if (!localStorage.getItem(STORAGE_PROJECTS)) DM.saveProjects(DEFAULT_PROJECTS.map(p=>({...p})));

  typeLoop();
  initNavbar();
  initProjectFilters();
  initDesignFilters();
  initLightbox();
  initAdminPanel();
  initConfirmModal();
  initProjectDetailPanel();

  // Render all dynamic sections
  renderProfile();
  renderSkills();
  renderExperience();
  renderProjects('all');
  renderDesigns('all');

  // Apply reveal to static elements
  document.querySelectorAll('.stat-card,.contact-card').forEach(el => el.classList.add('reveal'));
  attachReveal();
});

// =====================================================
// GLOBAL EXPORTS (inline HTML handlers)
// =====================================================
function exportData() {
  const data = {
    profile: DM.getProfile(),
    skills: DM.getSkills(),
    experience: DM.getExperience(),
    projects: DM.getProjects(),
    designs: DM.getDesigns(),
    docs: DM.getAllDocs()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'portfolio_data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('📥 Data exported successfully!');
}

Object.assign(window, {
  handleLogin, adminLogout, openAdmin, closeAdmin,
  openProjectForm, closeProjectForm, saveProject, editProject,
  openDesignForm, closeDesignForm, saveDesign, editDesign,
  handleImageUpload, handleImageUrl,
  openProjDocs, closeProjDocs, saveProjDocs, scrollToDocSection,
  handleDocImageUpload, handleDocImageUrl, clearDocImage,
  openProjectDetail, closeProjectDetail, scrollToDetailSection, openSingleImageLightbox,
  saveAbout, addFocusTag, removeFocusTag, handleAboutPhotoUpload, handleAboutPhotoUrl,
  addSkillCategory, addSkill, removeSkill, updateSkillCat,
  openExperienceForm, closeExperienceForm, saveExperience, editExperience,
  confirmDelete, closeConfirm, handleFormSubmit, exportData,
  // expose for admin panel edit button
  get currentDetailProjectId() { return currentDetailProjectId; },
});
