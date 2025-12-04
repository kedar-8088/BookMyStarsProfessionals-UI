import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, Grid, Avatar, IconButton, Button, CircularProgress, Alert, Menu, MenuItem } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import BasicInfoNavbar from '../components/BasicInfoNavbar';
import EditIcon from '@mui/icons-material/Edit';
import { Person as PersonIcon, Phone as PhoneIcon, Work as WorkIcon, CalendarToday as CalendarTodayIcon, Favorite as FavoriteIcon, Email as EmailIcon, LocationOn as LocationOnIcon, ArrowDropDown as ArrowDropDownIcon, Language as LanguageIcon } from '@mui/icons-material';
import menImage from '../../assets/images/Men.jpg';
import instagramIcon from '../../assets/images/instagram.png';
import facebookIcon from '../../assets/images/facebook.png';
import youtubeIcon from '../../assets/images/youtube.png';
import linkedinIcon from '../../assets/images/linkedin.png';
import BookMyStarsLogo from '../../assets/images/BookMyStarsLogo.png.png';
import { getProfessionalsProfileById, saveOrUpdateProfessionalsProfile, updateProfessionalsProfile } from '../../API/professionalsProfileApi';
import { sessionManager } from '../../API/authApi';
import profileFlowManager from '../../utils/profileFlowManager';
import { saveOrUpdateProfessionalsProfileByProfessionalsId } from '../../API/professionalsProfileApi';
import { getBasicInfoById, getBasicInfoByEmail } from '../../API/basicInfoApi';
import AuthImage from '../../components/common/AuthImage';
import AuthVideo from '../../components/common/AuthVideo';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { getSkinColor, getHairColor, getEyeColor } from '../../utils/colorMapping';
import { BaseUrl } from '../../BaseUrl';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [headlineAnchorEl, setHeadlineAnchorEl] = useState(null);
  const headlineMenuOpen = Boolean(headlineAnchorEl);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const isFetchingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // Initialize profile ID on mount
  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitializedRef.current) {
      return;
    }

    const initializeProfile = async () => {
      try {
        hasInitializedRef.current = true;
        
        // Check if user is logged in
        if (!sessionManager.isLoggedIn()) {
          navigate('/login');
          return;
        }

        // Initialize profile flow manager
        const initResult = await profileFlowManager.initialize();
        
        // Get profile ID from session or profile flow manager
        let id = sessionManager.getProfessionalsProfileId();
        
        if (!id && initResult.profileId) {
          id = initResult.profileId;
        }

        // If still no profile ID, try to create one
        if (!id) {
          const professionalsId = sessionManager.getProfessionalsId();
          if (professionalsId) {
            console.log('🔄 Creating professionals profile...');
            const createResult = await saveOrUpdateProfessionalsProfileByProfessionalsId(professionalsId, {});
            if (createResult.success && createResult.data?.professionalsProfileId) {
              id = createResult.data.professionalsProfileId;
              console.log('✅ Profile created with ID:', id);
            }
          }
        }

        if (id) {
          setProfileId(id);
          console.log('✅ Using profile ID:', id);
        } else {
          console.error('❌ Could not get or create profile ID');
          setError('Unable to initialize your profile. Please ensure you have completed the basic info step.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing profile:', error);
        setError('Failed to initialize your profile. Please refresh the page.');
        setLoading(false);
        hasInitializedRef.current = false; // Reset on error to allow retry
      }
    };

    initializeProfile();
  }, []); // Empty dependency array - only run once on mount

  const fetchProfileData = useCallback(async () => {
    if (!profileId) {
      setError('Profile ID not available');
      setLoading(false);
      return;
    }

    // Prevent concurrent calls
    if (isFetchingRef.current) {
      console.log('⏸️ Already fetching profile data, skipping...');
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching profile data for ID:', profileId);
      const response = await getProfessionalsProfileById(profileId);
      console.log('📡 Profile API response:', response);
      
      if (response.success && response.data.code === 1000) {
        let profileData = response.data.data;
        console.log('📋 Profile data structure:', profileData);
        console.log('📋 BasicInfo in profile:', profileData.basicInfo);
        
        // Check if basicInfo is missing or incomplete
        if (!profileData.basicInfo || !profileData.basicInfo.fullName) {
          console.log('⚠️ BasicInfo missing or incomplete in profile response');
          
          // Try to get basicInfoId from various possible locations in the profile
          const basicInfoId = 
            profileData.basicInfoId || 
            profileData.basicInfo?.id || 
            profileData.basicInfo?.basicInfoId;
          
          let basicInfoData = null;
          
          // Try fetching by ID first
          if (basicInfoId) {
            console.log('🔄 Fetching basic info separately with ID:', basicInfoId);
            try {
              const basicInfoResponse = await getBasicInfoById(basicInfoId);
              console.log('📡 Basic Info API response:', basicInfoResponse);
              
              if (basicInfoResponse.success && basicInfoResponse.data) {
                // Handle different response structures
                if (basicInfoResponse.data.code === 200 && basicInfoResponse.data.data) {
                  basicInfoData = basicInfoResponse.data.data;
                } else if (basicInfoResponse.data.data) {
                  basicInfoData = basicInfoResponse.data.data;
                } else if (basicInfoResponse.data.id || basicInfoResponse.data.basicInfoId) {
                  basicInfoData = basicInfoResponse.data;
                }
                
                if (basicInfoData) {
                  console.log('✅ Basic info fetched successfully by ID:', basicInfoData);
                }
              }
            } catch (basicInfoError) {
              console.error('❌ Error fetching basic info by ID:', basicInfoError);
            }
          }
          
          // If ID fetch failed, try fetching by email as fallback
          if (!basicInfoData) {
            const email = profileData.professionalsDto?.email || profileData.email;
            if (email) {
              console.log('🔄 Trying to fetch basic info by email:', email);
              try {
                const basicInfoResponse = await getBasicInfoByEmail(email);
                console.log('📡 Basic Info API response (by email):', basicInfoResponse);
                
                // Handle 404 as "not found" - this is expected if basicInfo doesn't exist yet
                if (basicInfoResponse.status === 404) {
                  console.log('ℹ️ Basic info not found for this email (404) - user may need to complete basic info step');
                } else if (basicInfoResponse.success && basicInfoResponse.data) {
                  // Handle different response structures
                  if (basicInfoResponse.data.code === 200 && basicInfoResponse.data.data) {
                    basicInfoData = basicInfoResponse.data.data;
                  } else if (basicInfoResponse.data.data) {
                    basicInfoData = basicInfoResponse.data.data;
                  } else if (basicInfoResponse.data.id || basicInfoResponse.data.basicInfoId) {
                    basicInfoData = basicInfoResponse.data;
                  }
                  
                  if (basicInfoData) {
                    console.log('✅ Basic info fetched successfully by email:', basicInfoData);
                  }
                }
              } catch (basicInfoError) {
                // Only log as error if it's not a 404 (not found is expected)
                if (basicInfoError.status !== 404 && basicInfoError.response?.status !== 404) {
                  console.error('❌ Error fetching basic info by email:', basicInfoError);
                } else {
                  console.log('ℹ️ Basic info not found for this email - user may need to complete basic info step');
                }
              }
            }
          }
          
          // Merge basicInfo into profileData if we found it
          if (basicInfoData) {
            profileData = {
              ...profileData,
              basicInfo: basicInfoData
            };
            console.log('✅ Basic info merged into profile data');
          } else {
            console.log('ℹ️ Basic info not found - this is normal if the user hasn\'t completed the basic info step yet');
            // Set basicInfo to null explicitly so the page knows it doesn't exist
            profileData.basicInfo = null;
          }
        } else {
          console.log('✅ BasicInfo found in profile response');
        }
        
        setProfileData(profileData);
        console.log('✅ Profile data loaded successfully');
      } else {
        const errorMessage = response.data?.message || response.data?.error || 'Failed to fetch profile data';
        console.error('❌ Failed to fetch profile:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('❌ Error fetching profile:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching profile data');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [profileId]);

  // Fetch profile data when profile ID is available
  useEffect(() => {
    if (profileId) {
      fetchProfileData();
    }
  }, [profileId, fetchProfileData]);

  // Refresh profile data when navigating back to this page (location change)
  useEffect(() => {
    if (profileId && location.pathname === '/complete-profile') {
      console.log('🔄 Location changed to complete-profile, refreshing profile data...');
      fetchProfileData();
    }
  }, [location.pathname, profileId, fetchProfileData]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  // Helper function to get full name
  const getFullName = () => {
    if (profileData?.basicInfo?.fullName) {
      return profileData.basicInfo.fullName;
    }
    if (profileData?.professionalsDto?.firstName || profileData?.professionalsDto?.lastName) {
      return `${profileData.professionalsDto.firstName || ''} ${profileData.professionalsDto.lastName || ''}`.trim();
    }
    return 'N/A';
  };

  // Handle Share Profile on Social Media
  const handleShareProfile = () => {
    if (!profileData) {
      Swal.fire({
        icon: 'warning',
        title: 'Profile Not Ready',
        text: 'Please wait for your profile to load before sharing.',
        confirmButtonColor: '#69247C'
      });
      return;
    }

    const profileName = getFullName();
    const profileHeadline = profileData.basicInfo?.profileHeadline || 'Professional Profile';
    const currentUrl = window.location.href;
    const shareText = `Check out ${profileName}'s professional profile: ${profileHeadline}`;

    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
      navigator.share({
        title: `${profileName} - Professional Profile`,
        text: shareText,
        url: currentUrl,
      }).catch((error) => {
        console.log('Error sharing:', error);
      });
    } else {
      // Show social media sharing options
      Swal.fire({
        title: 'Share Profile',
        html: `
          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 20px;">
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}" 
               target="_blank" 
               rel="noopener noreferrer"
               style="display: flex; align-items: center; gap: 10px; padding: 12px; background: #1877F2; color: white; border-radius: 8px; text-decoration: none; font-weight: 500;">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Share on Facebook
            </a>
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}" 
               target="_blank" 
               rel="noopener noreferrer"
               style="display: flex; align-items: center; gap: 10px; padding: 12px; background: #1DA1F2; color: white; border-radius: 8px; text-decoration: none; font-weight: 500;">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Share on Twitter
            </a>
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}" 
               target="_blank" 
               rel="noopener noreferrer"
               style="display: flex; align-items: center; gap: 10px; padding: 12px; background: #0077B5; color: white; border-radius: 8px; text-decoration: none; font-weight: 500;">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Share on LinkedIn
            </a>
            <a href="https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}" 
               target="_blank" 
               rel="noopener noreferrer"
               style="display: flex; align-items: center; gap: 10px; padding: 12px; background: #25D366; color: white; border-radius: 8px; text-decoration: none; font-weight: 500;">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share on WhatsApp
            </a>
            <button onclick="(async function(){try{await navigator.clipboard.writeText('${currentUrl}');Swal.close();Swal.fire({icon:'success',title:'Copied!',text:'Profile link copied to clipboard',confirmButtonColor:'#69247C',timer:2000});}catch(e){Swal.close();Swal.fire({icon:'error',title:'Error',text:'Failed to copy link',confirmButtonColor:'#69247C'});}})()" 
                    style="display: flex; align-items: center; gap: 10px; padding: 12px; background: #6c757d; color: white; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; width: 100%;">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              Copy Link
            </button>
          </div>
        `,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Close',
        cancelButtonColor: '#69247C',
        width: '400px',
        customClass: {
          popup: 'swal2-popup-custom',
          htmlContainer: 'swal2-html-container-custom'
        }
      });
    }
  };

  // Navigation handlers for edit icons
  const handleEditBasicInfo = () => {
    navigate('/basic-info');
  };

  const handleEditPhysicalDetails = () => {
    navigate('/physical-details');
  };

  const handleEditShowcase = () => {
    navigate('/showcase');
  };

  const handleEditSocialMedia = () => {
    navigate('/showcase?section=social-media');
  };

  const handleEditLanguages = () => {
    navigate('/showcase?section=languages');
  };

  const handleEditPhotos = () => {
    navigate('/showcase?section=photos');
  };

  const handleEditVideos = () => {
    navigate('/showcase?section=videos');
  };

  const handleEditEducationBackground = () => {
    navigate('/education-background');
  };

  const handleEditEducation = () => {
    navigate('/education-background?section=education');
  };

  const handleEditWorkExperience = () => {
    navigate('/education-background?section=work-experience');
  };

  const handleEditCertifications = () => {
    navigate('/education-background?section=certifications');
  };

  const handleEditSkills = () => {
    navigate('/education-background?section=skills');
  };

  const handleEditPreferences = () => {
    navigate('/preferences');
  };

  const handleHeadlineMenuOpen = (event) => {
    setHeadlineAnchorEl(event.currentTarget);
  };

  const handleHeadlineMenuClose = () => {
    setHeadlineAnchorEl(null);
  };

  const handleHeadlineSelect = (headline) => {
    // Navigate to basic info page to edit the headline
    handleHeadlineMenuClose();
    navigate('/basic-info');
  };

  // Handle Download Profile as PDF
  const handleDownloadProfile = async () => {
    if (!profileData) {
      Swal.fire({
        icon: 'warning',
        title: 'Profile Not Ready',
        text: 'Please wait for your profile to load before downloading.',
        confirmButtonColor: '#69247C'
      });
      return;
    }

    try {
      // Show loading alert
      Swal.fire({
        title: 'Generating PDF...',
        text: 'Please wait while we prepare your profile document',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Create a temporary container for PDF content
      const pdfContent = document.createElement('div');
      pdfContent.style.position = 'absolute';
      pdfContent.style.left = '-9999px';
      pdfContent.style.width = '210mm'; // A4 width
      pdfContent.style.padding = '20mm';
      pdfContent.style.backgroundColor = 'white';
      pdfContent.style.fontFamily = 'Poppins, Arial, sans-serif';
      pdfContent.style.color = '#333333';

      // Helper function to create section
      const createSection = (title, content) => {
        const section = document.createElement('div');
        section.style.marginBottom = '30px';
        section.innerHTML = `
          <div style="font-size: 22px; font-weight: 600; color: #DA498D; margin-bottom: 10px; border-bottom: 2px solid #69247C; padding-bottom: 10px;">
            ${title}
          </div>
          ${content}
        `;
        return section;
      };

      // Helper function to create info row
      const createInfoRow = (label, value) => {
        return `
          <div style="display: flex; margin-bottom: 10px;">
            <span style="font-weight: 600; color: #333333; min-width: 150px;">${label}:</span>
            <span style="color: #666666;">${value || 'N/A'}</span>
          </div>
        `;
      };

      // Helper function to convert image to base64
      const getImageAsBase64 = async (filePath) => {
        if (!filePath) return null;
        try {
          const user = JSON.parse(sessionStorage.getItem('user') || '{}');
          const response = await axios.get(`${BaseUrl}/file/downloadFile/?filePath=${encodeURIComponent(filePath)}`, {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`
            },
            responseType: 'blob'
          });
          
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(response.data);
          });
        } catch (error) {
          console.error('Error fetching image:', error);
          return null;
        }
      };

      // Helper function to convert local image file to base64
      const getLocalImageAsBase64 = async (imageSrc) => {
        try {
          const response = await fetch(imageSrc);
          const blob = await response.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error('Error converting local image to base64:', error);
          return null;
        }
      };

      // Fetch profile image and logo
      let profileImageBase64 = null;
      if (profileData?.basicInfo?.filePath) {
        profileImageBase64 = await getImageAsBase64(profileData.basicInfo.filePath);
      }

      // Convert logo to base64
      let logoBase64 = null;
      try {
        logoBase64 = await getLocalImageAsBase64(BookMyStarsLogo);
      } catch (error) {
        console.error('Error loading logo:', error);
      }

      // Profile Header with Image and Logo
      const header = document.createElement('div');
      header.style.marginBottom = '30px';
      
      let headerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; width: 100%;">
          <div style="display: flex; align-items: center; gap: 20px; flex: 1;">
      `;
      
      if (profileImageBase64) {
        headerHTML += `
          <img src="${profileImageBase64}" alt="Profile" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid #DA498D; object-fit: cover;" />
        `;
      }
      
      headerHTML += `
            <div style="flex: 1;">
              <h2 style="font-size: 20px; font-weight: 600; color: #333333; margin: 0;">${getFullName()}</h2>
            </div>
          </div>
      `;
      
      // Add logo on the right side
      if (logoBase64) {
        headerHTML += `
          <div style="display: flex; align-items: center; justify-content: flex-end;">
            <img src="${logoBase64}" alt="BookMyStars Logo" style="max-height: 60px; max-width: 180px; height: auto; width: auto; object-fit: contain; background-color: #fff; border-radius: 6px; padding: 4px;" />
          </div>
        `;
      }
      
      headerHTML += `
        </div>
        <div style="border-bottom: 3px solid #DA498D; margin: 20px 0;"></div>
      `;
      
      header.innerHTML = headerHTML;
      pdfContent.appendChild(header);

      // Basic Details Section
      let basicDetailsContent = `
        <div style="margin-bottom: 15px;">
          ${createInfoRow('Name', getFullName())}
          ${createInfoRow('Headline', profileData.basicInfo?.profileHeadline || 'N/A')}
          ${createInfoRow('Phone', profileData.basicInfo?.phoneNo || profileData.professionalsDto?.phoneNumber || 'N/A')}
          ${createInfoRow('Email', profileData.basicInfo?.email || profileData.professionalsDto?.email || 'N/A')}
          ${createInfoRow('Category', profileData.basicInfo?.category?.categoryName || 'N/A')}
          ${createInfoRow('Date of Birth', formatDate(profileData.basicInfo?.dateOfBirth))}
          ${createInfoRow('Marital Status', profileData.basicInfo?.maritalStatus?.maritalStatusName || 'N/A')}
          ${createInfoRow('Location', `${profileData.basicInfo?.state?.stateName || ''}, ${profileData.basicInfo?.city?.cityName || ''}`.replace(/^,\s*|,\s*$/g, '') || 'N/A')}
        </div>
      `;
      pdfContent.appendChild(createSection('Basic Details', basicDetailsContent));

      // Style Profile Details Section
      let physicalDetailsContent = `
        <div style="margin-bottom: 15px;">
          <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 15px;">
            <div style="flex: 1; min-width: 30%;">${createInfoRow('Body Type', profileData.styleProfile?.bodyType?.bodyTypeName || 'N/A')}</div>
            <div style="flex: 1; min-width: 30%;">${createInfoRow('Height', profileData.styleProfile?.height ? `${profileData.styleProfile.height} cm` : 'N/A')}</div>
            <div style="flex: 1; min-width: 30%;">${createInfoRow('Weight', profileData.styleProfile?.weight ? `${profileData.styleProfile.weight} kg` : 'N/A')}</div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 15px;">
            <div style="flex: 1; min-width: 30%;">${createInfoRow('Shoe Size', profileData.styleProfile?.shoeSize?.shoeSizeName || 'N/A')}</div>
            <div style="flex: 1; min-width: 30%;">${createInfoRow('Chest', profileData.styleProfile?.chest ? `${profileData.styleProfile.chest} inch` : 'N/A')}</div>
            <div style="flex: 1; min-width: 30%;">${createInfoRow('Waist', profileData.styleProfile?.waist ? `${profileData.styleProfile.waist} inch` : 'N/A')}</div>
          </div>
          <div style="margin-bottom: 15px;">
            ${createInfoRow('Skin Color', profileData.styleProfile?.skinColor?.skinColorName || 'N/A')}
            ${createInfoRow('Hair Color', profileData.styleProfile?.hairColor?.hairColorName || 'N/A')}
            ${createInfoRow('Eye Color', profileData.styleProfile?.eyeColor?.eyeColorName || 'N/A')}
            ${createInfoRow('Allergies', profileData.styleProfile?.allergies || 'N/A')}
          </div>
        </div>
      `;
      pdfContent.appendChild(createSection('Style Profile Details', physicalDetailsContent));

      // Photos Section (excluding videos) - Show minimum 6 photos (or all if less than 6)
      const photos = profileData.showcase?.files?.filter(file => file.isImage) || [];
      if (photos.length > 0) {
        // Limit to first 6 photos for PDF (minimum 6 requirement)
        const photosToShow = photos.slice(0, 6);
        
        // Load all photos as base64
        const photoPromises = photosToShow.map(photo => getImageAsBase64(photo.filePath));
        const photoBase64Array = await Promise.all(photoPromises);
        
        let photosContent = `
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
            ${photoBase64Array.map((photoBase64, index) => {
              if (photoBase64) {
                return `
                  <div style="flex: 1; min-width: 30%; max-width: 32%; border: 1px solid #DA498D; border-radius: 8px; padding: 10px; text-align: center; overflow: hidden;">
                    <img src="${photoBase64}" alt="Photo ${index + 1}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 5px;" />
                    <div style="color: #666666; font-size: 12px;">Photo ${index + 1}</div>
                  </div>
                `;
              } else {
                return `
                  <div style="flex: 1; min-width: 30%; max-width: 32%; border: 1px solid #DA498D; border-radius: 8px; padding: 10px; text-align: center; min-height: 150px; display: flex; align-items: center; justify-content: center;">
                    <div style="color: #666666; font-size: 12px;">Photo ${index + 1} (Failed to load)</div>
                  </div>
                `;
              }
            }).join('')}
          </div>
        `;
        pdfContent.appendChild(createSection('Photos', photosContent));
      }

      // Social Media Section
      const socialPresence = profileData.showcase?.socialPresence || [];
      if (socialPresence.length > 0) {
        let socialContent = `
          <div style="margin-bottom: 15px;">
            ${socialPresence.map((url, index) => createInfoRow(`Link ${index + 1}`, url)).join('')}
          </div>
        `;
        pdfContent.appendChild(createSection('Social Media', socialContent));
      }

      // Languages Section
      const languages = profileData.showcase?.languages || [];
      if (languages.length > 0) {
        let languagesContent = `
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
            ${languages.map(lang => `
              <span style="background: linear-gradient(90deg, #DA498D 0%, #69247C 100%); color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px;">
                ${lang.languageName}
              </span>
            `).join('')}
          </div>
        `;
        pdfContent.appendChild(createSection('Languages', languagesContent));
      }

      // Educational Background Section
      if (profileData.workExperiences && profileData.workExperiences.length > 0) {
        let workExpContent = `
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 18px; font-weight: 600; color: #333333; margin-bottom: 15px;">Work Experience</h3>
            ${profileData.workExperiences.map((exp, index) => `
              <div style="border: 1px solid #DA498D; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                ${createInfoRow('Category', exp.categoryName)}
                ${createInfoRow('Role', exp.roleTitle)}
                ${createInfoRow('Project Name', exp.projectName)}
                ${createInfoRow('Year', exp.year)}
                <div style="margin-top: 10px;">
                  <div style="font-weight: 600; color: #333333; margin-bottom: 5px;">Description:</div>
                  <div style="color: #666666; line-height: 1.6;">${exp.description || 'N/A'}</div>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        pdfContent.appendChild(createSection('Educational Background', workExpContent));
      }

      // Education Section
      if (profileData.educations && profileData.educations.length > 0) {
        let educationContent = `
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 18px; font-weight: 600; color: #333333; margin-bottom: 15px;">Education</h3>
            ${profileData.educations.map((edu, index) => `
              <div style="border: 1px solid #DA498D; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                ${createInfoRow('Highest Qualification', edu.highestQualification)}
                ${createInfoRow('Academy Name', edu.academyName)}
                ${createInfoRow('Passout Year', edu.passoutYear)}
              </div>
            `).join('')}
          </div>
        `;
        const educationSection = document.createElement('div');
        educationSection.style.marginBottom = '30px';
        educationSection.innerHTML = educationContent;
        pdfContent.appendChild(educationSection);
      }

      // Skills Section
      if (profileData.professionalSkills && profileData.professionalSkills.length > 0) {
        let skillsContent = `
          <div style="margin-bottom: 15px;">
            ${profileData.professionalSkills.map((skill, index) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #F8F9FA; border-radius: 8px; margin-bottom: 10px;">
                <span style="font-weight: 500; color: #444444;">${skill.skillName}</span>
                <span style="color: #666666;">${'★'.repeat(skill.rating || 0)}${'☆'.repeat(5 - (skill.rating || 0))}</span>
              </div>
            `).join('')}
          </div>
        `;
        const skillsSection = document.createElement('div');
        skillsSection.style.marginBottom = '30px';
        skillsSection.innerHTML = `
          <div style="font-size: 22px; font-weight: 600; color: #DA498D; margin-bottom: 10px; border-bottom: 2px solid #69247C; padding-bottom: 10px;">
            Skills
          </div>
          ${skillsContent}
        `;
        pdfContent.appendChild(skillsSection);
      }

      // Certifications Section
      if (profileData.certifications && profileData.certifications.length > 0) {
        let certContent = `
          <div style="margin-bottom: 15px;">
            ${profileData.certifications.map((cert, index) => `
              <div style="border: 1px solid #DA498D; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                ${createInfoRow('Certification Name', cert.certificationName)}
                ${createInfoRow('Issued By', cert.issuedBy)}
                ${createInfoRow('Issue Date', cert.issueDate)}
                ${createInfoRow('Credential ID', cert.credentialId)}
              </div>
            `).join('')}
          </div>
        `;
        const certSection = document.createElement('div');
        certSection.style.marginBottom = '30px';
        certSection.innerHTML = `
          <div style="font-size: 22px; font-weight: 600; color: #DA498D; margin-bottom: 10px; border-bottom: 2px solid #69247C; padding-bottom: 10px;">
            Certifications
          </div>
          ${certContent}
        `;
        pdfContent.appendChild(certSection);
      }

      // Preferences Section
      let preferencesContent = `
        <div style="margin-bottom: 20px;">
          <h3 style="font-size: 18px; font-weight: 600; color: #333333; margin-bottom: 15px;">Comfortable Attire</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
            <div style="flex: 1; min-width: 30%;">
              <div style="font-weight: 600; color: #333333; margin-bottom: 10px;">Mainstream Attires</div>
              ${[
                { name: 'Casual Wear', selected: profileData.preferences?.casualWear },
                { name: 'Traditional', selected: profileData.preferences?.traditional },
                { name: 'Party Western', selected: profileData.preferences?.partyWestern },
                { name: 'Formal', selected: profileData.preferences?.formal }
              ].filter(item => item.selected).map(item => `
                <div style="margin-bottom: 5px;">✓ ${item.name}</div>
              `).join('')}
            </div>
            <div style="flex: 1; min-width: 30%;">
              <div style="font-weight: 600; color: #333333; margin-bottom: 10px;">Functional Attires</div>
              ${[
                { name: 'Sports', selected: profileData.preferences?.sports },
                { name: 'Cultural', selected: profileData.preferences?.cultural },
                { name: 'Historical', selected: profileData.preferences?.historical },
                { name: 'Swimmer', selected: profileData.preferences?.swimmer }
              ].filter(item => item.selected).map(item => `
                <div style="margin-bottom: 5px;">✓ ${item.name}</div>
              `).join('')}
            </div>
            <div style="flex: 1; min-width: 30%;">
              <div style="font-weight: 600; color: #333333; margin-bottom: 10px;">Optional Attires</div>
              ${[
                { name: 'Cosplay Costume', selected: profileData.preferences?.cosplayCostume },
                { name: 'Lingerie', selected: profileData.preferences?.lingerie }
              ].filter(item => item.selected).map(item => `
                <div style="margin-bottom: 5px;">✓ ${item.name}</div>
              `).join('')}
            </div>
          </div>
          <h3 style="font-size: 18px; font-weight: 600; color: #333333; margin-bottom: 15px;">Preferred Job Types</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
            ${[
              { name: 'Modeling', selected: profileData.preferences?.modeling },
              { name: 'Acting', selected: profileData.preferences?.acting },
              { name: 'Commercial', selected: profileData.preferences?.commercial },
              { name: 'Fashion', selected: profileData.preferences?.fashion },
              { name: 'Film', selected: profileData.preferences?.film },
              { name: 'Television', selected: profileData.preferences?.television },
              { name: 'Music', selected: profileData.preferences?.music },
              { name: 'Event', selected: profileData.preferences?.event },
              { name: 'Photography', selected: profileData.preferences?.photography },
              { name: 'Runway', selected: profileData.preferences?.runway },
              { name: 'Print', selected: profileData.preferences?.print },
              { name: 'Digital', selected: profileData.preferences?.digital }
            ].filter(item => item.selected).map(item => `
              <span style="border: 1px solid #DA498D; border-radius: 20px; padding: 5px 15px; font-size: 14px;">${item.name}</span>
            `).join('')}
          </div>
          <div style="margin-top: 15px;">
            ${createInfoRow('Available From', formatDate(profileData.preferences?.availableFromDate) || 'Not specified')}
            <div style="margin-top: 10px;">
              <span style="font-weight: 600; color: #333333;">Open for out of country shoots: </span>
              <span style="color: #666666;">${profileData.preferences?.openForOutOfCountryShoots ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      `;
      pdfContent.appendChild(createSection('Preferences', preferencesContent));

      // Add to DOM temporarily
      document.body.appendChild(pdfContent);

      // Wait for images to load
      const images = pdfContent.querySelectorAll('img');
      const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = resolve; // Continue even if image fails to load
          setTimeout(resolve, 3000); // Timeout after 3 seconds
        });
      });
      await Promise.all(imagePromises);
      await new Promise(resolve => setTimeout(resolve, 500)); // Additional buffer

      // Generate PDF
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      const fileName = `${getFullName().replace(/\s+/g, '_')}_Complete_Profile.pdf`;
      pdf.save(fileName);

      // Clean up
      document.body.removeChild(pdfContent);

      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Download Complete!',
        text: 'Your profile has been downloaded successfully.',
        confirmButtonColor: '#69247C',
        timer: 2000
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'An error occurred while generating the PDF. Please try again.',
        confirmButtonColor: '#69247C'
      });
    }
  };

  // Handle Complete Profile button click
  const handleCompleteProfile = async () => {
    if (!profileId || !profileData) {
      Swal.fire({
        icon: 'warning',
        title: 'Profile Not Ready',
        text: 'Please wait for your profile to load before completing.',
        confirmButtonColor: '#69247C'
      });
      return;
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Complete Your Profile?',
      text: 'Are you sure you want to mark your profile as complete? This will make your profile visible to potential clients.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#69247C',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Complete Profile!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal2-popup-custom',
        title: 'swal2-title-custom',
        content: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom'
      }
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      setIsCompleting(true);

      // Show loading alert
      Swal.fire({
        title: 'Completing Profile...',
        text: 'Please wait while we save your profile',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Prepare profile data for update - include all existing profile data plus completion flags
      const profileUpdateData = {
        ...profileData,
        professionalsProfileId: profileId,
        isComplete: true,
        isActive: true,
        completedDate: new Date().toISOString()
      };

      console.log('🔄 Completing profile with data:', profileUpdateData);

      // Try update first, if that fails, try save-or-update
      let response = await updateProfessionalsProfile(profileUpdateData);
      
      // If update fails (maybe profile doesn't have an ID yet), try save-or-update
      if (!response.success) {
        console.log('⚠️ Update failed, trying save-or-update...');
        const professionalsId = sessionManager.getProfessionalsId();
        if (professionalsId) {
          response = await saveOrUpdateProfessionalsProfileByProfessionalsId(professionalsId, profileUpdateData);
        }
      }
      
      console.log('📡 Complete profile API response:', response);

      if (response.success) {
        // Show success alert
        const result = await Swal.fire({
          title: 'Profile Completed!',
          text: response.message || 'Your profile has been completed and saved successfully!',
          icon: 'success',
          confirmButtonColor: '#69247C',
          confirmButtonText: 'Go to Dashboard',
          customClass: {
            popup: 'swal2-popup-custom',
            title: 'swal2-title-custom',
            content: 'swal2-content-custom',
            confirmButton: 'swal2-confirm-custom'
          }
        });

        // Refresh profile data to get updated status
        await fetchProfileData();

        // Navigate to dashboard after successful completion
        navigate('/dashboard');
      } else {
        throw new Error(response.error || 'Failed to complete profile');
      }
    } catch (error) {
      console.error('❌ Error completing profile:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Completion Failed',
        text: error.message || 'An error occurred while completing your profile. Please try again.',
        confirmButtonColor: '#69247C'
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <>
      <style>
        {`
          .swal2-popup-custom {
            font-family: 'Poppins', sans-serif !important;
            border-radius: 12px !important;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.15) !important;
          }
          
          .swal2-title-custom {
            font-family: 'Poppins', sans-serif !important;
            font-weight: 600 !important;
            font-size: 24px !important;
            color: #69247C !important;
          }
          
          .swal2-content-custom {
            font-family: 'Poppins', sans-serif !important;
            font-weight: 400 !important;
            font-size: 16px !important;
            color: #444444 !important;
            line-height: 1.5 !important;
          }
          
          .swal2-confirm-custom {
            font-family: 'Poppins', sans-serif !important;
            font-weight: 500 !important;
            font-size: 16px !important;
            background: linear-gradient(90deg, #69247C 0%, #DA498D 100%) !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 12px 24px !important;
            transition: all 0.3s ease !important;
          }
          
          .swal2-confirm-custom:hover {
            background: linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%) !important;
            transform: translateY(-1px) !important;
          }
          
          .swal2-cancel-custom {
            font-family: 'Poppins', sans-serif !important;
            font-weight: 500 !important;
            font-size: 16px !important;
            background: #f5f5f5 !important;
            color: #666666 !important;
            border: 1px solid #d9d9d9 !important;
            border-radius: 8px !important;
            padding: 12px 24px !important;
            transition: all 0.3s ease !important;
          }
          
          .swal2-cancel-custom:hover {
            background: #e9e9e9 !important;
            transform: translateY(-1px) !important;
          }
        `}
      </style>
      {loading && (
        <>
          <BasicInfoNavbar />
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <CircularProgress sx={{ color: '#DA498D' }} />
          </Box>
        </>
      )}

      {error && !loading && (
        <>
          <BasicInfoNavbar />
          <Box sx={{ py: 2, backgroundColor: 'white', minHeight: '100vh', px: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={fetchProfileData} sx={{ 
              background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
              '&:hover': { background: 'linear-gradient(90deg, #5a1f6a 0%, #C43A7A 100%)' }
            }}>
              Retry
            </Button>
          </Box>
        </>
      )}

      {!loading && !error && !profileData && (
        <>
          <BasicInfoNavbar />
          <Box sx={{ py: 2, backgroundColor: 'white', minHeight: '100vh', px: 2 }}>
            <Alert severity="info">
              No profile data available
            </Alert>
          </Box>
        </>
      )}

      {!loading && !error && profileData && (
        <>
          <BasicInfoNavbar />
      <Box sx={{ py: { xs: 2, sm: 3, md: 4 }, backgroundColor: 'white', minHeight: '100vh', px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Main Profile Layout - Photo on Left, Basic Details on Right */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          justifyContent: { xs: 'center', md: 'flex-start' },
          gap: { xs: 3, sm: 4 }, 
          maxWidth: '1200px',
          mx: 'auto',
          width: '100%'
        }}>
          {/* Left Side - Circular Profile Photo */}
          <Box sx={{ 
            order: { xs: 1, md: 1 },
            flexShrink: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: { xs: '100%', md: 'auto' }
          }}>
            <Box sx={{
              width: { xs: '150px', sm: '200px', md: '250px', lg: '300px' }, 
              height: { xs: '150px', sm: '200px', md: '250px', lg: '300px' },
              border: '4px solid #f0f0f0',  
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <AuthImage 
                filePath={profileData?.basicInfo?.filePath}
                alt={getFullName()}
                fallbackSrc={menImage}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          </Box>

          {/* Right Side - Basic Details */}
          <Box sx={{ 
            order: { xs: 2, md: 2 },
            flex: { xs: '0 0 auto', md: 1 }, 
            minWidth: 0, 
            width: { xs: '100%', md: 'auto' },
            maxWidth: { xs: '100%', md: 'none' }
          }}>
            {/* Basic Details Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%', justifyContent: 'space-between' }}>
              <Typography sx={{
                fontFamily: 'Poppins', fontWeight: 600,
                fontSize: { xs: '18px', sm: '20px', md: '22px' }, lineHeight: '140%',
                color: '#DA498D', flexGrow: 1
              }}>
                Basic Details
              </Typography>
              <IconButton size="small" onClick={handleEditBasicInfo}>
                <EditIcon sx={{ color: '#DA498D', fontSize: { xs: '18px', sm: '20px' } }} />
              </IconButton>
            </Box>

            {/* Divider Line */}
            <Box sx={{ borderBottom: '2px solid #69247C', mb: 3, width: '100%' }} />

            {/* Name with Person Icon */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%' }}>
              <Box sx={{ width: { xs: '28px', sm: '32px' }, height: { xs: '28px', sm: '32px' }, borderRadius: '50%', background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: { xs: 1.5, sm: 2 }, flexShrink: 0 }}>
                <PersonIcon sx={{ color: 'white', fontSize: { xs: '16px', sm: '18px' } }} />
              </Box>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: { xs: '16px', sm: '18px' }, lineHeight: '140%', color: '#333333', wordBreak: 'break-word' }}>
                {getFullName()}
              </Typography>
            </Box>

            {/* Description/Bio with Dropdown */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 3, width: '100%' }}>
              <Typography 
                sx={{ 
                  fontFamily: 'Poppins', 
                  fontWeight: 400, 
                  fontSize: { xs: '12px', sm: '14px' }, 
                  lineHeight: '140%', 
                  color: '#666666', 
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-word'
                }}
              >
                {profileData.basicInfo?.profileHeadline || 'No description available'}
              </Typography>
              <IconButton
                size="small"
                onClick={handleHeadlineMenuOpen}
                sx={{
                  color: '#DA498D',
                  '&:hover': {
                    backgroundColor: 'rgba(218, 73, 141, 0.1)',
                  },
                }}
              >
                <ArrowDropDownIcon />
              </IconButton>
              <Menu
                anchorEl={headlineAnchorEl}
                open={headlineMenuOpen}
                onClose={handleHeadlineMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    maxWidth: '400px',
                    minWidth: '250px',
                  }
                }}
              >
                <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography sx={{ 
                    fontFamily: 'Poppins', 
                    fontWeight: 500, 
                    fontSize: '12px', 
                    color: '#666666',
                    mb: 1
                  }}>
                    Full Profile Headline:
                  </Typography>
                  <Typography sx={{ 
                    fontFamily: 'Poppins', 
                    fontWeight: 400, 
                    fontSize: '14px', 
                    lineHeight: '140%', 
                    color: '#333333',
                    wordBreak: 'break-word'
                  }}>
                    {profileData.basicInfo?.profileHeadline || 'No description available'}
                  </Typography>
                </Box>
                <MenuItem onClick={() => handleHeadlineSelect('Edit Profile Headline')}>
                  <EditIcon sx={{ mr: 1, fontSize: 18, color: '#DA498D' }} />
                  Edit Headline
                </MenuItem>
              </Menu>
            </Box>

            {/* Contact and Personal Information Grid */}
            <Grid container spacing={2}>
              {[
                { icon: PhoneIcon, text: profileData.basicInfo?.phoneNo || profileData.professionalsDto?.phoneNumber || 'N/A' },
                { icon: WorkIcon, text: profileData.basicInfo?.category?.categoryName || 'N/A' },
                { icon: CalendarTodayIcon, text: formatDate(profileData.basicInfo?.dateOfBirth) },
                { icon: FavoriteIcon, text: profileData.basicInfo?.maritalStatus?.maritalStatusName || 'N/A' },
                { icon: EmailIcon, text: profileData.basicInfo?.email || profileData.professionalsDto?.email || 'N/A' },
                { icon: LocationOnIcon, text: `${profileData.basicInfo?.state?.stateName || ''}, ${profileData.basicInfo?.city?.cityName || ''}`.replace(/^,\s*|,\s*$/g, '') || 'N/A' }
              ].map((item, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1.5, sm: 2 } }}>
                    <Box sx={{ width: { xs: '28px', sm: '32px' }, height: { xs: '28px', sm: '32px' }, borderRadius: '50%', background: 'linear-gradient(135deg, #DA498D 0%, #69247C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: { xs: 1.5, sm: 2 }, flexShrink: 0 }}>
                      <item.icon sx={{ color: 'white', fontSize: { xs: '14px', sm: '16px' } }} />
                    </Box>
                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, lineHeight: '140%', color: '#333333', wordBreak: 'break-word' }}>
                      {item.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>

        {/* Style Profile Details Section */}
        <Box sx={{ 
          mt: { xs: 3, sm: 4 },
          maxWidth: '1200px',
          mx: 'auto'
        }}>
          {/* Style Profile Details Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: { xs: 2, sm: 3, md: 4 } }}>
            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: { xs: '18px', sm: '22px' }, lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
              Style Profile Details
            </Typography>
            <IconButton size="small" onClick={handleEditPhysicalDetails}>
              <EditIcon sx={{ color: '#DA498D', fontSize: { xs: '18px', sm: '20px' } }} />
            </IconButton>
          </Box>

          {/* Divider Line */}
          <Box sx={{ borderBottom: '2px solid #69247C', mb: 3, mx: { xs: 2, sm: 3, md: 4 } }} />

          {/* Two Boxes in Same Row */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, sm: 3 }, mb: 3, px: { xs: 2, sm: 3, md: 4 } }}>
            {/* Left Box - Measurements and Attributes */}
            <Box sx={{ flex: 1, border: '1px solid #DA498D', borderRadius: '8px', p: { xs: 1.5, sm: 2 }, backgroundColor: 'white', width: { xs: '100%', md: 'auto' } }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { xs: 'flex-start', sm: 'space-between' }, gap: { xs: 1, sm: 0 }, mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, color: '#333333', mb: { xs: 1, sm: 0 } }}>
                  Body Type : <span style={{ color: '#666666' }}>{profileData.styleProfile?.bodyType?.bodyTypeName || 'N/A'}</span>
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, color: '#333333', mb: { xs: 1, sm: 0 } }}>
                  Height : <span style={{ color: '#666666' }}>{profileData.styleProfile?.height ? `${profileData.styleProfile.height} cm` : 'N/A'}</span>
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, color: '#333333' }}>
                  Weight : <span style={{ color: '#666666' }}>{profileData.styleProfile?.weight ? `${profileData.styleProfile.weight} kg` : 'N/A'}</span>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { xs: 'flex-start', sm: 'space-between' }, gap: { xs: 1, sm: 0 } }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, color: '#333333', mb: { xs: 1, sm: 0 } }}>
                  Shoe Size : <span style={{ color: '#666666' }}>{profileData.styleProfile?.shoeSize?.shoeSizeName || 'N/A'}</span>
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, color: '#333333', mb: { xs: 1, sm: 0 } }}>
                  Chest : <span style={{ color: '#666666' }}>{profileData.styleProfile?.chest ? `${profileData.styleProfile.chest} inch` : 'N/A'}</span>
                </Typography>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, color: '#333333' }}>
                  Waist : <span style={{ color: '#666666' }}>{profileData.styleProfile?.waist ? `${profileData.styleProfile.waist} inch` : 'N/A'}</span>
                </Typography>
              </Box>
            </Box>

            {/* Right Box - Appearance Details */}
            <Box sx={{ flex: 1, border: '1px solid #DA498D', borderRadius: '8px', p: { xs: 1.5, sm: 2 }, backgroundColor: 'white', width: { xs: '100%', md: 'auto' } }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { xs: 'center', sm: 'space-between' }, alignItems: 'center', gap: { xs: 2, sm: 1 } }}>
                {[
                  { 
                    color: getSkinColor(profileData.styleProfile?.skinColor?.skinColorName), 
                    border: '#DA498D', 
                    title: 'Skin Color', 
                    value: profileData.styleProfile?.skinColor?.skinColorName || 'N/A' 
                  },
                  { 
                    color: getHairColor(profileData.styleProfile?.hairColor?.hairColorName), 
                    border: '#DA498D', 
                    title: 'Hair Color', 
                    value: profileData.styleProfile?.hairColor?.hairColorName || 'N/A' 
                  },
                  { 
                    color: getEyeColor(profileData.styleProfile?.eyeColor?.eyeColorName), 
                    border: '#DA498D', 
                    title: 'Eye Color', 
                    value: profileData.styleProfile?.eyeColor?.eyeColorName || 'N/A' 
                  }
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ width: { xs: '35px', sm: '40px' }, height: { xs: '35px', sm: '40px' }, borderRadius: '50%', backgroundColor: item.color, border: `2px solid ${item.border}`, mb: 1 }} />
                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, color: '#333333', textAlign: 'center' }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: { xs: '10px', sm: '12px' }, color: '#666666', textAlign: 'center' }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Bottom Box - Allergies */}
          <Box sx={{ border: '1px solid #DA498D', borderRadius: '8px', p: { xs: 1.5, sm: 2 }, backgroundColor: 'white', maxWidth: { xs: '100%', md: '50%' }, mx: { xs: 2, sm: 3, md: 4 } }}>
            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, color: '#333333' }}>
              Allergies : <span style={{ color: '#666666' }}>{profileData.styleProfile?.allergies || 'N/A'}</span>
            </Typography>
          </Box>
        </Box>

        {/* Show Case Section */}
        <Box sx={{ mt: { xs: 3, sm: 4 }, maxWidth: '1200px', mx: 'auto' }}>
          {/* Show Case Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: { xs: 2, sm: 3, md: 4 } }}>
            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: { xs: '18px', sm: '22px' }, lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
              Show Case
            </Typography>
            <IconButton size="small" onClick={handleEditShowcase}>
              <EditIcon sx={{ color: '#DA498D', fontSize: { xs: '18px', sm: '20px' } }} />
            </IconButton>
          </Box>

          {/* Divider Line */}
          <Box sx={{ borderBottom: '2px solid #69247C', mb: 4, mx: { xs: 2, sm: 3, md: 4 } }} />

          {/* Videos Section */}
          <Box sx={{ mb: 4, px: { xs: 2, sm: 3, md: 4 } }}>
            {(() => {
              const videos = profileData.showcase?.files?.filter(file => file.isVideo) || [];
              const hasMoreVideos = videos.length > 5;
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                    Videos
                  </Typography>
                  {hasMoreVideos && (
                    <IconButton 
                      size="small" 
                      onClick={() => setShowAllVideos(!showAllVideos)}
                      sx={{ 
                        color: '#DA498D',
                        '&:hover': {
                          backgroundColor: 'rgba(218, 73, 141, 0.1)'
                        }
                      }}
                    >
                      <ArrowDropDownIcon sx={{ 
                        color: '#DA498D', 
                        fontSize: '20px',
                        transform: showAllVideos ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }} />
                    </IconButton>
                  )}
                  <IconButton size="small" onClick={handleEditVideos}>
                    <EditIcon sx={{ color: '#DA498D', fontSize: '18px' }} />
                  </IconButton>
                </Box>
              );
            })()}

            <Box sx={{ borderBottom: '1px solid #DA498D', mb: 2 }} />

            {/* Video Thumbnails */}
            {(() => {
              const videos = profileData.showcase?.files?.filter(file => file.isVideo) || [];
              const displayedVideos = showAllVideos ? videos : videos.slice(0, 5);
              const hasMoreVideos = videos.length > 5;
              
              return (
                <>
                  <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, flexWrap: 'wrap' }}>
                    {displayedVideos.map((video, index) => (
                      <Box key={video.id} sx={{ position: 'relative', width: { xs: '100%', sm: '180px', md: '200px' }, height: { xs: '200px', sm: '140px', md: '150px' }, border: '2px dashed #DA498D', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', overflow: 'hidden' }}>
                        <AuthVideo 
                          filePath={video.filePath}
                          thumbnailPath={video.thumbnailPath}
                          alt={`Video ${index}`}
                          fallbackSrc={menImage}
                          showControls={true}
                          autoPlay={false}
                          muted={true}
                          loop={false}
                          style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0
                          }}
                        />
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', backgroundColor: 'rgba(218, 73, 141, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, zIndex: 3 }}>
                          <Box sx={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleEditVideos}>
                            <EditIcon sx={{ color: 'white', fontSize: '16px' }} />
                          </Box>
                          <Box sx={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Box sx={{ width: '12px', height: '12px', border: '1px solid white', borderRadius: '2px', position: 'relative' }}>
                              <Box sx={{ position: 'absolute', top: '2px', left: '2px', right: '2px', height: '1px', backgroundColor: 'white' }} />
                              <Box sx={{ position: 'absolute', bottom: '2px', left: '2px', right: '2px', height: '1px', backgroundColor: 'white' }} />
                            </Box>
                          </Box>
                          <Box sx={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Typography sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>×</Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                    
                    {videos.length === 0 && (
                      <Box sx={{ width: { xs: '100%', sm: '180px', md: '200px' }, height: { xs: '200px', sm: '140px', md: '150px' }, border: '2px dashed #DA498D', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
                        <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: { xs: '12px', sm: '14px' } }}>No videos uploaded</Typography>
                      </Box>
                    )}
                  </Box>
                </>
              );
            })()}
          </Box>

          {/* Photos Section */}
          <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            {(() => {
              const photos = profileData.showcase?.files?.filter(file => file.isImage) || [];
              const hasMorePhotos = photos.length > 5;
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                    Photos
                  </Typography>
                  {hasMorePhotos && (
                    <IconButton 
                      size="small" 
                      onClick={() => setShowAllPhotos(!showAllPhotos)}
                      sx={{ 
                        color: '#DA498D',
                        '&:hover': {
                          backgroundColor: 'rgba(218, 73, 141, 0.1)'
                        }
                      }}
                    >
                      <ArrowDropDownIcon sx={{ 
                        color: '#DA498D', 
                        fontSize: '20px',
                        transform: showAllPhotos ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }} />
                    </IconButton>
                  )}
                  <IconButton size="small" onClick={handleEditPhotos}>
                    <EditIcon sx={{ color: '#DA498D', fontSize: '18px' }} />
                  </IconButton>
                </Box>
              );
            })()}

            <Box sx={{ borderBottom: '1px solid #DA498D', mb: 2 }} />

            {/* Photo Thumbnails */}
            {(() => {
              const photos = profileData.showcase?.files?.filter(file => file.isImage) || [];
              const displayedPhotos = showAllPhotos ? photos : photos.slice(0, 5);
              
              return (
                <>
                  <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, flexWrap: 'wrap' }}>
                    {displayedPhotos.map((image, index) => (
                      <Box key={image.id} sx={{ position: 'relative', width: { xs: '100%', sm: '180px', md: '200px' }, height: { xs: '200px', sm: '140px', md: '150px' }, border: '2px dashed #DA498D', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', overflow: 'hidden' }}>
                        <AuthImage 
                          filePath={image.filePath}
                          alt={`Photo ${index}`}
                          fallbackSrc={menImage}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'absolute',
                            top: 0,
                            left: 0
                          }}
                        />
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', backgroundColor: 'rgba(218, 73, 141, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, zIndex: 3 }}>
                          <Box sx={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleEditPhotos}>
                            <EditIcon sx={{ color: 'white', fontSize: '16px' }} />
                          </Box>
                          <Box sx={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Box sx={{ width: '12px', height: '12px', border: '1px solid white', borderRadius: '2px', position: 'relative' }}>
                              <Box sx={{ position: 'absolute', top: '2px', left: '2px', right: '2px', height: '1px', backgroundColor: 'white' }} />
                              <Box sx={{ position: 'absolute', bottom: '2px', left: '2px', right: '2px', height: '1px', backgroundColor: 'white' }} />
                            </Box>
                          </Box>
                          <Box sx={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Typography sx={{ color: 'white', fontSize: '16px', fontWeight: 'bold' }}>×</Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                    
                    {photos.length === 0 && (
                      <Box sx={{ width: { xs: '100%', sm: '180px', md: '200px' }, height: { xs: '200px', sm: '140px', md: '150px' }, border: '2px dashed #DA498D', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
                        <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: { xs: '12px', sm: '14px' } }}>No photos uploaded</Typography>
                      </Box>
                    )}
                  </Box>
                </>
              );
            })()}
          </Box>

          {/* Social Media Section */}
          <Box sx={{ 
            mt: { xs: 3, sm: 4 },
            maxWidth: '1200px',
            mx: 'auto'
          }}>
            <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                  Social Media
                </Typography>
                <IconButton size="small" onClick={handleEditSocialMedia}>
                  <EditIcon sx={{ color: '#DA498D', fontSize: '18px' }} />
                </IconButton>
              </Box>

              {/* Divider Line */}
              <Box sx={{ borderBottom: '1px solid #DA498D', mb: 2 }} />

              {/* Social Media Box */}
                <Grid container spacing={2}>
                  {profileData.showcase?.socialPresence?.map((url, index) => {
                    const urlLower = url.toLowerCase();
                    const platform = urlLower.includes('instagram') ? 'instagram' : 
                                   urlLower.includes('youtube') ? 'youtube' : 
                                   urlLower.includes('facebook') ? 'facebook' : 
                                   urlLower.includes('linkedin') ? 'linkedin' : 'portfolio';
                    
                    const platformConfig = {
                      instagram: { color: 'transparent', borderRadius: '50%', icon: 'instagram' },
                      youtube: { color: 'transparent', borderRadius: '50%', icon: 'youtube' },
                      facebook: { color: 'transparent', borderRadius: '50%', icon: 'facebook' },
                      linkedin: { color: 'transparent', borderRadius: '50%', icon: 'linkedin' },
                      portfolio: { color: '#000000', borderRadius: '4px', icon: 'portfolio' }
                    };
                    
                    const config = platformConfig[platform];
                    
                    return (
                      <Grid size={{ xs: 12, sm: 6 }} key={index}>
                        <Box 
                          component="a"
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: { xs: 1.5, sm: 2 },
                            textDecoration: 'none',
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.8
                            }
                          }}
                        >
                          <Box sx={{ width: { xs: '28px', sm: '32px' }, height: { xs: '28px', sm: '32px' }, borderRadius: config.borderRadius, background: config.color, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: { xs: 1.5, sm: 2 }, flexShrink: 0, overflow: 'hidden' }}>
                            {config.icon === 'instagram' && (
                              <Box
                                component="img"
                                src={instagramIcon}
                                alt="Instagram"
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            )}
                            {config.icon === 'youtube' && (
                              <Box
                                component="img"
                                src={youtubeIcon}
                                alt="YouTube"
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            )}
                            {config.icon === 'facebook' && (
                              <Box
                                component="img"
                                src={facebookIcon}
                                alt="Facebook"
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            )}
                            {config.icon === 'linkedin' && (
                              <Box
                                component="img"
                                src={linkedinIcon}
                                alt="LinkedIn"
                                sx={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                            )}
                            {config.icon === 'portfolio' && (
                              <LanguageIcon sx={{ color: 'white', fontSize: { xs: '18px', sm: '20px' } }} />
                            )}
                          </Box>
                          <Typography 
                            sx={{ 
                              fontFamily: 'Poppins', 
                              fontWeight: 500, 
                              fontSize: { xs: '12px', sm: '14px' }, 
                              color: '#69247C', 
                              wordBreak: 'break-word',
                              '&:hover': {
                                textDecoration: 'underline',
                                color: '#DA498D'
                              }
                            }}
                          >
                            {url}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                  {(!profileData.showcase?.socialPresence || profileData.showcase.socialPresence.length === 0) && (
                    <Grid size={12}>
                      <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: '14px', textAlign: 'center', py: 2 }}>
                        No social media links added
                      </Typography>
                    </Grid>
                  )}
                </Grid>
            </Box>
          </Box>

          {/* Languages Section */}
          <Box sx={{ 
            mt: { xs: 3, sm: 4 },
            maxWidth: '1200px',
            mx: 'auto'
          }}>
            <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                  Languages
                </Typography>
                <IconButton size="small" onClick={handleEditLanguages}>
                  <EditIcon sx={{ color: '#DA498D', fontSize: '18px' }} />
                </IconButton>
              </Box>

              {/* Divider Line */}
              <Box sx={{ borderBottom: '1px solid #DA498D', mb: 2 }} />
              <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, flexWrap: 'wrap' }}>
                {profileData.showcase?.languages?.map((language, index) => (
                  <Box key={language.languageId} sx={{ background: 'linear-gradient(90deg, #DA498D 0%, #69247C 100%)', borderRadius: '20px', px: { xs: 1.5, sm: 2 }, py: { xs: 0.75, sm: 1 }, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: { xs: '14px', sm: '16px' }, height: { xs: '14px', sm: '16px' }, borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                      <Typography sx={{ color: '#DA498D', fontSize: { xs: '10px', sm: '12px' }, fontWeight: 'bold' }}>×</Typography>
                    </Box>
                    <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, color: 'white' }}>
                      {language.languageName}
                    </Typography>
                  </Box>
                ))}
                {(!profileData.showcase?.languages || profileData.showcase.languages.length === 0) && (
                  <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: '14px' }}>
                    No languages added
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Educational Background Section */}
          <Box sx={{ 
            mt: { xs: 3, sm: 4 },
            maxWidth: '1200px',
            mx: 'auto'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: { xs: 2, sm: 3, md: 4 } }}>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: { xs: '18px', sm: '22px' }, lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                Educational Background
              </Typography>
              <IconButton size="small" onClick={handleEditEducationBackground}>
                <EditIcon sx={{ color: '#DA498D', fontSize: { xs: '18px', sm: '20px' } }} />
              </IconButton>
            </Box>

            {/* Divider Line */}
            <Box sx={{ borderBottom: '2px solid #69247C', mb: 4, mx: { xs: 2, sm: 3, md: 4 } }} />

            {/* Work/Experience Section */}
            <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                  Work/Experience
                </Typography>
                <IconButton size="small" onClick={handleEditWorkExperience}>
                  <EditIcon sx={{ color: '#DA498D', fontSize: '18px' }} />
                </IconButton>
              </Box>

              <Box sx={{ borderBottom: '1px solid #DA498D', mb: 2 }} />

              {/* Work Experience Cards - Same Row */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
              {profileData.workExperiences?.map((experience, index) => (
                <Box key={experience.id} sx={{ flex: 1, minWidth: { xs: '100%', md: '300px' }, width: { xs: '100%', md: 'auto' } }}>
                  <Box sx={{ border: '1px solid', borderImage: 'linear-gradient(90deg, #DA498D 0%, #69247C 100%) 1', borderRadius: '8px', p: { xs: 2, sm: 3 }, backgroundColor: 'white', position: 'relative' }}>
                    <Box>
                      {[
                        { label: 'Category', value: experience.categoryName },
                        { label: 'Role', value: experience.roleTitle },
                        { label: 'Project Name', value: experience.projectName },
                        { label: 'Year', value: experience.year }
                      ].map((item, idx) => (
                        <Typography key={idx} sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, color: '#333333', mb: idx === 3 ? 2 : 1 }}>
                          {item.label} : <span style={{ color: '#666666' }}>{item.value}</span>
                        </Typography>
                      ))}
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, color: '#333333', mb: 1 }}>
                        Description :
                      </Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: { xs: '12px', sm: '14px' }, color: '#666666', lineHeight: '140%' }}>
                        {experience.description}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
              {(!profileData.workExperiences || profileData.workExperiences.length === 0) && (
                <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                  <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: '16px' }}>
                    No work experience added yet
                  </Typography>
                </Box>
              )}
              </Box>
            </Box>

            {/* Education Section */}
            <Box sx={{ mt: 4, px: { xs: 2, sm: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '18px', lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                  Education
                </Typography>
                <IconButton size="small" onClick={handleEditEducation}>
                  <EditIcon sx={{ color: '#DA498D', fontSize: '18px' }} />
                </IconButton>
              </Box>

              <Box sx={{ borderBottom: '1px solid #DA498D', mb: 2 }} />

              <Box sx={{ border: '1px solid #DA498D', borderRadius: '8px', p: { xs: 2, sm: 3 }, backgroundColor: 'white' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { xs: 'flex-start', sm: 'space-between' }, flexWrap: 'wrap', gap: { xs: 2, sm: 2 } }}>
                  {profileData.educations?.map((education, index) => (
                    <Box key={education.id} sx={{ flex: 1, minWidth: { xs: '100%', sm: '200px' }, width: { xs: '100%', sm: 'auto' } }}>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, color: '#333333', mb: 0.5 }}>
                        Highest Qualification :
                      </Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: { xs: '12px', sm: '14px' }, color: '#666666', mb: 1 }}>
                        {education.highestQualification}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, color: '#333333', mb: 0.5 }}>
                        Academy Name :
                      </Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: { xs: '12px', sm: '14px' }, color: '#666666', mb: 1 }}>
                        {education.academyName}
                      </Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '12px', sm: '14px' }, color: '#333333', mb: 0.5 }}>
                        Passout Year :
                      </Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: { xs: '12px', sm: '14px' }, color: '#666666' }}>
                        {education.passoutYear}
                      </Typography>
                    </Box>
                  ))}
                  {(!profileData.educations || profileData.educations.length === 0) && (
                    <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>
                      <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: '14px' }}>
                        No education information added
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Certifications Section */}
            <Box sx={{ mt: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: { xs: '16px', sm: '18px' }, lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                  Certifications
                </Typography>
                <IconButton size="small" onClick={handleEditCertifications}>
                  <EditIcon sx={{ color: '#DA498D', fontSize: { xs: '16px', sm: '18px' } }} />
                </IconButton>
              </Box>

              <Box sx={{ borderBottom: '1px solid #DA498D', mb: 2 }} />

              <Box sx={{ border: '1px solid #DA498D', borderRadius: '8px', p: { xs: 2, sm: 3 }, backgroundColor: 'white' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
                  {profileData.certifications?.map((cert, index) => (
                    <Box key={cert.id} sx={{ flex: 1, minWidth: { xs: '100%', md: '300px' }, width: { xs: '100%', md: 'auto' }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 2 } }}>
                      <Box sx={{ flexShrink: 0, alignSelf: { xs: 'center', sm: 'flex-start' } }}>
                        {/* Certificate Frame */}
                        <Box sx={{ 
                          width: { xs: '120px', sm: '140px' }, 
                          height: { xs: '170px', sm: '200px' }, 
                          border: '2px solid #e0e0e0', 
                          borderRadius: '8px', 
                          backgroundColor: '#f8f9fa', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          mb: 1, 
                          overflow: 'hidden'
                        }}>
                          <AuthImage 
                            filePath={cert.filePath}
                            alt="Certification"
                            fallbackSrc={null}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              borderRadius: '4px'
                            }}
                          />
                        </Box>
                        
                        {/* Control Buttons Below Frame */}
                        <Box sx={{ backgroundColor: '#DA498D', borderRadius: '4px', p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                          <Box sx={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={handleEditCertifications}>
                            <EditIcon sx={{ color: 'white', fontSize: '12px' }} />
                          </Box>
                          <Box sx={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Box sx={{ width: '10px', height: '10px', border: '1px solid white', borderRadius: '2px', position: 'relative' }}>
                              <Box sx={{ position: 'absolute', top: '2px', left: '2px', right: '2px', height: '1px', backgroundColor: 'white' }} />
                              <Box sx={{ position: 'absolute', bottom: '2px', left: '2px', right: '2px', height: '1px', backgroundColor: 'white' }} />
                            </Box>
                          </Box>
                          <Box sx={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Typography sx={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>×</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ flex: 1, width: { xs: '100%', sm: 'auto' } }}>
                        {[
                          { label: 'Certification Name', value: cert.certificationName },
                          { label: 'Issued By', value: cert.issuedBy },
                          { label: 'Issue Date', value: cert.issueDate },
                          { label: 'Credential ID', value: cert.credentialId }
                        ].map((item, idx) => (
                          <Box key={idx} sx={{ mb: idx === 3 ? 0 : 1 }}>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: { xs: '12px', sm: '14px' }, color: '#333333', mb: 0.5 }}>
                              {item.label}:
                            </Typography>
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: { xs: '12px', sm: '14px' }, color: '#666666' }}>
                              {item.value || 'N/A'}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                  {(!profileData.certifications || profileData.certifications.length === 0) && (
                    <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                      <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: '16px' }}>
                        No certifications added yet
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Skills Section */}
            <Box sx={{ mt: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: { xs: '16px', sm: '18px' }, lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                  Skills
                </Typography>
                <IconButton size="small" onClick={handleEditSkills}>
                  <EditIcon sx={{ color: '#DA498D', fontSize: { xs: '16px', sm: '18px' } }} />
                </IconButton>
              </Box>
              
              <Box sx={{ borderBottom: '1px solid #DA498D', mb: 2 }} />

              {/* Rate Your Skills Section */}
              <Box sx={{ mb: { xs: '24px', sm: '32px' } }}>
                <Grid container spacing={2}>
                  {profileData.professionalSkills?.map((skill, index) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={skill.id}>
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', p: { xs: 1.5, sm: 2 }, backgroundColor: '#F8F9FA', borderRadius: '8px', border: '1px solid #E9ECEF', gap: { xs: 1, sm: 0 } }}>
                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: { xs: '14px', sm: '16px' }, color: '#444444', flex: 1, mb: { xs: 1, sm: 0 } }}>
                          {skill.skillName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mx: { xs: 0, sm: 2 }, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-start' } }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Box key={star} sx={{ p: 0.25, cursor: 'pointer' }}>
                              <Typography sx={{ fontSize: { xs: '16px', sm: '20px' }, color: star <= skill.rating ? '#FFD700' : '#D9D9D9', lineHeight: 1 }}>
                                {star <= skill.rating ? '★' : '☆'}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton sx={{ p: 0.5, color: '#DA498D' }}>
                            <Box sx={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #DA498D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Typography sx={{ color: '#DA498D', fontSize: '10px', fontWeight: 'bold' }}>×</Typography>
                            </Box>
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                  {(!profileData.professionalSkills || profileData.professionalSkills.length === 0) && (
                    <Grid size={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, backgroundColor: '#F8F9FA', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '16px', color: '#666666' }}>
                          No skills added yet
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>

            {/* Preferences Section */}
            <Box sx={{ mt: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: { xs: '18px', sm: '22px' }, lineHeight: '140%', color: '#DA498D', flexGrow: 1 }}>
                  Preferences
                </Typography>
                <IconButton size="small" onClick={handleEditPreferences}>
                  <EditIcon sx={{ color: '#DA498D', fontSize: { xs: '18px', sm: '20px' } }} />
                </IconButton>
              </Box>

              <Box sx={{ borderBottom: '2px solid #69247C', mb: 4 }} />

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: { xs: 3, sm: 4 }, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: { xs: '100%', lg: '300px' }, width: { xs: '100%', lg: 'auto' } }}>
                  <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: { xs: '16px', sm: '18px' }, lineHeight: '140%', color: '#333333', mb: 2 }}>
                    Comfortable Attire
                  </Typography>
                  <Box sx={{ border: '1px solid #DA498D', borderRadius: '8px', p: { xs: 2, sm: 3 }, backgroundColor: 'white' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
                      {[
                        { title: 'Mainstream Attires', items: [
                          { name: 'Casual Wear', selected: profileData.preferences?.casualWear },
                          { name: 'Traditional', selected: profileData.preferences?.traditional },
                          { name: 'Party Western', selected: profileData.preferences?.partyWestern },
                          { name: 'Formal', selected: profileData.preferences?.formal }
                        ]},
                        { title: 'Functional Attires', items: [
                          { name: 'Sports', selected: profileData.preferences?.sports },
                          { name: 'Cultural', selected: profileData.preferences?.cultural },
                          { name: 'Historical', selected: profileData.preferences?.historical },
                          { name: 'Swimmer', selected: profileData.preferences?.swimmer }
                        ]},
                        { title: 'Optional Attires', items: [
                          { name: 'Cosplay Costume', selected: profileData.preferences?.cosplayCostume },
                          { name: 'Lingerie', selected: profileData.preferences?.lingerie }
                        ]}
                      ].map((column, colIndex) => (
                        <Box key={colIndex} sx={{ flex: 1, minWidth: { xs: '100%', sm: '150px' }, width: { xs: '100%', sm: 'auto' } }}>
                          <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: { xs: '12px', sm: '14px' }, color: '#333333', mb: 2 }}>
                            {column.title}
                          </Typography>
                          {column.items.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Box sx={{ width: { xs: '14px', sm: '16px' }, height: { xs: '14px', sm: '16px' }, borderRadius: '50%', backgroundColor: item.selected ? '#DA498D' : '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1, cursor: 'pointer', flexShrink: 0 }}>
                                {item.selected && <Typography sx={{ color: 'white', fontSize: { xs: '8px', sm: '10px' }, fontWeight: 'bold' }}>×</Typography>}
                              </Box>
                              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: { xs: '12px', sm: '14px' }, color: '#333333' }}>
                                {item.name}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ flex: 1, minWidth: { xs: '100%', lg: '300px' }, width: { xs: '100%', lg: 'auto' } }}>
                  <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: { xs: '16px', sm: '18px' }, lineHeight: '140%', color: '#333333', mb: 2 }}>
                    Preferred Job Types
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.75, sm: 1 } }}>
                    {[
                      { name: 'Modeling', selected: profileData.preferences?.modeling },
                      { name: 'Acting', selected: profileData.preferences?.acting },
                      { name: 'Commercial', selected: profileData.preferences?.commercial },
                      { name: 'Fashion', selected: profileData.preferences?.fashion },
                      { name: 'Film', selected: profileData.preferences?.film },
                      { name: 'Television', selected: profileData.preferences?.television },
                      { name: 'Music', selected: profileData.preferences?.music },
                      { name: 'Event', selected: profileData.preferences?.event },
                      { name: 'Photography', selected: profileData.preferences?.photography },
                      { name: 'Runway', selected: profileData.preferences?.runway },
                      { name: 'Print', selected: profileData.preferences?.print },
                      { name: 'Digital', selected: profileData.preferences?.digital }
                    ].filter(item => item.selected).map((jobType, index) => (
                      <Box key={index} sx={{ border: '1px solid #DA498D', borderRadius: '20px', px: { xs: 1.5, sm: 2 }, py: { xs: 0.75, sm: 1 }, backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: 1, minWidth: { xs: '100px', sm: '120px' }, justifyContent: 'center', flex: { xs: '1 1 auto', sm: '0 0 auto' } }}>
                        <Box sx={{ width: { xs: '14px', sm: '16px' }, height: { xs: '14px', sm: '16px' }, borderRadius: '50%', backgroundColor: '#DA498D', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                          <Typography sx={{ color: 'white', fontSize: { xs: '8px', sm: '10px' }, fontWeight: 'bold' }}>×</Typography>
                        </Box>
                        <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: { xs: '12px', sm: '14px' }, color: '#333333' }}>
                          {jobType.name}
                        </Typography>
                      </Box>
                    ))}
                    {(!profileData.preferences || Object.values(profileData.preferences).filter(val => typeof val === 'boolean' && val).length === 0) && (
                      <Typography sx={{ fontFamily: 'Poppins', color: '#666666', fontSize: '14px' }}>
                        No job preferences selected
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Available From Section */}
            <Box sx={{ mt: { xs: 3, sm: 4 } }}>
              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: { xs: '16px', sm: '18px' }, lineHeight: '140%', color: '#333333', mb: 2 }}>
                Available From
              </Typography>

              <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: { xs: '14px', sm: '16px' }, lineHeight: '140%', color: '#333333', mb: 2 }}>
                {formatDate(profileData.preferences?.availableFromDate) || 'Not specified'}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box sx={{ width: { xs: '18px', sm: '20px' }, height: { xs: '18px', sm: '20px' }, border: '2px solid #1976d2', borderRadius: '4px', backgroundColor: profileData.preferences?.openForOutOfCountryShoots ? '#1976d2' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, flexShrink: 0 }}>
                  {profileData.preferences?.openForOutOfCountryShoots && (
                    <Box sx={{ width: { xs: '6px', sm: '8px' }, height: { xs: '10px', sm: '12px' }, border: '2px solid white', borderTop: 'none', borderLeft: 'none', transform: 'rotate(45deg)', marginTop: '-2px' }} />
                  )}
                </Box>
                <Typography sx={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: { xs: '14px', sm: '16px' }, lineHeight: '140%', color: '#333333' }}>
                  Open for out of country shoots
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 3 }, justifyContent: 'center', mt: { xs: 4, sm: 6 }, px: { xs: 2, sm: 0 } }}>
                <Button 
                  variant="outlined" 
                  onClick={handleShareProfile}
                  sx={{ 
                    border: '1px solid #DA498D', 
                    borderRadius: '8px', 
                    color: '#DA498D', 
                    fontFamily: 'Poppins', 
                    fontWeight: 600, 
                    fontSize: { xs: '14px', sm: '16px' }, 
                    padding: { xs: '10px 24px', sm: '12px 32px' }, 
                    textTransform: 'none', 
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': { border: '1px solid #DA498D', backgroundColor: 'rgba(218, 73, 141, 0.04)' } 
                  }}
                >
                  Share
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleDownloadProfile}
                  disabled={!profileData}
                  sx={{ 
                    background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)', 
                    borderRadius: '8px', 
                    color: 'white', 
                    fontFamily: 'Poppins', 
                    fontWeight: 600, 
                    fontSize: { xs: '14px', sm: '16px' }, 
                    padding: { xs: '10px 24px', sm: '12px 32px' }, 
                    textTransform: 'none', 
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': { 
                      background: 'linear-gradient(90deg, #5a1f6a 0%, #C43A7A 100%)', 
                      boxShadow: '0 6px 12px rgba(0,0,0,0.15)' 
                    },
                    '&:disabled': {
                      background: '#cccccc',
                      cursor: 'not-allowed'
                    }
                  }}
                >
                  Download
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
        </>
      )}
    </>
  );
};
export default CompleteProfilePage;