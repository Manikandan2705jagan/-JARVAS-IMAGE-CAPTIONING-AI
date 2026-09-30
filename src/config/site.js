/**
 * Static, presentational content for the landing page.
 * Keeping copy in one place makes the JSX components purely structural.
 */

import {
  Aperture,
  Boxes,
  Brain,
  Braces,
  ChartNoAxesColumn,
  Clock,
  Cpu,
  Database,
  Feather,
  Gauge,
  ScanEye,
  Server,
  ShieldCheck,
  Sparkles,
  Type,
  Workflow,
  Zap,
} from 'lucide-react'

import { ACCEPTED_LABEL, APP_VERSION, LINKS, MAX_FILE_SIZE_MB } from './env.js'

export const PROJECT = {
  name: 'Jarvas Image Captioning AI',
  /** Condensed wordmark for the navbar, where horizontal space is tight. */
  shortName: 'Jarvas AI',
  tagline: 'Transforming visual information into meaningful language with AI.',
  author: 'Manikandan J.',
  year: 2026,
  version: APP_VERSION,
  repoUrl: LINKS.github,
  linkedinUrl: LINKS.linkedin,
}

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'caption', label: 'Image Captioning' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'technology', label: 'Technology' },
  { id: 'about', label: 'About' },
]

export const HERO_BADGE = 'AI • Computer Vision • NLP'
export const HERO_TITLE_LINES = ['Turn Images Into', 'Intelligent Stories']
export const HERO_SUBTITLE =
  'Jarvas Image Captioning AI combines computer vision and natural language processing to automatically understand images and generate meaningful, human-like captions.'

export const HOW_IT_WORKS_STEPS = [
  {
    id: 'upload',
    number: '01',
    title: 'Upload',
    icon: Aperture,
    description: 'Upload an image through the modern drag-and-drop interface.',
  },
  {
    id: 'visual',
    number: '02',
    title: 'Visual Understanding',
    icon: ScanEye,
    description:
      'A pretrained computer vision model extracts meaningful visual features.',
  },
  {
    id: 'language',
    number: '03',
    title: 'Language Generation',
    icon: Braces,
    description:
      'An NLP / deep learning model converts visual features into natural language.',
  },
  {
    id: 'caption',
    number: '04',
    title: 'Caption',
    icon: Type,
    description: 'The system generates a meaningful description of the image.',
  },
]

export const PIPELINE_STAGES = [
  'Image',
  'ResNet / Vision Model',
  'Feature Extraction',
  'Transformer / LSTM',
  'Natural Language',
  'Generated Caption',
]

export const ARCHITECTURE_STAGES = [
  { id: 'upload', label: 'User Upload', icon: Aperture, kind: 'io' },
  { id: 'preprocess', label: 'Image Preprocessing', icon: Boxes, kind: 'process' },
  { id: 'resnet', label: 'Pretrained ResNet', icon: Cpu, kind: 'model' },
  { id: 'features', label: 'Feature Extraction', icon: ScanEye, kind: 'process' },
  { id: 'embedding', label: 'Feature Embedding', icon: Database, kind: 'process' },
  { id: 'decoder', label: 'Transformer / LSTM', icon: Brain, kind: 'model' },
  { id: 'tokens', label: 'Token Prediction', icon: Feather, kind: 'process' },
  { id: 'postprocess', label: 'Caption Post Processing', icon: Workflow, kind: 'process' },
  { id: 'result', label: 'Final Caption', icon: Sparkles, kind: 'output' },
]

export const TECHNOLOGY_STACK = [
  {
    id: 'python',
    name: 'Python',
    role: 'Core AI development',
    icon: Braces,
    accent: 'from-sky-500/20 to-blue-500/5',
  },
  {
    id: 'pytorch',
    name: 'PyTorch',
    role: 'Deep learning framework',
    icon: Cpu,
    accent: 'from-orange-500/20 to-rose-500/5',
  },
  {
    id: 'resnet',
    name: 'ResNet',
    role: 'Visual feature extraction',
    icon: ScanEye,
    accent: 'from-emerald-500/20 to-teal-500/5',
  },
  {
    id: 'transformer',
    name: 'Transformer',
    role: 'Natural language generation',
    icon: Brain,
    accent: 'from-violet-500/20 to-fuchsia-500/5',
  },
  {
    id: 'nlp',
    name: 'NLP',
    role: 'Language understanding',
    icon: Type,
    accent: 'from-cyan-500/20 to-sky-500/5',
  },
  {
    id: 'datasets',
    name: 'Flickr8k / Flickr30k',
    role: 'Image-caption training datasets',
    icon: Database,
    accent: 'from-indigo-500/20 to-blue-500/5',
  },
  {
    id: 'bleu',
    name: 'BLEU Score',
    role: 'Caption evaluation',
    icon: ChartNoAxesColumn,
    accent: 'from-amber-500/20 to-orange-500/5',
  },
  {
    id: 'api',
    name: 'FastAPI',
    role: 'Model serving over REST',
    icon: Server,
    accent: 'from-lime-500/20 to-green-500/5',
  },
]

