import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import the Provider
import store from './store/store'; // Import your newly created store
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap App inside the Provider and pass the store */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);