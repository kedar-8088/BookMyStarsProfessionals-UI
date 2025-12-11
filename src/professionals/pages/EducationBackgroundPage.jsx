import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Chip, IconButton, CircularProgress, useTheme } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { motion, useInView } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BasicInfoNavbar from '../components/BasicInfoNavbar';
import BookmystarsBanner from '../components/BookmystarsBanner';
import { getAllCategories } from '../../API/categoryApi';
import { getAllSkills, getSkillsWithPagination } from '../../API/skillsApi';
import { getAllHighestQualifications } from '../../API/qualificationApi';
import { createEducation, linkEducationToProfile, getEducationsByProfileId, saveOrUpdateEducation, deleteEducation } from '../../API/educationApi';
import { createWorkExperience, linkWorkExperienceToProfile, getWorkExperiencesByProfileId, saveOrUpdateWorkExperience, deleteWorkExperience } from '../../API/workExperienceApi';
import { createCertification, linkCertificationToProfile, getCertificationsByProfileId, saveOrUpdateCertification, deleteCertification, uploadCertificationDocument } from '../../API/certificationApi';
import { saveOrUpdateProfessionalSkill, getProfessionalSkillsByProfileId, deleteProfessionalSkill } from '../../API/professionalSkillsApi';
import { sessionManager } from '../../API/authApi';
import profileFlowManager from '../../utils/profileFlowManager';
import { saveOrUpdateProfessionalsProfileByProfessionalsId } from '../../API/professionalsProfileApi';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Swal from 'sweetalert2';

const ContentBox = styled(Box)(({ theme }) => ({
  flex: 1,
  maxWidth: '100%',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  
  // Media queries for responsive design
  '@media (max-width: 1200px)': {
    maxWidth: '55%',
  },
  '@media (max-width: 992px)': {
    maxWidth: '80%',
  },
  '@media (max-width: 768px)': {
    maxWidth: '90%',
  },
  '@media (max-width: 576px)': {
    maxWidth: '95%',
  },
  '@media (max-width: 480px)': {
    maxWidth: '100%',
  },
}));

