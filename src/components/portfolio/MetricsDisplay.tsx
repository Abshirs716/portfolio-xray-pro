// src/components/portfolio/MetricsDisplay.tsx

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Shield, Activity, Target, BarChart3 } from 'lucide-react';
import { PortfolioMetrics, MetricResult } from '../../services/calculations/metricsCalculator';

interface MetricsDisplayProps {
  metrics: PortfolioMetrics;
}

interface MetricCardProps {
  title: string;
  metric: MetricResult;
  icon: React.ReactNode;
  unit?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, metric, icon, unit = '' }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'Good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatValue = (value: number) => {
    // Handle percentage values
    if (title.includes('Drawdown') || title.includes('Capture')) {
      return `${(value * 100).toFixed(2)}%`;
    }
    // Handle ratio values
    return value.toFixed(3);
  };

  // Better formatting for input values
  const formatInputValue = (key: string, value: number | string): string => {
    if (typeof value === 'string') return value;
    
    // Format percentages
    if (key.toLowerCase().includes('return') || key.toLowerCase().includes('rate') || key.toLowerCase().includes('deviation')) {
      return `${(value * 100).toFixed(2)}%`;
    }
    
    // Format periods/counts as integers
    if (key.toLowerCase().includes('period') || key.toLowerCase().includes('returns') || key.toLowerCase().includes('days')) {
      return Math.round(value).toLocaleString();
    }
    
    // Format decimal values
    if (value < 0.01) {
      return value.toFixed(6);
    } else if (value < 1) {
      return value.toFixed(4);
    } else {
      return value.toFixed(2);
    }
  };

  // Format input key names for better readability
  const formatInputKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize each word
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-blue-50 mr-3">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getPerformanceColor(metric.performance)}`}>
              {metric.performance}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {formatValue(metric.value)}{unit}
          </div>
          <div className="text-sm text-gray-500">
            Confidence: {metric.confidence}
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <p className="text-gray-600 mb-4">{metric.interpretation}</p>

      {/* Show Your Work Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-center px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200"
      >
        <span className="font-medium text-gray-700 mr-2">Show Your Work™</span>
        {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Detailed Breakdown */}
      {showDetails && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <div className="space-y-6">
            {/* Formula */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">
                  📐
                </span>
                Formula
              </h4>
              <div className="bg-white p-4 rounded-lg border font-mono text-sm shadow-sm">
                {metric.transparency.formula}
              </div>
            </div>

            {/* Calculation Steps */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">
                  🧮
                </span>
                Calculation Steps
              </h4>
              <div className="space-y-3">
                {metric.transparency.steps.map((step, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium mb-2">{step.description}</p>
                        {step.formula && (
                          <div className="bg-gray-50 p-2 rounded font-mono text-sm text-gray-700 mb-2">
                            {step.formula}
                          </div>
                        )}
                        <div className="bg-blue-50 p-2 rounded">
                          <p className="text-sm font-semibold text-blue-700">
                            <span className="text-blue-600">Result:</span> {step.result}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">
                  📊
                </span>
                Key Inputs
              </h4>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(metric.transparency.inputs).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600 font-medium">
                        {formatInputKey(key)}:
                      </span>
                      <span className="font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded">
                        {formatInputValue(key, value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Methodology */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">
                  🔬
                </span>
                Methodology
              </h4>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  {metric.transparency.methodology}
                </p>
              </div>
            </div>

            {/* Assumptions */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="bg-yellow-100 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">
                  ⚠️
                </span>
                Key Assumptions
              </h4>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <ul className="space-y-2">
                  {metric.transparency.assumptions.map((assumption, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-blue-500 mr-3 mt-1 flex-shrink-0">•</span>
                      <span className="leading-relaxed">{assumption}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics }) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Performance Metrics Analysis
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Comprehensive risk-adjusted performance analysis with complete calculation transparency.
          Each metric provides institutional-grade insights with full mathematical disclosure.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Sharpe Ratio"
          metric={metrics.sharpeRatio}
          icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
        />
        
        <MetricCard
          title="Sortino Ratio"
          metric={metrics.sortinoRatio}
          icon={<TrendingDown className="h-6 w-6 text-blue-600" />}
        />
        
        <MetricCard
          title="Maximum Drawdown"
          metric={metrics.maxDrawdown}
          icon={<Shield className="h-6 w-6 text-blue-600" />}
        />
        
        <MetricCard
          title="Up Market Capture"
          metric={metrics.upCapture}
          icon={<Activity className="h-6 w-6 text-blue-600" />}
        />
        
        <MetricCard
          title="Down Market Capture"
          metric={metrics.downCapture}
          icon={<Target className="h-6 w-6 text-blue-600" />}
        />
        
        <MetricCard
          title="Beta"
          metric={metrics.beta}
          icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
        />
      </div>

      {/* Footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <Shield className="h-6 w-6 text-blue-600 mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Complete Transparency Guarantee
            </h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              Every calculation shown above can be independently verified. Click "Show Your Work™" on any metric 
              to see the complete mathematical process, including formulas, inputs, assumptions, and step-by-step calculations. 
              This level of transparency is required for institutional compliance and builds client trust.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};