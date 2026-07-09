export type FilterKey = 'All' | 'Frontend' | 'Backend' | 'AI/ML' | 'Mobile' | 'DevOps' | 'Full Stack';

export type Internship = {
  id: number;
  role: string;
  company: string;
  location: string;
  tag: string;
  category: Exclude<FilterKey, 'All'>;
  stack: string;
  duration: string;
  salary: string;
  description: string;
  tags: string[];
  match: string;
};

export const ALL_INTERNSHIPS: Internship[] = [
  {
    id: 1,
    role: 'Frontend Engineer Intern',
    company: 'Veritas Labs',
    location: 'Remote',
    tag: 'Remote',
    category: 'Frontend',
    stack: 'React · Next.js · TypeScript',
    duration: '10 weeks',
    salary: '$24/hr',
    description:
      'Work on production-grade UI components powering a B2B SaaS platform used by 10,000+ engineers. Own features end to end from design review to deployment.',
    tags: ['React', 'TypeScript', 'Remote'],
    match: '97% match — you have strong React and frontend experience for this role.',
  },
  {
    id: 2,
    role: 'Backend Engineer Intern',
    company: 'DataStream Inc',
    location: 'San Francisco, CA',
    tag: 'On-site',
    category: 'Backend',
    stack: 'Go · PostgreSQL · gRPC',
    duration: '12 weeks',
    salary: '$28/hr',
    description:
      'Build high-throughput data pipelines that process millions of events per day. Strong systems design fundamentals required; mentorship from senior engineers included.',
    tags: ['Go', 'PostgreSQL', 'On-site'],
    match: '91% match — your backend experience makes you a great fit for this startup.',
  },
  {
    id: 3,
    role: 'ML Research Intern',
    company: 'Synthos AI',
    location: 'New York, NY',
    tag: 'Hybrid',
    category: 'AI/ML',
    stack: 'Python · PyTorch · CUDA',
    duration: '8 weeks',
    salary: '$27/hr',
    description:
      'Join our applied research team working on large language model fine-tuning and efficient inference. Publications encouraged; compute budget provided.',
    tags: ['Python', 'PyTorch', 'Hybrid'],
    match: '88% match — your ML projects align well with the research team’s focus.',
  },
  {
    id: 4,
    role: 'Mobile Developer Intern',
    company: 'Latchkey',
    location: 'Austin, TX',
    tag: 'On-site',
    category: 'Mobile',
    stack: 'React Native · Swift · Expo',
    duration: '10 weeks',
    salary: '$23/hr',
    description:
      'Ship features to our consumer app with 500K+ monthly active users. Work directly with the product and design teams in a fast-paced startup environment.',
    tags: ['React Native', 'Swift', 'On-site'],
    match: '82% match — your app work makes you a strong candidate for this mobile role.',
  },
  {
    id: 5,
    role: 'DevOps / Platform Intern',
    company: 'CloudBridge',
    location: 'Remote',
    tag: 'Remote',
    category: 'DevOps',
    stack: 'Kubernetes · Terraform · AWS',
    duration: '12 weeks',
    salary: '$26/hr',
    description:
      'Help automate our CI/CD infrastructure and improve developer tooling across 12 product teams. Prior Linux experience required; cloud certs a bonus.',
    tags: ['Kubernetes', 'Terraform', 'Remote'],
    match: '86% match — strong DevOps fundamentals are a perfect fit here.',
  },
  {
    id: 6,
    role: 'Full Stack Engineer Intern',
    company: 'FinEdge',
    location: 'London, UK',
    tag: 'Hybrid',
    category: 'Full Stack',
    stack: 'Node.js · Vue · MongoDB',
    duration: '10 weeks',
    salary: '$25/hr',
    description:
      'Build internal tools and customer-facing features for a fintech platform serving retail investors across Europe. Remote-friendly for 3 days a week.',
    tags: ['Node.js', 'Vue', 'Hybrid'],
    match: '90% match — your full-stack experience is well-suited for this role.',
  },
];

export const TAG_COLORS: Record<string, string> = {
  Remote: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-200',
  'On-site': 'border-white/10 bg-white/10 text-white/70',
  Hybrid: 'border-violet-400/20 bg-violet-500/10 text-violet-200',
};

export type ApplicationForm = { name: string; email: string; note: string };

export type StoredApplication = {
  role: string;
  company: string;
  appliedAt: string;
  name: string;
  email: string;
  note: string;
};

export type PipelineStage = 'Applied' | 'In Review' | 'Interview Scheduled' | 'Offer Received';

export type Application = {
  id: number;
  role: string;
  company: string;
  stage: PipelineStage;
  date: string;
};

export const STORAGE_KEY = 'devstart_applications';

export function loadAppliedMap(): Record<number, boolean> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored) as Record<number, StoredApplication>;
    return Object.keys(parsed).reduce<Record<number, boolean>>((map, key) => {
      map[Number(key)] = true;
      return map;
    }, {});
  } catch {
    return {};
  }
}

export function loadApplications(): Application[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as Record<number, StoredApplication>;
    return Object.entries(parsed)
      .map(([id, app]) => ({
        id: Number(id),
        role: app.role,
        company: app.company,
        stage: 'Applied',
        date: new Date(app.appliedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      }))
      .sort((a, b) => b.id - a.id);
  } catch {
    return [];
  }
}

export function saveApplication(internship: Internship, form: ApplicationForm) {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as Record<number, StoredApplication>) : {};
    parsed[internship.id] = {
      role: internship.role,
      company: internship.company,
      appliedAt: new Date().toISOString(),
      name: form.name,
      email: form.email,
      note: form.note,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore localStorage errors
  }
}

export const RECOMMENDED_INTERNSHIPS = ALL_INTERNSHIPS.slice(0, 4);
