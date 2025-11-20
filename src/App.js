import React from 'react';
import { projects } from './projects';
import ProjectCard from './ProjectCard';
import EucalyptusPattern from './EucalyptusPattern';
import './App.css';

function App() {
  return (
    <div className="App">
      <EucalyptusPattern />
      <header className="header">
        <h1>aussiedatagal</h1>
        <p className="intro">
          A collection of projects I've worked on in my spare time. 
          Mostly things I found interesting or wanted to explore. 
          Some might be useful, others are just for fun.
        </p>
      </header>
      
      <main className="projects">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </main>
      
      <footer className="footer">
        <p>
          All projects are open source. Data sources and licenses are noted in each one.
        </p>
        <p className="footer-contact">
          <a href="https://github.com/aussiedatagal/aussiedatagal.github.io/issues" target="_blank" rel="noopener noreferrer">
            Contact me
          </a>
          {' • '}
          <a href="mailto:tkl9tlfno@mozmail.com">
            Email
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;

