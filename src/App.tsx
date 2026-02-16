import './App.css'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Experiences from './components/Experiences'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Certificates from './components/Certificates'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import Tooltip from './components/Tooltip'
import Chatbot from './components/Chatbot'

function App() {
    return (
        <div className="min-h-screen custom-cursor">
            <CustomCursor />
            <Tooltip />
            <Navigation />
            <Chatbot />
            <main>
                <Hero />
                <Experiences />
                <Skills />
                <Projects />
                <Certificates />
                <Contact />
            </main>
            <Footer />
        </div>
    )
}

export default App
