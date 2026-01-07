import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  IconButton,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { sessionManager } from '../../API/authApi';
import { getAgencyRegisterById } from '../../API/agencyRegisterApi';

const AgencyDashboard = () => {
  const navigate = useNavigate();
  const [agencyData, setAgencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get session data
    const userSession = sessionManager.getUserSession();
    setSession(userSession);

    // Fetch agency data if agencyId is available
    const fetchAgencyData = async () => {
      try {
        const agencyId = localStorage.getItem('agencyId') || userSession?.user?.agencyId;
        if (agencyId) {
          const response = await getAgencyRegisterById(agencyId);
          if (response.success) {
            setAgencyData(response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching agency data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencyData();
  }, []);

  // Dashboard stats cards
  const statsCards = [
    {
      title: 'Total Projects',
      value: '12',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: '#69247C' }} />,
      color: '#69247C',
      bgColor: '#F5E6F8',
    },
    {
      title: 'Active Talent',
      value: '45',
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#DA498D' }} />,
      color: '#DA498D',
      bgColor: '#FFF0F5',
    },
    {
      title: 'Pending Requests',
      value: '8',
      icon: <PendingIcon sx={{ fontSize: 40, color: '#FF9800' }} />,
      color: '#FF9800',
      bgColor: '#FFF3E0',
    },
    {
      title: 'Completed Projects',
      value: '28',
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#4CAF50' }} />,
      color: '#4CAF50',
      bgColor: '#E8F5E9',
    },
  ];

  // Quick actions
  const quickActions = [
    {
      title: 'Create New Project',
      description: 'Post a new project requirement',
      icon: <AddIcon sx={{ fontSize: 32 }} />,
      color: '#69247C',
      onClick: () => navigate('/hire-talent/hiring-for'),
    },
    {
      title: 'View Basic Details',
      description: 'Manage your agency profile',
      icon: <BusinessIcon sx={{ fontSize: 32 }} />,
      color: '#DA498D',
      onClick: () => navigate('/agency/basicdetails'),
    },
    {
      title: 'Verify Agency',
      description: 'Complete your verification',
      icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
      color: '#FF9800',
      onClick: () => navigate('/agency/verifyagency'),
    },
  ];

  // Recent activities (dummy data)
  const recentActivities = [
    { id: 1, title: 'New project posted', description: 'Film/TV Actor role', time: '2 hours ago', type: 'project' },
    { id: 2, title: 'Talent application received', description: 'John Doe applied', time: '5 hours ago', type: 'application' },
    { id: 3, title: 'Project completed', description: 'Commercial shoot', time: '1 day ago', type: 'completed' },
    { id: 4, title: 'Profile updated', description: 'Business details updated', time: '2 days ago', type: 'profile' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <Navbar />
      
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              mb: 4,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #69247C 0%, #DA498D 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2 }}>
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: { xs: '24px', sm: '28px', md: '32px' },
                    mb: 1,
                  }}
                >
                  Welcome back, {agencyData?.businessName || session?.user?.businessName || 'Agency'}!
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: { xs: '14px', sm: '16px' },
                    opacity: 0.9,
                  }}
                >
                  Manage your projects, talent, and agency profile from one place.
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={() => navigate('/agency/basicdetails')}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: 'white',
                  color: '#69247C',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '16px',
                  '&:hover': {
                    backgroundColor: '#F5F5F5',
                  },
                }}
              >
                Create profile 
              </Button>
            </Box>
          </Paper>
        </motion.div>

        {/* Agency Information Card */}
        {agencyData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', mb: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '20px',
                    color: '#DA498D',
                    mb: 3,
                  }}
                >
                  Agency Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <BusinessIcon sx={{ color: '#69247C', fontSize: 20 }} />
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '14px',
                            color: '#9E9E9E',
                            mb: 0.5,
                          }}
                        >
                          Business Name
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            fontSize: '16px',
                            color: '#444444',
                          }}
                        >
                          {agencyData.businessName || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <EmailIcon sx={{ color: '#69247C', fontSize: 20 }} />
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '14px',
                            color: '#9E9E9E',
                            mb: 0.5,
                          }}
                        >
                          Email
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            fontSize: '16px',
                            color: '#444444',
                          }}
                        >
                          {agencyData.email || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <PhoneIcon sx={{ color: '#69247C', fontSize: 20 }} />
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '14px',
                            color: '#9E9E9E',
                            mb: 0.5,
                          }}
                        >
                          Phone
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            fontSize: '16px',
                            color: '#444444',
                          }}
                        >
                          {agencyData.phoneNo || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocationOnIcon sx={{ color: '#69247C', fontSize: 20 }} />
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 500,
                            fontSize: '14px',
                            color: '#9E9E9E',
                            mb: 0.5,
                          }}
                        >
                          Location
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            fontSize: '16px',
                            color: '#444444',
                          }}
                        >
                          {agencyData.city?.cityName || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/agency/basicdetails')}
                    sx={{
                      borderColor: '#69247C',
                      color: '#69247C',
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      textTransform: 'none',
                      borderRadius: '8px',
                      px: 3,
                      '&:hover': {
                        borderColor: '#DA498D',
                        backgroundColor: '#FFF0F5',
                      },
                    }}
                  >
                    View Full Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '12px',
                          backgroundColor: stat.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {stat.icon}
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '32px',
                        color: stat.color,
                        mb: 0.5,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: '14px',
                        color: '#5E6366',
                      }}
                    >
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: '20px',
                      color: '#DA498D',
                      mb: 3,
                    }}
                  >
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {quickActions.map((action, index) => (
                      <Paper
                        key={index}
                        onClick={action.onClick}
                        sx={{
                          p: 2,
                          borderRadius: '8px',
                          border: '1px solid #E0E0E0',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          '&:hover': {
                            borderColor: action.color,
                            backgroundColor: `${action.color}10`,
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '8px',
                            backgroundColor: `${action.color}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: action.color,
                          }}
                        >
                          {action.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 600,
                              fontSize: '16px',
                              color: '#444444',
                              mb: 0.5,
                            }}
                          >
                            {action.title}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 400,
                              fontSize: '14px',
                              color: '#5E6366',
                            }}
                          >
                            {action.description}
                          </Typography>
                        </Box>
                        <ArrowForwardIcon sx={{ color: action.color }} />
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 600,
                      fontSize: '20px',
                      color: '#DA498D',
                      mb: 3,
                    }}
                  >
                    Recent Activities
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentActivities.map((activity) => (
                      <Box
                        key={activity.id}
                        sx={{
                          p: 2,
                          borderRadius: '8px',
                          border: '1px solid #E0E0E0',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: '#F5F5F5',
                            borderColor: '#DA498D',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                          <Typography
                            sx={{
                              fontFamily: 'Poppins',
                              fontWeight: 600,
                              fontSize: '16px',
                              color: '#444444',
                            }}
                          >
                            {activity.title}
                          </Typography>
                          <Chip
                            label={activity.type}
                            size="small"
                            sx={{
                              backgroundColor: activity.type === 'completed' ? '#E8F5E9' : activity.type === 'project' ? '#E3F2FD' : '#FFF3E0',
                              color: activity.type === 'completed' ? '#4CAF50' : activity.type === 'project' ? '#1976D2' : '#FF9800',
                              fontFamily: 'Poppins',
                              fontWeight: 500,
                              fontSize: '12px',
                            }}
                          />
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 400,
                            fontSize: '14px',
                            color: '#5E6366',
                            mb: 1,
                          }}
                        >
                          {activity.description}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: 'Poppins',
                            fontWeight: 400,
                            fontSize: '12px',
                            color: '#9E9E9E',
                          }}
                        >
                          {activity.time}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AgencyDashboard;

