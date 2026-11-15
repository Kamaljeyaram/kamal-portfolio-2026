export type Project = {
  slug: string
  name: string
  color: string
  blurb: string
  year: string
  role: string
  stack: string[]
  summary: string
  challenge: string
  approach: string
  outcome: string
  highlights: string[]
  metrics: { value: string; label: string }[]
  links: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    slug: 'resume-analyzer',
    name: 'Resume Analyzer',
    color: '#FF5B1F',
    blurb: 'AI parsing & insights',
    year: '2024',
    role: 'Full-stack · AI',
    stack: ['Python', 'NLP', 'React', 'FastAPI'],
    summary:
      'An intelligent resume analysis tool that extracts structure, skills, and signals from unstructured PDFs and turns them into actionable hiring insights.',
    challenge:
      'Resumes arrive in messy formats. Manual screening is slow, inconsistent, and easy to bias — especially when volume spikes.',
    approach:
      'Built a parsing pipeline that normalizes document layout, extracts entities, and scores fit against role criteria with explainable highlights for recruiters.',
    outcome:
      'Cut first-pass screening time and made shortlist decisions easier to audit with clear skill and experience breakdowns.',
    highlights: [
      'PDF + text ingestion with layout-aware parsing',
      'Skill / experience entity extraction',
      'Explainable match scores for reviewers',
      'Clean dashboard for batch review',
    ],
    metrics: [
      { value: '12s', label: 'Average parse' },
      { value: '94%', label: 'Field accuracy' },
      { value: '6×', label: 'Faster first pass' },
      { value: '40+', label: 'Resumes per batch' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Kamaljeyaram' }],
  },
  {
    slug: 'pocketz',
    name: 'PocketZ',
    color: '#6947FF',
    blurb: 'Product experiment',
    year: '2024',
    role: 'Product · Full-stack',
    stack: ['React', 'TypeScript', 'Node'],
    summary:
      'A compact product experiment focused on fast iteration — shipping a usable interface, validating flows, and refining based on real usage friction.',
    challenge:
      'Early product ideas die when the first build is too heavy. PocketZ needed speed without looking unfinished.',
    approach:
      'Scoped a thin vertical slice, shipped a polished interaction surface, and instrumented the critical path so improvements were based on behavior, not guesses.',
    outcome:
      'A working prototype that proved the core loop and clarified what to build next.',
    highlights: [
      'Rapid prototype-to-polish cycle',
      'Focused UX for one primary job',
      'Lightweight API + state model',
      'Clear next-step product learnings',
    ],
    metrics: [
      { value: '11d', label: 'Idea to prototype' },
      { value: '1', label: 'Core user loop' },
      { value: '3', label: 'Design passes' },
      { value: '0', label: 'Unused screens' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Kamaljeyaram' }],
  },
  {
    slug: 'airline-dss',
    name: 'Airline DSS',
    color: '#2878B8',
    blurb: 'Decision support',
    year: '2023',
    role: 'Data · Systems',
    stack: ['Python', 'Decision models', 'Dashboards'],
    summary:
      'A decision-support system that helps operators compare routing and resource options with clearer trade-offs under operational constraints.',
    challenge:
      'Airline operations involve competing objectives — cost, delay, and capacity — that are hard to compare in a single glance.',
    approach:
      'Modeled key constraints, surfaced ranked options, and presented the reasoning path so humans stay in control of the final call.',
    outcome:
      'Faster comparative decisions with transparent scoring instead of opaque recommendations.',
    highlights: [
      'Constraint-aware option ranking',
      'Readable trade-off presentation',
      'Operator-first UI patterns',
      'Extensible scoring hooks',
    ],
    metrics: [
      { value: '8', label: 'Constraints modeled' },
      { value: '3', label: 'Objectives scored' },
      { value: '1:1', label: 'Human final call' },
      { value: '0', label: 'Black-box picks' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Kamaljeyaram' }],
  },
  {
    slug: 'iot-agriculture',
    name: 'IoT Agriculture',
    color: '#5B9B63',
    blurb: 'Precision farming',
    year: '2024',
    role: 'IoT Engineer',
    stack: ['Sensors', 'Mesh networking', 'Cloud', 'Python'],
    summary:
      'Precision farming system using NPK and environmental sensors on a mesh network, with sleep sync for power efficiency and cloud monitoring for live field insight.',
    challenge:
      'Remote farms need reliable sensing without burning battery or losing packets across wide plots.',
    approach:
      'Implemented mesh routing to a hub, synchronized sleep cycles, and streamed aggregated readings to the cloud for monitoring and analysis.',
    outcome:
      'Stable field telemetry with better power behavior and a clear path from soil data to decisions.',
    highlights: [
      'NPK + environment sensor suite',
      'Mesh network to central hub',
      'Sleep synchronization for power savings',
      'Cloud dashboard for live monitoring',
    ],
    metrics: [
      { value: 'NPK', label: 'Soil + climate' },
      { value: 'Mesh', label: 'Plot-wide network' },
      { value: '−40%', label: 'Idle power draw' },
      { value: '24/7', label: 'Cloud monitoring' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/Kamaljeyaram' },
      { label: 'LinkedIn context', href: 'https://linkedin.com/in/kamal-jeyaram-109785257' },
    ],
  },
  {
    slug: 'emosense',
    name: 'EmoSense',
    color: '#F04D9B',
    blurb: 'Emotion AI',
    year: '2023',
    role: 'AI · CV',
    stack: ['Python', 'DeepFace', 'OpenCV'],
    summary:
      'Computer-vision experiment for facial emotion sensing — exploring how affective signals can feed adaptive interfaces and research workflows.',
    challenge:
      'Emotion labels are noisy and context-dependent; the system had to stay useful without overclaiming certainty.',
    approach:
      'Combined face detection with expression models and presented confidence-aware outputs for experimentation and demos.',
    outcome:
      'A working CV pipeline that made emotion signals inspectable and easy to plug into other apps.',
    highlights: [
      'Face detection + expression inference',
      'Confidence-aware readout',
      'Demo-ready visualization layer',
      'Modular pipeline for reuse',
    ],
    metrics: [
      { value: '7', label: 'Expression classes' },
      { value: 'Live', label: 'Camera demo' },
      { value: '%', label: 'Confidence shown' },
      { value: 'CV', label: 'Modular pipeline' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Kamaljeyaram/emosense_deepface' }],
  },
  {
    slug: 'eduguide',
    name: 'EduGuide',
    color: '#C4A800',
    blurb: 'Learning systems',
    year: '2024',
    role: 'Full-stack',
    stack: ['React', 'Python', 'APIs'],
    summary:
      'A learning guidance surface that helps students navigate topics, resources, and next steps with clearer structure.',
    challenge:
      'Learners get lost between content dumps and vague recommendations.',
    approach:
      'Organized guidance into progressive paths and kept the interface editorial so progress feels intentional.',
    outcome:
      'A clearer learning flow that prioritizes next actions over endless browsing.',
    highlights: [
      'Structured learning paths',
      'Resource grouping by intent',
      'Simple progress cues',
      'Extensible content model',
    ],
    metrics: [
      { value: '1', label: 'Next action' },
      { value: 'Paths', label: 'Not content dumps' },
      { value: 'Clear', label: 'Progress cues' },
      { value: 'Open', label: 'Content model' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Kamaljeyaram/eduguide' }],
  },
  {
    slug: 'deepblue',
    name: 'DeepBlue',
    color: '#43D9E8',
    blurb: 'Exploration build',
    year: '2023',
    role: 'R&D',
    stack: ['Python', 'Systems', 'Experiments'],
    summary:
      'An exploratory engineering build used to pressure-test ideas at the intersection of data, interaction, and system design.',
    challenge:
      'Some ideas need a sandbox before they deserve a product brief.',
    approach:
      'Kept the architecture modular, documented findings, and promoted only the pieces that survived real use.',
    outcome:
      'A reusable base of experiments that fed later product and research work.',
    highlights: [
      'Sandbox for rapid experiments',
      'Documented technical findings',
      'Reusable modules',
      'Bridge into later shipped work',
    ],
    metrics: [
      { value: 'Lab', label: 'Experiment sandbox' },
      { value: 'Docs', label: 'Written findings' },
      { value: 'Reuse', label: 'Modules kept' },
      { value: 'Ship', label: 'Fed later work' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Kamaljeyaram/deepblue' }],
  },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}
