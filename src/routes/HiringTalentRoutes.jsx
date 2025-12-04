import React, { lazy, Suspense } from 'react';
import Loadable from 'ui-component/Loadable';

// Custom Error Component
const CustomErrorElement = ({ error }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f5f5f5'
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '40px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    maxWidth: '500px'
                }}
            >
                <h1 style={{ color: '#d32f2f', marginBottom: '20px' }}>⚠️ Something went wrong!</h1>
                <p style={{ marginBottom: '20px', color: '#666' }}>
                    We're sorry, but something unexpected happened while loading this page.
                </p>
                {error && (
                    <details style={{ marginBottom: '20px', textAlign: 'left' }}>
                        <summary style={{ cursor: 'pointer', color: '#1976d2' }}>Error Details</summary>
                        <pre
                            style={{
                                backgroundColor: '#f5f5f5',
                                padding: '10px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                overflow: 'auto',
                                marginTop: '10px'
                            }}
                        >
                            {error.message || 'Unknown error occurred'}
                        </pre>
                    </details>
                )}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Refresh Page
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        style={{
                            backgroundColor: '#666',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

// hiring-talent routing
const HiringTalentDefault = Loadable(lazy(() => import('views/hiring-talent')));
const HiringTalentBanner = Loadable(lazy(() => import('views/hiring-talent/Banner')));
const HiringTalentCategory = Loadable(lazy(() => import('views/utilities/Professionals/Category')));
const HiringTalentCountry = Loadable(lazy(() => import('views/utilities/Professionals/Country')));
const HiringTalentCity = Loadable(lazy(() => import('views/utilities/Professionals/City')));
const HiringTalentState = Loadable(lazy(() => import('views/utilities/Professionals/State')));
const HiringTalentBodyType = Loadable(lazy(() => import('views/utilities/Professionals/BodyType')));
const HiringTalentCommunicationLanguage = Loadable(lazy(() => import('views/utilities/Professionals/CommunicationLanguage')));
const HiringTalentSkills = Loadable(lazy(() => import('views/utilities/Professionals/Skills')));
const HiringTalentEyeColor = Loadable(lazy(() => import('views/utilities/Professionals/EyeColor')));
const HiringTalentHairColor = Loadable(lazy(() => import('views/utilities/Professionals/HairColor')));
const HiringTalentHighestQualification = Loadable(lazy(() => import('views/utilities/Professionals/HighestQualification')));
const HiringTalentMaritalStatus = Loadable(lazy(() => import('views/utilities/Professionals/MaritalStatus')));
const HiringTalentShoeSize = Loadable(lazy(() => import('views/utilities/Professionals/ShoeSize')));
const HiringTalentSkinColor = Loadable(lazy(() => import('views/utilities/Professionals/SkinColor')));
const HiringTalentManagement = Loadable(lazy(() => import('views/hiring-talent/HiringTalentManagement')));
const HiringTalentVerification = Loadable(lazy(() => import('views/hiring-talent/Verification')));
const HiringTalentPayments = Loadable(lazy(() => import('views/hiring-talent/Payments')));
const HiringTalentSettings = Loadable(lazy(() => import('views/hiring-talent/Settings')));

const HiringTalentRoutes = {
    path: 'hiring-talent',
    errorElement: <CustomErrorElement />,
    children: [
        { path: '', element: <HiringTalentDefault />, errorElement: <CustomErrorElement /> },
        { path: 'banner', element: <HiringTalentBanner />, errorElement: <CustomErrorElement /> },
        { path: 'category', element: <HiringTalentCategory />, errorElement: <CustomErrorElement /> },
        { path: 'country', element: <HiringTalentCountry />, errorElement: <CustomErrorElement /> },
        { path: 'city', element: <HiringTalentCity />, errorElement: <CustomErrorElement /> },
        { path: 'state', element: <HiringTalentState />, errorElement: <CustomErrorElement /> },
        { path: 'body-type', element: <HiringTalentBodyType />, errorElement: <CustomErrorElement /> },
        { path: 'communication-language', element: <HiringTalentCommunicationLanguage />, errorElement: <CustomErrorElement /> },
        
        { path: 'skills', element: <HiringTalentSkills />, errorElement: <CustomErrorElement /> },
        { path: 'eye-color', element: <HiringTalentEyeColor />, errorElement: <CustomErrorElement /> },
        { path: 'hair-color', element: <HiringTalentHairColor />, errorElement: <CustomErrorElement /> },
        { path: 'highest-qualification', element: <HiringTalentHighestQualification />, errorElement: <CustomErrorElement /> },
        { path: 'marital-status', element: <HiringTalentMaritalStatus />, errorElement: <CustomErrorElement /> },
        { path: 'shoe-size', element: <HiringTalentShoeSize />, errorElement: <CustomErrorElement /> },
        { path: 'skin-color', element: <HiringTalentSkinColor />, errorElement: <CustomErrorElement /> },
        { path: 'management', element: <HiringTalentManagement />, errorElement: <CustomErrorElement /> },
        { path: 'verification', element: <HiringTalentVerification />, errorElement: <CustomErrorElement /> },
        { path: 'payments', element: <HiringTalentPayments />, errorElement: <CustomErrorElement /> },
        { path: 'settings', element: <HiringTalentSettings />, errorElement: <CustomErrorElement /> }
    ]
};

export default HiringTalentRoutes;

