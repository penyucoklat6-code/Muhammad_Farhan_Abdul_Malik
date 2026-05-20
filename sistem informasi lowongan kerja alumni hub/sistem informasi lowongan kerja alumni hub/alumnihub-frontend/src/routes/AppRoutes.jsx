import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import VerifyOtpPage from '../pages/public/VerifyOtpPage';
import JobsPage from '../pages/public/JobsPage';
import JobDetailPage from '../pages/public/JobDetailPage';
import CompaniesPage from '../pages/public/CompaniesPage';
import AboutPage from '../pages/public/AboutPage';

// Dashboard Pages
import ProfilePage from '../pages/dashboard/ProfilePage';
import ManageJobsPage from '../pages/dashboard/mahasiswa/ManageJobsPage';
import JobFormPage from '../pages/dashboard/mahasiswa/JobFormPage';
import ApplicationsPage from '../pages/dashboard/mahasiswa/ApplicationsPage';
import BookmarksPage from '../pages/dashboard/mahasiswa/BookmarksPage';
import NotificationsPage from '../pages/dashboard/mahasiswa/NotificationsPage';

// Kaprodi Dashboard Pages
import OverviewPage from '../pages/dashboard/kaprodi/OverviewPage';
import ApprovalsPage from '../pages/dashboard/kaprodi/ApprovalsPage';
import ActivityLogsPage from '../pages/dashboard/kaprodi/ActivityLogsPage';
import KaprodiManageJobsPage from '../pages/dashboard/kaprodi/ManageJobsPage';
import KaprodiJobFormPage from '../pages/dashboard/kaprodi/KaprodiJobFormPage';
import MitraPage from '../pages/dashboard/kaprodi/MitraPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
      </Route>

      {/* Dashboard Routes with DashboardLayout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Mahasiswa Routes */}
        <Route path="mahasiswa/jobs" element={<ManageJobsPage />} />
        <Route path="mahasiswa/jobs/create" element={<JobFormPage />} />
        <Route path="mahasiswa/jobs/edit/:id" element={<JobFormPage />} />
        <Route path="mahasiswa/applications" element={<ApplicationsPage />} />
        <Route path="mahasiswa/bookmarks" element={<BookmarksPage />} />
        <Route path="mahasiswa/notifications" element={<NotificationsPage />} />

        {/* Kaprodi Routes */}
        <Route path="kaprodi/overview" element={<OverviewPage />} />
        <Route path="kaprodi/jobs" element={<KaprodiManageJobsPage />} />
        <Route path="kaprodi/jobs/create" element={<KaprodiJobFormPage />} />
        <Route path="kaprodi/jobs/edit/:id" element={<KaprodiJobFormPage />} />
        <Route path="kaprodi/mitra" element={<MitraPage />} />
        <Route path="kaprodi/approvals" element={<ApprovalsPage />} />
        <Route path="kaprodi/activity-logs" element={<ActivityLogsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
