import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard/DashboardPage";
import VetMap from "./pages/VetMap";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<SigninPage />} />
        <Route exact path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vet-map" element={<VetMap />} />
      </Routes>
    </Router>
  );
}

export default App;
