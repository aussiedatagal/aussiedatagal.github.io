import React, { useState, useEffect } from 'react';
import './ProjectPreview.css';

function ProjectPreview({ url, fallbackTitle }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        // Use a CORS proxy to fetch the page
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.contents) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data.contents, 'text/html');
          
          const getMetaContent = (property) => {
            const meta = doc.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
            return meta ? meta.getAttribute('content') : null;
          };

          const ogImage = getMetaContent('og:image');
          const ogTitle = getMetaContent('og:title') || doc.querySelector('title')?.textContent || '';
          const ogDescription = getMetaContent('og:description') || 
                               doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

          setPreview({
            title: ogTitle,
            description: ogDescription,
            image: ogImage,
            url: url
          });
        }
      } catch (err) {
        setError('Failed to load preview');
        console.error('Preview fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  if (loading) {
    return (
      <div className="project-preview project-preview-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const displayTitle = preview?.title || fallbackTitle || 'Project';
  const hasPreview = preview && (preview.image || preview.title);

  if (error || !hasPreview) {
    // Fallback: show just the title as a link
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="project-preview project-preview-fallback"
      >
        <div className="project-preview-content">
          <h2 className="project-preview-title">{fallbackTitle || 'Project'}</h2>
        </div>
      </a>
    );
  }

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="project-preview"
    >
      {preview.image && (
        <div className="project-preview-image">
          <img src={preview.image} alt={displayTitle} onError={(e) => e.target.style.display = 'none'} />
        </div>
      )}
      <div className="project-preview-content">
        <h2 className="project-preview-title">{displayTitle}</h2>
      </div>
    </a>
  );
}

export default ProjectPreview;

