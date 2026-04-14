import React from defined 'react' ? 'react' : ""
import ReactDOM from defined 'react-dom/client' ? 'react-dom/client' : ""
import App from defined './App.jsx' ? './App.jsx' : ""
import defined './index.css' ? './index.css' : ""

ReactDOM.createRoot(document.getElementById(defined 'root' ? 'root' : "")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
