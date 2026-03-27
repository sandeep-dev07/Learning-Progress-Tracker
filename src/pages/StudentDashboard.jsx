import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import TaskList from '../components/TaskList';
import ProgressGraph from '../components/ProgressGraph';

const StudentDashboard = () => {
  const { user } = useContext(AppContext);
  const [sectionData, setSectionData] = useState(null);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [totalTopics, setTotalTopics] = useState(0);

  const fetchSectionData = () => {
    if (!user || user.role !== 'student' || !user.section) return;

    // Fetch matching section statically from local storage
    const sections = JSON.parse(localStorage.getItem('app_sections') || '{}');
    
    // Perform case-insensitive string matching just in case the student registered 
    // with different capitalization or spacing than the teacher's section (e.g. 'section7' vs 'Section 7')
    const userTargetSectionNormalized = user.section.trim().toLowerCase().replace(/\s+/g, '');
    const matchedKey = Object.keys(sections).find(
      key => key.trim().toLowerCase().replace(/\s+/g, '') === userTargetSectionNormalized
    ) || user.section;

    const data = sections[matchedKey] || { subjects: [] };
    
    setSectionData(data);
    
    let total = 0;
    data.subjects?.forEach(s => {
      s.modules?.forEach(m => {
          total += (m.topics?.length || 0);
      });
    });
    setTotalTopics(total);

    // Fetch personal progress
    const progressStore = JSON.parse(localStorage.getItem('app_progress') || '{}');
    const progKey = `${user.id}_${matchedKey}`;
    
    if (progressStore[progKey]) {
      setCompletedTopics(progressStore[progKey].completedTopics || []);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchSectionData();

    // Listen to local storage updates so if teacher saves in another window, 
    // the student dashboard updates instantly without needing a refresh!
    const handleStorageChange = (e) => {
      if (e.key === 'app_sections' || e.key === 'app_progress') {
        fetchSectionData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // We also run a rapid interval poll just in case data changes in the exact same tab 
    // or routing forces a ghost-mount bug
    const syncInterval = setInterval(fetchSectionData, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(syncInterval);
    };
  }, [user]);

  const handleToggleTopic = (topicId) => {
    if (!user.section) return;
    
    const newCompleted = completedTopics.includes(topicId)
      ? completedTopics.filter(id => id !== topicId) 
      : [...completedTopics, topicId];
      
    // Update local React state instantly
    setCompletedTopics(newCompleted);

    // Save strictly to local storage
    const progressStore = JSON.parse(localStorage.getItem('app_progress') || '{}');
    const sections = JSON.parse(localStorage.getItem('app_sections') || '{}');

    // Retrieve the normalized key to safely anchor progress
    const userTargetSectionNormalized = user.section.trim().toLowerCase().replace(/\s+/g, '');
    const matchedKey = Object.keys(sections).find(
      key => key.trim().toLowerCase().replace(/\s+/g, '') === userTargetSectionNormalized
    ) || user.section;

    const progKey = `${user.id}_${matchedKey}`;
    
    progressStore[progKey] = {
      studentId: user.id,
      sectionNumber: matchedKey,
      completedTopics: newCompleted
    };
    
    localStorage.setItem('app_progress', JSON.stringify(progressStore));
  };

  if (!sectionData) return <div className="p-4 mt-8 text-center text-muted">Awaiting connection to section node...</div>;

  const progressPercentage = totalTopics === 0 ? 0 : Math.round((completedTopics.length / totalTopics) * 100);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1>Student Dashboard</h1>
          <p className="text-muted mt-1">Class Section: <span style={{color:'var(--primary)'}}>{user.section}</span></p>
        </div>
        <div>
          <ProgressGraph percentage={progressPercentage} />
        </div>
      </header>
      
      <section className="modules-list" style={{ marginTop: '2rem' }}>
        <TaskList 
          sectionData={sectionData} 
          completedTopics={completedTopics} 
          onToggle={handleToggleTopic} 
        />
      </section>
    </div>
  );
};

export default StudentDashboard;
