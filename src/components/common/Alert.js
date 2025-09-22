import React from 'react';
import { AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';

const Alert = ({ 
  type = 'info', 
  message, 
  onClose, 
  className = '',
  dismissible = true 
}) => {
  const types = {
    success: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: CheckCircle
    },
    error: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: XCircle
    },
    warning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: AlertCircle
    },
    info: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: AlertCircle
    }
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-lg border ${config.bg} ${config.text} ${config.border} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className="w-5 h-5 mr-2" />
          <span>{message}</span>
        </div>
        {dismissible && onClose && (
          <button
            onClick={onClose}
            className={`ml-4 ${config.text} hover:opacity-70 transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;