import React from 'react';
import './App.css';
import MainRouter from './MainRouter';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './globalState';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
