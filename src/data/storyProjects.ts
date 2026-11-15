export type StoryProject = {
  title: string
  card: string
  color: string
  c2: string
  icon: 'vision' | 'resume' | 'health' | 'leaf' | 'fish' | 'hospital'
  meta: string
  big: string
  lbl: string
  sum: string
  pts: string[]
  tags: string[]
  cats: string[]
  role: string
  year: string
  problem: string
  result: string
  facts: [string, string][]
}

export const GLYPHS: Record<StoryProject['icon'], string> = {
  vision:
    '<path d="M10 34V14h20M90 14h20v20M110 86v20H90M30 106H10V86"/><circle cx="60" cy="54" r="20"/><path d="M52 50v2M68 50v2M52 62q8 6 16 0"/><path d="M30 98q30-22 60 0"/>',
  resume:
    '<rect x="24" y="12" width="62" height="86" rx="8"/><path d="M38 34h34M38 46h34M38 58h22"/><circle cx="84" cy="80" r="16"/><path d="M96 92l14 14"/>',
  health:
    '<path d="M60 100C22 74 14 46 34 33c12-8 22-1 26 8 4-9 14-16 26-8 20 13 12 41-26 67z"/><path d="M22 62h22l6-12 9 24 6-12h33"/>',
  leaf: '<path d="M60 106c0-46 12-76 46-90 4 40-14 68-46 76"/><path d="M60 106c-4-26-20-42-44-46 0 26 18 42 44 42"/><path d="M14 108h92"/>',
  fish: '<path d="M18 62c20-24 56-24 72 0-16 24-52 24-72 0z"/><path d="M90 62l18-16v32z"/><circle cx="36" cy="58" r="2.5"/><path d="M58 26c-4 6-4 10 0 12 4-2 4-6 0-12zM78 18c-3 5-3 8 0 10 3-2 3-5 0-10z"/>',
  hospital:
    '<path d="M14 92V42M14 76h92v16M106 76V64c0-8-6-12-14-12H54v24"/><circle cx="36" cy="62" r="9"/><path d="M78 20h12M84 14v12"/><rect x="70" y="8" width="28" height="28" rx="6"/>',
}

