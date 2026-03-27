import React from 'react';
import ProgressBar from './ProgressBar';

const ModuleCard = ({ module }) => {
  return (
    <div className="module-card">
      <h3 className="module-title">{module.title}</h3>
      <div className="module-status badge">{module.status.replace('-', ' ')}</div>
      <div className="module-progress">
        <ProgressBar progress={module.progress} />
      </div>
      <button className="btn-primary mt-4 w-full">
        {module.progress === 100 ? 'Review' : 'Continue'}
      </button>
    </div>
  );
};

export default ModuleCard;
