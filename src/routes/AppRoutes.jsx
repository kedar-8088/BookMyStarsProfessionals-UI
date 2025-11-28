import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  HomeRoute,
  ProfessionalRoute,
  FeaturesRoute,
  BasicInfoRoute,
  PhysicalDetailsRoute,
  ShowcaseRoute,
  EducationBackgroundRoute,
  PreferencesRoute,
  CompleteProfileRoute,
  LoginRoute,
  SignupRoute,
  OtpVerificationRoute,
  UserLandingRoute
} from './components';
import Dashboard from '../professionals/pages/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/professional" element={<ProfessionalRoute />} />
      <Route path="/features" element={<FeaturesRoute />} />
      <Route path="/basic-info" element={<BasicInfoRoute />} />
      <Route path="/physical-details" element={<PhysicalDetailsRoute />} />
      <Route path="/showcase" element={<ShowcaseRoute />} />
      <Route path="/education-background" element={<EducationBackgroundRoute />} />
      <Route path="/preferences" element={<PreferencesRoute />} />
      <Route path="/complete-profile" element={<CompleteProfileRoute />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/signup" element={<SignupRoute />} />
      <Route path="/otp-verification" element={<OtpVerificationRoute />} />
  <Route path="/UserLanding" element={<UserLandingRoute />} />
  <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};
export default AppRoutes;
