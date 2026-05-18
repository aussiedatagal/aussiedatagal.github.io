import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { projects } from './projects';

const script = document.createElement('script');
script.type = 'application/ld+json';
script.text = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'aussiedatagal — Maps and data projects',
  description: 'Interactive maps and data tools about Sydney, NSW housing, childcare costs, food safety, and more. Open-source side projects.',
  url: 'https://aussiedatagal.github.io/',
  hasPart: projects.map(p => ({
    '@type': 'WebApplication',
    name: p.title,
    description: p.description,
    url: p.liveUrl,
  })),
});
document.head.appendChild(script);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

