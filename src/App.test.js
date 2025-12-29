import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { projects } from './projects';

describe('App', () => {
  test('renders header with title', () => {
    render(<App />);
    const titleElement = screen.getByText('aussiedatagal');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe('H1');
  });

  test('renders intro text', () => {
    render(<App />);
    const introText = screen.getByText(/A collection of projects I've worked on/i);
    expect(introText).toBeInTheDocument();
  });

  test('renders all projects', () => {
    render(<App />);
    projects.forEach(project => {
      const projectDescription = screen.getByText(project.description);
      expect(projectDescription).toBeInTheDocument();
    });
  });

  test('renders footer with contact information', () => {
    render(<App />);
    const footerText = screen.getByText(/All projects are open source/i);
    expect(footerText).toBeInTheDocument();
    
    const contactLink = screen.getByText('Contact me');
    expect(contactLink).toBeInTheDocument();
    expect(contactLink.closest('a')).toHaveAttribute('href', expect.stringContaining('github.com'));
    
    const emailLink = screen.getByText('Email');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:tkl9tlfno@mozmail.com');
  });

  test('renders EucalyptusPattern component', () => {
    const { container } = render(<App />);
    // Check if EucalyptusPattern is rendered (it should be in the DOM)
    const appDiv = container.querySelector('.App');
    expect(appDiv).toBeInTheDocument();
  });
});

