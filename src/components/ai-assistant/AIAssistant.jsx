import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Fade,
  Slide,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Minimize as MinimizeIcon,
  PersonAdd as PersonAddIcon,
  AccountCircle as AccountCircleIcon,
  Payment as PaymentIcon,
  HelpOutline as HelpOutlineIcon,
  AttachMoney as AttachMoneyIcon,
  SupportAgent as SupportAgentIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const FloatingButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: 24,
  right: 24,
  width: 64,
  height: 64,
  backgroundColor: '#69247C',
  color: 'white',
  boxShadow: '0 4px 12px rgba(105, 36, 124, 0.4)',
  zIndex: 1000,
  '&:hover': {
    backgroundColor: '#DA498D',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    width: 56,
    height: 56,
    bottom: 16,
    right: 16,
  },
}));

const ChatWindow = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 100,
  right: 24,
  width: 400,
  height: 600,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  zIndex: 1001,
  borderRadius: '16px',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100% - 32px)',
    height: '70vh',
    maxHeight: '500px',
    bottom: 80,
    right: 16,
    left: 16,
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  backgroundColor: '#69247C',
  color: 'white',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: '#f5f5f5',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#69247C',
    borderRadius: '3px',
  },
}));

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isUser',
})(({ theme, isUser }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: isUser ? 'flex-end' : 'flex-start',
  alignItems: 'flex-start',
  '& .message-content': {
    maxWidth: '75%',
    padding: theme.spacing(1.5, 2),
    borderRadius: '16px',
    backgroundColor: isUser ? '#69247C' : 'white',
    color: isUser ? 'white' : '#333',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    wordWrap: 'break-word',
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: 'white',
  borderTop: '1px solid #e0e0e0',
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
}));

const QuickActions = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  backgroundColor: '#f8f9fa',
  borderTop: '1px solid #e0e0e0',
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(0.75),
    padding: theme.spacing(1),
  },
}));

const QuickActionButton = styled(Box)(({ theme, color }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(0.25),
  padding: theme.spacing(0.75, 0.5),
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  background: color || 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
  border: '1px solid transparent',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
  minHeight: '50px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.1)',
    opacity: 0,
    transition: 'opacity 0.25s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    '&::before': {
      opacity: 1,
    },
  },
  '&:active': {
    transform: 'translateY(0) scale(0.98)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0.6, 0.4),
    minHeight: '48px',
    gap: theme.spacing(0.2),
  },
}));

