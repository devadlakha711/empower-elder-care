import React, { useState, useEffect } from 'react';

const Debug = () => {
  const [errors, setErrors] = useState<string[]>([]);
  
  useEffect(() => {
    // Check if localStorage is available
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      setErrors(prev => [...prev, "✅ LocalStorage is working"]);
    } catch (error) {
      setErrors(prev => [...prev, "❌ LocalStorage error: " + String(error)]);
    }
    
    // Check if crypto.randomUUID is available
    try {
      const uuid = crypto.randomUUID();
      setErrors(prev => [...prev, `✅ crypto.randomUUID() is working: ${uuid}`]);
    } catch (error) {
      setErrors(prev => [...prev, "❌ crypto.randomUUID() error: " + String(error)]);
    }
    
    // Check React version
    try {
      setErrors(prev => [...prev, `✅ React version: ${React.version}`]);
    } catch (error) {
      setErrors(prev => [...prev, "❌ Failed to get React version"]);
    }
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
        
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Environment Checks:</h2>
          <ul className="space-y-1 list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index} className={error.startsWith('❌') ? 'text-red-600' : 'text-green-600'}>
                {error}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <h2 className="text-lg font-semibold mb-2">Browser Information:</h2>
          <div className="text-sm space-y-1">
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Window Size:</strong> {window.innerWidth} x {window.innerHeight}</p>
            <p><strong>Device Pixel Ratio:</strong> {window.devicePixelRatio}</p>
          </div>
        </div>
        
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default Debug; 
