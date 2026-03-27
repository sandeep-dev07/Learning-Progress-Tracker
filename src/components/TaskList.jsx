import React from 'react';

const TaskList = ({ sectionData, completedTopics, onToggle }) => {
  if (!sectionData?.subjects || sectionData.subjects.length === 0) {
     return <div className="module-card text-center text-muted">No assignments listed in this section yet.</div>;
  }

  return (
    <div>
      {sectionData?.subjects?.map(subject => (
        <div key={subject.id} className="module-card mb-4 border-slate-600 border">
          <h2 className="text-xl font-bold mb-3">{subject.title || 'Untitled Subject'}</h2>
          
          {subject.modules?.map(module => (
            <div key={module.id} className="mb-4 pl-4 border-l-2 border-slate-600 py-1">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">{module.title || 'Untitled Module'}</h3>
              
              <div className="flex flex-col gap-2">
                {module.topics?.map(topic => {
                  const isCompleted = completedTopics.includes(topic.id);
                  return (
                    <label 
                      key={topic.id} 
                      className="flex justify-between items-center p-3 rounded"
                      style={{ background: 'var(--bg-dark)', cursor: 'pointer', transition: 'all 0.2s', border: isCompleted ? '1px solid var(--success)' : '1px solid transparent' }}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={isCompleted}
                          onChange={() => onToggle(topic.id)}
                          style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--success)' }}
                        />
                        <span style={{ 
                           textDecoration: isCompleted ? 'line-through' : 'none', 
                           color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                           fontWeight: 500
                        }}>
                          {topic.title || 'Untitled Topic'}
                        </span>
                      </div>
                      {topic.deadline && (
                        <span className="badge m-0" style={{ 
                          background: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', 
                          color: isCompleted ? '#34d399' : '#fbbf24'
                        }}>
                          Due: {topic.deadline}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TaskList;
