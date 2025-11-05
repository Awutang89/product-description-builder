import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { Templates } from './pages/Templates';
import { Editor } from './pages/Editor';
import { ImageCompressor } from './pages/ImageCompressor';

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col bg-gray-50">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navigation />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <Navigation />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/templates"
            element={
              <>
                <Navigation />
                <Templates />
              </>
            }
          />
          <Route
            path="/image-compressor"
            element={
              <>
                <Navigation />
                <ImageCompressor />
              </>
            }
          />
          <Route path="/editor/:projectId" element={<Editor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
