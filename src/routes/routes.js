// src/routes/routes.js
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AuthLayout from '../layouts/auth/index';
import MainLayout from '../layouts/main/index';

// Lazy load de páginas
const NotFoundPage = lazy(() => import('../pages/not-found'));
const LoginPage = lazy(() => import('../features/auth/login'));
const RegisterPage = lazy(() => import('../features/auth/register'));
const DashboardPage = lazy(() => import('../features/dashboard'));
const EditProfilePage = lazy(() => import('../features/profile/user-profile'));
const PublicTermsPage = lazy(() => import('../features/terms/terms-and-conditions'));
const PublicPrivacyPage = lazy(() => import('../features/terms/privacy-policy'));
const PublicRequestRecoverPasswordPage = lazy(() => import('../features/auth/recover-password/index'));
const PublicResetPasswordPage = lazy(() => import('../features/auth/recover-password/reset-password'));
const ShortLinkPage = lazy(() => import('../features/shortlink'));
const CreateShortLinkPage = lazy(() => import('../features/shortlink/create'));
const RulesPage = lazy(() => import('../features/rules'));
const RedirectPage = lazy(() => import('../features/redirect'));

const routes = [
  {
    path: '/',
    element: <Navigate to="/auth/login" />,
  },
  {
    path: '/auth/login',
    element: <AuthLayout><LoginPage /></AuthLayout>,
  },
  {
    path: '/auth/register',
    element: <AuthLayout><RegisterPage /></AuthLayout>,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <MainLayout title={'Tablero'}><DashboardPage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/profile/edit',
    element: (
      <PrivateRoute>
        <MainLayout title={'Perfil'}><EditProfilePage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/shortlink',
    element: (
      <PrivateRoute>
        <MainLayout title={'URLs Cortas'}><ShortLinkPage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/shortlink/create',
    element: (
      <PrivateRoute>
        <MainLayout title={'Crear URL'}><CreateShortLinkPage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/shortlinks/:id/rules',
    element: (
      <PrivateRoute>
        <MainLayout title={'Reglas'}><RulesPage /></MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: '/r/:code',
    element: (
      <RedirectPage />
    ),
  },
  {
    path: '/terms',
    element: (
      <PublicTermsPage />
    ),
  },
  {
    path: '/privacy',
    element: (
      <PublicPrivacyPage />
    ),
  },
  {
    path: '/auth/request-recover-password',
    element: (
      <PublicRequestRecoverPasswordPage />
    ),
  },
  {
    path: '/auth/reset-password',
    element: (
      <PublicResetPasswordPage />
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;
