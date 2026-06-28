import './App.css';
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
    <div className="min-h-screen">
      <AnimatedBackground />
      <CustomCursor />
      <Tooltip />
      <Navigation />
      <Chatbot />
      <main>
        <Hero />
        <Experiences />
        <Skills />
        <Projects />
        <SkillsCredentials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
