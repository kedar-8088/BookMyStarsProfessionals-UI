import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { 
    IconFileText, 
    IconUsers, 
    IconClock, 
    IconAlertCircle 
} from '@tabler/icons-react';
import Banner from './Banner';

// ==============================|| HIRING-TALENT DASHBOARD ||============================== //

const HiringTalent = () => {

    const stats = [
        {
            title: 'TOTAL HIRING TALENTS',
            value: '1,234',
            subText: '+12% vs last month',
            icon: IconFileText,
            iconColor: '#FFFFFF',
            iconBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            cardAccent: '#667eea',
            animationDelay: '0s'
        },
        {
            title: 'ACTIVE HIRING TALENTS',
            value: '987',
            subText: 'Currently active',
            icon: IconUsers,
            iconColor: '#FFFFFF',
            iconBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            cardAccent: '#f5576c',
            animationDelay: '0.1s'
        },
        {
            title: 'PENDING VERIFICATION',
            value: '156',
            subText: '18 awaiting review',
            icon: IconClock,
            iconColor: '#FFFFFF',
            iconBg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            cardAccent: '#4facfe',
            animationDelay: '0.2s'
        },
        {
            title: 'SUSPENDED',
            value: '23',
            subText: '3 pending action',
            icon: IconAlertCircle,
            iconColor: '#FFFFFF',
            iconBg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            cardAccent: '#fa709a',
            animationDelay: '0.3s'
        }
    ];

    return (
        <Box sx={{ mt: { xs: 2, sm: 2, md: 3 }, width: '100%', px: { xs: 1, sm: 1, md: 0 } }}>
            <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item xs={12}>
                    <Banner />
                </Grid>

                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '16px',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    border: `2px solid transparent`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    animation: `fadeInUp 0.6s ease-out ${stat.animationDelay} both`,
                                    '@keyframes fadeInUp': {
                                        '0%': {
                                            opacity: 0,
                                            transform: 'translateY(30px)'
                                        },
                                        '100%': {
                                            opacity: 1,
                                            transform: 'translateY(0)'
                                        }
                                    },
                                    '@keyframes iconPulse': {
                                        '0%, 100%': {
                                            transform: 'scale(1)'
                                        },
                                        '50%': {
                                            transform: 'scale(1.1)'
                                        }
                                    },
                                    '@keyframes iconRotate': {
                                        '0%': {
                                            transform: 'rotate(0deg) scale(1)'
                                        },
                                        '50%': {
                                            transform: 'rotate(180deg) scale(1.1)'
                                        },
                                        '100%': {
                                            transform: 'rotate(360deg) scale(1)'
                                        }
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: stat.iconBg,
                                        transform: 'scaleX(0)',
                                        transformOrigin: 'left',
                                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-8px) scale(1.02)',
                                        boxShadow: `0 12px 40px ${stat.cardAccent}40`,
                                        borderColor: stat.cardAccent,
                                        '&::before': {
                                            transform: 'scaleX(1)'
                                        },
                                        '& .icon-circle': {
                                            transform: 'scale(1.15) rotate(5deg)',
                                            boxShadow: `0 8px 25px ${stat.cardAccent}60`,
                                            animation: index === 2 ? 'iconRotate 0.6s ease-in-out' : 'iconPulse 1s ease-in-out infinite'
                                        },
                                        '& .stat-value': {
                                            transform: 'scale(1.08)',
                                            textShadow: `0 2px 10px ${stat.cardAccent}30`
                                        },
                                        '& .stat-title': {
                                            color: stat.cardAccent,
                                            transform: 'translateY(-2px)'
                                        },
                                        '& .stat-subtext': {
                                            transform: 'translateY(-2px)',
                                            opacity: 1
                                        }
                                    }
                                }}
                            >
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        flexGrow: 1,
                                        p: 3.5,
                                        pt: 4,
                                        position: 'relative',
                                        zIndex: 1
                                    }}
                                >
                                    <Box
                                        className="icon-circle"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 64,
                                            height: 64,
                                            borderRadius: '50%',
                                            background: stat.iconBg,
                                            mb: 3,
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            '&::after': {
                                                content: '""',
                                                position: 'absolute',
                                                inset: -4,
                                                borderRadius: '50%',
                                                background: stat.iconBg,
                                                opacity: 0.2,
                                                filter: 'blur(8px)',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                zIndex: -1
                                            },
                                            '&:hover::after': {
                                                opacity: 0.4,
                                                transform: 'scale(1.2)'
                                            }
                                        }}
                                    >
                                        <IconComponent 
                                            size={28} 
                                            color={stat.iconColor} 
                                            stroke={2}
                                            style={{
                                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        className="stat-title"
                                        variant="caption"
                                        sx={{
                                            color: '#666666',
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase',
                                            mb: 2,
                                            lineHeight: 1.2,
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}
                                    >
                                        {stat.title}
                                    </Typography>
                                    <Typography
                                        className="stat-value"
                                        variant="h4"
                                        component="div"
                                        sx={{
                                            fontWeight: 800,
                                            color: '#000000',
                                            mb: 1.5,
                                            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            letterSpacing: '-0.5px',
                                            lineHeight: 1.2,
                                            background: `linear-gradient(135deg, ${stat.cardAccent} 0%, ${stat.cardAccent}dd 100%)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Typography 
                                        className="stat-subtext"
                                        variant="body2" 
                                        sx={{
                                            color: '#666666',
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            lineHeight: 1.4,
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            opacity: 0.8
                                        }}
                                    >
                                        {stat.subText}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}

                <Grid item xs={12}>
                    <MainCard title="Quick Actions">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        p: 2.5,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-4px) scale(1.02)',
                                            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                                        }
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        View All Hiring Talents
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        p: 2.5,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                        color: 'white',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-4px) scale(1.02)',
                                            boxShadow: '0 8px 25px rgba(17, 153, 142, 0.4)',
                                            background: 'linear-gradient(135deg, #38ef7d 0%, #11998e 100%)'
                                        }
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Verify Applications
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        p: 2.5,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                        color: 'white',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-4px) scale(1.02)',
                                            boxShadow: '0 8px 25px rgba(240, 147, 251, 0.4)',
                                            background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)'
                                        }
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Manage Categories
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Card
                                    sx={{
                                        p: 2.5,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                        color: 'white',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-4px) scale(1.02)',
                                            boxShadow: '0 8px 25px rgba(250, 112, 154, 0.4)',
                                            background: 'linear-gradient(135deg, #fee140 0%, #fa709a 100%)'
                                        }
                                    }}
                                >
                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                        Reports & Analytics
                                    </Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </MainCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HiringTalent;

