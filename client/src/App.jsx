import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminDashboardPage from './pages/AdminDashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import DepartmentsPage from './pages/DepartmentsPage';
import DepartmentsDashboardPage from './pages/DepartmentsDashboardPage';
import ReviewsPage from './pages/ReviewsPage';
import NewReviewPage from './pages/NewReviewPage';
import DailyWorkPage from './pages/DailyWorkPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/departments/dashboard" element={<DepartmentsDashboardPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/reviews/new" element={<NewReviewPage />} />
            <Route path="/dailywork" element={<DailyWorkPage />} />
            <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
