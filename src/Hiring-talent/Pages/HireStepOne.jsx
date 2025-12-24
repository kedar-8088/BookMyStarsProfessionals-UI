// import { useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   Grid,
//   Card,
//   CardActionArea,
//   Button,
//   Container,
// } from "@mui/material";

// const roles = [
//   "Film/TV Actor",
//   "Hair Stylist",
//   "Makeup Artist",
//   "Saree Draper",
//   "Voice Artist",
//   "Costume Designer",
//   "Wardrobe Consultant",
//   "Fashion Model",
// ];

// export default function HireStepOne() {
//   const [selectedRole, setSelectedRole] = useState("Hair Stylist");

//   return (
//     <Box minHeight="100vh" bgcolor="#fff">
//       {/* Header */}
//       <AppBar
//         position="static"
//         sx={{
//           background: "linear-gradient(90deg, #7b2c83, #e04c8f)",
//           px: 3,
//         }}
//       >
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Typography fontWeight="bold">LOGO</Typography>
//           <Box display="flex" gap={3}>
//             <Typography>Home</Typography>
//             <Typography>Features</Typography>
//             <Typography>Dummy text</Typography>
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* Main Content */}
//       <Container maxWidth="md" sx={{ mt: 6, textAlign: "center" }}>
//         <Typography
//           variant="h5"
//           sx={{ color: "#e04c8f", mb: 3, fontWeight: 500 }}
//         >
//           Tell Us What You’re Hiring For
//         </Typography>

//         {/* Step Indicator */}
//         <Box
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           gap={2}
//           mb={4}
//         >
//           <Typography fontSize={14} color="#7b2c83">
//             Step 1 of 4
//           </Typography>

//           <Box display="flex" gap={1.5}>
//             {[1, 2, 3, 4].map((step) => (
//               <Box
//                 key={step}
//                 sx={{
//                   width: 10,
//                   height: 10,
//                   borderRadius: "50%",
//                   bgcolor: step === 1 ? "#7b2c83" : "#ddd",
//                 }}
//               />
//             ))}
//           </Box>
//         </Box>

//         {/* Role Cards */}
//         <Grid container spacing={2} mb={4}>
//           {roles.map((role) => (
//             <Grid item xs={6} md={3} key={role}>
//               <Card
//                 variant="outlined"
//                 sx={{
//                   border:
//                     selectedRole === role
//                       ? "2px solid #1e90ff"
//                       : "1px solid #ddd",
//                 }}
//               >
//                 <CardActionArea
//                   onClick={() => setSelectedRole(role)}
//                   sx={{ p: 2 }}
//                 >
//                   <Box
//                     sx={{
//                       width: 40,
//                       height: 40,
//                       bgcolor: "#eaeaea",
//                       mx: "auto",
//                       mb: 1.5,
//                       borderRadius: 1,
//                     }}
//                   />
//                   <Typography fontSize={14}>{role}</Typography>
//                 </CardActionArea>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         {/* Next Button */}
//         <Button
//           variant="contained"
//           sx={{
//             backgroundColor: "#7b2c83",
//             px: 6,
//             textTransform: "none",
//             "&:hover": { backgroundColor: "#6a2471" },
//           }}
//         >
//           Next
//         </Button>
//       </Container>
//     </Box>
//   );
// }
