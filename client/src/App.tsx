import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BuilderPage from './pages/BuilderPage';
import { BuilderProvider } from './context/BuilderContext';
import {Home} from './pages/Home'

function App() {

  return (
    <Router>
      <BuilderProvider>
        <div className="min-h-screen bg-gray-950 text-gray-100">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/home" element={<Home/>} />

          </Routes>
        </div>
      </BuilderProvider>
    </Router>
  );
}

export default App;