import { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await projectsAPI.getAll();

      // ✅ Backend returns { projects: [...] }
      const data = response.data.projects || response.data || [];
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const response = await projectsAPI.create(projectData);

      // ✅ Backend returns { project: {...} }
      const newProject = response.data.project || response.data;
      setProjects((prev) => [...prev, newProject]);

      return { success: true, data: newProject };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to create project',
      };
    }
  };

  const updateProjectLimits = async (projectId, limits) => {
    try {
      const response = await projectsAPI.updateLimits(projectId, limits);

      // ✅ Backend returns { limits: {...} }
      const updatedLimits = response.data.limits || {};
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? { ...project, ...updatedLimits }
            : project
        )
      );

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to update limits',
      };
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await projectsAPI.delete(projectId);
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to delete project',
      };
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProjectLimits,
    deleteProject,
  };
};
