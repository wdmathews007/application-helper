import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const styles = {
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #020617 0%, #1e3a8a 100%)',
    color: '#bae6fd',
    fontFamily: 'sans-serif',
    padding: '40px',
    boxSizing: 'border-box',
    overflow: 'hidden'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '20px 30px',
    borderRadius: '16px',
    marginBottom: '40px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  title: {
    fontWeight: 'bold', fontSize: '2rem', margin: 0
  },
  button: {
    padding: '12px 25px', borderRadius: '25px', border: 'none',
    background: '#38bdf8', color: '#0f172a',
    fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)'
  },
  columns: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px',
    flex: 1, minHeight: 0
  },
  column: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '30px', borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    overflowY: 'auto'
  },
  colHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '10px',
    marginBottom: '20px'
  },
  colTitle: {
    fontSize: '1.5rem', margin: 0, color: '#7dd3fc'
  },
  addIcon: {
    background: 'transparent', border: 'none', color: '#38bdf8',
    fontSize: '2rem', cursor: 'pointer', fontWeight: 'bold', lineHeight: 1, padding: '0 10px'
  },
  form: {
    display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px'
  },
  input: {
    padding: '12px', borderRadius: '8px', border: '1px solid #38bdf8',
    background: 'rgba(0, 0, 0, 0.2)', color: '#bae6fd',
    fontWeight: 'bold', fontSize: '1rem', outline: 'none'
  },
  card: {
    background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', marginBottom: '15px',
    borderLeft: '4px solid #38bdf8'
  },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
  },
  interaction: {
    background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', marginTop: '10px', fontSize: '0.95rem'
  },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: '#0f172a', padding: '30px', borderRadius: '16px',
    width: '90%', maxWidth: '500px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    border: '1px solid #1e3a8a'
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'
  },
  closeButton: {
    background: 'transparent', border: 'none', color: '#fca5a5',
    fontSize: '1.75rem', cursor: 'pointer', fontWeight: 'bold', lineHeight: 1
  },
  resumeVariation: {
    marginLeft: '15px', padding: '8px 0', fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  },
  error: {
    color: '#fca5a5', fontWeight: 'bold', fontSize: '1.2rem'
  },
  emptyText: {
    fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center', marginTop: '40px'
  },
  deleteButton: {
    background: 'transparent', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '0.9rem', padding: '0 5px', fontWeight: 'bold'
  }
};

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Modal Visibility State
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);

  const [showRejected, setShowRejected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New Application Form State
  const [appCompanyName, setAppCompanyName] = useState('');
  const [appRole, setAppRole] = useState('');
  const [appJobUrl, setAppJobUrl] = useState('');
  const [appResumeId, setAppResumeId] = useState('');

  // Interaction Modal State
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [interactionAppId, setInteractionAppId] = useState(null);
  const [interactionType, setInteractionType] = useState('Follow-up');
  const [interactionNotes, setInteractionNotes] = useState('');

  const [expandedApp, setExpandedApp] = useState(null);

  const [resumeName, setResumeName] = useState('');
  const [resumeVariant, setResumeVariant] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState('new');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, intRes, resRes] = await Promise.all([
          api.get('/applications'),
          api.get('/interactions'),
          api.get('/resumes')
        ]);

        let appsData = appRes.data;
        let intsData = intRes.data;
        const resData = resRes.data;

        // Auto-reject applications with no interactions in the last 4 weeks
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        const newRejections = [];
        for (const app of appsData) {
          const appInteractions = intsData.filter(i => i.applicationId === app.id);
          if (appInteractions.length > 0) {
            const latest = [...appInteractions].sort((a, b) => new Date(b.interactionDate).getTime() - new Date(a.interactionDate).getTime())[0];
            
            if (latest.type !== 'Rejection' && latest.type !== 'Offer' && new Date(latest.interactionDate) < fourWeeksAgo) {
              newRejections.push({
                applicationId: app.id,
                type: 'Rejection',
                notes: 'Automated Rejection: No response for 4 weeks (Ghosted).',
                interactionDate: new Date().toISOString()
              });
            }
          }
        }

        if (newRejections.length > 0) {
          const postedRejections = await Promise.all(
            newRejections.map(payload => api.post('/interactions', payload))
          );
          intsData = [...intsData, ...postedRejections.map(res => res.data)];
        }

        setApplications(appsData);
        setInteractions(intsData);
        setResumes(resData);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error(err);
          setError('Failed to load dashboard data.');
        }
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAddResume = async (e) => {
    e.preventDefault();
    if (!resumeFile && !resumeUrl) {
      setError('Please upload a file or provide a URL.');
      return;
    }
    setError('');

    try {
      let finalUrl = resumeUrl;
      
      if (resumeFile) {
        const formData = new FormData();
        formData.append('file', resumeFile);
        
        const uploadRes = await api.post('/files/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        finalUrl = `http://localhost:5224${uploadRes.data.url}`;
      }

      if (selectedResumeId === 'new') {
        const newVariations = [{ variant: resumeVariant || 'Default', url: finalUrl }];
        const payload = { name: resumeName, fileUrl: JSON.stringify(newVariations) };
        const res = await api.post('/resumes', payload);
        setResumes([...resumes, res.data]);
      } else {
        const existing = resumes.find(r => r.id === parseInt(selectedResumeId));
        const variations = parseVariations(existing.fileUrl);
        variations.push({ variant: resumeVariant || 'Update', url: finalUrl });
        
        const payload = { ...existing, fileUrl: JSON.stringify(variations) };
        const res = await api.put(`/resumes/${existing.id}`, payload);
        setResumes(resumes.map(r => r.id === existing.id ? res.data : r));
      }
      // Reset form
      setResumeName(''); setResumeVariant(''); setResumeUrl(''); setResumeFile(null); setSelectedResumeId('new');
      setShowResumeModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to save resume.');
    }
  };

  const handleAddApplication = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        companyName: appCompanyName,
        role: appRole,
        status: 'Applied', // Legacy field, kept for backwards compatibility in DB
        jobDescriptionUrl: appJobUrl,
        resumeId: appResumeId ? parseInt(appResumeId, 10) : null,
        dateApplied: new Date().toISOString()
      };
      const res = await api.post('/applications', payload);
      setApplications([...applications, res.data]);
      
      const intRes = await api.get('/interactions');
      setInteractions(intRes.data);

      // Reset form
      setAppCompanyName(''); setAppRole(''); setAppJobUrl(''); setAppResumeId('');
      setShowAppModal(false);
    } catch (err) {
      console.error(err);
      setError('Failed to save application.');
    }
  };

  const handleAddInteraction = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        applicationId: interactionAppId,
        type: interactionType,
        notes: interactionNotes,
        interactionDate: new Date().toISOString()
      };
      const res = await api.post('/interactions', payload);
      setInteractions([...interactions, res.data]);
      
      setShowInteractionModal(false); setInteractionNotes(''); setInteractionType('Follow-up'); setInteractionAppId(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save interaction.');
    }
  };

  const handleDeleteResume = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entire resume group?")) return;
    try {
      await api.delete(`/resumes/${id}`);
      setResumes(resumes.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete resume.');
    }
  };

  const handleDeleteResumeVariant = async (resumeId, variantIndex) => {
    if (!window.confirm("Are you sure you want to delete this variant?")) return;
    try {
      const existing = resumes.find(r => r.id === resumeId);
      const variations = parseVariations(existing.fileUrl);
      variations.splice(variantIndex, 1);
      const payload = { ...existing, fileUrl: JSON.stringify(variations) };
      const res = await api.put(`/resumes/${existing.id}`, payload);
      setResumes(resumes.map(r => r.id === existing.id ? res.data : r));
    } catch (err) {
      console.error(err);
      setError('Failed to delete resume variant.');
    }
  };

  const handleDeleteApplication = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await api.delete(`/applications/${id}`);
      setApplications(applications.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete application.');
    }
  };

  const handleDeleteInteraction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this interaction?")) return;
    try {
      await api.delete(`/interactions/${id}`);
      setInteractions(interactions.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete interaction.');
    }
  };

  // Helper to safely parse FileUrl back into an array of variations
  const parseVariations = (fileUrl) => {
    if (!fileUrl) return [];
    try {
      const parsed = JSON.parse(fileUrl);
      return Array.isArray(parsed) ? parsed : [{ variant: 'Default', url: fileUrl }];
    } catch {
      // Fallback for legacy plain-string URLs
      return [{ variant: 'Default', url: fileUrl }];
    }
  };

  const getAppStatus = (appId) => {
    const appInteractions = interactions.filter(i => i.applicationId === appId);
    if (appInteractions.length === 0) return 'Applied';
    const latest = appInteractions.sort((a, b) => new Date(b.interactionDate).getTime() - new Date(a.interactionDate).getTime())[0];
    return latest.type;
  };

  // Helper to calculate resume performance
  const getResumeStats = (resumeId) => {
    const apps = applications.filter(a => a.resumeId === resumeId);
    if (apps.length === 0) return { total: 0, callbackRateTotal: 0, callbackRateResolved: 0 };

    let callbacksCount = 0;
    let resolvedCount = 0;

    apps.forEach(a => {
      const appInteractions = interactions.filter(i => i.applicationId === a.id);
      const hasCallback = appInteractions.some(i => ['Callback', 'Interviewing', 'Offer'].includes(i.type));
      const hasRejection = appInteractions.some(i => i.type === 'Rejection');
      
      if (hasCallback) callbacksCount++;
      if (hasCallback || hasRejection) resolvedCount++;
    });

    const callbackRateTotal = ((callbacksCount / apps.length) * 100).toFixed(0);
    const callbackRateResolved = resolvedCount > 0 ? ((callbacksCount / resolvedCount) * 100).toFixed(0) : 0;
    
    return { total: apps.length, callbackRateTotal, callbackRateResolved };
  };

  // Dynamically sort applications so the ones with the most recent interactions bubble to the top
  const sortedApplications = [...applications].sort((a, b) => {
    const aTime = Math.max(new Date(a.dateApplied || 0).getTime(), ...interactions.filter(i => i.applicationId === a.id).map(i => new Date(i.interactionDate).getTime()));
    const bTime = Math.max(new Date(b.dateApplied || 0).getTime(), ...interactions.filter(i => i.applicationId === b.id).map(i => new Date(i.interactionDate).getTime()));
    return bTime - aTime;
  });

  const visibleApplications = showRejected 
    ? sortedApplications 
    : sortedApplications.filter(app => getAppStatus(app.id) !== 'Rejection');

  const searchedApplications = visibleApplications.filter(app => 
    (app.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (app.role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Applications</h1>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      
      <div style={styles.columns}>
        
        {/* Left Column: Resumes */}
        <div style={styles.column}>
          <div style={styles.colHeader}>
            <h2 style={styles.colTitle}>Resume Manager</h2>
            <button onClick={() => setShowResumeModal(true)} style={styles.addIcon} title="Add Resume">+</button>
          </div>

          <div>
            {resumes.map(r => {
              const stats = getResumeStats(r.id);
              return (
                <div key={r.id} style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0 }}>{r.name}</h3>
                    <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#bae6fd' }}>
                      <div>{stats.total} App{stats.total !== 1 ? 's' : ''}</div>
                      <div style={{ color: stats.callbackRateTotal > 0 ? '#86efac' : '' }}>{stats.callbackRateTotal}% Callback (All)</div>
                      <div style={{ color: stats.callbackRateResolved > 0 ? '#86efac' : '' }}>{stats.callbackRateResolved}% Callback (Resolved)</div>
                      <button onClick={() => handleDeleteResume(r.id)} style={{ ...styles.deleteButton, marginTop: '5px' }}>Delete Group</button>
                    </div>
                  </div>
                  {parseVariations(r.fileUrl).map((v, i) => (
                    <div key={i} style={styles.resumeVariation}>
                      <span>{v.variant}</span>
                      <div>
                        <a href={v.url} target="_blank" rel="noreferrer" style={{ color: '#7dd3fc', textDecoration: 'none', marginRight: '10px' }}>View &rarr;</a>
                        <button onClick={() => handleDeleteResumeVariant(r.id, i)} style={styles.deleteButton} title="Delete Variant">×</button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Applications */}
        <div style={styles.column}>
          <div style={styles.colHeader}>
            <h2 style={styles.colTitle}>Current Applications</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                style={{ ...styles.input, padding: '8px', fontSize: '0.9rem' }} 
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={showRejected} onChange={(e) => setShowRejected(e.target.checked)} />
                Show Rejected
              </label>
              <button onClick={() => setShowAppModal(true)} style={styles.addIcon} title="Add Application">+</button>
            </div>
          </div>
          
          {searchedApplications.length === 0 ? (
            <p style={styles.emptyText}>No applications found. Time to apply to some jobs!</p>
          ) : (
            searchedApplications.map(app => (
              <div key={app.id} style={styles.card}>
                <div style={styles.cardHeader} onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}>
                  <div>
                    <strong style={{ fontSize: '1.2rem' }}>{app.companyName}</strong>
                    <div style={{ color: '#7dd3fc', marginTop: '4px' }}>{app.role} ({getAppStatus(app.id)})</div>
                    {app.resumeId && (
                      <div style={{ color: '#bae6fd', fontSize: '0.85rem', marginTop: '4px' }}>
                        Resume: {resumes.find(r => r.id === app.resumeId)?.name || 'Unknown'}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {expandedApp === app.id ? '−' : '+'}
                  </span>
                </div>

                {expandedApp === app.id && (
                  <div style={{ marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h4 style={{ margin: 0, color: '#e0f2fe' }}>Timeline & Interactions</h4>
                      <div>
                        <button onClick={(e) => { e.stopPropagation(); setInteractionAppId(app.id); setShowInteractionModal(true); }} style={{ ...styles.button, padding: '5px 10px', fontSize: '0.85rem' }}>+ Add</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteApplication(app.id); }} style={{ ...styles.deleteButton, marginLeft: '10px' }}>Delete App</button>
                      </div>
                    </div>
                    {interactions.filter(i => i.applicationId === app.id).length === 0 ? (
                      <p style={{ fontSize: '0.9rem', color: '#bae6fd' }}>No interactions logged yet.</p>
                    ) : (
                      interactions.filter(i => i.applicationId === app.id).sort((a,b) => new Date(b.interactionDate).getTime() - new Date(a.interactionDate).getTime()).map(interaction => (
                        <div key={interaction.id} style={styles.interaction}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                              <strong style={{ color: '#38bdf8' }}>{new Date(interaction.interactionDate).toLocaleDateString()}</strong> - <span style={{ color: interaction.type === 'Rejection' ? '#fca5a5' : ['Callback', 'Offer', 'Interviewing'].includes(interaction.type) ? '#86efac' : '#bae6fd'}}>{interaction.type}</span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteInteraction(interaction.id); }} style={styles.deleteButton} title="Delete Interaction">×</button>
                          </div>
                          <div style={{ marginTop: '4px' }}>{interaction.notes}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>

      {/* --- MODALS --- */}

      {/* Resume Modal */}
      {showResumeModal && (
        <div style={styles.modalOverlay} onClick={() => setShowResumeModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: '#bae6fd' }}>Add Resume</h2>
              <button onClick={() => setShowResumeModal(false)} style={styles.closeButton}>×</button>
            </div>
            <form onSubmit={handleAddResume} style={styles.form}>
              <select 
                value={selectedResumeId} 
                onChange={(e) => {
                  setSelectedResumeId(e.target.value);
                  const r = resumes.find(x => x.id === parseInt(e.target.value));
                  setResumeName(r ? r.name : '');
                }} 
                style={styles.input}
              >
                <option value="new">-- Create New Resume Group --</option>
                {resumes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              {selectedResumeId === 'new' && (
                <input placeholder="Base Name (e.g. Software Engineer)" value={resumeName} onChange={e => setResumeName(e.target.value)} required style={styles.input} />
              )}
              <input placeholder="Variation Name (e.g. Dark Mode, Startup)" value={resumeVariant} onChange={e => setResumeVariant(e.target.value)} required style={styles.input} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input key={resumeFile ? 'loaded' : 'empty'} type="file" onChange={e => setResumeFile(e.target.files[0])} style={styles.input} accept=".pdf,.doc,.docx" />
                <span style={{ color: '#7dd3fc', fontWeight: 'bold', alignSelf: 'center' }}>OR</span>
                <input placeholder="File URL / Link" value={resumeUrl} onChange={e => setResumeUrl(e.target.value)} style={styles.input} />
              </div>
              <button type="submit" style={styles.button}>Save Resume</button>
            </form>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showAppModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAppModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: '#bae6fd' }}>Track New Application</h2>
              <button onClick={() => setShowAppModal(false)} style={styles.closeButton}>×</button>
            </div>
            <form onSubmit={handleAddApplication} style={styles.form}>
              <input placeholder="Company Name" value={appCompanyName} onChange={e => setAppCompanyName(e.target.value)} required style={styles.input} />
              <input placeholder="Role" value={appRole} onChange={e => setAppRole(e.target.value)} required style={styles.input} />
              <input placeholder="Job Description URL" value={appJobUrl} onChange={e => setAppJobUrl(e.target.value)} style={styles.input} />
              <select value={appResumeId} onChange={e => setAppResumeId(e.target.value)} style={styles.input}>
                <option value="">-- Select Resume Used (Optional) --</option>
                {resumes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <button type="submit" style={styles.button}>Save Application</button>
            </form>
          </div>
        </div>
      )}

      {/* Interaction Modal */}
      {showInteractionModal && (
        <div style={styles.modalOverlay} onClick={() => setShowInteractionModal(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={{ margin: 0, color: '#bae6fd' }}>Log Interaction</h2>
              <button onClick={() => setShowInteractionModal(false)} style={styles.closeButton}>×</button>
            </div>
            <form onSubmit={handleAddInteraction} style={styles.form}>
              <select value={interactionType} onChange={e => setInteractionType(e.target.value)} style={styles.input}>
                <option value="Follow-up">Follow-up</option>
                <option value="Callback">Callback (Positive)</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer!</option>
                <option value="Rejection">Rejection</option>
              </select>
              <textarea placeholder="Description / Notes" value={interactionNotes} onChange={e => setInteractionNotes(e.target.value)} required style={{ ...styles.input, minHeight: '100px' }} />
              <button type="submit" style={styles.button}>Save Interaction</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;