import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { getAllSkills, getSkillsWithPagination } from '../../API/skillsApi';

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
        let allSkills = [];
        
        // First try getAllSkills
        try {
          const skillsResponse = await getAllSkills();
          console.log('getAllSkills response:', skillsResponse);
          
          if (skillsResponse && skillsResponse.data) {
            const responseData = skillsResponse.data;
            
            // Check different response structures
            if (responseData.code === 200 || responseData.code === 1000) {
              let skillsData = [];
              
              if (responseData.data) {
                if (Array.isArray(responseData.data)) {
                  skillsData = responseData.data;
                } else if (responseData.data.content && Array.isArray(responseData.data.content)) {
                  skillsData = responseData.data.content;
                } else if (responseData.data.data && Array.isArray(responseData.data.data)) {
                  skillsData = responseData.data.data;
                }
              }
              
              if (skillsData.length > 0) {
                allSkills = skillsData;
                console.log(`✅ getAllSkills returned ${allSkills.length} skills`);
              }
            }
          }
        } catch (getAllError) {
          console.warn('getAllSkills failed, trying pagination:', getAllError);
          
          // Fallback to pagination if getAllSkills fails
          try {
            let pageNumber = 0;
            const pageSize = 1000; // Large page size to fetch all at once
            let hasMore = true;
            
            while (hasMore && isMounted) {
              const paginatedResponse = await getSkillsWithPagination(pageNumber, pageSize);
              
              if (paginatedResponse && paginatedResponse.data) {
                const responseData = paginatedResponse.data;
                let skillsData = [];
                
                if (responseData.code === 200 || responseData.code === 1000) {
                  if (responseData.data) {
                    if (Array.isArray(responseData.data)) {
                      skillsData = responseData.data;
                    } else if (responseData.data.content && Array.isArray(responseData.data.content)) {
                      skillsData = responseData.data.content;
                      hasMore = pageNumber < (responseData.data.totalPages - 1);
                    } else if (responseData.data.data && Array.isArray(responseData.data.data)) {
                      skillsData = responseData.data.data;
                    }
                  }
                  
                  if (skillsData.length > 0) {
                    allSkills = [...allSkills, ...skillsData];
                    pageNumber++;
                  } else {
                    hasMore = false;
                  }
                } else {
                  hasMore = false;
                }
              } else {
                hasMore = false;
              }
            }
            
            console.log(`✅ Pagination returned ${allSkills.length} skills`);
          } catch (paginationError) {
            console.error('Error fetching skills with pagination:', paginationError);
          }
        }

        if (isMounted && allSkills.length > 0) {
          // Extract skill names and remove duplicates
          const skillNames = allSkills
            .map(skill => {
              // Handle different possible field names
              return skill?.skillName?.trim() || 
                     skill?.name?.trim() || 
                     skill?.skill?.trim() || 
                     '';
            })
            .filter(Boolean);
          
          // Remove duplicates based on skill name
          const uniqueSkills = Array.from(new Set(skillNames));
          
          if (uniqueSkills.length > 0) {
            setOptions(uniqueSkills);
            setSelectedOption(prev => (prev < uniqueSkills.length ? prev : 0));
            console.log(`✅ Loaded ${uniqueSkills.length} unique skills from database`);
          }
        } else if (isMounted) {
          console.warn('⚠️ No skills were loaded from database, using default options');
        }
      } catch (error) {
        console.error('Error loading skills from database:', error);
        // Silently fall back to default options on error
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
