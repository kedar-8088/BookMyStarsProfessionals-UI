import React, { useState } from "react";
import { Box, Typography, Card, CardActionArea, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from '../../agency/components/Navbar';

const roles = [
  "Film/TV Actor",
  "Hair Stylist",
  "Makeup Artist",
  "Saree Draper",
  "Voice Artist",
  "Costume Designer",
  "Wardrobe Consultant",
  "Fashion Model",
];

const HiringFor = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

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
          Tell Us What You're Hiring For
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

        {/* Role Cards Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 6,
          }}
        >
          {roles.map((role) => (
            <Card
              key={role}
              sx={{
                width: "100%",
                height: "208px",
                borderRadius: "8px",
                border: selectedRole === role ? "2px solid #69247C" : "1px solid #8A8A8A",
                backgroundColor: "#FFFFFF",
                transition: "all 0.3s ease",
                "&:hover": {
                  border: "2px solid #69247C",
                  transform: "translateY(-4px)",
                  boxShadow: "0px 4px 12px rgba(105, 36, 124, 0.2)",
                },
              }}
            >
              <CardActionArea
                onClick={() => setSelectedRole(role)}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                {/* Icon Placeholder */}
                <Box
                  sx={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#E0E0E0",
                    borderRadius: "8px",
                    mb: 2,
                  }}
                />
                
                {/* Role Name */}
                <Typography
                  sx={{
                    fontFamily: "Poppins",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "24px",
                    lineHeight: "140%",
                    letterSpacing: "0%",
                    textAlign: "center",
                    color: "#444444",
                  }}
                >
                  {role}
                </Typography>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        {/* Next Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => {
              // Navigate to next step (you can update this route later)
              console.log("Selected role:", selectedRole);
              // navigate('/hire-talent/step-2');
            }}
            sx={{
              background: "linear-gradient(90deg, #69247C 0%, #DA498D 100%)",
              color: "#FFFFFF",
              fontFamily: "Poppins",
              fontWeight: 500,
              fontSize: "18px",
              textTransform: "none",
              px: 6,
              py: 1.5,
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
      </Container>
    </Box>
  );
};

export default HiringFor;

