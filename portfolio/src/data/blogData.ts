export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Architecture' | 'AI & ML' | 'Quality Assurance' | 'Engineering Process';
  date: string;
  readTime: string;
  featured: boolean;
  coverGradient: string;
  tags: string[];
  tableOfContents: { id: string; title: string }[];
  content: {
    sectionId: string;
    heading: string;
    body: string[];
    codeSnippet?: {
      language: string;
      code: string;
    };
    callout?: {
      type: 'tip' | 'note' | 'important';
      text: string;
    };
  }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'scalable-fullstack-architecture-nextjs-laravel',
    title: 'Designing Scalable Full-Stack Applications with Next.js & Laravel',
    excerpt: 'How combining Next.js App Router with Laravel 11 creates a high-velocity, type-safe stack for enterprise web apps, transactional ledgers, and decoupled SPAs.',
    category: 'Architecture',
    date: 'October 2026',
    readTime: '6 min read',
    featured: true,
    coverGradient: 'from-cyan-950/60 via-blue-950/40 to-slate-900',
    tags: ['Next.js 15', 'Laravel 11', 'Architecture', 'TypeScript', 'ACID Ledgers'],
    tableOfContents: [
      { id: 'the-problem', title: 'Decoupled Frontends vs. Heavy Monoliths' },
      { id: 'contract-design', title: 'Designing Strict API Contracts' },
      { id: 'state-ledgers', title: 'Managing Transactional Integrity' },
      { id: 'lessons-gallapasal', title: 'Production Takeaways from Gallapasal' }
    ],
    content: [
      {
        sectionId: 'the-problem',
        heading: 'Decoupled Frontends vs. Heavy Monoliths',
        body: [
          'In modern web engineering, developers often face a dilemma: choose a monolithic framework like classic Blade/Rails for simplicity, or build a distributed microservice setup that introduces significant operational overhead.',
          'When architecting Gallapasal, an enterprise grain point-of-sale and ledger management platform, the requirement was crystal clear: client interactions (real-time weight calculation, dynamic invoice itemization) needed zero-latency responsiveness, while backend financial records required strict transactional consistency.'
        ],
        callout: {
          type: 'tip',
          text: 'Pairing React 19 and Next.js/Vite with Laravel 11 via REST endpoints yields the best of both worlds: reactive client state paired with mature PHP ORM ledgers.'
        }
      },
      {
        sectionId: 'contract-design',
        heading: 'Designing Strict API Contracts',
        body: [
          'A common failure mode in full-stack teams is API schema drift. Frontend developers expect camelCase and typed objects, while backend controllers return snake_case relational dictionaries.',
          'By defining comprehensive TypeScript interfaces that mirror Laravel Form Requests and API Resources, we eliminate run-time boundary errors and gain end-to-end autocompletion.'
        ],
        codeSnippet: {
          language: 'typescript',
          code: `// Shared API Type Contract
export interface TransactionPayload {
  merchantId: string;
  grainTypeId: number;
  weightGrossKg: number;
  tareWeightKg: number;
  unitPricePerKg: number;
  nepaliDateBs: string; // YYYY-MM-DD (Bikram Sambat)
  paymentMode: 'cash' | 'credit' | 'bank_transfer';
}`
        }
      },
      {
        sectionId: 'state-ledgers',
        heading: 'Managing Transactional Integrity',
        body: [
          'Financial and inventory systems cannot afford phantom reads or incomplete commits. Using Laravel database transactions (\`DB::transaction\`) ensures that invoice generation, customer ledger balancing, and grain inventory updates execute atomically.',
          'If any step failsâ€”such as a failure in PDF voucher rendering or negative stock validationâ€”the entire operation rolls back gracefully.'
        ]
      },
      {
        sectionId: 'lessons-gallapasal',
        heading: 'Production Takeaways from Gallapasal',
        body: [
          'Building Gallapasal demonstrated that decoupling the presentation layer from business logic makes maintenance remarkably straightforward. The application boots instantaneously, serves assets via optimized Vite builds, and isolates database operations cleanly behind verified REST routes.'
        ]
      }
    ]
  },
  {
    slug: 'practical-aiml-web-applications',
    title: 'Practical Applications of AI and Machine Learning in Web Products',
    excerpt: 'Bridging the divide between Python machine learning notebooks and production web applications using real-time computer vision and multimodal pipelines.',
    category: 'AI & ML',
    date: 'September 2026',
    readTime: '7 min read',
    featured: false,
    coverGradient: 'from-purple-950/60 via-indigo-950/40 to-slate-900',
    tags: ['Machine Learning', 'Computer Vision', 'OpenCV', 'TensorFlow', 'Python'],
    tableOfContents: [
      { id: 'notebook-to-web', title: 'From Research Notebook to User Interface' },
      { id: 'vision-pipelines', title: 'Real-Time Edge Computer Vision' },
      { id: 'cnn-rnn-architectures', title: 'Combining CNN and RNN Models' },
      { id: 'future-perspectives', title: 'The Practical AI Horizon' }
    ],
    content: [
      {
        sectionId: 'notebook-to-web',
        heading: 'From Research Notebook to User Interface',
        body: [
          'Much of modern AI education stops at Jupyter Notebooks: training on static CSVs, plotting Matplotlib graphs, and evaluating loss curves. However, true engineering value is unlocked when models are deployed into production systems that normal users can operate.',
          'In my research projectsâ€”including real-time facial verification and deep-learning image captioningâ€”the primary challenge was reducing inference latency to make web interactions smooth.'
        ]
      },
      {
        sectionId: 'vision-pipelines',
        heading: 'Real-Time Edge Computer Vision',
        body: [
          'Webcam face detection requires processing at least 24 frames per second without locking the browser UI thread or overloading the server. Utilizing OpenCV with lightweight Haar cascade stages followed by deep embedding comparisons ensures responsive verification.'
        ],
        codeSnippet: {
          language: 'python',
          code: `# Efficient Inference Pipeline
import cv2
import numpy as np

def process_video_frame(frame, cascade_detector, embedding_model):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = cascade_detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    for (x, y, w, h) in faces:
        roi = frame[y:y+h, x:x+w]
        preprocessed = cv2.resize(roi, (160, 160)) / 255.0
        embedding = embedding_model.predict(np.expand_dims(preprocessed, axis=0))
        yield (x, y, w, h, embedding)`
        }
      },
      {
        sectionId: 'cnn-rnn-architectures',
        heading: 'Combining CNN and RNN Models',
        body: [
          'In our Image Captioning pipeline, we coupled a pre-trained ResNet-50 feature extractor with an LSTM decoder. The CNN encodes rich visual features into a dense vector, and the LSTM sequences words into human-readable sentences step-by-step.'
        ]
      },
      {
        sectionId: 'future-perspectives',
        heading: 'The Practical AI Horizon',
        body: [
          'The future of web applications belongs to intelligent interfaces that anticipate user intentâ€”such as automatic OCR invoice scanning in POS systems or intelligent recommendations in travel discovery platforms.'
        ]
      }
    ]
  },
  {
    slug: 'reliable-software-testing-qa',
    title: 'Building Reliable Software Through Testing and Quality Assurance',
    excerpt: 'Defect prevention strategies, automated regression pipelines, and test discipline that transform fragile prototypes into resilient enterprise platforms.',
    category: 'Quality Assurance',
    date: 'August 2026',
    readTime: '5 min read',
    featured: false,
    coverGradient: 'from-emerald-950/60 via-teal-950/40 to-slate-900',
    tags: ['Quality Assurance', 'Testing', 'PHPUnit', 'Defect Prevention', 'CI/CD'],
    tableOfContents: [
      { id: 'why-qa-matters', title: 'Why Quality Assurance is Architecture' },
      { id: 'test-pyramid', title: 'Constructing a Practical Test Pyramid' },
      { id: 'edge-cases', title: 'Hunting Boundary Conditions' },
      { id: 'summary', title: 'The Quality Mindset' }
    ],
    content: [
      {
        sectionId: 'why-qa-matters',
        heading: 'Why Quality Assurance is Architecture',
        body: [
          'Testing is frequently treated as an afterthoughtâ€”something performed manually right before a Friday deploy. But in production systems where money, stock, or user data are involved, quality assurance is an architectural cornerstone.',
          'A defect caught during the specification or unit phase costs orders of magnitude less to fix than an error discovered by an angry customer.'
        ]
      },
      {
        sectionId: 'test-pyramid',
        heading: 'Constructing a Practical Test Pyramid',
        body: [
          'A balanced test portfolio consists of fast, isolated unit tests for core domain math (like tax calculations and stock debits), combined with targeted API integration tests verifying endpoint contracts and authentication barriers.'
        ],
        codeSnippet: {
          language: 'php',
          code: `// Laravel Unit Test Example
public function test_purchase_slip_calculates_correct_net_amount(): void
{
    $grain = Grain::factory()->create(['unit_price' => 50.00]);
    $slip = PurchaseSlip::make([
        'gross_weight' => 100.0,
        'tare_weight' => 2.0,
        'rate_per_kg' => 50.00,
    ]);

    $this->assertEquals(98.0, $slip->net_weight);
    $this->assertEquals(4900.00, $slip->total_amount);
}`
        }
      },
      {
        sectionId: 'edge-cases',
        heading: 'Hunting Boundary Conditions',
        body: [
          'Special attention must be paid to boundary conditions: leap years in dual calendar systems (Gregorian vs. Bikram Sambat), zero-quantity stock orders, floating-point rounding errors in financial balances, and international character encoding.'
        ]
      },
      {
        sectionId: 'summary',
        heading: 'The Quality Mindset',
        body: [
          'High-performing software engineers do not write code and hope it works. They write code, prove its validity through automated assertions, and deploy with confidence.'
        ]
      }
    ]
  },
  {
    slug: 'lessons-learned-building-real-world-products-nepal',
    title: 'Lessons Learned from Building and Maintaining Real-World Products in Nepal',
    excerpt: 'Navigating localized challenges: dual calendar synchronizations (AD/BS), variable cellular connectivity, and digital adoption in local commercial sectors.',
    category: 'Engineering Process',
    date: 'July 2026',
    readTime: '6 min read',
    featured: false,
    coverGradient: 'from-amber-950/60 via-slate-900 to-slate-900',
    tags: ['Product Engineering', 'Nepal Tech', 'Bikram Sambat', 'UX Design', 'Localization'],
    tableOfContents: [
      { id: 'local-realities', title: 'Localized Engineering Realities' },
      { id: 'dual-calendars', title: 'The Bikram Sambat Date Challenge' },
      { id: 'mobile-first-performance', title: 'Performance on Variable Networks' },
      { id: 'closing-thoughts', title: 'Building for Authentic Impact' }
    ],
    content: [
      {
        sectionId: 'local-realities',
        heading: 'Localized Engineering Realities',
        body: [
          'Building software for international audiences teaches global design patterns. But building software for domestic merchants and remote travelers in Nepal provides unique, humbling engineering lessons that generic templates completely overlook.',
          'When designing Digital Nomads in Nepal and Gallapasal, we had to adapt our architecture to real-world friction: spotty cellular reception in mountain valleys, traditional merchant ledger practices, and localized calendar standards.'
        ]
      },
      {
        sectionId: 'dual-calendars',
        heading: 'The Bikram Sambat Date Challenge',
        body: [
          'In Nepal, commercial and legal transactions run on the Bikram Sambat (BS) solar calendar, which has 56.7 years of offset from the Gregorian calendar and varying month day counts (29 to 32 days).',
          'Standard database timestamps use ISO Gregorian dates. To keep records authentic for local tax authorities while maintaining standardized database sorting, we built an automated bidirectional translation layer that maps every transaction across both calendars.'
        ]
      },
      {
        sectionId: 'mobile-first-performance',
        heading: 'Performance on Variable Networks',
        body: [
          'A website that takes 4 seconds to load over 3G cellular in Pokhara or Mustang will simply be abandoned. Heavy JavaScript libraries and uncompressed assets are unacceptable. We prioritized lightweight SVG icons, responsive picture tags, and aggressive client-side caching.'
        ]
      },
      {
        sectionId: 'closing-thoughts',
        heading: 'Building for Authentic Impact',
        body: [
          'Great software is not measured by framework complexity or buzzwords. It is measured by whether it solves a tangible problem for real people and businesses every single day.'
        ]
      }
    ]
  }
];
