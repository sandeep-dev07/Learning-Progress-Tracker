import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import SectionSelector from '../components/SectionSelector';

const TeacherDashboard = () => {
  const { user } = useContext(AppContext);
  const [sectionNumber, setSectionNumber] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleAddSubject = () => setSubjects([...subjects, { id: Date.now(), title: '', modules: [] }]);
  
  const handleAddModule = (subIndex) => {
    const newSubjects = [...subjects];
    newSubjects[subIndex].modules.push({ id: Date.now(), title: '', topics: [] });
    setSubjects(newSubjects);
  };
  
  const handleAddTopic = (subIndex, modIndex) => {
    const newSubjects = [...subjects];
    newSubjects[subIndex].modules[modIndex].topics.push({ id: Date.now(), title: '', deadline: '' });
    setSubjects(newSubjects);
  };

  const handleTopicChange = (subIndex, modIndex, topIndex, field, value) => {
    const newSubjects = [...subjects];
    newSubjects[subIndex].modules[modIndex].topics[topIndex][field] = value;
    setSubjects(newSubjects);
  };

  const handleSave = () => {
    if (!sectionNumber || sectionNumber === 'custom') return alert("Please specify a valid section number");
    setSaving(true);
    
    try {
      const sections = JSON.parse(localStorage.getItem('app_sections') || '{}');
      sections[sectionNumber] = {
        sectionNumber,
        createdBy: user?.teacherId || user?.id,
        subjects
      };
      
      localStorage.setItem('app_sections', JSON.stringify(sections));
      alert('Section content saved locally!');
    } catch (err) {
      alert("Error saving: " + err.message);
    }
    
    setSaving(false);
  };

  useEffect(() => {
    if (!sectionNumber || sectionNumber === 'custom') return;
    
    const sections = JSON.parse(localStorage.getItem('app_sections') || '{}');
    if (sections[sectionNumber]) {
      setSubjects(sections[sectionNumber].subjects || []);
    } else {
      setSubjects([]);
    }
  }, [sectionNumber]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header flex-col items-start gap-2">
        <h1>Teacher Dashboard</h1>
        <p className="text-muted">Build curriculum and assignments</p>
      </header>
      
      <div className="module-card mb-4 border-slate-600">
        <SectionSelector 
          value={sectionNumber} 
          onChange={setSectionNumber} 
          options={['section1', 'section2', 'section7']} 
        />
        {sectionNumber === 'custom' && (
          <input 
            type="text" 
            placeholder="Type custom section name" 
            className="form-input w-full mt-3" 
            onBlur={e => {
              if (e.target.value) setSectionNumber(e.target.value);
            }}
          />
        )}
      </div>

      {sectionNumber && sectionNumber !== 'custom' && (
        <div className="mb-4 flex gap-2">
          <button onClick={handleAddSubject} className="btn-secondary">+ New Subject</button>
          <button onClick={handleSave} className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Local Payload'}
          </button>
        </div>
      )}

      {subjects.map((subj, sIdx) => (
        <div key={subj.id} className="module-card mb-4" style={{ borderLeft: '4px solid var(--primary)' }}>
          <input 
            className="form-input w-full mb-3 text-lg font-bold" 
            placeholder="Subject Name (e.g. Mathematics)" 
            value={subj.title} 
            onChange={e => {
              const newS = [...subjects]; newS[sIdx].title = e.target.value; setSubjects(newS);
            }} 
          />
          <button onClick={() => handleAddModule(sIdx)} className="btn-secondary small mb-4">+ Add Module component</button>
          
          {subj.modules.map((mod, mIdx) => (
            <div key={mod.id} className="p-4 mb-3 rounded" style={{ background: 'var(--bg-dark)' }}>
              <input 
                className="form-input w-full mb-3 font-semibold text-blue-400" 
                placeholder="Module Name (e.g. Algebra Basics)" 
                value={mod.title} 
                onChange={e => {
                  const newS = [...subjects]; newS[sIdx].modules[mIdx].title = e.target.value; setSubjects(newS);
                }} 
              />
              <button onClick={() => handleAddTopic(sIdx, mIdx)} className="btn-secondary small mb-3">+ Add Topic</button>

              {mod.topics.map((top, tIdx) => (
                <div key={top.id} className="flex gap-2 mb-2 items-center">
                  <input 
                    className="form-input" style={{flex: 2}} 
                    placeholder="Topic Title (e.g. Linear Equations)" 
                    value={top.title} 
                    onChange={e => handleTopicChange(sIdx, mIdx, tIdx, 'title', e.target.value)} 
                  />
                  <input 
                    className="form-input" style={{flex: 1}} 
                    type="date" 
                    value={top.deadline} 
                    onChange={e => handleTopicChange(sIdx, mIdx, tIdx, 'deadline', e.target.value)} 
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TeacherDashboard;
