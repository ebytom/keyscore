import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Chrome,
  FileText,
  Target,
  Check,
  Star,
  Download,
  Puzzle,
  Zap,
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const features = [
  {
    icon: Chrome,
    title: 'Works Everywhere',
    description: 'Supports LinkedIn, Indeed, Glassdoor, Greenhouse, Lever, Workday, and 50+ job sites.',
  },
  {
    icon: Search,
    title: 'Auto-Detect JD',
    description: 'Automatically extracts job descriptions when you open a job posting. No copy-paste needed.',
  },
  {
    icon: Target,
    title: 'ATS Score',
    description: 'Get an instant match score showing how well your resume fits the job requirements.',
  },
  {
    icon: CheckCircle2,
    title: 'Matched Keywords',
    description: 'See which skills and keywords from the JD are already in your resume.',
  },
  {
    icon: XCircle,
    title: 'Missing Keywords',
    description: 'Identify exactly what keywords to add to your resume to improve your match.',
  },
  {
    icon: FileText,
    title: 'Multiple Resumes',
    description: 'Upload different versions of your resume and compare which one matches best.',
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'Upload Your Resume',
    description: 'Upload your resume (PDF or DOCX) to your dashboard. You can upload multiple versions.',
  },
  {
    step: '2',
    title: 'Browse Jobs',
    description: 'Go to any job posting on LinkedIn, Indeed, or other supported sites.',
  },
  {
    step: '3',
    title: 'Click the Extension',
    description: 'The extension auto-detects the JD and shows your ATS match score instantly.',
  },
  {
    step: '4',
    title: 'Optimize & Apply',
    description: 'Add missing keywords to your resume and apply with confidence.',
  },
];

const testimonials = [
  {
    name: 'Keerthana Sen',
    role: 'Software Engineer',
    image: 'https://media.licdn.com/dms/image/v2/D5603AQEbfxTBCbxiDw/profile-displayphoto-scale_400_400/B56ZewjcDWG0Ak-/0/1751013772614?e=1786579200&v=beta&t=G9GYkS23TY0RZxwGwBrnzVi2_G0TZLzAErzw2C82lA4',
    content: 'Finally, a simple tool that does one thing well. I can instantly see what keywords I\'m missing before applying.',
  },
  {
    name: 'Jefin Joy',
    role: 'Business Analyst',
    image: 'https://media.licdn.com/dms/image/v2/D5635AQHq8NmJZx7XMg/profile-framedphoto-shrink_400_400/B56ZmjVEwqJ8Ac-/0/1759381835105?e=1785870000&v=beta&t=YJj0CDZpDYEFuzT2XurozDYfgCA87U64SXtSyCfR_ZQ',
    content: 'I went from 10% callback rate to over 40% just by adding the missing keywords this extension showed me.',
  },
  {
    name: 'Hrigith K N',
    role: 'Implementation Engineer',
    image: 'https://media.licdn.com/dms/image/v2/D5635AQFaC1dVpkNlug/profile-framedphoto-shrink_400_400/B56Z7Q75fcHIAY-/0/1781621824026?e=1785870000&v=beta&t=t7H8_ROvKkvPF-TadmUCnvE1zvAtyfyOVdOow1n_RHc',
    content: 'Love that it works on any job site automatically. No more copying JDs into other tools.',
  },
];

