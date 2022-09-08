import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SearchClientContext from './context/SearchClientContext';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchClientContext>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </SearchClientContext>
    </BrowserRouter>
  </React.StrictMode>
);
