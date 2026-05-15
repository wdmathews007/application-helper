
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import api from './api';
import Dashboard from './Dashboard';

const styles = {
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #020617 0%, #1e3a8a 100%)',
    color: '#bae6fd',
    fontFamily: 'sans-serif',
    padding: '20px',
    boxSizing: 'border-box'
  },
  title: {
    fontWeight: 'bold',
    fontSize: '2.5rem',
    margin: '0 0 10px 0'
  },
  subtitle: {
    fontWeight: 'bold',
    color: '#7dd3fc',
    margin: '0 0 30px 0'
  },
  form: {
    display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '350px', gap: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
  },
  input: {
    padding: '15px', borderRadius: '12px', border: '1px solid #38bdf8',
    background: 'rgba(0, 0, 0, 0.2)', color: '#bae6fd',
    fontWeight: 'bold', fontSize: '1rem', outline: 'none'
  },
  button: {
    padding: '15px', borderRadius: '25px', border: 'none',
    background: '#38bdf8', color: '#0f172a',
    fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)'
  },
  message: { marginTop: '20px', fontWeight: 'bold', color: '#fca5a5' }
};

function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('admin@example.com'); 
  const [password, setPassword] = useState('SuperSecret123!');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the browser from refreshing the page
    
    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });

      const token = response.data.token;
      localStorage.setItem('token', token);

      // Navigate to the dashboard on successful login!
      navigate('/'); 
    } catch (error) {
      console.error(error);
      setMessage('Login failed. Check your credentials.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Application Tracker</h1>
      <h2 style={styles.subtitle}>Login</h2>
      
      <form onSubmit={handleLogin} style={styles.form}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
        <button type="submit" style={styles.button}>Login</button>
      </form>

      {message && (
        <p style={styles.message}>{message}</p>
      )}
    </div>
  );
}

// This component checks if we have a token. If not, it forces you to the login page!
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
