import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DarkModeProvider } from './hooks/useDarkMode';
import { ToastProvider } from './contexts/ToastContext';
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './api/queryClient';
import RootLayout from './layout/RootLayout';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';

const Home = React.lazy(() => import('./pages/Home'));
const Users = React.lazy(() => import('./pages/Users'));
const Patients = React.lazy(() => import('./pages/Patients'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Login = React.lazy(() => import('./pages/Login'));
const Profile = React.lazy(() => import('./pages/Profile'));
const ClinicalEncounterPage = React.lazy(() => import('./pages/ClinicalEncouter'));
const ViewEncounter = React.lazy(() => import('./pages/ViewEncounter'));

const App: React.FC = () => {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <DarkModeProvider>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="/" element={<RootLayout />}>
                        <Route index element={<Home />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/:id/clinicalEncounter" element={<ClinicalEncounterPage />} />
                        <Route path="/:id/viewEncounter" element={<ViewEncounter />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/profile" element={<Profile />} />
                      </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
              </DarkModeProvider>
            </Suspense>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </Router>
  );
};

export default App;