import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Copy, Check, Key, Settings, Trash2 } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import Card from '../common/Card';
import Button from '../common/Button';
import Alert from '../common/Alert';

const ProjectSettings = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, updateProjectLimits, deleteProject } = useProjects();

  const [formData, setFormData] = useState({
    requests_per_minute: 100,
    requests_per_day: 1000,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (project) {
      setFormData({
        requests_per_minute: project.requests_per_minute || 100,
        requests_per_day: project.requests_per_day || 1000,
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value) || 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await updateProjectLimits(projectId, formData);
      if (result.success) {
        setSuccess('Project limits updated successfully!');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDeleteProject = async () => {
    setLoading(true);
    try {
      const result = await deleteProject(projectId);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert type="error" message="Project not found" />
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Project Settings
            </h1>
            <p className="text-gray-600">{project.name}</p>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/analytics/${projectId}`)}
            >
              View Analytics
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess('')}
          className="mb-6"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center mb-6">
              <Settings className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Rate Limits
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="requests_per_minute"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Requests per Minute
                  </label>
                  <input
                    id="requests_per_minute"
                    name="requests_per_minute"
                    type="number"
                    min="1"
                    required
                    value={formData.requests_per_minute}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="requests_per_day"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Requests per Day
                  </label>
                  <input
                    id="requests_per_day"
                    name="requests_per_day"
                    type="number"
                    min="1"
                    required
                    value={formData.requests_per_day}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" loading={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>

          <Card className="border-red-200">
            <div className="flex items-center mb-4">
              <Trash2 className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-red-900">
                Danger Zone
              </h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Once you delete a project, there is no going back.
            </p>

            {!showDeleteConfirm ? (
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Project
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-medium text-red-900">
                  Are you sure you want to delete "{project.name}"?
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="danger"
                    onClick={handleDeleteProject}
                    loading={loading}
                  >
                    Yes, Delete Project
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* API Key Info */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <div className="flex items-center mb-4">
              <Key className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">API Key</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your API Key
                </label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-gray-900 text-green-400 px-3 py-2 rounded text-xs font-mono break-all">
                    {project.apiKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(project.apiKey)}
                    className="px-2 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {copiedKey ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
