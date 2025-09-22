import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Settings, Eye, EyeOff, Copy, Check, Activity, Clock } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { API_BASE_URL } from '../../utils/constants';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const toggleApiKeyVisibility = () => setShowApiKey(!showApiKey);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleAnalytics = () => navigate(`/analytics/${project.id}`);
  const handleSettings = () => navigate(`/settings/${project.id}`);

  const formatApiKey = (key) => (showApiKey ? key : '••••••••••••••••');

  return (
    <Card hover className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAnalytics}
            className="text-gray-600 hover:text-blue-600"
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSettings}
            className="text-gray-600 hover:text-gray-900"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* API Key Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 font-medium">API Key</span>
          <div className="flex items-center space-x-2">
            <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono max-w-32 truncate">
              {formatApiKey(project.apiKey)}
            </code>
            <button
              onClick={toggleApiKeyVisibility}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={() => copyToClipboard(project.apiKey)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {copiedKey ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <Clock className="w-3 h-3 text-gray-500 mr-1" />
              <span className="text-gray-600 text-xs">Per Minute</span>
            </div>
            <p className="font-semibold text-gray-900">{project.requests_per_minute || 'N/A'}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center mb-1">
              <Activity className="w-3 h-3 text-gray-500 mr-1" />
              <span className="text-gray-600 text-xs">Per Day</span>
            </div>
            <p className="font-semibold text-gray-900">{project.requests_per_day || 'N/A'}</p>
          </div>
        </div>

        {/* Usage Example */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2 font-medium">Usage Example:</p>
          <div className="bg-gray-900 text-green-400 text-xs p-2 rounded font-mono">
            <div className="break-all">
              curl -H "X-API-Key: {project.apiKey?.substring(0, 16)}..." \\
            </div>
            <div className="text-gray-400 mt-1">{API_BASE_URL}/test</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" onClick={handleAnalytics} className="flex-1">
            <BarChart3 className="w-3 h-3 mr-1" />
            Analytics
          </Button>
          <Button variant="outline" size="sm" onClick={handleSettings} className="flex-1">
            <Settings className="w-3 h-3 mr-1" />
            Settings
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
