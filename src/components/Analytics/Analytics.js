// src/components/Analytics/Analytics.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { analyticsAPI } from '../../services/api';
import { useProjects } from '../../hooks/useProjects';
import { TIME_RANGES, CHART_COLORS } from '../../utils/constants';
import Card from '../common/Card';
import Button from '../common/Button';
import Alert from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';

const Analytics = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects } = useProjects();
  
  const [analytics, setAnalytics] = useState({
    totals: { allowed: 0, blocked: 0, total: 0 },
    timeseries: []
  });
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const project = projects.find(p => p.id === projectId);

  const fetchAnalytics = async (range = timeRange) => {
    try {
      setLoading(true);
      setError('');
      const response = await analyticsAPI.getUsage(projectId, range);
      setAnalytics({
        totals: response.data.totals,
        timeseries: response.data.timeseries
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchAnalytics();
    }
  }, [projectId]);

  if (loading) return <LoadingSpinner size="lg" className="py-12" />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">
          Analytics – {project?.name || 'Project'}
        </h1>
        <select
          value={timeRange}
          onChange={(e) => {
            setTimeRange(e.target.value);
            fetchAnalytics(e.target.value);
          }}
          className="ml-4 border rounded p-2 text-sm"
        >
          {TIME_RANGES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <p className="text-gray-600 text-sm">Allowed</p>
          <p className="text-2xl font-bold text-green-600">{analytics.totals.allowed}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm">Blocked</p>
          <p className="text-2xl font-bold text-red-600">{analytics.totals.blocked}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-2xl font-bold text-blue-600">{analytics.totals.total}</p>
        </Card>
      </div>

      {/* Line Chart */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" /> Requests Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.timeseries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="allowed" stroke={CHART_COLORS.allowed} />
            <Line type="monotone" dataKey="blocked" stroke={CHART_COLORS.blocked} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Pie Chart */}
      <Card>
        <h2 className="text-lg font-semibold mb-4">Allowed vs Blocked</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: 'Allowed', value: analytics.totals.allowed },
                { name: 'Blocked', value: analytics.totals.blocked }
              ]}
              cx="50%" cy="50%" outerRadius={80} label
            >
              <Cell fill={CHART_COLORS.allowed} />
              <Cell fill={CHART_COLORS.blocked} />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default Analytics;
