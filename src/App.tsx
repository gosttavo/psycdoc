import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RootLayout from './layout/RootLayout';
import { AuthProvider } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import { DarkModeProvider } from './hooks/useDarkMode';

const Home = React.lazy(() => import('./pages/Home'));
const Users = React.lazy(() => import('./pages/Users'));
const Patients = React.lazy(() => import('./pages/Patients'));
const Settings = React.lazy(() => import('./pages/Settings'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const Login = React.lazy(() => import('./pages/Login'));

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <DarkModeProvider>
            <Routes>
              {/* <Route path="/login" element={<Login />} /> */}
              
              {/* <Route element={<ProtectedRoute />}> */}
                <Route path="/" element={<RootLayout />}>
                  <Route index element={<Home />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              {/* </Route> */}
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DarkModeProvider>
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;