const EducationBackgroundPage = () => {
  // Navigation
  const navigate = useNavigate();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const activeSection = searchParams.get('section'); // Get the section parameter from URL

  // Intersection Observer refs
  const showcaseRef = useRef(null);
  const educationRef = useRef(null);

  // Intersection Observer hooks
  const showcaseInView = useInView(showcaseRef, { once: true, margin: "-50px" });
  const educationInView = useInView(educationRef, { once: true, margin: "-50px" });


  // Skills state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillRatings, setSkillRatings] = useState({});
  const [professionalSkillIds, setProfessionalSkillIds] = useState({}); // Map skill names to professional skill IDs
  
  // Dropdown state management
  const [isEducationExpanded, setIsEducationExpanded] = useState(true);
  const [isCertificationsExpanded, setIsCertificationsExpanded] = useState(true);
  const [isPresentWorkExpanded, setIsPresentWorkExpanded] = useState(true);
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(true);
  
  // API state management
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);
  
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState(null);
  
  const [qualifications, setQualifications] = useState([]);
  const [qualificationsLoading, setQualificationsLoading] = useState(false);
  const [qualificationsError, setQualificationsError] = useState(null);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Track submitted entries
  const [submittedWorkEntries, setSubmittedWorkEntries] = useState(new Set());
  const [submittedEducationEntries, setSubmittedEducationEntries] = useState(new Set());
  const [submittedCertificationEntries, setSubmittedCertificationEntries] = useState(new Set());
  const [submittedSkills, setSubmittedSkills] = useState(new Set());

  // State for professionals profile ID
  const [professionalsProfileId, setProfessionalsProfileId] = useState(null);
  
  const filteredSkills = skills.filter(skill =>
    skill.skillName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillRatings({...skillRatings, [skill]: 1});
    }
  };
  
  const handleSkillRemove = async (skill) => {
    try {
      // If this skill was previously submitted, delete it from the database
      if (submittedSkills.has(skill) && professionalSkillIds[skill]) {
        const professionalSkillId = professionalSkillIds[skill];
        await deleteProfessionalSkill(professionalSkillId);
        console.log('Professional skill deleted successfully');
        
        // Remove from professional skill IDs mapping
        const newProfessionalSkillIds = { ...professionalSkillIds };
        delete newProfessionalSkillIds[skill];
        setProfessionalSkillIds(newProfessionalSkillIds);
      }
      
      // Remove from submitted set
      if (submittedSkills.has(skill)) {
        setSubmittedSkills(prev => {
          const newSet = new Set(prev);
          newSet.delete(skill);
          return newSet;
        });
      }
      
      // Remove from local state
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
      const newRatings = { ...skillRatings };
      delete newRatings[skill];
      setSkillRatings(newRatings);
    } catch (error) {
      console.error('Error removing skill:', error);
      setSubmitError('Failed to delete skill');
    }
  };

  const handleStarClick = (skill, rating) => {
    setSkillRatings({...skillRatings, [skill]: rating});
    
    // If this skill was previously submitted, remove it from submitted set
    if (submittedSkills.has(skill)) {
      setSubmittedSkills(prev => {
        const newSet = new Set(prev);
        newSet.delete(skill);
        return newSet;
      });
    }
  };

  const handleSkillSubmit = async (skillName, rating) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Ensure profile exists before submitting
      const profileId = await ensureProfileExists();
      if (!profileId) {
        throw new Error('Professionals profile not found. Please complete the basic info step first.');
      }

      // Find skill ID from skills array
      const selectedSkill = skills.find(skill => skill.skillName === skillName);
      if (!selectedSkill) {
        throw new Error('Please select a valid skill');
      }

      const skillData = {
        professionalsProfileId: parseInt(profileId),
        skillId: selectedSkill.skillId,
        skillName: skillName,
        rating: rating
      };

      const response = await saveOrUpdateProfessionalSkill(skillData);
      
      if (response.code === 1000) {
        console.log('Professional skill saved/updated successfully:', response.data);
        // Mark this skill as submitted
        setSubmittedSkills(prev => new Set(prev).add(skillName));
        // Store the professional skill ID for future deletion
        if (response.data && (response.data.id || response.data.professionalSkillId)) {
          setProfessionalSkillIds(prev => ({
            ...prev,
            [skillName]: response.data.id || response.data.professionalSkillId
          }));
        }
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to save/update professional skill');
      }
    } catch (error) {
      console.error('Error submitting professional skill:', error);
      setSubmitError(error.message || 'Failed to submit professional skill');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Present Work / Experience state
  const [workEntries, setWorkEntries] = useState([
    {
      id: 1,
      category: '',
      roleTitle: '',
      projectName: '',
      year: '',
      description: ''
    }
  ]);

  const addWorkEntry = () => {
    const newEntry = {
      id: Date.now(),
      category: '',
      roleTitle: '',
      projectName: '',
      year: '',
      description: ''
    };
    setWorkEntries([...workEntries, newEntry]);
  };

  const removeWorkEntry = async (id) => {
    try {
      // If this entry was previously submitted (has a real ID from the database), delete it from the API
      const entry = workEntries.find(entry => entry.id === id);
      if (entry && submittedWorkEntries.has(id)) {
        // This is a real entry from the database, delete it via API
        await deleteWorkExperience(id);
        console.log('Work experience deleted successfully');
      }
      
      // Remove from local state
    if (workEntries.length > 1) {
      setWorkEntries(workEntries.filter(entry => entry.id !== id));
        // Remove from submitted set if it was there
        setSubmittedWorkEntries(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error deleting work experience:', error);
      setSubmitError('Failed to delete work experience');
    }
  };

  const updateWorkEntry = (id, field, value) => {
    setWorkEntries(workEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
    
    // If this entry was previously submitted, remove it from submitted set
    if (submittedWorkEntries.has(id)) {
      setSubmittedWorkEntries(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Education entries state
  const [educationEntries, setEducationEntries] = useState([
    {
      id: 1,
      qualification: '',
      institution: '',
      year: '',
      grade: ''
    }
  ]);

  const addEducationEntry = () => {
    const newEntry = {
      id: Date.now(),
      qualification: '',
      institution: '',
      year: '',
      grade: ''
    };
    setEducationEntries([...educationEntries, newEntry]);
  };

  const removeEducationEntry = async (id) => {
    try {
      // If this entry was previously submitted (has a real ID from the database), delete it from the API
      const entry = educationEntries.find(entry => entry.id === id);
      if (entry && submittedEducationEntries.has(id)) {
        // This is a real entry from the database, delete it via API
        await deleteEducation(id);
        console.log('Education deleted successfully');
      }
      
      // Remove from local state
    if (educationEntries.length > 1) {
      setEducationEntries(educationEntries.filter(entry => entry.id !== id));
        // Remove from submitted set if it was there
        setSubmittedEducationEntries(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error deleting education:', error);
      setSubmitError('Failed to delete education');
    }
  };

  const updateEducationEntry = (id, field, value) => {
    setEducationEntries(educationEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
    
    // If this entry was previously submitted, remove it from submitted set
    if (submittedEducationEntries.has(id)) {
      setSubmittedEducationEntries(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // Certification documents state
  const [uploadedCertificates, setUploadedCertificates] = useState([]);
  const [certificationFileUploads, setCertificationFileUploads] = useState({});

  // Certification entries state
  const [certificationEntries, setCertificationEntries] = useState([
    {
      id: 1,
      certificationName: '',
      issuingOrganization: '',
      issueDate: '',
      credentialId: ''
    }
  ]);

  const addCertificationEntry = () => {
    const newEntry = {
      id: Date.now(),
      certificationName: '',
      issuingOrganization: '',
      issueDate: '',
      credentialId: ''
    };
    setCertificationEntries([...certificationEntries, newEntry]);
  };

  const removeCertificationEntry = async (id) => {
    try {
      // If this entry was previously submitted (has a real ID from the database), delete it from the API
      const entry = certificationEntries.find(entry => entry.id === id);
      if (entry && submittedCertificationEntries.has(id)) {
        // This is a real entry from the database, delete it via API
        await deleteCertification(id);
        console.log('Certification deleted successfully');
      }
      
      // Remove from local state
    if (certificationEntries.length > 1) {
      setCertificationEntries(certificationEntries.filter(entry => entry.id !== id));
        // Remove from submitted set if it was there
        setSubmittedCertificationEntries(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
      setSubmitError('Failed to delete certification');
    }
  };

  const updateCertificationEntry = (id, field, value) => {
    setCertificationEntries(certificationEntries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
    
    // If this entry was previously submitted, remove it from submitted set
    if (submittedCertificationEntries.has(id)) {
      setSubmittedCertificationEntries(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleCertificateUpload = (event, certificationId) => {
    const file = event.target.files[0];
    if (file) {
      const newCertificate = {
        id: Date.now(),
        name: file.name,
        size: Math.round(file.size / 1024) + ' KB', // Convert to KB
        file: file,
        type: file.type
      };
      
      // Store file per certification entry
      setCertificationFileUploads(prev => ({
        ...prev,
        [certificationId]: newCertificate
      }));
    }
  };

  const handleCertificateRemove = (certificationId) => {
    setCertificationFileUploads(prev => {
      const newUploads = { ...prev };
      delete newUploads[certificationId];
      return newUploads;
    });
  };

  // Form submission handlers
  const handleWorkExperienceSubmit = async (entry, options = {}) => {
    const { showAlerts = true, throwOnError = false } = options;
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Ensure profile exists before submitting
      const profileId = await ensureProfileExists();
      if (!profileId) {
        throw new Error('Professionals profile not found. Please complete the basic info step first.');
      }

      // Find category ID from categories array
      const selectedCategory = categories.find(cat => cat.categoryName === entry.category);
      if (!selectedCategory) {
        throw new Error('Please select a valid category');
      }

      const workExperienceData = {
        categoryId: selectedCategory.categoryId,
        categoryName: entry.category,
        description: entry.description,
        professionalsProfileId: parseInt(profileId),
        projectName: entry.projectName,
        roleTitle: entry.roleTitle,
        year: parseInt(entry.year)
      };

      console.log('🔄 Submitting work experience:', workExperienceData);
      const response = await saveOrUpdateWorkExperience(workExperienceData);
      console.log('📡 Work experience API response:', response);
      
      // Handle different response codes (1000 for success, 200 also means success)
      if (response.code === 1000 || response.code === 200) {
        console.log('✅ Work experience saved/updated successfully:', response.data || response);
        // Mark this entry as submitted
        setSubmittedWorkEntries(prev => new Set(prev).add(entry.id));
        
        // Show success message if alerts are enabled
        if (showAlerts) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Work experience saved successfully',
            confirmButtonColor: '#69247C',
            timer: 2000,
            timerProgressBar: true
          });
        }
        
        return response.data || response;
      } else {
        // Log the full response for debugging
        console.error('❌ API returned non-success code:', response);
        const errorMessage = response.message || response.error || 'Failed to save/update work experience';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('❌ Error submitting work experience:', error);
      
      // Handle Axios errors which have a different structure
      let errorMessage = 'Failed to submit work experience';
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || error.response.data?.error || error.message;
        console.error('Error response data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || 'Failed to submit work experience';
      }
      
      setSubmitError(errorMessage);
      
      // Show error alert if alerts are enabled
      if (showAlerts) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonColor: '#69247C'
        });
      }
      
      // Throw error if requested (for handleAllSubmissions)
      if (throwOnError) {
        throw error;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEducationSubmit = async (entry) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Ensure profile exists before submitting
      const profileId = await ensureProfileExists();
      if (!profileId) {
        throw new Error('Professionals profile not found. Please complete the basic info step first.');
      }

      const educationData = {
        academyName: entry.institution,
        gradePercentage: entry.grade,
        highestQualification: entry.qualification,
        passoutYear: parseInt(entry.year),
        professionalsProfileId: parseInt(profileId)
      };

      const response = await saveOrUpdateEducation(educationData);
      
      if (response.code === 1000) {
        console.log('Education saved/updated successfully:', response.data);
        // Mark this entry as submitted
        setSubmittedEducationEntries(prev => new Set(prev).add(entry.id));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to save/update education');
      }
    } catch (error) {
      console.error('Error submitting education:', error);
      setSubmitError(error.message || 'Failed to submit education');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCertificationSubmit = async (entry) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Ensure profile exists before submitting
      const profileId = await ensureProfileExists();
      if (!profileId) {
        throw new Error('Professionals profile not found. Please complete the basic info step first.');
      }

      const certificationData = {
        certificationName: entry.certificationName,
        credentialId: entry.credentialId,
        issueDate: entry.issueDate,
        issuedBy: entry.issuingOrganization,
        professionalsProfileId: parseInt(profileId)
      };

      const response = await saveOrUpdateCertification(certificationData);
      
      if (response.code === 1000) {
        console.log('Certification saved/updated successfully:', response.data);
        
        // Upload file if one is attached
        const uploadedFile = certificationFileUploads[entry.id];
        if (uploadedFile && uploadedFile.file) {
          try {
            const uploadResponse = await uploadCertificationDocument(response.data.id, uploadedFile.file);
            console.log('File uploaded successfully:', uploadResponse);
          } catch (uploadError) {
            console.error('Error uploading file:', uploadError);
            // Don't throw error here, certification was saved successfully
          }
        }
        
        // Mark this entry as submitted
        setSubmittedCertificationEntries(prev => new Set(prev).add(entry.id));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to save/update certification');
      }
    } catch (error) {
      console.error('Error submitting certification:', error);
      setSubmitError(error.message || 'Failed to submit certification');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAllSubmissions = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      // Show loading alert
      Swal.fire({
        title: 'Saving...',
        text: 'Please wait while we save your information',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const results = {
        workExperiences: [],
        educations: [],
        certifications: [],
        skills: []
      };

      // Submit work experiences
      for (const entry of workEntries) {
        if (entry.category && entry.roleTitle && entry.projectName && entry.year) {
          const result = await handleWorkExperienceSubmit(entry, { showAlerts: false, throwOnError: true });
          results.workExperiences.push(result);
        }
      }

      // Submit education entries
      for (const entry of educationEntries) {
        if (entry.qualification && entry.institution && entry.year) {
          const result = await handleEducationSubmit(entry);
          results.educations.push(result);
        }
      }

      // Submit certification entries
      for (const entry of certificationEntries) {
        if (entry.certificationName && entry.issuingOrganization) {
          const result = await handleCertificationSubmit(entry);
          results.certifications.push(result);
        }
      }

      // Submit skills
      for (const skill of selectedSkills) {
        if (skillRatings[skill]) {
          const result = await handleSkillSubmit(skill, skillRatings[skill]);
          results.skills.push(result);
        }
      }

      console.log('All submissions completed successfully:', results);
      
      // Show success alert
      await Swal.fire({
        title: 'Saved Successfully!',
        text: 'All your information has been saved successfully!',
        icon: 'success',
        confirmButtonColor: '#69247C',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      
       // Navigate to next page
       navigate('/complete-profile');
      // Don't navigate automatically - let user stay on the page

    } catch (error) {
      console.error('Error in bulk submission:', error);
      
      // Show error alert
      await Swal.fire({
        title: 'Submission Failed',
        text: error.message || 'Failed to submit some entries. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Try Again',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      
      setSubmitError(error.message || 'Failed to submit some entries');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation handlers
  const handleNextClick = () => {
    navigate('/complete-profile');
  };

  const handleBackClick = () => {
    navigate('/showcase');
  };

  // Initialize profile ID
  useEffect(() => {
    const initializeProfile = async () => {
      try {
        // Check if user is logged in
        if (!sessionManager.isLoggedIn()) {
          navigate('/login');
          return;
        }

        // Initialize profile flow manager
        const initResult = await profileFlowManager.initialize();
        
        // Get profile ID from session or profile flow manager
        let profileId = sessionManager.getProfessionalsProfileId();
        
        if (!profileId && initResult.profileId) {
          profileId = initResult.profileId;
        }

        // If still no profile ID, try to create one
        if (!profileId) {
          const professionalsId = sessionManager.getProfessionalsId();
          if (professionalsId) {
            console.log('🔄 Creating professionals profile...');
            const createResult = await saveOrUpdateProfessionalsProfileByProfessionalsId(professionalsId, {});
            if (createResult.success && createResult.data?.professionalsProfileId) {
              profileId = createResult.data.professionalsProfileId;
              console.log('✅ Profile created with ID:', profileId);
            }
          }
        }

        if (profileId) {
          setProfessionalsProfileId(profileId);
          console.log('✅ Using profile ID:', profileId);
        } else {
          console.error('❌ Could not get or create profile ID');
          Swal.fire({
            icon: 'error',
            title: 'Profile Error',
            text: 'Unable to initialize your profile. Please try logging in again.',
            confirmButtonColor: '#69247C'
          });
        }
      } catch (error) {
        console.error('Error initializing profile:', error);
        Swal.fire({
          icon: 'error',
          title: 'Initialization Error',
          text: 'Failed to initialize your profile. Please refresh the page.',
          confirmButtonColor: '#69247C'
        });
      }
    };

    initializeProfile();
  }, [navigate]);

  // Ensure profile exists before operations
  const ensureProfileExists = async () => {
    if (professionalsProfileId) {
      return professionalsProfileId;
    }

    // Try to get from session
    let profileId = sessionManager.getProfessionalsProfileId();
    if (profileId) {
      setProfessionalsProfileId(profileId);
      return profileId;
    }

    // Try to create profile
    const professionalsId = sessionManager.getProfessionalsId();
    if (professionalsId) {
      console.log('🔄 Creating professionals profile...');
      const createResult = await saveOrUpdateProfessionalsProfileByProfessionalsId(professionalsId, {});
      if (createResult.success && createResult.data?.professionalsProfileId) {
        profileId = createResult.data.professionalsProfileId;
        setProfessionalsProfileId(profileId);
        console.log('✅ Profile created with ID:', profileId);
        return profileId;
      }
    }

    throw new Error('Professionals profile not found. Please ensure you have completed the basic info step.');
  };

  // Load existing data
  const loadExistingData = async () => {
    if (!professionalsProfileId) {
      return; // Don't load if profile ID is not set
    }
    
    try {
      // Load existing work experiences
      const workExperiencesResponse = await getWorkExperiencesByProfileId(professionalsProfileId);
      if (workExperiencesResponse.code === 1000 && workExperiencesResponse.data) {
        const existingWorkEntries = workExperiencesResponse.data.map((exp, index) => ({
          id: exp.id || Date.now() + index,
          category: exp.categoryName || '',
          roleTitle: exp.roleTitle || '',
          projectName: exp.projectName || '',
          year: exp.year?.toString() || '',
          description: exp.description || ''
        }));
        if (existingWorkEntries.length > 0) {
          setWorkEntries(existingWorkEntries);
          // Mark existing entries as submitted
          const existingIds = existingWorkEntries.map(entry => entry.id);
          setSubmittedWorkEntries(new Set(existingIds));
        }
      }

      // Load existing education
      const educationResponse = await getEducationsByProfileId(professionalsProfileId);
      if (educationResponse.code === 1000 && educationResponse.data) {
        const existingEducationEntries = educationResponse.data.map((edu, index) => ({
          id: edu.id || Date.now() + index + 1000,
          qualification: edu.highestQualification || '',
          institution: edu.academyName || '',
          year: edu.passoutYear?.toString() || '',
          grade: edu.gradePercentage || ''
        }));
        if (existingEducationEntries.length > 0) {
          setEducationEntries(existingEducationEntries);
          // Mark existing entries as submitted
          const existingIds = existingEducationEntries.map(entry => entry.id);
          setSubmittedEducationEntries(new Set(existingIds));
        }
      }

      // Load existing certifications
      const certificationsResponse = await getCertificationsByProfileId(professionalsProfileId);
      if (certificationsResponse.code === 1000 && certificationsResponse.data) {
        const existingCertificationEntries = certificationsResponse.data.map((cert, index) => ({
          id: cert.id || Date.now() + index + 2000,
          certificationName: cert.certificationName || '',
          issuingOrganization: cert.issuedBy || '',
          issueDate: cert.issueDate || '',
          credentialId: cert.credentialId || ''
        }));
        if (existingCertificationEntries.length > 0) {
          setCertificationEntries(existingCertificationEntries);
          // Mark existing entries as submitted
          const existingIds = existingCertificationEntries.map(entry => entry.id);
          setSubmittedCertificationEntries(new Set(existingIds));
          
          // Load existing file information if available
          const existingFileUploads = {};
          certificationsResponse.data.forEach((cert, index) => {
            if (cert.fileName && cert.filePath) {
              existingFileUploads[cert.id || Date.now() + index + 2000] = {
                id: Date.now() + index,
                name: cert.fileName,
                size: cert.fileSize ? `${Math.round(cert.fileSize / 1024)} KB` : 'Unknown size',
                file: null, // No file object for existing files
                type: cert.fileType || 'application/pdf',
                isExisting: true // Flag to indicate this is an existing file
              };
            }
          });
          setCertificationFileUploads(existingFileUploads);
        }
      }

      // Load existing professional skills
      const skillsResponse = await getProfessionalSkillsByProfileId(professionalsProfileId);
      if (skillsResponse.code === 1000 && skillsResponse.data) {
        const existingSkills = skillsResponse.data.map(skill => skill.skillName);
        const existingRatings = {};
        const skillIdMapping = {};
        skillsResponse.data.forEach(skill => {
          existingRatings[skill.skillName] = skill.rating;
          // Store the professional skill ID for deletion
          if (skill.id || skill.professionalSkillId) {
            skillIdMapping[skill.skillName] = skill.id || skill.professionalSkillId;
          }
        });
        
        if (existingSkills.length > 0) {
          setSelectedSkills(existingSkills);
          setSkillRatings(existingRatings);
          setProfessionalSkillIds(skillIdMapping);
          // Mark existing skills as submitted
          setSubmittedSkills(new Set(existingSkills));
        }
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Categories
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const categoriesResponse = await getAllCategories();
        if (categoriesResponse.data && categoriesResponse.data.code === 200) {
          setCategories(categoriesResponse.data.data || []);
        } else {
          setCategoriesError('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoriesError('Error loading categories');
      } finally {
        setCategoriesLoading(false);
      }

      // Fetch Skills - Fetch all skills using pagination
      setSkillsLoading(true);
      setSkillsError(null);
      try {
        let allSkills = [];
        let pageNumber = 0;
        const pageSize = 1000; // Very large page size to fetch all at once
        let hasMore = true;
        let totalPages = null;

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
                  totalPages = responseData.data.totalPages;
                } else if (responseData.data.data && Array.isArray(responseData.data.data)) {
                  skillsData = responseData.data.data;
                }
              }
              
              if (skillsData.length > 0) {
                allSkills = skillsData;
                console.log(`✅ getAllSkills returned ${allSkills.length} skills`);
                
                // If it's paginated, check if we need to fetch more pages
                if (totalPages && totalPages > 1) {
                  hasMore = true;
                  pageNumber = 1; // Start from page 1 (0-indexed, so page 0 was already fetched)
                } else {
                  hasMore = false;
                }
              }
            }
          }
        } catch (getAllError) {
          console.log('getAllSkills failed, trying pagination:', getAllError);
        }

        // If we need to fetch more pages or getAllSkills didn't work, use pagination
        if (hasMore || allSkills.length === 0) {
          console.log('Fetching skills using pagination...');
          
          while (hasMore) {
            try {
              const paginatedResponse = await getSkillsWithPagination(pageNumber, pageSize);
              console.log(`Page ${pageNumber} response:`, paginatedResponse);
              
              if (paginatedResponse && paginatedResponse.data) {
                const responseData = paginatedResponse.data;
                
                // Check different response structures
                let pageSkills = [];
                let isLastPage = false;
                
                if (responseData.code === 200 || responseData.code === 1000) {
                  if (responseData.data) {
                    // Check if data is an array or has content array
                    if (Array.isArray(responseData.data)) {
                      pageSkills = responseData.data;
                    } else if (responseData.data.content && Array.isArray(responseData.data.content)) {
                      pageSkills = responseData.data.content;
                      isLastPage = responseData.data.last === true;
                      totalPages = responseData.data.totalPages;
                      hasMore = !isLastPage && (totalPages ? pageNumber < totalPages - 1 : pageSkills.length === pageSize);
                    } else if (responseData.data.data && Array.isArray(responseData.data.data)) {
                      pageSkills = responseData.data.data;
                    }
                  }
                }

                if (pageSkills.length > 0) {
                  // Avoid duplicates by checking skillId
                  const existingIds = new Set(allSkills.map(s => s.skillId));
                  const newSkills = pageSkills.filter(s => !existingIds.has(s.skillId));
                  allSkills = [...allSkills, ...newSkills];
                  
                  console.log(`✅ Page ${pageNumber}: Added ${newSkills.length} new skills (Total: ${allSkills.length})`);
                  
                  pageNumber++;
                  
                  // If we got fewer items than pageSize, we've reached the end
                  if (pageSkills.length < pageSize || isLastPage) {
                    hasMore = false;
                  }
                  
                  // Safety limit to prevent infinite loops
                  if (pageNumber > 100) {
                    console.warn('Reached safety limit of 100 pages');
                    hasMore = false;
                  }
                } else {
                  hasMore = false;
                }
              } else {
                hasMore = false;
              }
            } catch (pageError) {
              console.error(`Error fetching skills page ${pageNumber}:`, pageError);
              hasMore = false;
            }
          }
        }

        if (allSkills.length > 0) {
          // Remove duplicates based on skillId
          const uniqueSkills = allSkills.reduce((acc, current) => {
            const existing = acc.find(item => item.skillId === current.skillId);
            if (!existing) {
              acc.push(current);
            }
            return acc;
          }, []);
          
          setSkills(uniqueSkills);
          console.log(`✅ Final: Loaded ${uniqueSkills.length} unique skills`);
        } else {
          setSkillsError('No skills available');
          console.warn('⚠️ No skills were loaded');
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
        setSkillsError('Error loading skills');
      } finally {
        setSkillsLoading(false);
      }

      // Fetch Qualifications
      setQualificationsLoading(true);
      setQualificationsError(null);
      try {
        const qualificationsResponse = await getAllHighestQualifications();
        if (qualificationsResponse.code === 200) {
          setQualifications(qualificationsResponse.data || []);
        } else {
          setQualificationsError('Failed to fetch qualifications');
        }
      } catch (error) {
        console.error('Error fetching qualifications:', error);
        setQualificationsError('Error loading qualifications');
      } finally {
        setQualificationsLoading(false);
      }

      // Load existing data
      await loadExistingData();
    };

    fetchData();
  }, [professionalsProfileId]);



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
          
          .swal2-loading {
            border-color: #69247C transparent #69247C transparent !important;
          }
          
          @media (max-width: 768px) {
            .swal2-title-custom {
              font-size: 20px !important;
            }
            
            .swal2-content-custom {
              font-size: 14px !important;
            }
            
            .swal2-confirm-custom,
            .swal2-cancel-custom {
              font-size: 14px !important;
              padding: 10px 20px !important;
            }
          }
          
          @media (max-width: 480px) {
            .swal2-title-custom {
              font-size: 18px !important;
            }
            
            .swal2-content-custom {
              font-size: 13px !important;
            }
            
            .swal2-confirm-custom,
            .swal2-cancel-custom {
              font-size: 13px !important;
              padding: 8px 16px !important;
            }
          }
        `}
      </style>
      <BasicInfoNavbar />
      
      {/* Showcase Your Style Section */}
      <motion.div
        ref={showcaseRef}
        initial={{ opacity: 0 }}
        animate={showcaseInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Box sx={{ 
          py: { xs: 1, sm: 2, md: 3, lg: 4 }, 
          px: { xs: 1, sm: 2, md: 3, lg: 4 },
          width: '100%' 
        }}>
          <Box sx={{ 
            width: '100%', 
            maxWidth: '80%', 
            mx: 'auto',
            px: { xs: 0, sm: 0.5, md: 1 },
            [theme.breakpoints.down('xl')]: {
              maxWidth: '85%',
            },
            [theme.breakpoints.down('lg')]: {
              maxWidth: '90%',
            },
            [theme.breakpoints.down('md')]: {
              maxWidth: '95%',
            },
            [theme.breakpoints.down('sm')]: {
              maxWidth: '98%',
            },
            [theme.breakpoints.down('xs')]: {
              maxWidth: '100%',
            },
          }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >

              <BookmystarsBanner 
                containerHeight={{ xs: '110px', sm: '150px', md: '190px', lg: '230px' }}
                cardHeight={{ xs: '110px', sm: '150px', md: '190px', lg: '230px' }}
              />
            </Box>
          </Box>
        </Box>
      </motion.div>

      {/* Education & Background Section */}
      <Box sx={{ 
        py: 8, 
        backgroundColor: '#ffffff',
        '@media (max-width: 768px)': {
          py: '24px'
        },
        '@media (max-width: 480px)': {
          py: '16px'
        }
      }}>
        <Container maxWidth="lg">
          <motion.div
            ref={educationRef}
            initial={{ opacity: 0 }}
            animate={educationInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Box sx={{ 
              maxWidth: 1200, 
              mx: 'auto', 
              px: '24px',
              '@media (max-width: 768px)': {
                px: '16px'
              },
              '@media (max-width: 480px)': {
                px: '12px'
              }
            }}>
              {/* Education & Background Title */}
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: '36px',
                  lineHeight: '140%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                  color: '#DA498D',
                  mb: '16px',
                  '@media (max-width: 992px)': {
                    fontSize: '32px'
                  },
                  '@media (max-width: 768px)': {
                    fontSize: '28px',
                    mb: '12px'
                  },
                  '@media (max-width: 480px)': {
                    fontSize: '24px',
                    mb: '8px'
                  }
                }}
              >
                Education & Background
              </Typography>


              {/* Separator Line */}
              <Box
                sx={{
                  width: '100%',
                  height: '1px',
                  border: '1px solid #69247C',
                  mx: 'auto',
                  mb: 4
                }}
              />

              {/* Step and Progress Header */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mb: '24px',
                position: 'relative',
                '@media (max-width: 768px)': {
                  flexDirection: 'column',
                  gap: '16px',
                  mb: '20px'
                },
                '@media (max-width: 480px)': {
                  gap: '12px',
                  mb: '16px'
                }
              }}>
              </Box>

              {/* Present Work / Experience Section */}
              {(!activeSection || activeSection === 'work-experience') && (
              <Box sx={{ 
                mt: '48px',
                '@media (max-width: 768px)': {
                  mt: '32px'
                },
                '@media (max-width: 480px)': {
                  mt: '24px'
                }
              }}>
                {/* Present Work / Experience Header */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 3
                }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: '20px',
                      lineHeight: '140%',
                      letterSpacing: '0%',
                      background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      '@media (max-width: 768px)': {
                        fontSize: '18px'
                      },
                      '@media (max-width: 480px)': {
                        fontSize: '16px'
                      }
                    }}
                  >
                    Work / Experience
                  </Typography>
                </Box>

                {/* Dynamic Work Experience Containers */}
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    alignItems: 'center',
                    width: '100%',
                    '@media (max-width: 768px)': {
                      gap: '20px'
                    },
                    '@media (max-width: 480px)': {
                      gap: '16px'
                    }
                  }}>
                {workEntries.map((entry, entryIndex) => (
                      <Box key={entry.id} sx={{
                        width: '842px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        boxShadow: '0px 0px 4px 0px #F2B6C6',
                        padding: '24px',
                        position: 'relative',
                        '@media (max-width: 1200px)': {
                          width: '100%',
                          maxWidth: '842px'
                        },
                        '@media (max-width: 768px)': {
                          padding: '20px'
                        },
                        '@media (max-width: 480px)': {
                          padding: '16px'
                        }
                      }}>
                    {/* Entry Header with Delete Button (if more than one entry) */}
                    {workEntries.length > 1 && (
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '16px',
                            color: '#69247C'
                          }}
                        >
                          Work Experience {entryIndex + 1}
                        </Typography>
                        <Button
                          onClick={() => removeWorkEntry(entry.id)}
                          sx={{
                            color: '#DA498D',
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '14px',
                            textTransform: 'none',
                            minWidth: 'auto',
                            px: 1
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    )}

                    {/* Present Work / Experience Form Fields */}
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: 3,
                      mb: 3,
                      '@media (max-width: 768px)': {
                        gridTemplateColumns: '1fr',
                        gap: '16px',
                        mb: '20px'
                      },
                      '@media (max-width: 480px)': {
                        gap: '12px',
                        mb: '16px'
                      }
                    }}>
                      {/* Select Category */}
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 400,
                            fontSize: '20px',
                            lineHeight: '140%',
                            letterSpacing: '0%',
                            color: '#444444',
                            mb: 1
                          }}
                        >
                          Select Category
                        </Typography>
                        <FormControl
                          sx={{
                            width: '100%',
                            height: 53,
                            '@media (max-width: 768px)': {
                              width: '100%',
                              height: '48px'
                            },
                            '@media (max-width: 480px)': {
                              height: '44px'
                            },
                            '& .MuiOutlinedInput-root': {
                              height: 53,
                              '@media (max-width: 768px)': {
                                height: '48px'
                              },
                              '@media (max-width: 480px)': {
                                height: '44px'
                              },
                              borderRadius: '8px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #8A8A8A',
                              '& fieldset': {
                                border: '1px solid #8A8A8A',
                              },
                              '&:hover fieldset': {
                                border: '1px solid #8A8A8A',
                              },
                              '&.Mui-focused fieldset': {
                                border: '1px solid #8A8A8A',
                              },
                            },
                          }}
                        >
                          <Select
                            value={entry.category || ""}
                            onChange={(e) => updateWorkEntry(entry.id, 'category', e.target.value)}
                            displayEmpty
                            sx={{
                              height: 53,
                              '& .MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                height: '100%',
                              }
                            }}
                          >
                            <MenuItem value="" disabled>
                              <em>Select Category</em>
                            </MenuItem>
                            {categoriesLoading ? (
                              <MenuItem disabled>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CircularProgress size={16} sx={{ color: '#69247C' }} />
                                  <Typography sx={{ fontSize: '14px', color: '#666' }}>Loading...</Typography>
                                </Box>
                              </MenuItem>
                            ) : categoriesError ? (
                              <MenuItem disabled>
                                <Typography sx={{ fontSize: '14px', color: '#999' }}>{categoriesError}</Typography>
                              </MenuItem>
                            ) : categories.length > 0 ? (
                              categories.map((category) => (
                                <MenuItem key={category.categoryId} value={category.categoryName}>
                                  {category.categoryName}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>
                                <Typography sx={{ fontSize: '14px', color: '#999' }}>No categories available</Typography>
                              </MenuItem>
                            )}
                          </Select>
                        </FormControl>
                      </Box>

                      {/* Add Role/Title */}
                      <Box sx={{ position: 'relative' }}>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 400,
                            fontSize: '20px',
                            lineHeight: '140%',
                            letterSpacing: '0%',
                            color: '#444444',
                            mb: 1
                          }}
                        >
                          Add Role/Title
                        </Typography>
                        <TextField
                          value={entry.roleTitle}
                          onChange={(e) => updateWorkEntry(entry.id, 'roleTitle', e.target.value)}
                          sx={{
                            width: '100%',
                            height: 53,
                            '@media (max-width: 768px)': {
                              height: '48px'
                            },
                            '@media (max-width: 480px)': {
                              height: '44px'
                            },
                            '& .MuiOutlinedInput-root': {
                              height: 53,
                              '@media (max-width: 768px)': {
                                height: '48px'
                              },
                              '@media (max-width: 480px)': {
                                height: '44px'
                              },
                              borderRadius: '8px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #8A8A8A',
                              '& fieldset': {
                                border: '1px solid #8A8A8A',
                              },
                              '&:hover fieldset': {
                                border: '1px solid #8A8A8A',
                              },
                              '&.Mui-focused fieldset': {
                                border: '1px solid #8A8A8A',
                              },
                            },
                          }}
                          placeholder="Enter Role/Title"
                        />
                      </Box>
                    </Box>

                    {/* Second Row */}
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: 3,
                      mb: 3,
                      '@media (max-width: 768px)': {
                        gridTemplateColumns: '1fr',
                        gap: '16px',
                        mb: '20px'
                      },
                      '@media (max-width: 480px)': {
                        gap: '12px',
                        mb: '16px'
                      }
                    }}>
                      {/* Add Project Name */}
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 400,
                            fontSize: '20px',
                            lineHeight: '140%',
                            letterSpacing: '0%',
                            color: '#444444',
                            mb: 1
                          }}
                        >
                          Add Project Name
                        </Typography>
                        <TextField
                          value={entry.projectName}
                          onChange={(e) => updateWorkEntry(entry.id, 'projectName', e.target.value)}
                          sx={{
                            width: '100%',
                            height: 53,
                            '@media (max-width: 768px)': {
                              height: '48px'
                            },
                            '@media (max-width: 480px)': {
                              height: '44px'
                            },
                            '& .MuiOutlinedInput-root': {
                              height: 53,
                              '@media (max-width: 768px)': {
                                height: '48px'
                              },
                              '@media (max-width: 480px)': {
                                height: '44px'
                              },
                              borderRadius: '8px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #8A8A8A',
                              '& fieldset': {
                                border: '1px solid #8A8A8A',
                              },
                              '&:hover fieldset': {
                                border: '1px solid #8A8A8A',
                              },
                              '&.Mui-focused fieldset': {
                                border: '1px solid #8A8A8A',
                              },
                            },
                          }}
                          placeholder="Enter Project Name"
                        />
                      </Box>

                      {/* Year */}
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 400,
                            fontSize: '20px',
                            lineHeight: '140%',
                            letterSpacing: '0%',
                            color: '#444444',
                            mb: 1
                          }}
                        >
                          Year
                        </Typography>
                        <TextField
                          value={entry.year}
                          onChange={(e) => updateWorkEntry(entry.id, 'year', e.target.value)}
                          sx={{
                            width: '100%',
                            height: 53,
                            '@media (max-width: 768px)': {
                              height: '48px'
                            },
                            '@media (max-width: 480px)': {
                              height: '44px'
                            },
                            '& .MuiOutlinedInput-root': {
                              height: 53,
                              '@media (max-width: 768px)': {
                                height: '48px'
                              },
                              '@media (max-width: 480px)': {
                                height: '44px'
                              },
                              borderRadius: '8px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #8A8A8A',
                              '& fieldset': {
                                border: '1px solid #8A8A8A',
                              },
                              '&:hover fieldset': {
                                border: '1px solid #8A8A8A',
                              },
                              '&.Mui-focused fieldset': {
                                border: '1px solid #8A8A8A',
                              },
                            },
                          }}
                          placeholder="Enter Year"
                        />
                      </Box>
                    </Box>

                    {/* Description */}
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        sx={{
                          fontFamily: 'Poppins',
                          fontWeight: 400,
                          fontSize: '20px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          color: '#444444',
                          mb: 1
                        }}
                      >
                        Description
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={entry.description}
                        onChange={(e) => updateWorkEntry(entry.id, 'description', e.target.value)}
                        placeholder="Type here ..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #8A8A8A',
                            '& fieldset': {
                              border: '1px solid #8A8A8A',
                            },
                            '&:hover fieldset': {
                              border: '1px solid #8A8A8A',
                            },
                            '&.Mui-focused fieldset': {
                              border: '1px solid #8A8A8A',
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Done and Add Another Buttons */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 3,
                      mb: 2,
                      gap: 2
                    }}>
                      {/* Done Button - Only show if not submitted */}
                      {!submittedWorkEntries.has(entry.id) && (
                      <Button
                          onClick={async () => {
                            try {
                              await handleWorkExperienceSubmit(entry);
                            } catch (error) {
                              // Error is already handled in handleWorkExperienceSubmit
                              // This catch prevents unhandled promise rejection
                              console.error('Work experience submission error:', error);
                            }
                          }}
                          disabled={isSubmitting}
                        sx={{
                          width: '86px',
                          height: '47px',
                          borderRadius: '8px',
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontSize: '18px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                          color: '#FFFFFF',
                          textTransform: 'none',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                          },
                          '@media (max-width: 768px)': {
                            width: '80px',
                            height: '42px',
                            fontSize: '16px'
                          },
                          '@media (max-width: 480px)': {
                            width: '75px',
                            height: '38px',
                            fontSize: '14px'
                          }
                        }}
                      >
                        Done
                      </Button>
                      )}
                      
                      {/* Success indicator for submitted entries */}
                      {submittedWorkEntries.has(entry.id) && (
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 2,
                          py: 1,
                          backgroundColor: '#e8f5e8',
                          borderRadius: '8px',
                          border: '1px solid #4caf50'
                        }}>
                          <Typography sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '14px',
                            color: '#2e7d32'
                          }}>
                            ✓ Saved
                          </Typography>
                        </Box>
                      )}

                      {/* Add Another Button */}
                      <Button
                        onClick={addWorkEntry}
                        sx={{
                          width: '170px',
                          height: '47px',
                          borderRadius: '8px',
                          border: '1px solid #AAAAAA',
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontSize: '18px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          background: '#FFFFFF',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          backgroundImage: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                          textTransform: 'none',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                            color: '#FFFFFF',
                            border: '1px solid #AAAAAA'
                          },
                          '@media (max-width: 768px)': {
                            width: '130px',
                            height: '42px',
                            fontSize: '16px'
                          },
                          '@media (max-width: 480px)': {
                            width: '120px',
                            height: '38px',
                            fontSize: '14px'
                          }
                        }}
                      >
                        + Add Another
                      </Button>
                    </Box>
                  </Box>
                ))}
                  </Box>
              </Box>
              )}

              {/* Education Section */}
              {(!activeSection || activeSection === 'education') && (
              <Box sx={{ 
                mt: '48px',
                '@media (max-width: 768px)': {
                  mt: '32px'
                },
                '@media (max-width: 480px)': {
                  mt: '24px'
                }
              }}>
                {/* Education Header */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                  justifyContent: 'center',
                    mb: '24px',
                    '@media (max-width: 768px)': {
                      mb: '20px'
                    },
                    '@media (max-width: 480px)': {
                      mb: '16px'
                    }
                }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: '20px',
                      lineHeight: '140%',
                      letterSpacing: '0%',
                      background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      '@media (max-width: 768px)': {
                        fontSize: '18px'
                      },
                      '@media (max-width: 480px)': {
                        fontSize: '16px'
                      }
                    }}
                  >
                    Education
                  </Typography>
                </Box>

                {/* Dynamic Education Containers */}
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    alignItems: 'center',
                    width: '100%',
                    '@media (max-width: 768px)': {
                      gap: '20px'
                    },
                    '@media (max-width: 480px)': {
                      gap: '16px'
                    }
                  }}>
                    {educationEntries.map((entry, entryIndex) => (
                      <Box key={entry.id} sx={{
                        width: '842px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        boxShadow: '0px 0px 4px 0px #F2B6C6',
                        padding: '24px',
                        position: 'relative',
                        '@media (max-width: 1200px)': {
                          width: '100%',
                          maxWidth: '842px'
                        },
                        '@media (max-width: 768px)': {
                          padding: '20px'
                        },
                        '@media (max-width: 480px)': {
                          padding: '16px'
                        }
                      }}>
                      {/* Entry Header with Delete Button (if more than one entry) */}
                      {educationEntries.length > 1 && (
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2
                        }}>
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: '16px',
                              color: '#69247C'
                            }}
                          >
                            Education {entryIndex + 1}
                          </Typography>
                          <Button
                            onClick={() => removeEducationEntry(entry.id)}
                            sx={{
                              color: '#DA498D',
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: '14px',
                              textTransform: 'none',
                              minWidth: 'auto',
                              px: 1
                            }}
                          >
                            Remove
                          </Button>
                        </Box>
                      )}

                {/* Education Form Fields */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '24px',
                  mb: '32px',
                  '@media (max-width: 768px)': {
                    gridTemplateColumns: '1fr',
                    gap: '16px',
                    mb: '24px'
                  },
                  '@media (max-width: 480px)': {
                    gap: '12px',
                    mb: '20px'
                  }
                }}>
                  {/* Highest Qualification */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#444444',
                        mb: 1
                      }}
                    >
                      Highest Qualification
                    </Typography>
                    <FormControl
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '55px',
                          '@media (max-width: 768px)': {
                            height: '50px'
                          },
                          '@media (max-width: 480px)': {
                            height: '45px'
                          },
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #8A8A8A',
                          '& fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&:hover fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&.Mui-focused fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                        },
                      }}
                    >
                      <Select
                              value={entry.qualification || ""}
                              onChange={(e) => updateEducationEntry(entry.id, 'qualification', e.target.value)}
                        displayEmpty
                        sx={{
                          height: '55px',
                          '@media (max-width: 768px)': {
                            height: '50px'
                          },
                          '@media (max-width: 480px)': {
                            height: '45px'
                          },
                          '& .MuiSelect-select': {
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                          }
                        }}
                      >
                        <MenuItem value="" disabled>
                          <em>Select Qualification</em>
                        </MenuItem>
                        {qualificationsLoading ? (
                          <MenuItem disabled>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CircularProgress size={16} sx={{ color: '#69247C' }} />
                              <Typography sx={{ fontSize: '14px', color: '#666' }}>Loading...</Typography>
                            </Box>
                          </MenuItem>
                        ) : qualificationsError ? (
                          <MenuItem disabled>
                            <Typography sx={{ fontSize: '14px', color: '#999' }}>{qualificationsError}</Typography>
                          </MenuItem>
                        ) : qualifications.length > 0 ? (
                          qualifications.map((qualification) => (
                            <MenuItem key={qualification.highestQualificationId} value={qualification.highestQualificationName}>
                              {qualification.highestQualificationName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>
                            <Typography sx={{ fontSize: '14px', color: '#999' }}>No qualifications available</Typography>
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Academy Name */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#444444',
                        mb: 1
                      }}
                    >
                      Academy Name
                    </Typography>
                    <TextField
                      fullWidth
                            value={entry.institution}
                            onChange={(e) => updateEducationEntry(entry.id, 'institution', e.target.value)}
                      placeholder="Enter Academy/University Name"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '55px',
                          '@media (max-width: 768px)': {
                            height: '50px'
                          },
                          '@media (max-width: 480px)': {
                            height: '45px'
                          },
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #8A8A8A',
                          '& fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&:hover fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&.Mui-focused fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Passout Year */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#444444',
                        mb: 1
                      }}
                    >
                      Passout Year
                    </Typography>
                    <TextField
                      fullWidth
                            value={entry.year}
                            onChange={(e) => updateEducationEntry(entry.id, 'year', e.target.value)}
                      placeholder="Enter Passout Year"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '55px',
                          '@media (max-width: 768px)': {
                            height: '50px'
                          },
                          '@media (max-width: 480px)': {
                            height: '45px'
                          },
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #8A8A8A',
                          '& fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&:hover fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&.Mui-focused fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                        },
                      }}
                    />
                  </Box>

                        {/* Grade/Percentage */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#444444',
                        mb: 1
                      }}
                    >
                            Grade/Percentage
                    </Typography>
                    <TextField
                      fullWidth
                            value={entry.grade}
                            onChange={(e) => updateEducationEntry(entry.id, 'grade', e.target.value)}
                            placeholder="Enter Grade/Percentage"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '55px',
                          '@media (max-width: 768px)': {
                            height: '50px'
                          },
                          '@media (max-width: 480px)': {
                            height: '45px'
                          },
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #8A8A8A',
                          '& fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&:hover fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&.Mui-focused fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>

                      {/* Save and Add Another Buttons */}
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mt: 3,
                        mb: 2,
                        gap: 2
                      }}>
                        {/* Done Button - Only show if not submitted */}
                        {!submittedEducationEntries.has(entry.id) && (
                        <Button
                            onClick={() => handleEducationSubmit(entry)}
                            disabled={isSubmitting}
                          sx={{
                            background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                            color: '#FFFFFF',
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '16px',
                            textTransform: 'none',
                            px: '24px',
                            py: '10px',
                            borderRadius: '8px',
                            '&:hover': {
                              background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                            },
                            '@media (max-width: 768px)': {
                              fontSize: '14px',
                              px: '20px',
                              py: '8px'
                            },
                            '@media (max-width: 480px)': {
                              fontSize: '12px',
                              px: '16px',
                              py: '6px'
                            }
                          }}
                        >
                          Done
                        </Button>
                        )}
                        
                        {/* Success indicator for submitted entries */}
                        {submittedEducationEntries.has(entry.id) && (
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                            py: 1,
                            backgroundColor: '#e8f5e8',
                            borderRadius: '8px',
                            border: '1px solid #4caf50'
                          }}>
                            <Typography sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: '14px',
                              color: '#2e7d32'
                            }}>
                              ✓ Saved
                            </Typography>
                          </Box>
                        )}

                        {/* Add Another Button - Only show for the last entry */}
                        {entryIndex === educationEntries.length - 1 && (
                          <Button
                            onClick={addEducationEntry}
                            sx={{
                              width: '170px',
                              height: '47px',
                              borderRadius: '8px',
                              border: '1px solid #AAAAAA',
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: '18px',
                              lineHeight: '140%',
                              letterSpacing: '0%',
                              background: '#FFFFFF',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              color: 'transparent',
                              backgroundImage: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                              textTransform: 'none',
                              '&:hover': {
                                background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                                color: '#FFFFFF',
                                border: '1px solid #AAAAAA'
                              },
                              '@media (max-width: 768px)': {
                                width: '130px',
                                height: '42px',
                                fontSize: '16px'
                              },
                              '@media (max-width: 480px)': {
                                width: '120px',
                                height: '38px',
                                fontSize: '14px'
                              }
                            }}
                          >
                            + Add Another
                          </Button>
                        )}
                      </Box>
                    </Box>
                    ))}
                  </Box>
              </Box>
              )}

              {/* Certifications Section */}
              {(!activeSection || activeSection === 'certifications') && (
              <Box sx={{ mt: 6 }}>
                {/* Certifications Header */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 3
                }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: '20px',
                      lineHeight: '140%',
                      letterSpacing: '0%',
                      background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      '@media (max-width: 768px)': {
                        fontSize: '18px'
                      },
                      '@media (max-width: 480px)': {
                        fontSize: '16px'
                      }
                    }}
                  >
                    Certifications
                  </Typography>
                </Box>

                {/* Dynamic Certifications Containers */}
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    alignItems: 'center',
                    width: '100%',
                    '@media (max-width: 768px)': {
                      gap: '20px'
                    },
                    '@media (max-width: 480px)': {
                      gap: '16px'
                    }
                  }}>
                    {certificationEntries.map((entry, entryIndex) => (
                      <Box key={entry.id} sx={{
                        width: '842px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        boxShadow: '0px 0px 4px 0px #F2B6C6',
                        padding: '24px',
                        position: 'relative',
                        '@media (max-width: 1200px)': {
                          width: '100%',
                          maxWidth: '842px'
                        },
                        '@media (max-width: 768px)': {
                          padding: '20px'
                        },
                        '@media (max-width: 480px)': {
                          padding: '16px'
                        }
                      }}>
                        {/* Entry Header with Delete Button (if more than one entry) */}
                        {certificationEntries.length > 1 && (
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2
                          }}>
                            <Typography
                              sx={{
                                fontFamily: 'Poppins',
                                fontWeight: 500,
                                fontSize: '16px',
                                color: '#69247C'
                              }}
                            >
                              Certification {entryIndex + 1}
                            </Typography>
                            <Button
                              onClick={() => removeCertificationEntry(entry.id)}
                              sx={{
                                color: '#DA498D',
                                fontFamily: 'Poppins',
                                fontWeight: 500,
                                fontSize: '14px',
                                textTransform: 'none',
                                minWidth: 'auto',
                                px: 1
                              }}
                            >
                              Remove
                            </Button>
                          </Box>
                        )}
                {/* Certifications Form Fields */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '24px',
                  mb: '32px',
                  '@media (max-width: 768px)': {
                    gridTemplateColumns: '1fr',
                    gap: '16px',
                    mb: '24px'
                  },
                  '@media (max-width: 480px)': {
                    gap: '12px',
                    mb: '20px'
                  }
                }}>
                  {/* Certification Name */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#444444',
                        mb: 1
                      }}
                    >
                      Certification Name
                    </Typography>
                    <TextField
                      fullWidth
                      value={entry.certificationName}
                      onChange={(e) => updateCertificationEntry(entry.id, 'certificationName', e.target.value)}
                      placeholder="Enter Certification Name"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '55px',
                          '@media (max-width: 768px)': {
                            height: '50px'
                          },
                          '@media (max-width: 480px)': {
                            height: '45px'
                          },
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #8A8A8A',
                          '& fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&:hover fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&.Mui-focused fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Issued by */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#444444',
                        mb: 1
                      }}
                    >
                      Issued by
                    </Typography>
                    <TextField
                      fullWidth
                      value={entry.issuingOrganization}
                      onChange={(e) => updateCertificationEntry(entry.id, 'issuingOrganization', e.target.value)}
                      placeholder="Enter Issuing Organization"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '55px',
                          '@media (max-width: 768px)': {
                            height: '50px'
                          },
                          '@media (max-width: 480px)': {
                            height: '45px'
                          },
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #8A8A8A',
                          '& fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&:hover fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&.Mui-focused fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Passout Year */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#444444',
                        mb: 1
                      }}
                    >
                      Passout Year
                    </Typography>
                    <TextField
                      fullWidth
                      value={entry.issueDate}
                      onChange={(e) => updateCertificationEntry(entry.id, 'issueDate', e.target.value)}
                      placeholder="Enter Issue Date"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '55px',
                          '@media (max-width: 768px)': {
                            height: '50px'
                          },
                          '@media (max-width: 480px)': {
                            height: '45px'
                          },
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #8A8A8A',
                          '& fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&:hover fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&.Mui-focused fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Any Other Section */}
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '140%',
                        letterSpacing: '0%',
                        color: '#444444',
                        mb: 1
                      }}
                    >
                      Credential ID
                    </Typography>
                    <TextField
                      fullWidth
                      value={entry.credentialId}
                      onChange={(e) => updateCertificationEntry(entry.id, 'credentialId', e.target.value)}
                      placeholder="Enter Credential ID"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: '55px',
                          '@media (max-width: 768px)': {
                            height: '50px'
                          },
                          '@media (max-width: 480px)': {
                            height: '45px'
                          },
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #8A8A8A',
                          '& fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&:hover fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                          '&.Mui-focused fieldset': {
                            border: '1px solid #8A8A8A',
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>

                {/* Document Upload Box */}
                {isCertificationsExpanded && (
                <Box sx={{ 
                  mb: '32px',
                  '@media (max-width: 768px)': {
                    mb: '24px'
                  },
                  '@media (max-width: 480px)': {
                    mb: '20px'
                  }
                }}>
                  {/* Document Upload Box */}
                  <Box
                    sx={{
                      width: '300px',
                      minHeight: '120px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid',
                      borderImage: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%) 1',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      p: '16px',
                      '@media (max-width: 768px)': {
                        width: '280px',
                        minHeight: '110px',
                        gap: '6px',
                        p: '14px'
                      },
                      '@media (max-width: 480px)': {
                        width: '260px',
                        minHeight: '100px',
                        gap: '4px',
                        p: '12px'
                      }
                    }}
                  >
                    {/* Hidden File Input - Always present */}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      style={{ display: 'none' }}
                      id={`certificate-upload-${entry.id}`}
                      onChange={(e) => handleCertificateUpload(e, entry.id)}
                      key={`file-input-${entry.id}-${certificationFileUploads[entry.id] ? 'has-file' : 'no-file'}`}
                    />

                    {/* Show uploaded file if exists, otherwise show upload button */}
                    {certificationFileUploads[entry.id] ? (
                      <Box sx={{ 
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                      }}>
                        {/* Document Preview */}
                        <Box sx={{ 
                          position: 'relative',
                          width: '100%',
                          height: '120px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid #E9ECEF',
                          '@media (max-width: 768px)': {
                            height: '110px'
                          },
                          '@media (max-width: 480px)': {
                            height: '100px'
                          }
                        }}>
                          {/* Image Preview or File Icon */}
                          {certificationFileUploads[entry.id].file ? (
                            <img
                              src={URL.createObjectURL(certificationFileUploads[entry.id].file)}
                              alt="Certificate preview"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#F8F9FA',
                                border: '1px solid #E9ECEF'
                              }}
                            >
                              <DescriptionIcon 
                                sx={{ 
                                  fontSize: '48px', 
                                  color: '#69247C',
                                  '@media (max-width: 768px)': {
                                    fontSize: '40px'
                                  },
                                  '@media (max-width: 480px)': {
                                    fontSize: '32px'
                                  }
                                }} 
                              />
                            </Box>
                          )}
                        </Box>

                        {/* File Info and Action Buttons - Outside the preview */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          p: 2,
                          backgroundColor: '#F8F9FA',
                          borderRadius: '8px',
                          border: '1px solid #E9ECEF'
                        }}>
                          {/* File Info */}
                          <Box sx={{ 
                            flex: 1,
                            minWidth: 0, // Allow shrinking
                            maxWidth: '200px', // Limit maximum width
                            '@media (max-width: 768px)': {
                              maxWidth: '150px'
                            },
                            '@media (max-width: 480px)': {
                              maxWidth: '120px'
                            }
                          }}>
                            <Typography
                              sx={{
                                fontFamily: 'Poppins',
                                fontWeight: 500,
                                fontSize: '14px',
                                color: '#444444',
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                '@media (max-width: 768px)': {
                                  fontSize: '12px'
                                },
                                '@media (max-width: 480px)': {
                                  fontSize: '11px'
                                }
                              }}
                              title={certificationFileUploads[entry.id].name} // Show full name on hover
                            >
                              {certificationFileUploads[entry.id].name}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: 'Poppins',
                                fontWeight: 400,
                                fontSize: '12px',
                                color: '#666666',
                                '@media (max-width: 768px)': {
                                  fontSize: '10px'
                                },
                                '@media (max-width: 480px)': {
                                  fontSize: '9px'
                                }
                              }}
                            >
                              {certificationFileUploads[entry.id].size}
                            </Typography>
                          </Box>
                          
                          {/* Action Buttons */}
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {/* Change Button */}
                            <Button
                              component="label"
                              htmlFor={`certificate-upload-${entry.id}`}
                              sx={{
                                background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                                color: 'white',
                                fontFamily: 'Poppins',
                                fontWeight: 600,
                                fontSize: '12px',
                                textTransform: 'none',
                                px: 2,
                                py: 1,
                                borderRadius: '6px',
                                minWidth: 'auto',
                                '&:hover': {
                                  background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                                },
                                '@media (max-width: 768px)': {
                                  fontSize: '11px',
                                  px: 1.5,
                                  py: 0.8
                                },
                                '@media (max-width: 480px)': {
                                  fontSize: '10px',
                                  px: 1.2,
                                  py: 0.6
                                }
                              }}
                            >
                              Change
                            </Button>
                            
                            {/* Delete Button */}
                            <IconButton 
                              onClick={() => handleCertificateRemove(entry.id)}
                              sx={{ 
                                p: 1,
                                backgroundColor: '#d32f2f',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: '#b71c1c'
                                }
                              }}
                            >
                              <CloseIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <DescriptionIcon 
                          sx={{ 
                            fontSize: '32px', 
                            color: '#69247C',
                            '@media (max-width: 768px)': {
                              fontSize: '28px'
                            },
                            '@media (max-width: 480px)': {
                              fontSize: '24px'
                            }
                          }} 
                        />
                        
                        <Button
                          component="label"
                          htmlFor={`certificate-upload-${entry.id}`}
                          sx={{
                            background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                            color: '#FFFFFF',
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '14px',
                            textTransform: 'none',
                            px: 2,
                            py: 1,
                            borderRadius: '6px',
                            '&:hover': {
                              background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                            },
                            '@media (max-width: 768px)': {
                              fontSize: '12px',
                              px: 1.5,
                              py: 0.8
                            },
                            '@media (max-width: 480px)': {
                              fontSize: '11px',
                              px: 1.2,
                              py: 0.6
                            }
                          }}
                        >
                          + Add Document
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
                )}


                    {/* Save and Add Another Buttons */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 3,
                      mb: 2,
                      gap: 2
                    }}>
                      {/* Done Button - Only show if not submitted */}
                      {!submittedCertificationEntries.has(entry.id) && (
                      <Button
                          onClick={() => handleCertificationSubmit(entry)}
                          disabled={isSubmitting}
                        sx={{
                          background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                          color: '#FFFFFF',
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontSize: '16px',
                          textTransform: 'none',
                          px: '24px',
                          py: '10px',
                          borderRadius: '8px',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                          },
                          '@media (max-width: 768px)': {
                            fontSize: '14px',
                            px: '20px',
                            py: '8px'
                          },
                          '@media (max-width: 480px)': {
                            fontSize: '12px',
                            px: '16px',
                            py: '6px'
                          }
                        }}
                      >
                        Done
                      </Button>
                      )}
                      
                      {/* Success indicator for submitted entries */}
                      {submittedCertificationEntries.has(entry.id) && (
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 2,
                          py: 1,
                          backgroundColor: '#e8f5e8',
                          borderRadius: '8px',
                          border: '1px solid #4caf50'
                        }}>
                          <Typography sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '14px',
                            color: '#2e7d32'
                          }}>
                            ✓ Saved
                          </Typography>
                        </Box>
                      )}

                      {/* Add Another Button */}
                      <Button
                        onClick={addCertificationEntry}
                        sx={{
                          width: '170px',
                          height: '47px',
                          borderRadius: '8px',
                          border: '1px solid #AAAAAA',
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                          fontSize: '18px',
                          lineHeight: '140%',
                          letterSpacing: '0%',
                          background: '#FFFFFF',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          backgroundImage: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                          textTransform: 'none',
                          '&:hover': {
                            background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                            color: '#FFFFFF',
                            border: '1px solid #AAAAAA'
                          },
                          '@media (max-width: 768px)': {
                            width: '130px',
                            height: '42px',
                            fontSize: '16px'
                          },
                          '@media (max-width: 480px)': {
                            width: '120px',
                            height: '38px',
                            fontSize: '14px'
                          }
                        }}
                      >
                        + Add Another
                      </Button>
                    </Box>
                    </Box>
                    ))}
                  </Box>
              </Box>
              )}

              {/* Skills Section */}
              {(!activeSection || activeSection === 'skills') && (
              <Box sx={{ 
                mt: '48px',
                '@media (max-width: 768px)': {
                  mt: '32px'
                },
                '@media (max-width: 480px)': {
                  mt: '24px'
                }
              }}>
                {/* Skills Header */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                  justifyContent: 'center',
                    mb: '24px',
                    '@media (max-width: 768px)': {
                      mb: '20px'
                    },
                    '@media (max-width: 480px)': {
                      mb: '16px'
                    }
                }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: '20px',
                      lineHeight: '140%',
                      letterSpacing: '0%',
                      background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      '@media (max-width: 768px)': {
                        fontSize: '18px'
                      },
                      '@media (max-width: 480px)': {
                        fontSize: '16px'
                      }
                    }}
                  >
                    Skills
                  </Typography>
                </Box>

                {/* Skills Container */}
                  <Box sx={{
                    width: { xs: '100%', md: '842px' },
                    maxWidth: '842px',
                    minHeight: { xs: 'auto', md: '500px' },
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 4px 0px #F2B6C6',
                    padding: { xs: 2, sm: 3, md: '24px' },
                    margin: '0 auto',
                    position: 'relative'
                  }}>
                {/* Search Bar */}
                <Box sx={{ 
                  mb: { xs: 2, sm: 2.5, md: '24px' }
                }}>
                  <TextField
                    fullWidth
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      width: { xs: '100%', sm: '100%', md: '333px' },
                      height: { xs: '40px', sm: '42px', md: '43px' },
                      '& .MuiOutlinedInput-root': {
                        height: { xs: '40px', sm: '42px', md: '43px' },
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D9D9D9',
                        '& fieldset': {
                          border: '1px solid #D9D9D9',
                        },
                        '&:hover fieldset': {
                          border: '1px solid #D9D9D9',
                        },
                        '&.Mui-focused fieldset': {
                          border: '1px solid #D9D9D9',
                        },
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <SearchIcon 
                          sx={{ 
                            color: '#8A8A8A', 
                            mr: 1,
                            fontSize: { xs: '18px', sm: '19px', md: '20px' }
                          }} 
                        />
                      ),
                    }}
                  />
                </Box>

                {/* Skills List */}
                <Box sx={{ 
                  border: '1px solid #D9D9D9',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  mb: { xs: 2, sm: 2.5, md: '24px' },
                  maxHeight: { xs: '200px', sm: '250px', md: '300px' },
                  overflowY: 'auto',
                  position: 'relative'
                }}>
                  {/* Skills count indicator */}
                  {!skillsLoading && !skillsError && (
                    <Box sx={{
                      position: 'sticky',
                      top: 0,
                      backgroundColor: '#FFFFFF',
                      padding: '8px 16px',
                      borderBottom: '1px solid #D9D9D9',
                      zIndex: 1
                    }}>
                      <Typography
                        sx={{
                          fontFamily: 'Poppins',
                          fontWeight: 400,
                          fontSize: '12px',
                          color: '#666666'
                        }}
                      >
                        {filteredSkills.length} of {skills.length} skills {searchTerm ? '(filtered)' : ''}
                      </Typography>
                    </Box>
                  )}
                  {skillsLoading ? (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      py: 4 
                    }}>
                      <CircularProgress size={24} sx={{ color: '#69247C' }} />
                    </Box>
                  ) : skillsError ? (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      py: 4 
                    }}>
                      <Typography
                        sx={{
                          fontFamily: 'Poppins',
                          fontWeight: 400,
                          fontSize: '14px',
                          color: '#999999'
                        }}
                      >
                        {skillsError}
                      </Typography>
                    </Box>
                  ) : filteredSkills.length > 0 ? (
                    filteredSkills.map((skill, index) => (
                      <Box
                        key={skill.skillId}
                        onClick={() => handleSkillSelect(skill.skillName)}
                        sx={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderBottom: index < filteredSkills.length - 1 ? '1px solid #D9D9D9' : 'none',
                          backgroundColor: selectedSkills.includes(skill.skillName) ? '#E8F4FD' : 'transparent',
                          '&:hover': {
                            backgroundColor: selectedSkills.includes(skill.skillName) ? '#D1E9F6' : '#F5F5F5'
                          }
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 400,
                            fontSize: { xs: '14px', sm: '15px', md: '16px' },
                            color: selectedSkills.includes(skill.skillName) ? '#1976D2' : '#444444'
                          }}
                        >
                          {skill.skillName}
                          {selectedSkills.includes(skill.skillName) && ' ✓'}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      py: 4 
                    }}>
                      <Typography
                        sx={{
                          fontFamily: 'Poppins',
                          fontWeight: 400,
                          fontSize: '14px',
                          color: '#999999'
                        }}
                      >
                        No skills available
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Rate Your Skills Section */}
                <Box sx={{ mb: { xs: 3, sm: 3.5, md: '32px' } }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: { xs: '16px', sm: '17px', md: '18px' },
                      color: '#444444',
                      mb: { xs: 1.5, sm: 2 }
                    }}
                  >
                    Rate Your Skills
                  </Typography>
                  
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 400,
                      fontSize: { xs: '12px', sm: '13px', md: '14px' },
                      color: '#666666',
                      mb: { xs: 2, sm: 2.5, md: 3 },
                      lineHeight: { xs: 1.4, md: 1.5 }
                    }}
                  >
                    Beginner : 1-2 stars, Intermediate : 3-4 stars, Expert : 5 stars
                  </Typography>

                  {/* Selected Skills with Ratings */}
                  {selectedSkills.length > 0 ? (
                  <Box sx={{ 
                    display: 'flex', 
                      flexDirection: 'column',
                      gap: 2
                    }}>
                      {selectedSkills.map((skill) => (
                        <Box key={skill} sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          justifyContent: 'space-between',
                          p: { xs: 1.5, sm: 2 },
                          backgroundColor: '#F8F9FA',
                          borderRadius: '8px',
                          border: '1px solid #E9ECEF',
                          gap: { xs: 2, sm: 1 }
                        }}>
                          {/* Skill Name */}
                          <Typography
                        sx={{
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                              fontSize: { xs: '14px', sm: '15px', md: '16px' },
                              color: '#444444',
                              flex: { xs: '1 1 auto', sm: '0 1 auto' },
                              minWidth: 0,
                              wordBreak: 'break-word'
                            }}
                          >
                            {skill}
                          </Typography>
                          
                          {/* Star Rating */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <IconButton
                                key={star}
                                onClick={() => handleStarClick(skill, star)}
                                sx={{ p: 0.25 }}
                              >
                                {star <= (skillRatings[skill] || 1) ? (
                                  <StarIcon sx={{ color: '#FFD700', fontSize: { xs: 18, sm: 19, md: 20 } }} />
                                ) : (
                                  <StarBorderIcon sx={{ color: '#D9D9D9', fontSize: { xs: 18, sm: 19, md: 20 } }} />
                                )}
                              </IconButton>
                            ))}
                          </Box>
                          
                          {/* Action Buttons */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1 }, flexShrink: 0, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                            {/* Submit Button - Only show if not submitted */}
                            {!submittedSkills.has(skill) && (
                              <Button
                                onClick={() => handleSkillSubmit(skill, skillRatings[skill] || 1)}
                                disabled={isSubmitting}
                                sx={{
                                  background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                                  color: 'white',
                                  fontFamily: 'Poppins',
                                  fontWeight: 500,
                                  fontSize: { xs: '11px', sm: '11px', md: '12px' },
                                  textTransform: 'none',
                                  px: { xs: 1.5, sm: 1.8, md: 2 },
                                  py: { xs: 0.75, sm: 0.9, md: 1 },
                                  borderRadius: '6px',
                                  minWidth: 'auto',
                                  '&:hover': {
                                    background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                                  }
                                }}
                              >
                                Save
                              </Button>
                            )}
                            
                            {/* Success indicator for submitted skills */}
                            {submittedSkills.has(skill) && (
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: { xs: 0.5, sm: 1 },
                                px: { xs: 1.5, sm: 2 },
                                py: { xs: 0.75, sm: 1 },
                                backgroundColor: '#e8f5e8',
                                borderRadius: '8px',
                                border: '1px solid #4caf50'
                              }}>
                                <Typography sx={{
                                  fontFamily: 'Poppins',
                                  fontWeight: 500,
                                  fontSize: { xs: '11px', sm: '11px', md: '12px' },
                                  color: '#2e7d32'
                                }}>
                                  ✓ Saved
                                </Typography>
                              </Box>
                            )}
                            
                            {/* Remove Button */}
                            <IconButton
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSkillRemove(skill);
                              }}
                              sx={{ 
                                p: { xs: 0.4, sm: 0.5 },
                                color: '#DA498D'
                              }}
                            >
                              <CloseIcon sx={{ fontSize: { xs: 14, sm: 15, md: 16 } }} />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#999999',
                        fontStyle: 'italic'
                      }}
                    >
                      No skills selected yet
                    </Typography>
                  )}
                  </Box>
                  </Box>
              </Box>
              )}

              {/* Navigation Buttons */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: '48px',
                mb: '32px',
                '@media (max-width: 768px)': {
                  mt: '40px',
                  mb: '24px'
                },
                '@media (max-width: 480px)': {
                  mt: '32px',
                  mb: '20px'
                }
              }}>
                {/* Back Button */}
                <Button
                  onClick={() => navigate('/complete-profile')}
                  sx={{
                    background: 'transparent',
                    color: '#69247C',
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: '16px',
                    textTransform: 'none',
                    px: '32px',
                    py: '12px',
                    borderRadius: '8px',
                    border: '2px solid #69247C',
                    '&:hover': {
                      background: '#69247C',
                      color: '#FFFFFF'
                    },
                    '@media (max-width: 768px)': {
                      px: '24px',
                      py: '10px',
                      fontSize: '14px'
                    },
                    '@media (max-width: 480px)': {
                      px: '20px',
                      py: '8px',
                      fontSize: '12px'
                    }
                  }}
                >
                  Back
                </Button>

                {/* Save Button */}
                <Button
                  onClick={handleAllSubmissions}
                  disabled={isSubmitting}
                  sx={{
                    background: 'linear-gradient(90deg, #69247C 0%, #DA498D 100%)',
                    color: '#FFFFFF',
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: '16px',
                    textTransform: 'none',
                    px: '32px',
                    py: '12px',
                    borderRadius: '8px',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #5a1f6a 0%, #c43d7a 100%)'
                    },
                    '@media (max-width: 768px)': {
                      fontSize: '14px',
                      px: '24px',
                      py: '10px'
                    },
                    '@media (max-width: 480px)': {
                      fontSize: '12px',
                      px: '20px',
                      py: '8px'
                    }
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </Box>
              </Box>
            </motion.div>
          </Container>
        </Box>
    </>
  );
};

export default EducationBackgroundPage;
