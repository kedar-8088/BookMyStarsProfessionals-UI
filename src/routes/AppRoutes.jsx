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
  UserLandingRoute,
  SharedProfileRoute
} from './components';

import Dashboard from '../professionals/pages/Dashboard';
import Dashboard1c from '../lms/pages/dashbaord1c';
import ModulesPage from '../lms/pages/modules';
import RegisterPage from '../agency/pages/RegisterPage';
import OtpVerificationPage from '../agency/pages/OtpVerificationPage';
import BasicDetails from '../agency/pages/BasicDetails';
import VerifyAgency from '../agency/pages/VerifyAgency';
import AgencyDashboard from '../agency/pages/AgencyDashboard';
import JobCard from '../job/jobcard';


import LandingPage from '../Hiring-talent/Pages/landingPage';
import HiringFor from '../Hiring-talent/Pages/HiringFor';
import YourProject from '../Hiring-talent/Pages/YourProject';

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
      <Route path="/profile/:profileId" element={<SharedProfileRoute />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/signup" element={<SignupRoute />} />
      <Route path="/otp-verification" element={<OtpVerificationRoute />} />
      <Route path="/UserLanding" element={<UserLandingRoute />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/lms" element={<Dashboard1c />} />
      <Route path="/dashboard/lms/modules" element={<ModulesPage />} />
      <Route path="/dashboard/jobs" element={<JobCard />} />
      <Route path="/hire-talent" element={<LandingPage />} />
      <Route path="/hire-talent/hiring-for" element={<HiringFor />} />
      <Route path="/hire-talent/your-project" element={<YourProject />} />
      <Route path="/agency/register" element={<RegisterPage />} />
      <Route path="/agency/otp-verification" element={<OtpVerificationPage />} />
      <Route path="/agency/basicdetails" element={<BasicDetails />} />
      <Route path="/agency/verifyagency" element={<VerifyAgency />} />
      <Route path="/agency/dashboard" element={<AgencyDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
