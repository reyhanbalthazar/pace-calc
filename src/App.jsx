import React from 'react';
import PaceCalculator from './components/PaceCalculator';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PaceCalculator />

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm p-4">
        <p>PaceCalc v1.0 • Built with React & Tailwind CSS</p>
        <p className="mt-1">For runners by runners</p>
      </footer>
    </div>
  );
}

export default App;