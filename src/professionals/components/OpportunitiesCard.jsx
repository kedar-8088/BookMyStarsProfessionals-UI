import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { sessionManager } from '../../API/authApi';
import profileFlowManager from '../../utils/profileFlowManager';
import { getProfessionalSkillsByProfileId } from '../../API/professionalSkillsApi';

const OpportunitiesCard = () => {
  const defaultOptions = useMemo(
    () => [
      'Acting', 'Modeling', 'Filmmaking', 'Photography', 'Music',
      'Dancing', 'Voice Acting', 'Stunt Work', 'Production',
      'Editing', 'Directing', 'Casting'
    ],
    []
  );

  const [options, setOptions] = useState(defaultOptions);
  const [selectedOption, setSelectedOption] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadSkills = async () => {
      try {
        if (!sessionManager.isLoggedIn()) {
          return;
        }

        let profileId = sessionManager.getProfessionalsProfileId();

        if (!profileId) {
          const initResult = await profileFlowManager.initialize();

          profileId =
            sessionManager.getProfessionalsProfileId() ||
            initResult.profileId;

          if (!profileId) {
            const profileResult = await profileFlowManager.createOrGetProfile();
            if (profileResult?.success && profileResult.profileId) {
              profileId = profileResult.profileId;
              sessionManager.setProfessionalsProfileId(profileId);
            }
          }
        }

        if (!profileId) {
          return;
        }

        const skillsResponse = await getProfessionalSkillsByProfileId(profileId);

        const skillNames = Array.isArray(skillsResponse?.data)
          ? skillsResponse.data
              .map(skill => skill?.skillName?.trim())
              .filter(Boolean)
          : Array.isArray(skillsResponse?.data?.data)
            ? skillsResponse.data.data
                .map(skill => skill?.skillName?.trim())
                .filter(Boolean)
            : [];

        if (isMounted && skillNames.length > 0) {
          const uniqueSkills = Array.from(new Set(skillNames));
          setOptions(uniqueSkills);
          setSelectedOption(prev => (prev < uniqueSkills.length ? prev : 0));
        }
      } catch (error) {
        console.warn('Unable to load professional skills for opportunities list:', error);
      } finally {
        // No-op: we silently fall back to default options on error
      }
    };

    loadSkills();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedOption >= options.length) {
      setSelectedOption(0);
    }
  }, [options, selectedOption]);

  const handleOptionClick = (index) => {
    setSelectedOption(index);
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: { xs: '100%', sm: 600, md: 800, lg: 1000, xl: 1200 }, 
      mx: 'auto',
      px: { xs: 1, sm: 2, md: 3, lg: 4 }
    }}>
      {/* Title Section - Above the card */}
      <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
            lineHeight: '140%',
            letterSpacing: '0%',
            color: '#E94E8B',
            textAlign: 'center'
          }}
        >
          Discover Exciting Opportunities
        </Typography>
        {/* Horizontal Line */}
        <Box
          sx={{
            width: { xs: '100%', sm: '80%', md: '90%', lg: '95%', xl: '100%' },
            height: 0,
            borderTop: '1px solid #E94E8B',
            opacity: 1,
            mx: 'auto',
            mt: 2
          }}
        />
      </Box>
      
      {/* The search bar and filter dropdowns have been removed as per request. */}

      {/* Option Buttons */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(3, minmax(0, 1fr))',
            md: 'repeat(4, minmax(0, 1fr))',
            lg: 'repeat(5, minmax(0, 1fr))',
            xl: 'repeat(6, minmax(0, 1fr))'
          },
          gap: { xs: 1, sm: 1.5, md: 2 },
          alignItems: 'stretch',
          justifyItems: 'center',
          maxWidth: { xs: '100%', sm: 560, md: 720, lg: 920, xl: 1080 },
          mx: 'auto'
        }}
      >
        {options.map((option, index) => {
          const isSelected = selectedOption === index;
          return (
            <Chip
              key={index}
              label={option}
              onClick={() => handleOptionClick(index)}
              sx={{
                width: '100%',
                maxWidth: { xs: 140, sm: 160, md: 180 },
                minHeight: { xs: 36, sm: 40, md: 44, lg: 48 },
                background: isSelected
                  ? 'linear-gradient(90deg, #DA498D 0%, #69247C 100%)'
                  : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#E94E8B',
                border: '2px solid',
                borderColor: isSelected ? 'transparent' : '#DA498D',
                borderRadius: { xs: '999px', sm: '999px' },
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontSize: { xs: '11px', sm: '12px', md: '13px', lg: '14px' },
                letterSpacing: '0.02em',
                justifyContent: 'center',
                px: { xs: 0.5, sm: 1, md: 1.5 },
                boxShadow: isSelected
                  ? '0 10px 24px rgba(218, 73, 141, 0.25)'
                  : '0 4px 12px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: isSelected
                    ? 'linear-gradient(90deg, #C9397D 0%, #59236C 100%)'
                    : 'linear-gradient(90deg, rgba(218,73,141,0.12) 0%, rgba(105,36,124,0.12) 100%)',
                  borderColor: isSelected ? 'transparent' : '#C9397D',
                  boxShadow: '0 12px 26px rgba(218, 73, 141, 0.2)'
                }
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default OpportunitiesCard;
