import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import ExperienceEducation from '../components/ExperienceEducation';
import GitHubSection from '../components/GitHubSection';
import Contact from '../components/Contact';

export default function HomePage() {
  return (
    <div className="flex flex-col space-y-4">
      <Hero />
      <About />
      <Projects />
      <Skills />
      <ExperienceEducation />
      <GitHubSection />
      <Contact />
    </div>
  );
}
