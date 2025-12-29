import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectCard from './ProjectCard';

const mockProject = {
  id: 'test-project',
  title: 'Test Project',
  description: 'This is a test project description',
  liveUrl: 'https://example.com',
  repoUrl: 'https://github.com/example/test'
};

describe('ProjectCard', () => {
  test('renders project description', () => {
    render(<ProjectCard project={mockProject} />);
    const description = screen.getByText(mockProject.description);
    expect(description).toBeInTheDocument();
  });

  test('renders source code link with correct URL', () => {
    render(<ProjectCard project={mockProject} />);
    const sourceLink = screen.getByText('Source code');
    expect(sourceLink).toBeInTheDocument();
    expect(sourceLink).toHaveAttribute('href', mockProject.repoUrl);
    expect(sourceLink).toHaveAttribute('target', '_blank');
    expect(sourceLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('renders ProjectPreview component', () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    // ProjectPreview should be rendered (check for project-card class)
    const projectCard = container.querySelector('.project-card');
    expect(projectCard).toBeInTheDocument();
  });

  test('renders with different project data', () => {
    const anotherProject = {
      id: 'another-project',
      title: 'Another Project',
      description: 'Another description',
      liveUrl: 'https://another.com',
      repoUrl: 'https://github.com/another/repo'
    };
    
    render(<ProjectCard project={anotherProject} />);
    expect(screen.getByText(anotherProject.description)).toBeInTheDocument();
    expect(screen.getByText('Source code')).toHaveAttribute('href', anotherProject.repoUrl);
  });
});

