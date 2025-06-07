import React from 'react';
import { Button } from '@/components/ui/button';

const TestApp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Test Application</h1>
        <p className="mb-4">If you can see this, the basic React application is working!</p>
        <Button 
          onClick={() => alert('Button clicked!')}
          className="w-full"
        >
          Click Me
        </Button>
      </div>
    </div>
  );
};

export default TestApp; 
