'use client';

import { useState } from 'react';
import MacWindow from './components/MacWindow';
import FolderNav from './components/FolderNav';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Testimonials from './components/sections/Testimonials';
import Contact from './components/sections/Contact';

export default function Home() {
  const [activeSection, setActiveSection] = useState('about');

  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return <About />;
      case 'projects':
        return <Projects />;
      case 'skills':
        return <Skills />;
      case 'experience':
        return <Experience />;
      case 'testimonials':
        return <Testimonials />;
      case 'contact':
        return <Contact />;
      default:
        return <About />;
    }
  };

  return (
    <MacWindow title={`Mugisha Pacifique - ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}`}>
      <div className="flex h-full">
        <FolderNav onNavigate={setActiveSection} activeSection={activeSection} />
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {renderSection()}
        </div>
      </div>
    </MacWindow>
  );
}
