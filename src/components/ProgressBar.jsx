import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-container">
      <div className="progress-bar-background">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${progress}%`, backgroundColor: progress === 100 ? '#10b981' : '#3b82f6' }}
        ></div>
      </div>
      <span className="progress-text">{progress}% Completed</span>
    </div>
  );
};

export default ProgressBar;