export const storyProjects: StoryProject[] = [
  {
    title: 'Workplace Vision',
    card: 'Workplace Vision',
    color: '#3B4BA8',
    c2: '#7C8CFF',
    icon: 'vision',
    meta: 'Internship · Aioty Labs · Client: Royal Enfield · 2025',
    big: '95%+',
    lbl: 'face-recognition accuracy',
    sum: 'A Python computer-vision system that monitors workstations on a Royal Enfield assembly line — who is there, whether the station is in use, and how people are sitting.',
    pts: [
      'Monitored 5+ assembly stations with a single Python system',
      'Employee verification with InsightFace at 95%+ accuracy in the test environment',
      'YOLOv8 occupancy detection and pose estimation for utilisation and posture',
      'Evaluated live with 10 employees and fed into workflow improvements',
    ],
    tags: ['Python', 'YOLOv8', 'InsightFace', 'Pose estimation', 'Computer vision'],
    cats: ['AI', 'Computer vision'],
    role: 'Computer Vision Engineer Intern',
    year: '2025',
    problem:
      'An assembly line needs to know who is at each workstation, whether it is in use and how people are sitting — without someone checking by hand.',
    result:
      'Tested live with 10 employees, reached 95%+ verification accuracy in the evaluated setup, and fed into workflow improvements.',
    facts: [
      ['95%+', 'face-recognition accuracy'],
      ['5+', 'assembly stations monitored'],
      ['10', 'employees in the live test'],
    ],
  },
  {
    title: 'Resume Analyzer SaaS',
    card: 'Resume Analyzer SaaS',
    color: '#2F5D50',
    c2: '#7FD1A8',
    icon: 'resume',
    meta: 'SaaS product · AI recruiting',
    big: 'Multi-tenant',
    lbl: 'company workspaces with role-based access',
    sum: 'An AI-powered platform that parses resumes, extracts candidate data and ranks candidates against a job description, so recruiters screen faster.',
    pts: [
      'Resume parsing and candidate data extraction',
      'Job-description-based candidate matching for screening',
      'Role-based access control and tenant isolation per company',
      'Versioning cut unnecessary LLM calls and sped up processing',
    ],
    tags: ['Python', 'SQL', 'REST APIs', 'LLMs', 'RBAC'],
    cats: ['AI', 'SaaS'],
    role: 'Full-stack AI developer',
    year: 'SaaS',
    problem: 'Recruiters lose hours screening resumes by hand, across many roles and many companies.',
    result: 'Faster screening, secure per-company workspaces, and lower processing cost by cutting unnecessary LLM calls.',
    facts: [
      ['Multi-tenant', 'company workspaces'],
      ['RBAC', 'role-based access control'],
      ['Fewer', 'LLM calls through versioning'],
    ],
  },
  {
    title: 'Healthcare Assistant',
    card: 'Healthcare Assistant',
    color: '#B8475A',
    c2: '#FF9AA8',
    icon: 'health',
    meta: 'Mobile app · AI healthcare',
    big: 'RAG',
    lbl: 'chatbot built on the Gemma LLM',
    sum: "A healthcare app for symptom assessment and medical guidance, with a context-aware AI assistant that speaks the patient's language.",
    pts: [
      'Retrieval-Augmented Generation chatbot using Gemma LLM',
      'Multilingual voice and text conversations',
      'Urgency classification to flag serious cases',
      'Appointment booking and consultation features',
    ],
    tags: ['Flutter', 'Flask', 'MySQL', 'RAG', 'Gemma LLM'],
    cats: ['AI', 'Healthcare'],
    role: 'App and AI developer',
    year: 'Mobile',
    problem: "Patients need quick, reliable guidance — in their own language — before they can reach a doctor.",
    result: 'Context-aware answers, urgent cases flagged early, and booking and consultation in one app.',
    facts: [
      ['RAG', 'chatbot on the Gemma LLM'],
      ['Voice + text', 'multilingual conversations'],
      ['In-app', 'appointment booking'],
    ],
  },
  {
    title: 'Fertile Future',
    card: 'Fertile Future',
    color: '#C9842B',
    c2: '#FFD27A',
    icon: 'leaf',
    meta: 'Smart India Hackathon 2024 · Finalist',
    big: '85%+',
    lbl: 'reported nutrient-estimation accuracy',
    sum: 'A low-cost soil nutrient tester that uses visible-light spectroscopy instead of expensive lab equipment — built for farmers.',
    pts: [
      'Three-wavelength LED measurement approach',
      'Estimates N, P, K, pH and calcium levels',
      'Selected as a finalist among 500+ teams at SIH 2024',
    ],
    tags: ['IoT', 'Spectroscopy', 'Embedded', 'Arduino'],
    cats: ['IoT'],
    role: 'Hardware and software',
    year: 'SIH 2024',
    problem: 'Soil nutrient testing usually needs lab equipment, which is slow and costly for small farmers.',
    result: 'Reported accuracy above 85%, and a finalist spot at Smart India Hackathon 2024 among 500+ teams.',
    facts: [
      ['85%+', 'reported accuracy'],
      ['5', 'N, P, K, pH and calcium'],
      ['500+', 'teams at SIH 2024'],
    ],
  },
  {
    title: 'Aquaponics IoT',
    card: 'Aquaponics IoT',
    color: '#2E7D6B',
    c2: '#5FD3E0',
    icon: 'fish',
    meta: 'Patent application · Project Expo 1st Runner-Up',
    big: 'Patent',
    lbl: 'application no. 20241083944',
    sum: 'A solar-powered IoT system that monitors an aquaponics farm and uses machine learning to automate it.',
    pts: [
      'Solar-powered monitoring with IoT sensors',
      'Machine-learning-driven automation',
      '1st Runner-Up at the Project Expo',
    ],
    tags: ['IoT', 'Machine learning', 'Solar', 'Sensors'],
    cats: ['IoT', 'AI'],
    role: 'IoT and ML developer',
    year: 'Patent',
    problem: 'Aquaponics farms need constant monitoring of water and plants, often far from reliable power.',
    result: 'A patent application (no. 20241083944) and 1st Runner-Up at the Project Expo.',
    facts: [
      ['Solar', 'powered monitoring'],
      ['ML', 'driven automation'],
      ['1st RU', 'Project Expo'],
    ],
  },
  {
    title: 'Smart Hospital',
    card: 'Smart Hospital',
    color: '#7A3F8F',
    c2: '#C79BFF',
    icon: 'hospital',
    meta: 'Patent application · Solveathon 2023 Winner',
    big: 'Winner',
    lbl: 'Solveathon 2023',
    sum: 'An Intelligent Hospitalization System designed to cut the time it takes for nurses to respond to patients.',
    pts: [
      'Built to reduce nurse response delays',
      'Won Solveathon 2023',
      'Top 60 of 2,500+ entries at the Circuit Digest Challenge 2024',
      'Patent application no. 202441084048',
    ],
    tags: ['IoT', 'Healthcare', 'Embedded', 'Alerts'],
    cats: ['IoT', 'Healthcare'],
    role: 'IoT developer',
    year: 'Patent',
    problem: 'Slow nurse response puts hospital patients at risk.',
    result:
      'Won Solveathon 2023, ranked Top 60 of 2,500+ at Circuit Digest 2024, and filed a patent application (no. 202441084048).',
    facts: [
      ['Winner', 'Solveathon 2023'],
      ['Top 60', 'of 2,500+ entries'],
      ['Patent', 'application filed'],
    ],
  },
]

export const STORY_CATS = ['All', 'AI', 'Computer vision', 'IoT', 'Healthcare', 'SaaS'] as const

export function storyMesh(i: number) {
  const p = storyProjects[i]
  return `radial-gradient(120% 95% at 0% 0%, ${p.color} 0%, transparent 62%), radial-gradient(90% 90% at 100% 100%, ${p.c2}aa 0%, transparent 58%), radial-gradient(60% 60% at 85% 5%, ${p.color}cc 0%, transparent 60%), #15110E`
}
