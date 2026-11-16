import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <header className="border-b border-neutral-200 py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-rose-500">airbnb</div>
      </header>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<div className="p-8 text-center text-gray-500">Welcome to Airbnb Clone</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
