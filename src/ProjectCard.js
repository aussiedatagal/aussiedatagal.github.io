import React from 'react';
import './ProjectCard.css';

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <div className="project-links">
        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
          View project
        </a>
        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
          Source code
        </a>
      </div>
    </article>
  );
}

export default ProjectCard;

