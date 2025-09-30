import React, { useRef, useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Chip, IconButton, CircularProgress } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { motion, useInView } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import BasicInfoNavbar from '../components/BasicInfoNavbar';
import carouselImage from '../../assets/images/carousel.png';
import { getAllCategories } from '../../API/categoryApi';
import { getAllSkills } from '../../API/skillsApi';
import { getAllHighestQualifications } from '../../API/qualificationApi';
import { createEducation, linkEducationToProfile, getEducationsByProfileId, saveOrUpdateEducation, deleteEducation } from '../../API/educationApi';
import { createWorkExperience, linkWorkExperienceToProfile, getWorkExperiencesByProfileId, saveOrUpdateWorkExperience, deleteWorkExperience } from '../../API/workExperienceApi';
import { createCertification, linkCertificationToProfile, getCertificationsByProfileId, saveOrUpdateCertification, deleteCertification, uploadCertificationDocument } from '../../API/certificationApi';
import { saveOrUpdateProfessionalSkill, getProfessionalSkillsByProfileId, deleteProfessionalSkill } from '../../API/professionalSkillsApi';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Swal from 'sweetalert2';

const CarouselContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '1400px',
  height: '350px',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundImage: `url(${carouselImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 100px',
  margin: '0',
  
  // Media queries for responsive design
  '@media (max-width: 1200px)': {
    maxWidth: '1200px',
    height: '320px',
    padding: '0 80px',
  },
  '@media (max-width: 992px)': {
    maxWidth: '1000px',
    height: '300px',
    padding: '0 60px',
  },
  '@media (max-width: 768px)': {
    height: '280px',
    padding: '0 40px',
    borderRadius: '12px',
  },
  '@media (max-width: 576px)': {
    height: '250px',
    padding: '0 20px',
    borderRadius: '8px',
  },
  '@media (max-width: 480px)': {
    height: '200px',
    padding: '0 15px',
    borderRadius: '6px',
  },
}));

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

  // Get professionals profile ID from localStorage or context
  const professionalsProfileId = localStorage.getItem('professionalsProfileId') || 4; // Default for testing
  
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
      // If this skill was previously submitted, remove it from submitted set
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

      // Find skill ID from skills array
      const selectedSkill = skills.find(skill => skill.skillName === skillName);
      if (!selectedSkill) {
        throw new Error('Please select a valid skill');
      }

      const skillData = {
        professionalsProfileId: parseInt(professionalsProfileId),
        skillId: selectedSkill.skillId,
        skillName: skillName,
        rating: rating
      };

      const response = await saveOrUpdateProfessionalSkill(skillData);
      
      if (response.code === 1000) {
        console.log('Professional skill saved/updated successfully:', response.data);
        // Mark this skill as submitted
        setSubmittedSkills(prev => new Set(prev).add(skillName));
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
  const handleWorkExperienceSubmit = async (entry) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Find category ID from categories array
      const selectedCategory = categories.find(cat => cat.categoryName === entry.category);
      if (!selectedCategory) {
        throw new Error('Please select a valid category');
      }

      const workExperienceData = {
        categoryId: selectedCategory.categoryId,
        categoryName: entry.category,
        description: entry.description,
        professionalsProfileId: parseInt(professionalsProfileId),
        projectName: entry.projectName,
        roleTitle: entry.roleTitle,
        year: parseInt(entry.year)
      };

      const response = await saveOrUpdateWorkExperience(workExperienceData);
      
      if (response.code === 1000) {
        console.log('Work experience saved/updated successfully:', response.data);
        // Mark this entry as submitted
        setSubmittedWorkEntries(prev => new Set(prev).add(entry.id));
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to save/update work experience');
      }
    } catch (error) {
      console.error('Error submitting work experience:', error);
      setSubmitError(error.message || 'Failed to submit work experience');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEducationSubmit = async (entry) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const educationData = {
        academyName: entry.institution,
        gradePercentage: entry.grade,
        highestQualification: entry.qualification,
        passoutYear: parseInt(entry.year),
        professionalsProfileId: parseInt(professionalsProfileId)
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

      const certificationData = {
        certificationName: entry.certificationName,
        credentialId: entry.credentialId,
        issueDate: entry.issueDate,
        issuedBy: entry.issuingOrganization,
        professionalsProfileId: parseInt(professionalsProfileId)
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
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Submit All Information?',
      text: 'Are you sure you want to submit all your education, work experience, certifications, and skills?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#69247C',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit All!',
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
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      // Show loading alert
      Swal.fire({
        title: 'Submitting...',
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
          const result = await handleWorkExperienceSubmit(entry);
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
        title: 'Success!',
        text: 'All your information has been submitted successfully!',
        icon: 'success',
        confirmButtonColor: '#69247C',
        confirmButtonText: 'Continue to Next Step',
        customClass: {
          popup: 'swal2-popup-custom',
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom'
        }
      });
      
      // Navigate to next page
      navigate('/preferences');

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
    navigate('/preferences');
  };

  const handleBackClick = () => {
    navigate('/showcase');
  };

  // Load existing data
  const loadExistingData = async () => {
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
        skillsResponse.data.forEach(skill => {
          existingRatings[skill.skillName] = skill.rating;
        });
        
        if (existingSkills.length > 0) {
          setSelectedSkills(existingSkills);
          setSkillRatings(existingRatings);
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

      // Fetch Skills
      setSkillsLoading(true);
      setSkillsError(null);
      try {
        const skillsResponse = await getAllSkills();
        if (skillsResponse.data && skillsResponse.data.code === 200) {
          setSkills(skillsResponse.data.data || []);
        } else {
          setSkillsError('Failed to fetch skills');
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
          py: '32px',
          '@media (max-width: 768px)': {
            py: '24px'
          },
          '@media (max-width: 480px)': {
            py: '16px'
          }
        }}>
          <Container maxWidth="lg">
            <CarouselContainer>
              <ContentBox>
                <Typography
                  variant="h3"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '2.6rem',
                    lineHeight: 1.2,
                    mb: '16px',
                    textAlign: 'center',
                    '@media (max-width: 992px)': {
                      fontSize: '2.2rem'
                    },
                    '@media (max-width: 768px)': {
                      fontSize: '1.8rem',
                      mb: '12px'
                    },
                    '@media (max-width: 480px)': {
                      fontSize: '1.5rem',
                      mb: '8px'
                    }
                  }}
                >
                  Showcase your style.
                  <Box
                    component="span"
                    sx={{
                      color: '#DA498D',
                      fontWeight: 700,
                    }}
                  >
                    Get discovered.
                  </Box>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: { xs: '0.9rem', md: '1rem', lg: '1.1rem' },
                    lineHeight: 1.5,
                    mb: 3,
                    maxWidth: '500px',
                    textAlign: 'center',
                  }}
                >
                  Build your professional profile, showcase your portfolio, and unlock job opportunities across fashion, film, and beauty
                </Typography>
              </ContentBox>
            </CarouselContainer>
          </Container>
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
                {/* Back Button - Positioned absolutely on the left */}
                <Button
                  onClick={() => navigate('/showcase')}
                  sx={{
                    position: 'absolute',
                    left: 0,
                    background: 'transparent',
                    color: '#69247C',
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: '16px',
                    textTransform: 'none',
                    px: 0,
                    py: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      background: 'transparent',
                      color: '#5a1f6a'
                    },
                    '@media (max-width: 768px)': {
                      position: 'static',
                      fontSize: '14px'
                    },
                    '@media (max-width: 480px)': {
                      fontSize: '12px'
                    }
                  }}
                >
                  ← Back
                </Button>

                {/* Centered - Step 4 of 5 */}
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '28px',
                    lineHeight: '140%',
                    letterSpacing: '0%',
                    color: '#69247C',
                    '@media (max-width: 992px)': {
                      fontSize: '24px'
                    },
                    '@media (max-width: 768px)': {
                      fontSize: '20px',
                      textAlign: 'center',
                      width: '100%'
                    },
                    '@media (max-width: 480px)': {
                      fontSize: '18px'
                    }
                  }}
                >
                  Step 4 of 5
                </Typography>

              </Box>

              {/* Progress Indicator - Above Education Section */}
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  {/* Step 1 - Completed */}
                  <Box
                    sx={{
                      width: 27,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                      border: '1px solid #8A8A8A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                  <Box
                    sx={{
                      width: 128,
                      height: 1,
                      border: '1px solid #D9D9D9',
                      backgroundColor: '#D9D9D9'
                    }}
                  />
                  {/* Step 2 - Completed */}
                  <Box
                    sx={{
                      width: 27,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                      border: '1px solid #8A8A8A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                  <Box
                    sx={{
                      width: 128,
                      height: 1,
                      border: '1px solid #D9D9D9',
                      backgroundColor: '#D9D9D9'
                    }}
                  />
                  {/* Step 3 - Completed */}
                  <Box
                    sx={{
                      width: 27,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                      border: '1px solid #8A8A8A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                  <Box
                    sx={{
                      width: 128,
                      height: 1,
                      border: '1px solid #D9D9D9',
                      backgroundColor: '#D9D9D9'
                    }}
                  />
                  {/* Step 4 - Current */}
                  <Box
                    sx={{
                      width: 27,
                      height: 28,
                      borderRadius: '50%',
                      background: 'linear-gradient(180deg, #69247C 0%, #DA498D 100%)',
                      border: '1px solid #8A8A8A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                  <Box
                    sx={{
                      width: 128,
                      height: 1,
                      border: '1px solid #D9D9D9',
                      backgroundColor: '#D9D9D9'
                    }}
                  />
                  {/* Step 5 - Inactive */}
                  <Box
                    sx={{
                      width: 27,
                      height: 28,
                      borderRadius: '50%',
                      border: '1px solid #D9D9D9',
                      backgroundColor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                </Box>
              </Box>

              {/* Present Work / Experience Section */}
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
                          onClick={() => handleWorkExperienceSubmit(entry)}
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

              {/* Education Section */}
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

                        {/* Add Another Button */}
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
                      </Box>
                    </Box>
                    ))}
                  </Box>
              </Box>

              {/* Certifications Section */}
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


              {/* Skills Section */}
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
                    width: '842px',
                    minHeight: '500px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    boxShadow: '0px 0px 4px 0px #F2B6C6',
                    padding: '24px',
                    margin: '0 auto',
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
                {/* Search Bar */}
                <Box sx={{ 
                  mb: '24px',
                  '@media (max-width: 768px)': {
                    mb: '20px'
                  },
                  '@media (max-width: 480px)': {
                    mb: '16px'
                  }
                }}>
                  <TextField
                    fullWidth
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                      width: '333px',
                      height: '43px',
                      '& .MuiOutlinedInput-root': {
                        height: '43px',
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
                      },
                      '@media (max-width: 768px)': {
                        width: '100%',
                        height: '40px',
                        '& .MuiOutlinedInput-root': {
                          height: '40px'
                        }
                      },
                      '@media (max-width: 480px)': {
                        height: '38px',
                        '& .MuiOutlinedInput-root': {
                          height: '38px'
                        }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <SearchIcon 
                          sx={{ 
                            color: '#8A8A8A', 
                            mr: 1,
                            fontSize: '20px',
                            '@media (max-width: 768px)': {
                              fontSize: '18px'
                            },
                            '@media (max-width: 480px)': {
                              fontSize: '16px'
                            }
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
                  mb: '24px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  '@media (max-width: 768px)': {
                    mb: '20px',
                    maxHeight: '180px'
                  },
                  '@media (max-width: 480px)': {
                    mb: '16px',
                    maxHeight: '160px'
                  }
                }}>
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
                            fontSize: '16px',
                            color: selectedSkills.includes(skill.skillName) ? '#1976D2' : '#444444',
                            '@media (max-width: 768px)': {
                              fontSize: '14px'
                            },
                            '@media (max-width: 480px)': {
                              fontSize: '12px'
                            }
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
                <Box sx={{ mb: '32px' }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: '18px',
                      color: '#444444',
                      mb: 2
                    }}
                  >
                    Rate Your Skills
                  </Typography>
                  
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 400,
                      fontSize: '14px',
                      color: '#666666',
                      mb: 3
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
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 2,
                          backgroundColor: '#F8F9FA',
                          borderRadius: '8px',
                          border: '1px solid #E9ECEF'
                        }}>
                          {/* Skill Name */}
                          <Typography
                        sx={{
                          fontFamily: 'Poppins',
                          fontWeight: 500,
                              fontSize: '16px',
                              color: '#444444'
                            }}
                          >
                            {skill}
                          </Typography>
                          
                          {/* Star Rating */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <IconButton
                                key={star}
                                onClick={() => handleStarClick(skill, star)}
                                sx={{ p: 0.25 }}
                              >
                                {star <= (skillRatings[skill] || 1) ? (
                                  <StarIcon sx={{ color: '#FFD700', fontSize: 20 }} />
                                ) : (
                                  <StarBorderIcon sx={{ color: '#D9D9D9', fontSize: 20 }} />
                                )}
                              </IconButton>
                            ))}
                          </Box>
                          
                          {/* Action Buttons */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                                Save
                              </Button>
                            )}
                            
                            {/* Success indicator for submitted skills */}
                            {submittedSkills.has(skill) && (
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
                                  fontSize: '12px',
                                  color: '#2e7d32'
                                }}>
                                  ✓ Saved
                                </Typography>
                              </Box>
                            )}
                            
                            {/* Remove Button */}
                            <IconButton
                              onClick={() => handleSkillRemove(skill)}
                              sx={{ 
                                p: 0.5,
                                color: '#DA498D'
                              }}
                            >
                              <CloseIcon sx={{ fontSize: 16 }} />
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
                  onClick={() => navigate('/showcase')}
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

                {/* Next Button */}
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
                  {isSubmitting ? 'Submitting...' : 'Next'}
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
