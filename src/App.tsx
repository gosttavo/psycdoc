import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DarkModeProvider } from './hooks/useDarkMode';
import RootLayout from './layout/RootLayout';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './contexts/ToastContext';

const Home = React.lazy(() => import('./pages/Home'));
const Users = React.lazy(() => import('./pages/Users'));
const Patients = React.lazy(() => import('./pages/Patients'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Login = React.lazy(() => import('./pages/Login'));
const ClinicalEncounter = React.lazy(() => import('./pages/ClinicalEncouter'));

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <DarkModeProvider>
          <ToastProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<RootLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/patients" element={<Patients />} />
                    <Route path="/:id/clinicalEncounter" element={<ClinicalEncounter />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ToastProvider>
          </DarkModeProvider>
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;