// AI Response Logic - Enhanced to handle any question
const getAIResponse = (userMessage) => {
  const message = userMessage.toLowerCase().trim();

  // Greetings
  if (
    message.includes('hi') ||
    message.includes('hello') ||
    message.includes('hey') ||
    message.includes('good morning') ||
    message.includes('good afternoon') ||
    message.includes('good evening') ||
    message.includes('greetings')
  ) {
    return {
      text: "Hello! 👋 I'm your AI assistant for BookMyStars Professionals. I'm here to help with any questions you have - whether it's about the platform, general questions, or anything else. What can I help you with today?",
      type: 'greeting',
    };
  }

  // Profile Creation - Check FIRST before other handlers
  if (
    message.includes('create profile') ||
    message.includes('how to create') ||
    message.includes('make profile') ||
    message.includes('build profile') ||
    message.includes('setup profile') ||
    message.includes('new profile') ||
    message.includes('register profile') ||
    (message.includes('profile') && (message.includes('create') || message.includes('make') || message.includes('new')))
  ) {
    return {
      text: "To create your profile on BookMyStars Professionals:\n\n📝 Complete Step-by-Step Guide:\n\n1️⃣ Sign Up\n   • Go to '/signup' or click 'Sign Up' in navigation\n   • Enter: First Name, Last Name, Email, Phone, Username, Password\n   • Click 'Register'\n\n2️⃣ Email Verification\n   • Check your email for OTP code\n   • Enter OTP on '/otp-verification' page\n   • Your profile is automatically created after verification\n\n3️⃣ Complete Profile Sections (in order):\n   • Basic Information (/basic-info)\n     - Full name, location, contact details\n   • Physical Details (/physical-details)\n     - Height, weight, body type, skin tone, etc.\n   • Showcase (/showcase)\n     - Add photos, videos, portfolio items\n   • Education Background (/education-background)\n     - Qualifications, certifications, skills\n   • Preferences (/preferences)\n     - Work preferences, availability, job types\n   • Complete Profile (/complete-profile)\n     - Review and finalize everything\n\n💡 Tip: Complete all sections for maximum visibility and opportunities!\n\nWhich step do you need help with?",
      type: 'profile_creation',
    };
  }

  // Where to access profile - Check BEFORE navigation handler
  if (
    message.includes('where is profile') ||
    message.includes('where to find profile') ||
    message.includes('where is my profile') ||
    message.includes('where can i find my profile') ||
    message.includes('access profile') ||
    message.includes('view profile') ||
    message.includes('my profile') ||
    message.includes('edit profile') ||
    message.includes('update profile') ||
    message.includes('profile page') ||
    message.includes('go to profile') ||
    (message.includes('where') && message.includes('profile'))
  ) {
    return {
      text: "To access and manage your profile:\n\n📍 How to Access:\n• Login to your account first\n• Go to '/dashboard' - This is your main profile hub\n• Or click 'Dashboard' in the top navigation menu\n• Your profile overview is displayed on the dashboard\n\n📋 Profile Sections You Can Edit:\n• Basic Information → Go to '/basic-info'\n• Physical Details → Go to '/physical-details'\n• Showcase/Portfolio → Go to '/showcase'\n• Education Background → Go to '/education-background'\n• Preferences → Go to '/preferences'\n• Complete Profile → Go to '/complete-profile'\n\n🔗 Direct Routes:\n• Dashboard: /dashboard\n• Basic Info: /basic-info\n• Physical Details: /physical-details\n• Showcase: /showcase\n• Education: /education-background\n• Preferences: /preferences\n\n💡 From your dashboard, you can navigate to any section to update your information!\n\nWhich section would you like to access?",
      type: 'profile_access',
    };
  }

  // Account Issues (but not profile creation/access - those are handled separately)
  if (
    (message.includes('account') && !message.includes('profile')) ||
    message.includes('login') ||
    message.includes('sign up') ||
    message.includes('password') ||
    message.includes('forgot') ||
    (message.includes('settings') && !message.includes('profile')) ||
    (message.includes('update') && !message.includes('profile')) ||
    message.includes('change password') ||
    message.includes('reset password')
  ) {
    return {
      text: "For account help:\n• Login/Signup: Use the top navigation\n• Password reset: Click 'Forgot Password' on login page\n• Profile updates: Go to Dashboard → Profile Settings\n• Account issues: Check your email or contact support\n\nNeed help with something specific?",
      type: 'account',
    };
  }

  // Website Navigation - Exclude profile-related questions
  if (
    (message.includes('navigate') && !message.includes('profile')) ||
    (message.includes('how to') && !message.includes('profile')) ||
    (message.includes('where') && !message.includes('profile')) ||
    message.includes('find') ||
    message.includes('search') ||
    message.includes('browse') ||
    (message.includes('go to') && !message.includes('profile')) ||
    (message.includes('access') && !message.includes('profile'))
  ) {
    return {
      text: "I can help you navigate! Here are key areas:\n• Dashboard: View your profile and projects\n• Professionals: Browse talent profiles\n• Jobs: Find job opportunities\n• Profile: Manage your account settings\n• LMS: Access learning modules\n\nWhat would you like to explore?",
      type: 'navigation',
    };
  }

  // Payment Methods
  if (
    message.includes('payment method') ||
    message.includes('payment option') ||
    message.includes('how to pay') ||
    message.includes('payment gateway') ||
    message.includes('payment process') ||
    message.includes('how was payment') ||
    message.includes('payment way') ||
    message.includes('pay') && (message.includes('method') || message.includes('how'))
  ) {
    return {
      text: "Payment methods available on BookMyStars Professionals:\n\n💳 Accepted payment methods:\n• Credit Cards (Visa, MasterCard, American Express)\n• Debit Cards\n• UPI (Unified Payments Interface)\n• Net Banking\n• Digital Wallets (Paytm, PhonePe, Google Pay)\n• Bank Transfer\n\n📝 Payment process:\n1. Select your plan or service\n2. Click 'Subscribe' or 'Pay Now'\n3. Choose your preferred payment method\n4. Enter payment details securely\n5. Complete the transaction\n6. Receive confirmation email\n\n🔒 Security:\n• All payments are processed through secure gateways\n• Your payment information is encrypted\n• We don't store your card details\n\n💡 For payment issues, contact support@bookmystars.com\n\nNeed help with a specific payment method?",
      type: 'payment_methods',
    };
  }

  // Pricing and Plans
  if (
    message.includes('price') ||
    message.includes('cost') ||
    message.includes('plan') ||
    message.includes('subscription') ||
    message.includes('fee') ||
    message.includes('payment') ||
    message.includes('pricing') ||
    message.includes('how much') ||
    message.includes('free')
  ) {
    return {
      text: "Pricing information:\n• Basic plans available for professionals\n• Flexible pricing for agencies\n• Contact us for custom enterprise solutions\n• Check the Pricing page for detailed plans\n\nWould you like to know more about a specific plan?",
      type: 'pricing',
    };
  }

  // Contact Information
  if (
    message.includes('contact') ||
    message.includes('email') ||
    message.includes('phone') ||
    message.includes('support') ||
    message.includes('help') ||
    message.includes('reach') ||
    message.includes('get in touch') ||
    message.includes('customer service')
  ) {
    return {
      text: "Get in touch:\n• Email: support@bookmystars.com\n• Check the Contact page for more details\n• Support available Monday-Friday, 9 AM - 6 PM\n• For urgent issues, use the Help section\n\nHow can we assist you?",
      type: 'contact',
    };
  }

  // Jobs and Opportunities
  if (
    message.includes('job') ||
    message.includes('opportunity') ||
    message.includes('apply') ||
    message.includes('application') ||
    message.includes('hiring') ||
    message.includes('work') ||
    message.includes('position')
  ) {
    return {
      text: "Jobs & Opportunities on BookMyStars Professionals:\n\n💼 Finding Jobs:\n• Go to '/dashboard/jobs' to browse available positions\n• Filter by location, category, and job type\n• View job details and requirements\n• Apply directly through the platform\n\n📋 Job Categories:\n• Fashion & Modeling\n• Media & Entertainment\n• Beauty & Makeup\n• Corporate Events\n• Photography & Videography\n\n✅ Application Process:\n• Complete your profile first (increases chances)\n• Browse available opportunities\n• Click 'Apply' on jobs that match your skills\n• Track your applications from dashboard\n\n💡 Tip: Keep your profile updated and showcase your best work!\n\nNeed help with job applications?",
      type: 'jobs',
    };
  }

  // Projects and Portfolio
  if (
    message.includes('project') ||
    message.includes('portfolio') ||
    message.includes('showcase') ||
    message.includes('gallery') ||
    message.includes('work samples')
  ) {
    return {
      text: "Projects & Portfolio Management:\n\n📸 Showcase Your Work:\n• Go to '/showcase' to add your portfolio\n• Upload photos and videos of your work\n• Organize by project type or category\n• Add descriptions and tags\n\n🎯 Portfolio Tips:\n• Add high-quality images/videos\n• Include diverse work samples\n• Update regularly with new projects\n• Highlight your best work first\n\n📍 Access:\n• Dashboard → Showcase section\n• Direct route: '/showcase'\n• Edit anytime from your dashboard\n\n💡 A complete portfolio increases your visibility and job opportunities!\n\nWant to know more about adding showcase items?",
      type: 'projects',
    };
  }

  // Skills and Qualifications
  if (
    message.includes('skill') ||
    message.includes('qualification') ||
    message.includes('certification') ||
    message.includes('education') ||
    message.includes('training') ||
    message.includes('expertise')
  ) {
    return {
      text: "Skills & Qualifications Management:\n\n🎓 Education Background:\n• Go to '/education-background'\n• Add your qualifications and degrees\n• Include certifications and training\n• List professional skills\n\n💪 Professional Skills:\n• Add skills relevant to your profession\n• Include technical and soft skills\n• Update as you learn new skills\n• Match skills to job requirements\n\n📜 Certifications:\n• Add professional certifications\n• Include completion dates\n• Upload certificates if available\n• Keep them current\n\n📍 Access:\n• Education: '/education-background'\n• Skills: Dashboard → Skills section\n\n💡 Complete skills section helps match you with relevant opportunities!\n\nNeed help adding your qualifications?",
      type: 'skills',
    };
  }

  // LMS (Learning Management System)
  if (
    message.includes('lms') ||
    message.includes('learning') ||
    message.includes('course') ||
    message.includes('module') ||
    message.includes('training') ||
    message.includes('study') ||
    message.includes('education')
  ) {
    return {
      text: "Learning Management System (LMS):\n\n📚 Access Learning Modules:\n• Go to '/dashboard/lms' for your learning dashboard\n• Browse available courses and modules\n• Track your progress\n• Complete modules to enhance your profile\n\n📖 Available Content:\n• Professional development courses\n• Skill enhancement modules\n• Industry-specific training\n• Certification programs\n\n📍 Navigation:\n• LMS Dashboard: '/dashboard/lms'\n• Modules: '/dashboard/lms/modules'\n• Access from main dashboard\n\n💡 Complete courses to boost your profile and career opportunities!\n\nWant to know more about specific courses?",
      type: 'lms',
    };
  }

  // Agency Registration
  if (
    message.includes('agency') ||
    message.includes('register agency') ||
    message.includes('agency signup') ||
    message.includes('hire talent') ||
    message.includes('talent search')
  ) {
    return {
      text: "Agency Registration & Talent Hiring:\n\n🏢 Agency Registration:\n• Go to '/agency/register'\n• Fill in agency details\n• Verify email with OTP\n• Complete agency profile\n• Start hiring talent\n\n👥 Hiring Talent:\n• Browse professionals on '/hire-talent'\n• Search by skills, location, category\n• View professional profiles\n• Contact and book talent\n• Manage your hires\n\n📍 Routes:\n• Agency Register: '/agency/register'\n• OTP Verification: '/agency/otp-verification'\n• Hire Talent: '/hire-talent'\n\n💡 Agencies can access a wide pool of verified professionals!\n\nNeed help with agency registration?",
      type: 'agency',
    };
  }

  // Features and Functionality
  if (
    message.includes('feature') ||
    message.includes('what can') ||
    message.includes('how does') ||
    (message.includes('what is') && !message.includes('profile') && !message.includes('payment')) ||
    message.includes('explain') ||
    message.includes('tell me about')
  ) {
    return {
      text: "BookMyStars Professionals offers:\n• Professional profile management\n• Job opportunities and applications\n• Talent browsing and hiring\n• Learning management system (LMS)\n• Project showcase and portfolio\n• Agency registration and management\n\nWhich feature would you like to know more about?",
      type: 'features',
    };
  }

  // Technical Questions
  if (
    message.includes('error') ||
    message.includes('bug') ||
    message.includes('not working') ||
    message.includes('problem') ||
    message.includes('issue') ||
    message.includes('broken') ||
    message.includes('fix')
  ) {
    return {
      text: "I'm sorry you're experiencing issues! Here's how I can help:\n• Try refreshing the page\n• Clear your browser cache\n• Check your internet connection\n• Contact support for technical issues\n\nCan you describe the problem in more detail?",
      type: 'technical',
    };
  }

  // Questions about time/date
  if (
    message.includes('time') ||
    message.includes('date') ||
    message.includes('when') ||
    message.includes('today') ||
    message.includes('now')
  ) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    return {
      text: `The current date and time is:\n${dateString} at ${timeString}\n\nIs there anything else I can help you with?`,
      type: 'time',
    };
  }

  // Weather questions
  if (message.includes('weather') || message.includes('temperature')) {
    return {
      text: "I don't have access to real-time weather data, but I'd be happy to help you with BookMyStars Professionals questions! You can check weather on your preferred weather app or website.\n\nWhat else can I help you with?",
      type: 'weather',
    };
  }

  // Math questions
  if (
    message.match(/\d+\s*[+\-*/]\s*\d+/) ||
    message.includes('calculate') ||
    message.includes('math') ||
    message.includes('what is') && message.match(/\d/)
  ) {
    try {
      // Simple math evaluation (be careful with eval in production)
      const mathMatch = message.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
      if (mathMatch) {
        const num1 = parseInt(mathMatch[1]);
        const operator = mathMatch[2];
        const num2 = parseInt(mathMatch[3]);
        let result;
        switch (operator) {
          case '+':
            result = num1 + num2;
            break;
          case '-':
            result = num1 - num2;
            break;
          case '*':
            result = num1 * num2;
            break;
          case '/':
            result = num2 !== 0 ? num1 / num2 : 'undefined (division by zero)';
            break;
          default:
            result = 'Unable to calculate';
        }
        return {
          text: `The answer is: ${result}\n\nIs there anything else I can help you with?`,
          type: 'math',
        };
      }
    } catch (e) {
      // Fall through to general response
    }
  }

  // General knowledge questions
  if (
    message.includes('what is') ||
    message.includes('who is') ||
    message.includes('where is') ||
    message.includes('why') ||
    message.includes('how')
  ) {
    return {
      text: "That's an interesting question! While I'm primarily designed to help with BookMyStars Professionals, I'll do my best to assist.\n\nFor platform-specific questions, I can provide detailed answers. For general knowledge, I'll share what I know. Could you provide more context about what you're looking for?",
      type: 'general',
    };
  }

  // Thank you / Appreciation
  if (
    message.includes('thank') ||
    message.includes('thanks') ||
    message.includes('appreciate') ||
    message.includes('helpful')
  ) {
    return {
      text: "You're very welcome! 😊 I'm glad I could help. If you have any other questions about BookMyStars Professionals or anything else, feel free to ask. Have a great day!",
      type: 'thanks',
    };
  }

  // Goodbye
  if (
    message.includes('bye') ||
    message.includes('goodbye') ||
    message.includes('see you') ||
    message.includes('later')
  ) {
    return {
      text: "Goodbye! 👋 It was great chatting with you. Feel free to come back anytime if you need help. Have a wonderful day!",
      type: 'goodbye',
    };
  }

  // Questions about the AI itself
  if (
    message.includes('who are you') ||
    message.includes('what are you') ||
    message.includes('your name') ||
    message.includes('what can you do')
  ) {
    return {
      text: "I'm an AI assistant for BookMyStars Professionals! 🤖\n\nI can help you with:\n• Platform navigation and features\n• Account and profile questions\n• Pricing and plans\n• Technical support\n• General questions and conversations\n\nI'm here to make your experience better. What would you like to know?",
      type: 'about',
    };
  }

  // Default response - friendly and helpful for any question
  return {
    text: `Thanks for your question! I'm here to help. ${message.length > 20 ? `Regarding "${userMessage}", ` : ''}I can assist with:\n\n• BookMyStars Professionals platform questions\n• General information and guidance\n• Account and technical support\n• Or just have a friendly conversation!\n\nCould you provide a bit more detail about what you're looking for? I'm here to help! 😊`,
    type: 'general',
  };
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [wasClosed, setWasClosed] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! 👋 I'm your AI assistant for BookMyStars Professionals. I can help you with anything - platform questions, general information, or just chat! What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const getInitialMessage = () => ({
    text: "Hello! 👋 I'm your AI assistant for BookMyStars Professionals. I can help you with anything - platform questions, general information, or just chat! What would you like to know?",
    isUser: false,
    timestamp: new Date(),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // Reset chat when opening after being closed
  useEffect(() => {
    if (isOpen && wasClosed) {
      setMessages([getInitialMessage()]);
      setInputValue('');
      setWasClosed(false);
    }
  }, [isOpen, wasClosed]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = getAIResponse(inputValue);
      setMessages((prev) => [
        ...prev,
        {
          text: aiResponse.text,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action) => {
    const quickMessages = {
      'Create Profile': 'How to create profile?',
      'My Profile': 'Where is my profile?',
      'Payment Methods': 'What are the payment methods?',
      'Account Help': 'I need help with my account',
      'Pricing Info': 'What are your pricing plans?',
      'Contact Support': 'How can I contact support?',
      'Navigation': 'How do I navigate the website?',
    };

    setInputValue(quickMessages[action]);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const toggleChat = () => {
    if (isOpen && !isMinimized) {
      setIsMinimized(true);
    } else if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setWasClosed(true);
    // Reset messages when closing
    setMessages([getInitialMessage()]);
    setInputValue('');
  };

  return (
    <>
      <FloatingButton onClick={toggleChat} aria-label="Open AI Assistant">
        <BotIcon sx={{ fontSize: 32 }} />
      </FloatingButton>

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <ChatWindow>
          <ChatHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'white', color: '#69247C' }}>
                <BotIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  AI Support Assistant
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Ask me anything
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton
                size="small"
                onClick={() => setIsMinimized(!isMinimized)}
                sx={{ color: 'white', mr: 0.5 }}
              >
                <MinimizeIcon />
              </IconButton>
              <IconButton size="small" onClick={closeChat} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </ChatHeader>

          {!isMinimized && (
            <>
              <MessagesContainer>
                {messages.map((message, index) => (
                  <MessageBubble key={index} isUser={message.isUser}>
                    {!message.isUser && (
                      <Avatar sx={{ bgcolor: '#69247C', width: 32, height: 32 }}>
                        <BotIcon sx={{ fontSize: 18 }} />
                      </Avatar>
                    )}
                    <Box className="message-content">
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {message.text}
                      </Typography>
                    </Box>
                    {message.isUser && (
                      <Avatar sx={{ bgcolor: '#DA498D', width: 32, height: 32 }}>
                        U
                      </Avatar>
                    )}
                  </MessageBubble>
                ))}
                <div ref={messagesEndRef} />
              </MessagesContainer>

              <QuickActions>
                <QuickActionButton
                  onClick={() => handleQuickAction('Create Profile')}
                  sx={{
                    background: 'linear-gradient(135deg, #69247C 0%, #8B3DA8 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #8B3DA8 0%, #DA498D 100%)',
                    },
                  }}
                >
                  <PersonAddIcon sx={{ fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem', textAlign: 'center', lineHeight: 1.2 }}>
                    Create Profile
                  </Typography>
                </QuickActionButton>

                <QuickActionButton
                  onClick={() => handleQuickAction('My Profile')}
                  sx={{
                    background: 'linear-gradient(135deg, #DA498D 0%, #E85A9F 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #E85A9F 0%, #F06BB0 100%)',
                    },
                  }}
                >
                  <AccountCircleIcon sx={{ fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem', textAlign: 'center', lineHeight: 1.2 }}>
                    My Profile
                  </Typography>
                </QuickActionButton>

                <QuickActionButton
                  onClick={() => handleQuickAction('Payment Methods')}
                  sx={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)',
                    },
                  }}
                >
                  <PaymentIcon sx={{ fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem', textAlign: 'center', lineHeight: 1.2 }}>
                    Payment
                  </Typography>
                </QuickActionButton>

                <QuickActionButton
                  onClick={() => handleQuickAction('Account Help')}
                  sx={{
                    background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #42A5F5 0%, #64B5F6 100%)',
                    },
                  }}
                >
                  <HelpOutlineIcon sx={{ fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem', textAlign: 'center', lineHeight: 1.2 }}>
                    Account Help
                  </Typography>
                </QuickActionButton>

                <QuickActionButton
                  onClick={() => handleQuickAction('Pricing Info')}
                  sx={{
                    background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FFB74D 0%, #FFCC80 100%)',
                    },
                  }}
                >
                  <AttachMoneyIcon sx={{ fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem', textAlign: 'center', lineHeight: 1.2 }}>
                    Pricing Info
                  </Typography>
                </QuickActionButton>

                <QuickActionButton
                  onClick={() => handleQuickAction('Contact Support')}
                  sx={{
                    background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #BA68C8 0%, #CE93D8 100%)',
                    },
                  }}
                >
                  <SupportAgentIcon sx={{ fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.65rem', textAlign: 'center', lineHeight: 1.2 }}>
                    Contact
                  </Typography>
                </QuickActionButton>
              </QuickActions>

              <InputContainer>
                <TextField
                  inputRef={inputRef}
                  fullWidth
                  size="small"
                  placeholder="Ask me anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '24px',
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  sx={{
                    bgcolor: '#69247C',
                    color: 'white',
                    '&:hover': { bgcolor: '#DA498D' },
                    '&.Mui-disabled': { bgcolor: '#e0e0e0' },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </InputContainer>
            </>
          )}
        </ChatWindow>
      </Slide>
    </>
  );
};

export default AIAssistant;

