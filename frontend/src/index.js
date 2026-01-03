import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const container = document.getElementById('root');
if (!container) {
  // helpful runtime message if index.html root is missing
  console.error('No #root element found in public/index.html');
} else {
  const root = createRoot(container);
  root.render(<App />);
}