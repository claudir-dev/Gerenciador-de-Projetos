import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google'; // <-- importar

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="157600458639-rrttikisl8pasrlgh7q2kc3l15pfer6t.apps.googleusercontent.com"> {/* <-- envolver */}
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
