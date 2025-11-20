import React from 'react';
import './EucalyptusPattern.css';

function EucalyptusPattern() {
  return (
    <div 
      className="eucalyptus-pattern" 
      aria-hidden="true"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/eucalyptus-pattern.png)`
      }}
    />
  );
}

export default EucalyptusPattern;

