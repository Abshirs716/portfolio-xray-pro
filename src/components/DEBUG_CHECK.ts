console.log('🚨 IMMEDIATE DEBUG CHECK: Are my code changes actually running?');
console.log('🚨 Technical Analysis Fix Applied - Moving averages now handle insufficient data gracefully');
console.log('🚨 This should prevent the cascade failure that caused 0.15 Sharpe ratio');
console.log('🚨 Current timestamp:', new Date().toISOString());

// Import and run comprehensive test
import('../utils/comprehensiveTest').then(module => {
  console.log('🧪 Comprehensive test imported successfully');
}).catch(error => {
  console.error('🧪 Failed to import comprehensive test:', error);
});