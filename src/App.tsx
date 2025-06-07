import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Learning from "./pages/Learning";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import CaregiverDashboard from "./pages/dashboards/CaregiverDashboard";
import ClientDashboard from "./pages/dashboards/ClientDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import TechDashboard from "./pages/dashboards/TechDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import CounselorDashboard from "./pages/dashboards/CounselorDashboard";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Debug from "./pages/Debug";
import Providers from "./components/Providers";

const App = () => (
  <Providers>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="/" element={
          <Layout>
            <Index />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />
        <Route path="/services" element={
          <Layout>
            <Services />
          </Layout>
        } />
        <Route path="/learning" element={
          <Layout>
            <Learning />
          </Layout>
        } />
        <Route path="/jobs" element={
          <Layout>
            <Jobs />
          </Layout>
        } />
        <Route path="/profile" element={
          <Layout>
            <Profile />
          </Layout>
        } />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="caregiver" element={<CaregiverDashboard />} />
          <Route path="client" element={<ClientDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="tech" element={<TechDashboard />} />
          <Route path="doctor" element={<DoctorDashboard />} />
          <Route path="counselor" element={<CounselorDashboard />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </Providers>
);

export default App;