export const FEATURES = [
  {
    id: 'fast',
    icon: Zap,
    title: 'Fast Caption Generation',
    description: 'Generate captions quickly from uploaded images.',
  },
  {
    id: 'vision',
    icon: Brain,
    title: 'AI-Powered Vision',
    description: 'Uses deep learning models to understand visual content.',
  },
  {
    id: 'language',
    icon: Feather,
    title: 'Natural Language',
    description: 'Produces human-readable image descriptions.',
  },
  {
    id: 'insights',
    icon: Gauge,
    title: 'Confidence Insights',
    description: 'Display AI confidence and analysis information.',
  },
  {
    id: 'formats',
    icon: Boxes,
    title: 'Multiple Image Formats',
    description: `Support ${ACCEPTED_LABEL.split(' • ').join(', ')} and WEBP.`,
  },
  {
    id: 'privacy',
    icon: ShieldCheck,
    title: 'Privacy Focused',
    description: 'Uploaded images are processed in memory and never written to disk.',
  },
]

export const METRICS = [
  {
    id: 'bleu',
    label: 'Caption Accuracy (BLEU-4)',
    value: 94,
    suffix: '%',
    decimals: 0,
    icon: ChartNoAxesColumn,
    note: 'Illustrative demo value',
  },
  {
    id: 'latency',
    label: 'Average Processing',
    value: 1.8,
    suffix: ' sec',
    decimals: 1,
    icon: Clock,
    note: 'Illustrative demo value',
  },
  {
    id: 'formats',
    label: 'Supported Formats',
    value: 4,
    suffix: '+',
    decimals: 0,
    icon: Boxes,
    note: 'JPG • PNG • JPEG • WEBP',
  },
  {
    id: 'model',
    label: 'AI Model',
    value: null,
    display: 'Transformer',
    icon: Brain,
    note: 'Seq2seq caption decoder',
  },
]

export const DEVELOPER = {
  name: 'Manikandan J.',
  role: 'Backend Web Developer | AI/ML Enthusiast',
  bio: 'Designs reliable backend services and enjoys shipping machine-learning pipelines behind clean, well-documented REST APIs.',
  skills: [
    'Python',
    'Node.js',
    'Express.js',
    'REST APIs',
    'SQL',
    'MongoDB',
    'Redis',
    'Docker',
    'Git/GitHub',
    'AI/ML',
  ],
  stats: [
    { id: 'focus', label: 'Focus', value: 'AI / ML Systems' },
    { id: 'stack', label: 'Stack', value: 'Python · Node.js' },
    { id: 'domain', label: 'Specialisation', value: 'Computer Vision + NLP' },
  ],
}

export const PROJECT_FACTS = [
  { label: 'Project Type', value: 'AI / Machine Learning / Computer Vision / NLP' },
  { label: 'Developer', value: DEVELOPER.name },
  { label: 'Project Focus', value: 'Image Captioning' },
  { label: 'Interface', value: 'React · Vite · Tailwind CSS' },
  { label: 'Serving Layer', value: 'Python FastAPI (REST)' },
  { label: 'Max Upload', value: `${MAX_FILE_SIZE_MB} MB` },
]

export const TRUST_STRIP = [
  'React 19',
  'Vite',
  'Tailwind CSS',
  'PyTorch',
  'ResNet-50',
  'Transformer',
  'FastAPI',
  'BLEU Evaluation',
]

export const PRIVACY_POINTS = [
  'Images are processed in memory and discarded after the caption is returned.',
  'Nothing is written to a database or object storage by the frontend.',
  'No third-party analytics or tracking scripts are loaded.',
]
