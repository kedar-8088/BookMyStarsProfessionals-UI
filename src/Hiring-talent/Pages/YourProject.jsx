import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Container, 
  TextField, 
  Button, 
  Checkbox, 
  FormControlLabel, 
  Select, 
  MenuItem, 
  FormControl,
  InputLabel
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from '../../agency/components/Navbar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckIcon from '@mui/icons-material/Check';

const YourProject = () => {
  const [projectDetails, setProjectDetails] = useState({
    genderPreference: "",
    projectTitle: "",
    projectType: "",
    location: "",
    projectDate: "",
    payment: "",
    applicationDeadline: "",
    briefDescription: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (field) => (event) => {
    setProjectDetails({
      ...projectDetails,
      [field]: event.target.value,
    });
  };

  const handleGenderChange = (gender) => {
    setProjectDetails({
      ...projectDetails,
      genderPreference: gender,
    });
  };

  const handleNext = () => {
    // Navigate to next step (you can update this route later)
    console.log("Project details:", projectDetails);
    // navigate('/hire-talent/next-step');
  };

  return (
    <Box sx={{ fontFamily: "Poppins, sans-serif", minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        {/* Title */}
        <Typography
          sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            fontStyle: "normal",
            fontSize: "36px",
            lineHeight: "140%",
            letterSpacing: "0%",
            textAlign: "center",
            color: "#DA498D",
            mb: 4,
          }}
        >
          Your Details About Your Project
        </Typography>

        {/* Divider */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "1196px",
            height: "0px",
            border: "1px solid #69247C",
            mx: "auto",
            mb: 6,
          }}
        />

        {/* Form Fields */}
        <Box
          sx={{
            maxWidth: "1200px",
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {/* Gender Preference Section */}
          <Box>
            <Typography
              sx={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "20px",
                lineHeight: "140%",
                letterSpacing: "0%",
                color: "#444444",
                mb: 2,
              }}
            >
              Gender Preference
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={projectDetails.genderPreference === "Male"}
                    onChange={() => handleGenderChange("Male")}
                    icon={
                      <Box
                        sx={{
                          width: 17,
                          height: 17,
                          border: "1px solid #444444",
                          borderRadius: "2px",
                          backgroundColor: "#FFFFFF",
                        }}
                      />
                    }
                    checkedIcon={
                      <Box
                        sx={{
                          width: 17,
                          height: 17,
                          border: "1px solid #69247C",
                          borderRadius: "2px",
                          backgroundColor: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckIcon sx={{ fontSize: 13, color: "#69247C" }} />
                      </Box>
                    }
                    sx={{
                      padding: 0,
                      "&:hover": {
                        "& .MuiBox-root": {
                          border: "1px solid #69247C",
                        },
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "18px",
                      lineHeight: "140%",
                      letterSpacing: "0%",
                      textAlign: "center",
                      color: "#444444",
                      ml: 1,
                    }}
                  >
                    Male
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={projectDetails.genderPreference === "Female"}
                    onChange={() => handleGenderChange("Female")}
                    icon={
                      <Box
                        sx={{
                          width: 17,
                          height: 17,
                          border: "1px solid #444444",
                          borderRadius: "2px",
                          backgroundColor: "#FFFFFF",
                        }}
                      />
                    }
                    checkedIcon={
                      <Box
                        sx={{
                          width: 17,
                          height: 17,
                          border: "1px solid #69247C",
                          borderRadius: "2px",
                          backgroundColor: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckIcon sx={{ fontSize: 13, color: "#69247C" }} />
                      </Box>
                    }
                    sx={{
                      padding: 0,
                      "&:hover": {
                        "& .MuiBox-root": {
                          border: "1px solid #69247C",
                        },
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "18px",
                      lineHeight: "140%",
                      letterSpacing: "0%",
                      textAlign: "center",
                      color: "#444444",
                      ml: 1,
                    }}
                  >
                    Female
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={projectDetails.genderPreference === "Any"}
                    onChange={() => handleGenderChange("Any")}
                    icon={
                      <Box
                        sx={{
                          width: 17,
                          height: 17,
                          border: "1px solid #444444",
                          borderRadius: "2px",
                          backgroundColor: "#FFFFFF",
                        }}
                      />
                    }
                    checkedIcon={
                      <Box
                        sx={{
                          width: 17,
                          height: 17,
                          border: "1px solid #69247C",
                          borderRadius: "2px",
                          backgroundColor: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckIcon sx={{ fontSize: 13, color: "#69247C" }} />
                      </Box>
                    }
                    sx={{
                      padding: 0,
                      "&:hover": {
                        "& .MuiBox-root": {
                          border: "1px solid #69247C",
                        },
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "18px",
                      lineHeight: "140%",
                      letterSpacing: "0%",
                      textAlign: "center",
                      color: "#444444",
                      ml: 1,
                    }}
                  >
                  Others
                  </Typography>
                }
              />
            </Box>
          </Box>

          {/* Two Column Layout */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 3,
              alignItems: "start",
            }}
          >
            {/* Left Column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
              {/* Project Title */}
              <Box sx={{ width: "100%", maxWidth: "349px" }}>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "20px",
                    lineHeight: "140%",
                    letterSpacing: "0%",
                    color: "#444444",
                    mb: 1,
                  }}
                >
                  Project Title
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={projectDetails.projectTitle}
                  onChange={handleInputChange("projectTitle")}
                  placeholder="e.g., 'Bridal Photoshoot - Model Needed'"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "53px",
                      borderRadius: "8px",
                      border: "1px solid #8A8A8A",
                      "&:hover fieldset": {
                        borderColor: "#69247C",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#69247C",
                      },
                      "& fieldset": {
                        borderColor: "#8A8A8A",
                      },
                    },
                    "& .MuiInputBase-input": {
                      fontFamily: "Poppins",
                      fontSize: "16px",
                    },
                  }}
                />
              </Box>

              {/* Location */}
              <Box sx={{ width: "100%", maxWidth: "349px" }}>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "20px",
                    lineHeight: "140%",
                    letterSpacing: "0%",
                    color: "#444444",
                    mb: 1,
                  }}
                >
                  Location
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={projectDetails.location}
                    onChange={handleInputChange("location")}
                    displayEmpty
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                      height: "53px",
                      borderRadius: "8px",
                      border: "1px solid #8A8A8A",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      color: "#444444",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#69247C",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#69247C",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8A8A8A",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#666666",
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      City or "Remote" option
                    </MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                    <MenuItem value="Mumbai">Mumbai</MenuItem>
                    <MenuItem value="Delhi">Delhi</MenuItem>
                    <MenuItem value="Bangalore">Bangalore</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Date(s) of Project */}
              <Box sx={{ width: "100%", maxWidth: "349px" }}>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "20px",
                    lineHeight: "140%",
                    letterSpacing: "0%",
                    color: "#444444",
                    mb: 1,
                  }}
                >
                  Date(s) of Project
                </Typography>
                <TextField
                  type="date"
                  variant="outlined"
                  fullWidth
                  value={projectDetails.projectDate}
                  onChange={handleInputChange("projectDate")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: <CalendarTodayIcon sx={{ color: "#666666", mr: 1 }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "53px",
                      borderRadius: "8px",
                      border: "1px solid #8A8A8A",
                      "&:hover fieldset": {
                        borderColor: "#69247C",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#69247C",
                      },
                      "& fieldset": {
                        borderColor: "#8A8A8A",
                      },
                    },
                    "& .MuiInputBase-input": {
                      fontFamily: "Poppins",
                      fontSize: "16px",
                    },
                  }}
                />
              </Box>

              {/* Brief Description */}
              <Box sx={{ width: "100%", maxWidth: "349px" }}>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "20px",
                    lineHeight: "140%",
                    letterSpacing: "0%",
                    color: "#444444",
                    mb: 1,
                  }}
                >
                  Brief Description
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={6}
                  value={projectDetails.briefDescription}
                  onChange={handleInputChange("briefDescription")}
                  placeholder="TV Commercial, Short Film,"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      border: "1px solid #8A8A8A",
                      "&:hover fieldset": {
                        borderColor: "#69247C",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#69247C",
                      },
                      "& fieldset": {
                        borderColor: "#8A8A8A",
                      },
                    },
                    "& .MuiInputBase-input": {
                      fontFamily: "Poppins",
                      fontSize: "16px",
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Right Column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
              {/* Project Type */}
              <Box sx={{ width: "100%", maxWidth: "349px" }}>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "20px",
                    lineHeight: "140%",
                    letterSpacing: "0%",
                    color: "#444444",
                    mb: 1,
                  }}
                >
                  Project Type
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={projectDetails.projectType}
                    onChange={handleInputChange("projectType")}
                    displayEmpty
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{
                      height: "53px",
                      borderRadius: "8px",
                      border: "1px solid #8A8A8A",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      color: "#444444",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#69247C",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#69247C",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8A8A8A",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#666666",
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      TV Commercial, Short Film,
                    </MenuItem>
                    <MenuItem value="TV Commercial">TV Commercial</MenuItem>
                    <MenuItem value="Short Film">Short Film</MenuItem>
                    <MenuItem value="Feature Film">Feature Film</MenuItem>
                    <MenuItem value="Web Series">Web Series</MenuItem>
                    <MenuItem value="Photoshoot">Photoshoot</MenuItem>
                    <MenuItem value="Event">Event</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Payment */}
              <Box sx={{ width: "100%", maxWidth: "349px" }}>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "20px",
                    lineHeight: "140%",
                    letterSpacing: "0%",
                    color: "#444444",
                    mb: 1,
                  }}
                >
                  Payment
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={projectDetails.payment}
                  onChange={handleInputChange("payment")}
                  placeholder="Enter payment amount"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "53px",
                      borderRadius: "8px",
                      border: "1px solid #8A8A8A",
                      "&:hover fieldset": {
                        borderColor: "#69247C",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#69247C",
                      },
                      "& fieldset": {
                        borderColor: "#8A8A8A",
                      },
                    },
                    "& .MuiInputBase-input": {
                      fontFamily: "Poppins",
                      fontSize: "16px",
                    },
                  }}
                />
              </Box>

              {/* Application Deadline */}
              <Box sx={{ width: "100%", maxWidth: "349px" }}>
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "20px",
                    lineHeight: "140%",
                    letterSpacing: "0%",
                    color: "#444444",
                    mb: 1,
                  }}
                >
                  Application Deadline
                </Typography>
                <TextField
                  type="date"
                  variant="outlined"
                  fullWidth
                  value={projectDetails.applicationDeadline}
                  onChange={handleInputChange("applicationDeadline")}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    endAdornment: <CalendarTodayIcon sx={{ color: "#666666", mr: 1 }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "53px",
                      borderRadius: "8px",
                      border: "1px solid #8A8A8A",
                      "&:hover fieldset": {
                        borderColor: "#69247C",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#69247C",
                      },
                      "& fieldset": {
                        borderColor: "#8A8A8A",
                      },
                    },
                    "& .MuiInputBase-input": {
                      fontFamily: "Poppins",
                      fontSize: "16px",
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Next Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                width: "226px",
                height: "55px",
                background: "linear-gradient(90deg, #69247C 0%, #DA498D 100%)",
                color: "#FFFFFF",
                fontFamily: "Poppins",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "24px",
                lineHeight: "140%",
                letterSpacing: "0%",
                textAlign: "center",
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": {
                  background: "linear-gradient(90deg, #5a1f6b 0%, #c43d7a 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0px 8px 20px rgba(105, 36, 124, 0.3)",
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default YourProject;

