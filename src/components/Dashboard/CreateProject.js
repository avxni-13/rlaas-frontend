import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Info, Clock, Activity } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import Card from '../common/Card';
import Button from '../common/Button';
import Alert from '../common/Alert';

const CreateProject = () => {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  
  const [formData, setFormData] = useState({
    name: '',
    requests_per_minute: 100,   // ✅ changed
    requests_per_day: 1000
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('requests') ? parseInt(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await createProject(formData);
      if (result.success) {
        setSuccess('Project created successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.requests_per_minute > 0 && formData.requests_per_day > 0; // ✅ changed

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
        <p className="text-gray-600">Set up rate limiting for your API endpoints</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}
      {success && <Alert type="success" message={success} dismissible={false} className="mb-6" />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="My API Project"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="requests_per_minute" className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Requests per Minute *
                  </label>
                  <input
                    id="requests_per_minute"
                    name="requests_per_minute"    // ✅ changed
                    type="number"
                    min="1"
                    required
                    value={formData.requests_per_minute}   // ✅ changed
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="requests_per_day" className="block text-sm font-medium text-gray-700 mb-2">
                    <Activity className="w-4 h-4 inline mr-1" />
                    Requests per Day *
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

              <div className="flex space-x-4 pt-6">
                <Button type="submit" loading={loading} disabled={!isFormValid}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
                <Button variant="secondary" onClick={() => navigate('/dashboard')} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
