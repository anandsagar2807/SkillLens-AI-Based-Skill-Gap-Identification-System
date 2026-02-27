import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Analysis from './pages/Analysis';
import Dashboard from './pages/Dashboard';
import JobExplorer from './pages/JobExplorer';
import CareerRoadmap from './pages/CareerRoadmap';
import Insights from './pages/Insights';
import Reports from './pages/Reports';
import About from './pages/About';

function App() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/jobs" element={<JobExplorer />} />
                    <Route path="/roadmap" element={<CareerRoadmap />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;