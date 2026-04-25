import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';
import { useEffect, useState } from 'react';
import { api } from './api';

function App() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.getSettings().then(data => {
      setSettings(data);
      if (data?.theme === 'light') {
        document.body.classList.add('light-mode');
      } else {
        document.body.classList.remove('light-mode');
      }
    }).catch(() => {});
  }, []);

  return (
    <div>
      <Navbar settings={settings} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </div>
  );
}

export default App;
