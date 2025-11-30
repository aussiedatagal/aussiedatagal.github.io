import React from 'react';
import ProjectPreview from './ProjectPreview';
import './ProjectCard.css';

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <ProjectPreview url={project.liveUrl} fallbackTitle={project.title} />
      <p className="project-description">{project.description}</p>
      <div className="project-links">
        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
          Source code
        </a>
      </div>
    </article>
  );
}

export default ProjectCard;

