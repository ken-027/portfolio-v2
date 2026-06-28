import './App.css';
import { MotionConfig } from 'framer-motion';
import Navigation from './components/Navigation';
import AnimatedBackground from './components/AnimatedBackground';
import Hero from './components/Hero';
import Experiences from './components/Experiences';
import Skills from './components/Skills';
import Projects from './components/Projects';
import SkillsCredentials from './components/SkillsCredentials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Tooltip from './components/Tooltip';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen [background-image:radial-gradient(circle,rgba(148,163,184,0.055)_1px,transparent_1px)] [background-size:36px_36px]">
        {/* Skip link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-xl focus:font-semibold focus:shadow-lg focus:shadow-cyan-500/30 focus:outline-none"
        >
          Skip to main content
        </a>
        {/* Aurora background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]" aria-hidden="true">
          <div className="absolute -top-60 -right-60 w-[700px] h-[700px] rounded-full bg-purple-600/[0.06] blur-[140px]" />
          <div className="absolute -bottom-60 -left-60 w-[600px] h-[600px] rounded-full bg-cyan-500/[0.07] blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.05] blur-[100px]" />
        </div>
        <AnimatedBackground />
        <CustomCursor />
        <Tooltip />
        <Navigation />
        <Chatbot />
        <main id="main-content">
          <Hero />
          <Experiences />
          <Skills />
          <Projects />
          <SkillsCredentials />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
