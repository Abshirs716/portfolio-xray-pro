// src/components/portfolio/CustomMappingWizard.tsx - Visual Field Mapping Interface

import React, { useState } from 'react';
import { ArrowRight, Check, X, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomMappingWizardProps {
  csvHeaders: string[];
  sampleData: Record<string, string>[];
  onMappingComplete: (mappings: Record<string, string>) => void;
  onCancel: () => void;
}

export const CustomMappingWizard: React.FC<CustomMappingWizardProps> = ({
  csvHeaders,
  sampleData,
  onMappingComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [mappings, setMappings] = useState<Record<string, string>>({
    symbol: '',
    description: '',
    shares: '',
    price: '',
    marketValue: '',
    costBasis: ''
  });

  const requiredFields = [
    { key: 'symbol', label: 'Stock Symbol/Ticker', required: true, example: 'AAPL, MSFT, etc.' },
    { key: 'description', label: 'Company Name/Description', required: false, example: 'Apple Inc.' },
    { key: 'shares', label: 'Quantity/Shares', required: true, example: '100, 50.5' },
    { key: 'price', label: 'Current Price', required: false, example: '$150.25' },
    { key: 'marketValue', label: 'Market/Position Value', required: false, example: '$15,025.00' },
    { key: 'costBasis', label: 'Cost Basis', required: false, example: '$12,000.00' }
  ];

  const handleMapping = (field: string, header: string) => {
    // Check if header is already mapped to another field
    const existingMapping = Object.entries(mappings).find(([k, v]) => v === header && k !== field);
    
    if (existingMapping) {
      // Remove the existing mapping
      setMappings(prev => ({
        ...prev,
        [existingMapping[0]]: '',
        [field]: header
      }));
    } else {
      setMappings(prev => ({
        ...prev,
        [field]: header
      }));
    }
  };

  const isValidMapping = () => {
    // Must have at least symbol and shares mapped
    return mappings.symbol !== '' && mappings.shares !== '';
  };

  const getSampleValue = (header: string) => {
    if (sampleData.length > 0 && sampleData[0][header]) {
      return sampleData[0][header];
    }
    return 'N/A';
  };

  const getMappedField = (header: string) => {
    const entry = Object.entries(mappings).find(([_, value]) => value === header);
    return entry ? requiredFields.find(f => f.key === entry[0])?.label : null;
  };

  const handleComplete = () => {
    // Filter out empty mappings
    const finalMappings = Object.entries(mappings)
      .filter(([_, value]) => value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    onMappingComplete(finalMappings);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Map Your CSV Fields</h3>
        <p className="text-gray-600">
          Drag and drop or click to map your CSV columns to portfolio fields
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Required Fields */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Portfolio Fields</h4>
          <div className="space-y-3">
            {requiredFields.map(field => (
              <div
                key={field.key}
                className={`p-4 rounded-lg border-2 transition-all ${
                  mappings[field.key] 
                    ? 'bg-green-50 border-green-300' 
                    : field.required
                    ? 'bg-yellow-50 border-yellow-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-gray-900">{field.label}</span>
                    {field.required && (
                      <span className="ml-2 text-xs text-red-600 font-medium">REQUIRED</span>
                    )}
                  </div>
                  {mappings[field.key] && (
                    <Check className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">Example: {field.example}</p>
                {mappings[field.key] ? (
                  <div className="flex items-center justify-between bg-white rounded p-2">
                    <span className="text-sm font-medium text-green-800">
                      Mapped to: {mappings[field.key]}
                    </span>
                    <button
                      onClick={() => handleMapping(field.key, '')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <select
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    value=""
                    onChange={(e) => handleMapping(field.key, e.target.value)}
                  >
                    <option value="">Select a column...</option>
                    {csvHeaders.filter(h => !getMappedField(h)).map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: CSV Headers */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Your CSV Columns</h4>
          <div className="space-y-3">
            {csvHeaders.map(header => {
              const mappedTo = getMappedField(header);
              return (
                <div
                  key={header}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    mappedTo 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{header}</span>
                    {mappedTo && (
                      <ArrowRight className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Sample: {getSampleValue(header)}
                  </p>
                  {mappedTo && (
                    <div className="bg-white rounded p-2">
                      <span className="text-sm font-medium text-green-800">
                        → {mappedTo}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!isValidMapping() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <h5 className="font-medium text-yellow-800 mb-1">Required Fields Missing</h5>
              <p className="text-sm text-yellow-700">
                Please map at least "Stock Symbol" and "Quantity/Shares" to continue.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Preview Your Mapping</h3>
        <p className="text-gray-600">
          Review how your data will be imported
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Mapping Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(mappings)
            .filter(([_, value]) => value !== '')
            .map(([key, value]) => {
              const field = requiredFields.find(f => f.key === key);
              return (
                <div key={key} className="flex items-center bg-white rounded-lg p-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{field?.label}</p>
                    <p className="font-medium text-gray-900">{value}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 mx-3" />
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Sample Value</p>
                    <p className="font-medium text-gray-900">{getSampleValue(value)}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {sampleData.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Sample Data Preview</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {mappings.symbol && <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Symbol</th>}
                  {mappings.description && <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>}
                  {mappings.shares && <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Shares</th>}
                  {mappings.price && <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>}
                  {mappings.marketValue && <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Market Value</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sampleData.slice(0, 3).map((row, index) => (
                  <tr key={index}>
                    {mappings.symbol && <td className="px-4 py-2 text-sm text-gray-900">{row[mappings.symbol]}</td>}
                    {mappings.description && <td className="px-4 py-2 text-sm text-gray-900">{row[mappings.description]}</td>}
                    {mappings.shares && <td className="px-4 py-2 text-sm text-gray-900">{row[mappings.shares]}</td>}
                    {mappings.price && <td className="px-4 py-2 text-sm text-gray-900">{row[mappings.price]}</td>}
                    {mappings.marketValue && <td className="px-4 py-2 text-sm text-gray-900">{row[mappings.marketValue]}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Mapping Complete!</h3>
        <p className="text-gray-600">
          Your custom format is ready to import
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-semibold text-green-800 mb-3">Ready to Import</h4>
        <ul className="space-y-2">
          <li className="flex items-center text-green-700">
            <Check className="h-4 w-4 mr-2" />
            <span>{Object.values(mappings).filter(v => v !== '').length} fields mapped successfully</span>
          </li>
          <li className="flex items-center text-green-700">
            <Check className="h-4 w-4 mr-2" />
            <span>{sampleData.length} rows ready to process</span>
          </li>
          <li className="flex items-center text-green-700">
            <Check className="h-4 w-4 mr-2" />
            <span>Custom format validated</span>
          </li>
        </ul>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h5 className="font-medium text-blue-800 mb-1">Save as Template (Coming Soon)</h5>
            <p className="text-sm text-blue-700">
              In the future, you'll be able to save this mapping as a template for reuse with similar files.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Custom Format Mapping Wizard</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-4">
            {[1, 2, 3].map(step => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {currentStep > step ? <Check className="h-4 w-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-24 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex items-center justify-center mt-2 text-sm text-gray-600">
            <span className={currentStep === 1 ? 'font-semibold' : ''}>Map Fields</span>
            <span className="mx-4">→</span>
            <span className={currentStep === 2 ? 'font-semibold' : ''}>Preview</span>
            <span className="mx-4">→</span>
            <span className={currentStep === 3 ? 'font-semibold' : ''}>Complete</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            
            <div className="flex items-center space-x-3">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={currentStep === 1 && !isValidMapping()}
                  className={`px-6 py-2 rounded-lg flex items-center ${
                    currentStep === 1 && !isValidMapping()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Apply Mapping
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};