const faqs = [
  {
    question: 'How does the ATS scoring work?',
    answer: 'We extract keywords from the job description and check which ones appear in your resume. Your score is based on the percentage of matched keywords. We look for technical skills, tools, and key requirements.',
  },
  {
    question: 'What job sites are supported?',
    answer: 'The extension works on LinkedIn, Indeed, Glassdoor, Greenhouse, Lever, Workday, Ashby, SmartRecruiters, and most company career pages. If auto-detection fails, you can select the JD text manually.',
  },
  {
    question: 'Is my resume data secure?',
    answer: 'Yes. Your resumes are stored securely and never shared. The keyword matching happens locally in your browser - job descriptions are not sent to any server.',
  },
  {
    question: 'Is it really free?',
    answer: 'Yes! The core features are completely free - upload resumes, extract JDs, and get ATS scores. No credit card required, no trial period.',
  },
  {
    question: 'How do I improve my ATS score?',
    answer: 'Look at the "Missing Keywords" section and add relevant ones to your resume. Focus on skills and tools you actually have experience with. Even small additions can significantly improve your match.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 lg:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-purple-500/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container px-4 sm:px-6">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                <Chrome className="mr-2 h-4 w-4" />
                Free Chrome Extension
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
            >
              Check Your Resume's{' '}
              <span className="text-primary">ATS Score</span> Instantly
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2"
            >
              See exactly which keywords from job descriptions match your resume —
              and which ones you're missing. Works on LinkedIn, Indeed, and 50+ job sites.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              <a href="/extension/keyscore-extension.zip" download className="w-full sm:w-auto">
                <Button size="lg" className="text-sm sm:text-base px-6 sm:px-8 w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Extension
                </Button>
              </a>
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="text-sm sm:text-base px-6 sm:px-8 w-full">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                3x more interviews
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                100% Free
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Works instantly
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 sm:mt-16 relative px-2 sm:px-0"
          >
            <div className="relative mx-auto max-w-4xl">
              {/* Extension Preview Card */}
              <div className="bg-[#0f0f23] rounded-xl border border-gray-800 shadow-2xl overflow-hidden p-3 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-800 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-md flex items-center justify-center">
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="text-white font-semibold text-xs sm:text-sm">KeyScore</span>
                  </div>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-700 rounded-full flex items-center justify-center text-[10px] sm:text-xs text-white font-semibold">
                    JD
                  </div>
                </div>

                {/* JD Section */}
                <div className="mb-3 sm:mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0 mb-2">
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Job Description</span>
                    <span className="text-[10px] sm:text-xs text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      Auto-detected (2,450 chars)
                    </span>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3 text-gray-400 text-[10px] sm:text-xs leading-relaxed">
                    We are looking for a Senior Software Engineer with experience in React, TypeScript, Node.js, and AWS. You will work on building scalable applications...
                  </div>
                </div>

                {/* Resume Card */}
                <div className="bg-gray-800/30 rounded-lg p-3 sm:p-4 border-2 border-green-500/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white text-xs sm:text-sm font-medium truncate">Senior_Developer_Resume.pdf</div>
                        <div className="text-gray-500 text-[10px] sm:text-xs">245 KB • ⭐ Primary</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <div className="text-2xl sm:text-3xl font-bold text-green-400">78%</div>
                      <div className="text-[10px] sm:text-xs text-gray-500 uppercase">Match</div>
                    </div>
                  </div>

                  {/* Keywords Preview */}
                  <div className="pt-3 border-t border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                      <span className="text-[10px] sm:text-xs text-gray-500 sm:w-16">Matched:</span>
                      <div className="flex flex-wrap gap-1">
                        {['React', 'TypeScript', 'Node.js', 'AWS'].map(kw => (
                          <span key={kw} className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] sm:text-xs">
                            <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                            {kw}
                          </span>
                        ))}
                        <span className="px-1.5 sm:px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] sm:text-xs">+5</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-[10px] sm:text-xs text-gray-500 sm:w-16">Missing:</span>
                      <div className="flex flex-wrap gap-1">
                        {['GraphQL', 'Kubernetes', 'CI/CD'].map(kw => (
                          <span key={kw} className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] sm:text-xs">
                            <XCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Best Match Badge */}
                <div className="mt-3 inline-flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-1 rounded text-[10px] sm:text-xs font-semibold">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  Best Match
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold sm:text-4xl">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Get your ATS score in seconds. No complicated setup required.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <Card className="h-full text-center relative">
                  <CardHeader className="pb-2 sm:pb-4">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg sm:text-xl font-bold mx-auto mb-3 sm:mb-4">
                      {item.step}
                    </div>
                    <CardTitle className="text-base sm:text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs sm:text-sm">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold sm:text-4xl">
              Simple Yet <span className="text-primary">Powerful</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to optimize your resume for ATS systems. Nothing you don't.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-hover">
                  <CardHeader className="pb-2 sm:pb-4">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 mb-3 sm:mb-4">
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm sm:text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Extension Installation Section */}
      <section id="extension" className="py-12 sm:py-20 bg-muted/30">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold sm:text-4xl">
              Install in <span className="text-primary">30 Seconds</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Get up and running with our Chrome extension in three easy steps.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: 'Download & Unzip',
                description: 'Click the download button and extract the ZIP file to a folder on your computer.',
                icon: Download,
              },
              {
                step: '2',
                title: 'Open Extensions',
                description: 'Go to chrome://extensions and enable "Developer mode" in the top right corner.',
                icon: Chrome,
              },
              {
                step: '3',
                title: 'Load Extension',
                description: 'Click "Load unpacked" and select the extracted folder. You\'re ready!',
                icon: Puzzle,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center">
                  <CardHeader className="pb-2 sm:pb-4">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg sm:text-xl font-bold mx-auto mb-3 sm:mb-4">
                      {item.step}
                    </div>
                    <CardTitle className="flex items-center justify-center gap-2 text-base sm:text-lg">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm sm:text-base">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a href="/extension/keyscore-extension.zip" download>
              <Button size="lg" className="text-base px-8">
                <Download className="mr-2 h-4 w-4" />
                Download Extension
              </Button>
            </a>
            <p className="text-sm text-muted-foreground mt-4">
              Works with Chrome, Edge, Brave, and other Chromium browsers
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold sm:text-4xl">
              What Users <span className="text-primary">Say</span>
            </h2>
          </div>

          <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6 h-full flex flex-col">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 flex-1">"{testimonial.content}"</p>
                    <div className="flex items-center gap-3 mt-auto">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-20 bg-muted/30">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold sm:text-4xl">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader className="pb-2 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm sm:text-base text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20">
        <div className="container px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-primary px-4 sm:px-6 py-12 sm:py-20 text-center text-primary-foreground">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-purple-600" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold sm:text-4xl">
                Stop Guessing. Start Matching.
              </h2>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Know exactly what keywords you need before you apply. It's free.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <a href="/extension/keyscore-extension.zip" download>
                  <Button size="lg" variant="secondary" className="text-sm sm:text-base px-6 sm:px-8 w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" />
                    Download Extension
                  </Button>
                </a>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="text-sm sm:text-base px-6 sm:px-8 bg-transparent border-white/30 hover:bg-white/10 w-full sm:w-auto">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
