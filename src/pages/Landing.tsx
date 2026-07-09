import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import {
  ClipboardList,
  LayoutGrid,
  Zap,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Rocket,
  BarChart3,
  Sparkles,
  CalendarClock,
  MousePointerClick,
} from 'lucide-react'
import '../styles/Landing.css'

const features = [
  {
    icon: LayoutGrid,
    title: 'Kanban Board',
    description: 'Drag and drop tasks between Pending, In Progress, and Completed columns to visualize your workflow at a glance.',
  },
  {
    icon: BarChart3,
    title: 'Live Statistics',
    description: 'Track total, pending, in-progress, and completed tasks with real-time counters that update as you work.',
  },
  {
    icon: CalendarClock,
    title: 'Due Date Tracking',
    description: 'Set due dates and instantly spot overdue tasks with clear visual cues, so nothing slips through the cracks.',
  },
  {
    icon: Zap,
    title: 'Fast Filtering',
    description: 'Filter tasks by status or date range and switch between Kanban and Table views in a single click.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by Design',
    description: 'Your account and tasks are protected with authenticated, token-based sessions built for peace of mind.',
  },
  {
    icon: MousePointerClick,
    title: 'Effortless Editing',
    description: 'Create, edit, and complete tasks in seconds with a clean modal workflow that stays out of your way.',
  },
]

const steps = [
  { title: 'Create an account', description: 'Sign up in seconds with just your name, email, and a password.' },
  { title: 'Add your tasks', description: 'Capture what needs to get done with titles, descriptions, and due dates.' },
  { title: 'Track progress', description: 'Drag tasks across your board and watch your stats update live as you complete them.' },
]

function useRevealOnScroll() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    const targets = el.querySelectorAll('.reveal')
    targets.forEach((t) => observer.observe(t))

    return () => observer.disconnect()
  }, [])

  return ref
}

const Landing: React.FC = () => {
  const containerRef = useRevealOnScroll()

  return (
    <div className="landing" ref={containerRef}>
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <ClipboardList size={26} />
            <span>Taskify</span>
          </div>
          <div className="landing-nav-actions">
            <Link to="/login" className="landing-nav-link">Sign In</Link>
            <Link to="/register">
              <Button type="primary" size="middle" className="landing-nav-cta">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <header className="landing-hero">
        <div className="landing-hero-glow" />
        <div className="landing-hero-content">
          <div className="landing-badge reveal">
            <Sparkles size={14} />
            <span>Organize your work, effortlessly</span>
          </div>
          <h1 className="landing-hero-title reveal">
            Manage your tasks with <span className="landing-gradient-text">clarity and speed</span>
          </h1>
          <p className="landing-hero-subtitle reveal">
            A clean, focused task manager with drag-and-drop Kanban boards, live progress tracking,
            and due-date reminders — built to help you get things done without the clutter.
          </p>
          <div className="landing-hero-actions reveal">
            <Link to="/register">
              <Button type="primary" size="large" className="landing-cta-primary" icon={<ArrowRight size={18} />} iconPosition="end">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="large" className="landing-cta-secondary">
                Sign In
              </Button>
            </Link>
          </div>
          <div className="landing-hero-points reveal">
            <span><CheckCircle2 size={16} /> No credit card required</span>
            <span><CheckCircle2 size={16} /> Free forever</span>
            <span><CheckCircle2 size={16} /> Setup in under a minute</span>
          </div>
        </div>

        <div className="landing-hero-preview reveal">
          <div className="landing-preview-card">
            <div className="landing-preview-header">
              <div className="landing-preview-dot" style={{ background: '#ef4444' }} />
              <div className="landing-preview-dot" style={{ background: '#f59e0b' }} />
              <div className="landing-preview-dot" style={{ background: '#22c55e' }} />
            </div>
            <div className="landing-preview-columns">
              <div className="landing-preview-column">
                <div className="landing-preview-column-title">Pending</div>
                <div className="landing-preview-task" />
                <div className="landing-preview-task" style={{ width: '70%' }} />
              </div>
              <div className="landing-preview-column">
                <div className="landing-preview-column-title">In Progress</div>
                <div className="landing-preview-task" style={{ width: '85%' }} />
              </div>
              <div className="landing-preview-column">
                <div className="landing-preview-column-title">Completed</div>
                <div className="landing-preview-task" style={{ width: '60%' }} />
                <div className="landing-preview-task" style={{ width: '90%' }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="landing-section">
        <div className="landing-section-header reveal">
          <span className="landing-eyebrow">Features</span>
          <h2>Everything you need to stay on top of your work</h2>
          <p>Powerful, simple tools that help individuals and teams move tasks from idea to done.</p>
        </div>

        <div className="landing-features-grid">
          {features.map((feature) => (
            <div className="landing-feature-card reveal" key={feature.title}>
              <div className="landing-feature-icon">
                <feature.icon size={22} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section landing-steps-section">
        <div className="landing-section-header reveal">
          <span className="landing-eyebrow">How it works</span>
          <h2>Get up and running in three simple steps</h2>
        </div>

        <div className="landing-steps">
          {steps.map((step, index) => (
            <div className="landing-step reveal" key={step.title}>
              <div className="landing-step-number">{index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-cta-section reveal">
        <div className="landing-cta-box">
          <Rocket size={32} />
          <h2>Ready to organize your work?</h2>
          <p>Join now and start managing your tasks with a board that keeps you moving forward.</p>
          <Link to="/register">
            <Button type="primary" size="large" className="landing-cta-primary" icon={<ArrowRight size={18} />} iconPosition="end">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-brand">
          <ClipboardList size={20} />
          <span>Taskify</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Taskify. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Landing
