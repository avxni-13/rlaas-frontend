import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import CreateProject from './components/Dashboard/CreateProject';
import Analytics from './components/Analytics/Analytics';
import ProjectSettings from './components/Settings/ProjectSettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <Layout requireAuth={false}>
                <Login />
              </Layout>
            } />
            <Route path="/signup" element={
              <Layout requireAuth={false}>
                <Signup />
              </Layout>
            } />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <Layout requireAuth={true}>
                <Dashboard />
              </Layout>
            } />
            <Route path="/create-project" element={
              <Layout requireAuth={true}>
                <CreateProject />
              </Layout>
            } />
            <Route path="/analytics/:projectId" element={
              <Layout requireAuth={true}>
                <Analytics />
              </Layout>
            } />
            <Route path="/settings/:projectId" element={
              <Layout requireAuth={true}>
                <ProjectSettings />
              </Layout>
            } />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;