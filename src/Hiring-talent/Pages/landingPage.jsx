import React from "react";
import {
    Box,
    Typography,
    Divider,
    Button
} from "@mui/material";
import { ArrowForward, VerifiedUser, Speed, LocationOn, Dashboard } from '@mui/icons-material';
// ... previous imports

// ... inside component ...

{/* Why Choose Bookmystars Section */ }
<Box
    sx={{
        width: "100%",
        minHeight: "621px",
        background: "linear-gradient(180deg, #69247C 0%, #DA498D 100%)",
        py: 8,
        px: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 8,
    }}
>
    <Typography
        sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            fontSize: "48px",
            lineHeight: "140%",
            color: "#FFFFFF",
            textAlign: "center",
            mb: 8,
        }}
    >
        Why Choose Bookmystars?
    </Typography>

    <Box
        sx={{
            display: "grid",
            gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
            },
            gap: 4,
            maxWidth: "1350px",
            width: "100%",
        }}
    >
        {[
            {
                icon: <VerifiedUser sx={{ fontSize: 60, color: "#69247C" }} />,
                title: "Verified Talent Only",
                desc: "Every profile is manually screened for authenticity."
            },
            {
                icon: <Speed sx={{ fontSize: 60, color: "#69247C" }} />,
                title: "Faster Hiring Process",
                desc: "Post roles, browse profiles, and manage hiring all in one place"
            },
            {
                icon: <LocationOn sx={{ fontSize: 60, color: "#69247C" }} />,
                title: "Find Talent by Location",
                desc: "Easily shortlist artists available in your shoot city or region."
            },
            {
                icon: <Dashboard sx={{ fontSize: 60, color: "#69247C" }} />,
                title: "Built-in Project Tools",
                desc: "Chat, schedule, and finalize within your dashboard."
            },
        ].map((item, index) => (
            <Box
                key={index}
                sx={{
                    width: "100%",
                    maxWidth: "304px",
                    height: "388px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    mx: "auto",
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                        transform: "translateY(-5px)",
                    },
                }}
            >
                <Box
                    sx={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(105, 36, 124, 0.1)", // Light purple bg for icon
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 4,
                    }}
                >
                    {item.icon}
                </Box>

                <Typography
                    sx={{
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        fontSize: "24px",
                        lineHeight: "140%",
                        color: "#69247C",
                        mb: 2,
                    }}
                >
                    {item.title}
                </Typography>

                <Typography
                    sx={{
                        fontFamily: "Poppins",
                        fontWeight: 400,
                        fontSize: "18px", // Adjusted 22px to 18px for better fit in cards
                        lineHeight: "140%",
                        color: "#000000",
                    }}
                >
                    {item.desc}
                </Typography>
            </Box>
        ))}
    </Box>
</Box>

import Navbar from '../../agency/components/Navbar';

// ✅ ONLY ONE image import
import heroImage from "../../assets/images/hirie-land.png.jpg";
import FilmImage from "../../assets/images/film-596009.jpg";
import MakeupImage from "../../assets/images/makeup.png";
import SareeImage from "../../assets/images/saree.png";
// Using placeholders/reuses for others to ensure no broken images
import VoiceImage from "../../assets/images/article1.png";
import ModelImage from "../../assets/images/girl.png";
import WardrobeImage from "../../assets/images/article2.png";
import HairImage from "../../assets/images/article3.png";
import CostumeImage from "../../assets/images/professionalcard.png";
import MenImage from "../../assets/images/Men.jpg";
import BannerImage from "../../assets/images/Talent  Banner.png";

const LandingPage = () => {
    return (
        <Box sx={{ fontFamily: "Poppins, sans-serif" }}>
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <Box sx={{ position: "relative", width: "100%", height: "auto" }}>
                <Box
                    component="img"
                    src={heroImage}
                    alt="Hire Talent Hero"
                    sx={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                        minHeight: "600px",
                        objectFit: "cover",
                    }}
                />

                {/* Hero Overlay Content */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        width: "100%",
                        maxWidth: "900px",
                        px: 2,
                        zIndex: 2
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: "Poppins",
                            fontWeight: 600,
                            fontSize: { xs: "32px", md: "40px" },
                            lineHeight: "120%",
                            color: "#FFFFFF",
                            mb: 2,
                        }}
                    >
                        One Platform. Endless Talent
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "Poppins",
                            fontWeight: 400,
                            fontSize: { xs: "18px", md: "24px" },
                            lineHeight: "140%",
                            color: "#FFFFFF",
                            mb: 4,
                        }}
                    >
                        From fashion models to film editors —<br />
                        hire who you need, when you need.
                    </Typography>

                    <Button
                        variant="contained"
                        sx={{
                            background: "linear-gradient(90deg, #69247C 0%, #DA498D 100%)",
                            borderRadius: "10px",
                            fontFamily: "Roboto",
                            fontWeight: 500,
                            fontSize: "24px",
                            lineHeight: "131%",
                            textTransform: "none",
                            color: "#FFFFFF",
                            px: 5,
                            py: 1.5,
                            "&:hover": {
                                background: "linear-gradient(90deg, #5a1f6b 0%, #c43d7a 100%)",
                            },
                        }}
                    >
                        Browse Talent
                    </Button>
                </Box>

                {/* Stats Overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        py: 4,
                        flexWrap: "wrap",
                        zIndex: 2
                    }}
                >
                    {[
                        { count: "2000+", label: "Verified Profiles" },
                        { count: "500,000+", label: "Creative Professionals" },
                        { count: "5000+", label: "Searches Annually" },
                        { count: "90%", label: "Successful Matches" },
                    ].map((stat, index) => (
                        <Box key={index} sx={{ textAlign: "left", px: 2, borderLeft: index > 0 ? { md: "1px solid rgba(255,255,255,0.3)" } : "none" }}>
                            <Typography
                                sx={{
                                    fontFamily: "Poppins",
                                    fontWeight: 500,
                                    fontSize: "24px",
                                    lineHeight: "171%",
                                    color: "#FFFFFF",
                                }}
                            >
                                {stat.count}
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "Poppins",
                                    fontWeight: 400,
                                    fontSize: "14px",
                                    color: "#FFFFFF",
                                    opacity: 0.9,
                                }}
                            >
                                {stat.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* How It Works Section */}
            <Box
                sx={{
                    backgroundColor: "#FFFFFF",
                    py: 8,
                    px: 5,
                }}
            >
                {/* Heading */}
                <Typography
                    sx={{
                        fontWeight: 600,
                        fontSize: "36px",
                        lineHeight: "140%",
                        textAlign: "center",
                        color: "#DA498D",
                        mb: 4,
                    }}
                >
                    How It Works
                </Typography>

                {/* Divider */}
                <Divider
                    sx={{
                        width: "100%",
                        borderColor: "#D8D8D8",
                        borderWidth: "1px",
                        mb: 8,
                    }}
                />

                {/* Steps Container */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 4,
                        maxWidth: "1200px",
                        mx: "auto",
                    }}
                >
                    {/* Step 1 */}
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                        <Typography
                            sx={{
                                fontWeight: 600,
                                fontSize: "26px",
                                lineHeight: "140%",
                                color: "#69247C",
                                mb: 1.5,
                            }}
                        >
                            Step.1
                            <br />
                            Post Your Requirement
                        </Typography>
                        <Typography
                            sx={{
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "140%",
                                color: "#333333",
                            }}
                        >
                            Describe your project and role — it takes just a few clicks.
                        </Typography>
                    </Box>

                    {/* Arrow 1 */}
                    <ArrowForward sx={{ color: "#69247C", fontSize: 40, mt: 4, display: { xs: 'none', md: 'block' } }} />

                    {/* Step 2 */}
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                        <Typography
                            sx={{
                                fontWeight: 600,
                                fontSize: "26px",
                                lineHeight: "140%",
                                color: "#69247C",
                                mb: 1.5,
                            }}
                        >
                            Step.2
                            <br />
                            Get Matched Instantly
                        </Typography>
                        <Typography
                            sx={{
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "140%",
                                color: "#333333",
                            }}
                        >
                            Browse relevant talent or receive direct applications from professionals.
                        </Typography>
                    </Box>

                    {/* Arrow 2 */}
                    <ArrowForward sx={{ color: "#69247C", fontSize: 40, mt: 4, display: { xs: 'none', md: 'block' } }} />

                    {/* Step 3 */}
                    <Box sx={{ flex: 1, textAlign: "center" }}>
                        <Typography
                            sx={{
                                fontWeight: 600,
                                fontSize: "26px",
                                lineHeight: "140%",
                                color: "#69247C",
                                mb: 1.5,
                            }}
                        >
                            Step.3
                            <br />
                            Connect & Shortlist
                        </Typography>
                        <Typography
                            sx={{
                                fontWeight: 400,
                                fontSize: "16px",
                                lineHeight: "140%",
                                color: "#333333",
                            }}
                        >
                            Chat, shortlist, and manage all communication from your dashboard.
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Browse Professionals by Role Section */}
            <Box
                sx={{
                    pt: 2,
                    pb: 8,
                    px: 5,
                    backgroundColor: "#FFFFFF",
                }}
            >
                <Typography
                    sx={{
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        fontSize: "36px",
                        lineHeight: "140%",
                        textAlign: "center",
                        color: "#DA498D",
                        mb: 4,
                    }}
                >
                    Browse Professionals by Role
                </Typography>

                <Divider
                    sx={{
                        width: "100%",
                        maxWidth: "1301px",
                        borderColor: "#69247C",
                        borderWidth: "1px",
                        mx: "auto",
                        mb: 6,
                    }}
                />

                {/* Categories Grid */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "repeat(1, 1fr)",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(4, 1fr)",
                        },
                        gap: 4,
                        maxWidth: "1200px",
                        mx: "auto",
                    }}
                >
                    {[
                        { title: "Film & TV Actors", img: FilmImage },
                        { title: "Voice Artists", img: VoiceImage },
                        { title: "Fashion Models", img: ModelImage },
                        { title: "Wardrobe Consultants", img: WardrobeImage },
                        { title: "Hair Stylists", img: HairImage },
                        { title: "Saree Drapers", img: SareeImage },
                        { title: "Costume designer", img: CostumeImage },
                        { title: "Makeup Artists", img: MakeupImage },
                    ].map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: "100%",
                                maxWidth: "248px",
                                height: "268px",
                                mx: "auto",
                                backgroundColor: "#FFFFFF",
                                border: "1px solid #7E5A9B",
                                borderRadius: "10px",
                                boxShadow: "0px 4px 15px 0px #00000040",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                overflow: "hidden",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                },
                            }}
                        >
                            {/* Card Image */}
                            <Box
                                component="img"
                                src={item.img} // Using imported image
                                alt={item.title}
                                sx={{
                                    width: "100%",
                                    height: "140px",
                                    objectFit: "cover",
                                }}
                            />

                            {/* Card Content */}
                            <Box
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    flex: 1,
                                    width: "100%",
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontFamily: "Poppins",
                                        fontWeight: 700,
                                        fontSize: "18px", // Adjsuted to fit
                                        lineHeight: "130%",
                                        textAlign: "center",
                                        color: "#69247C",
                                    }}
                                >
                                    {item.title}
                                </Typography>

                                <Button
                                    sx={{
                                        width: "136px",
                                        height: "44px",
                                        background: "linear-gradient(90deg, #DA498D 0%, #69247C 100%)",
                                        borderRadius: "10px",
                                        fontFamily: "Poppins",
                                        fontWeight: 600,
                                        fontSize: "14px",
                                        textTransform: "none",
                                        color: "#FFFFFF",
                                        "&:hover": {
                                            background: "linear-gradient(90deg, #b03a70 0%, #511b60 100%)",
                                        },
                                    }}
                                >
                                    Explore now
                                </Button>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* View More Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Button
                        sx={{
                            width: "260px",
                            height: "60px",
                            background: "linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg, #69247C 0%, #DA498D 100%) border-box",
                            border: "1px solid transparent",
                            borderRadius: "5px",
                            fontFamily: "Poppins",
                            fontWeight: 600,
                            fontSize: "24px",
                            textTransform: "none",
                            "&:hover": {
                                background: "linear-gradient(#f9f9f9, #f9f9f9) padding-box, linear-gradient(90deg, #69247C 0%, #DA498D 100%) border-box",
                            }
                        }}
                    >
                        <Typography
                            sx={{
                                background: "linear-gradient(90deg, #69247C 0%, #DA498D 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontWeight: 600,
                                fontSize: "24px",
                                fontFamily: "Poppins",
                                lineHeight: "140%",
                            }}
                        >
                            View More
                        </Typography>
                    </Button>
                </Box>
            </Box>

            {/* Start Hiring Section */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "90%",
                    height: { xs: "auto", md: "308px" },
                    mx: "auto",
                    mt: 8,
                    mb: 8,
                    backgroundColor: "#FAC67A",
                    borderRadius: "10px",
                    position: "relative",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: { xs: 4, md: 8 },
                    py: { xs: 4, md: 0 },
                    overflow: "hidden",
                }}
            >
                {/* Left Content */}
                <Box sx={{ maxWidth: "600px", zIndex: 1 }}>
                    <Typography
                        sx={{
                            fontFamily: "Poppins",
                            fontWeight: 600,
                            fontSize: "36px",
                            lineHeight: "140%",
                            background: "linear-gradient(180deg, #69247C 0%, #DA498D 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 2,
                        }}
                    >
                        Start Hiring in Minutes
                    </Typography>

                    {/* Vertical Divider (Simulated with BorderLeft on text or separate generic divider) - User asked for divider-like element 
                        "width: 16.99... height: 76... background: #69247C" 
                        This looks like a vertical bar next to text. I'll place it or ignore if it's just a misplaced element in description.
                        Actually, coordinate "left: 678px" suggests it might be in the middle. 
                        I will assume the text is the main focus.
                    */}

                    <Typography
                        sx={{
                            fontFamily: "Poppins",
                            fontWeight: 400,
                            fontSize: "22px",
                            lineHeight: "140%",
                            color: "#69247C",
                            mb: 4,
                        }}
                    >
                        Post your requirement, review professional portfolios, and connect instantly — no middlemen.
                    </Typography>

                    <Button
                        sx={{
                            width: "134px",
                            height: "47px",
                            background: "linear-gradient(180deg, #69247C 0%, #DA498D 100%)",
                            borderRadius: "5px",
                            fontFamily: "Roboto",
                            fontWeight: 500,
                            fontSize: "22px", // Adjusted as 22px might be large for this button size, but adhering to spec
                            lineHeight: "131%",
                            textTransform: "none",
                            color: "#FFFFFF",
                            "&:hover": {
                                background: "linear-gradient(180deg, #511b60 0%, #b03a70 100%)",
                            },
                        }}
                    >
                        Post a Job
                    </Button>
                </Box>

                {/* Right Images (Overlapping) */}
                <Box
                    sx={{
                        position: "relative",
                        width: "400px",
                        height: "300px",
                        display: { xs: "none", md: "block" }
                    }}
                >
                    {/* Image 1 */}
                    <Box
                        component="img"
                        src={MenImage}
                        alt="Hiring 1"
                        sx={{
                            width: "202px",
                            height: "200px",
                            borderRadius: "10px",
                            objectFit: "cover",
                            position: "absolute",
                            top: "20px",
                            left: "0",
                            boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
                        }}
                    />
                    {/* Image 2 */}
                    <Box
                        component="img"
                        src={BannerImage}
                        alt="Hiring 2"
                        sx={{
                            width: "202px",
                            height: "200px",
                            borderRadius: "10px",
                            objectFit: "cover",
                            position: "absolute",
                            top: "100px", // Adjusted to create overlap nicely
                            left: "150px", // Adjusted based on relative pos
                            boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
                            zIndex: 2,
                        }}
                    />
                </Box>
            </Box>

            {/* Talent You Can Trust Section */}
            <Box
                sx={{
                    py: 8,
                    px: 5,
                    backgroundColor: "#FFFFFF",
                }}
            >
                <Typography
                    sx={{
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        fontSize: "36px",
                        lineHeight: "140%",
                        textAlign: "center",
                        color: "#DA498D",
                        mb: 4,
                    }}
                >
                    Talent You Can Trust
                </Typography>

                <Divider
                    sx={{
                        width: "100%",
                        maxWidth: "1308px",
                        borderColor: "#69247C",
                        borderWidth: "1px",
                        mx: "auto",
                        mb: 8,
                    }}
                />

                {/* Profiles Grid */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "repeat(1, 1fr)",
                            md: "repeat(3, 1fr)",
                        },
                        gap: 4,
                        maxWidth: "1200px",
                        mx: "auto",
                    }}
                >
                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: "100%",
                                maxWidth: "367px",
                                height: "auto",
                                mx: "auto",
                                backgroundColor: "#FFFFFF",
                                border: "1px solid #000000",
                                borderRadius: "22px",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
                                },
                            }}
                        >
                            {/* Profile Image */}
                            <Box
                                component="img"
                                src={ModelImage}
                                alt="Ananya Kapoor"
                                sx={{
                                    width: "100%",
                                    height: "240px",
                                    objectFit: "cover",
                                }}
                            />

                            {/* Profile Content */}
                            <Box sx={{ p: 3 }}>
                                <Typography
                                    sx={{
                                        fontFamily: "Poppins",
                                        fontWeight: 600,
                                        fontSize: "24px",
                                        lineHeight: "140%",
                                        color: "#69247C",
                                        mb: 0.5,
                                    }}
                                >
                                    Ananya Kapoor
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "Poppins",
                                        fontWeight: 600,
                                        fontSize: "20px",
                                        lineHeight: "140%",
                                        color: "#DA498D",
                                        mb: 0.5,
                                    }}
                                >
                                    Fashion Model (Ethnic wear)
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "Poppins",
                                        fontWeight: 600,
                                        fontSize: "20px",
                                        lineHeight: "140%",
                                        color: "#DA498D",
                                        mb: 1.5,
                                    }}
                                >
                                    Exp : 4+ Years
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <Typography
                                            sx={{
                                                fontFamily: "Poppins",
                                                fontWeight: 500,
                                                fontSize: "18px",
                                                lineHeight: "140%",
                                                color: "#69247C",
                                            }}
                                        >
                                            📍 Bangalore
                                        </Typography>
                                    </Box>

                                    <Button
                                        sx={{
                                            width: "126px",
                                            height: "45px",
                                            background: "linear-gradient(180deg, #69247C 0%, #DA498D 100%)",
                                            borderRadius: "10px",
                                            fontFamily: "Poppins",
                                            fontWeight: 600,
                                            fontSize: "14px",
                                            textTransform: "none",
                                            color: "#FFFFFF",
                                            "&:hover": {
                                                background: "linear-gradient(180deg, #511b60 0%, #b03a70 100%)",
                                            },
                                        }}
                                    >
                                        View Profile
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* View More Button for Talents */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Button
                        sx={{
                            minWidth: "200px",
                            height: "50px",
                            border: "1px solid #DA498D",
                            borderRadius: "5px",
                            fontFamily: "Poppins",
                            fontWeight: 600,
                            fontSize: "20px",
                            textTransform: "none",
                            color: "#DA498D",
                            "&:hover": {
                                backgroundColor: "rgba(218, 73, 141, 0.1)",
                            },
                        }}
                    >
                        View More
                    </Button>
                </Box>
            </Box>


            {/* Talent Agency Section */}
            <Box
                sx={{
                    width: "100%",
                    height: "103px",
                    backgroundColor: "#FAC67A",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: { xs: 4, md: 8 },
                    mt: 8,
                }}
            >
                <Typography
                    sx={{
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        fontSize: { xs: "24px", md: "36px" },
                        lineHeight: "140%",
                        background: "linear-gradient(180deg, #69247C 0%, #DA498D 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Are you a Talent Agency?
                </Typography>

                {/* Vertical Divider */}
                <Box
                    sx={{
                        width: "17px",
                        height: "76px",
                        backgroundColor: "#69247C",
                        display: { xs: "none", md: "block" },
                    }}
                />

                <Button
                    sx={{
                        width: "240px",
                        height: "60px",
                        background: "linear-gradient(90deg, #69247C 0%, #DA498D 100%)",
                        borderRadius: "5px",
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        fontSize: "24px",
                        textTransform: "none",
                        color: "#FFFFFF",
                        "&:hover": {
                            background: "linear-gradient(90deg, #511b60 0%, #b03a70 100%)",
                        },
                    }}
                >
                </Button>
            </Box>

            {/* Why Choose Bookmystars Section */}
            <Box
                sx={{
                    width: "100%",
                    minHeight: "621px",
                    background: "linear-gradient(180deg, #69247C 0%, #DA498D 100%)",
                    py: 8,
                    px: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 8,
                }}
            >
                <Typography
                    sx={{
                        fontFamily: "Poppins",
                        fontWeight: 600,
                        fontSize: "48px",
                        lineHeight: "140%",
                        color: "#FFFFFF",
                        textAlign: "center",
                        mb: 8,
                    }}
                >
                    Why Choose Bookmystars?
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "repeat(1, 1fr)",
                            md: "repeat(2, 1fr)",
                            lg: "repeat(4, 1fr)",
                        },
                        gap: 4,
                        maxWidth: "1350px",
                        width: "100%",
                    }}
                >
                    {[
                        {
                            icon: <VerifiedUser sx={{ fontSize: 60, color: "#69247C" }} />,
                            title: "Verified Talent Only",
                            desc: "Every profile is manually screened for authenticity."
                        },
                        {
                            icon: <Speed sx={{ fontSize: 60, color: "#69247C" }} />,
                            title: "Faster Hiring Process",
                            desc: "Post roles, browse profiles, and manage hiring all in one place"
                        },
                        {
                            icon: <LocationOn sx={{ fontSize: 60, color: "#69247C" }} />,
                            title: "Find Talent by Location",
                            desc: "Easily shortlist artists available in your shoot city or region."
                        },
                        {
                            icon: <Dashboard sx={{ fontSize: 60, color: "#69247C" }} />,
                            title: "Built-in Project Tools",
                            desc: "Chat, schedule, and finalize within your dashboard."
                        },
                    ].map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: "100%",
                                maxWidth: "304px",
                                height: "388px",
                                backgroundColor: "#FFFFFF",
                                borderRadius: "16px",
                                mx: "auto",
                                p: 4,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    backgroundColor: "rgba(105, 36, 124, 0.1)", // Light purple bg for icon
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 4,
                                }}
                            >
                                {item.icon}
                            </Box>

                            <Typography
                                sx={{
                                    fontFamily: "Poppins",
                                    fontWeight: 600,
                                    fontSize: "24px",
                                    lineHeight: "140%",
                                    color: "#69247C",
                                    mb: 2,
                                }}
                            >
                                {item.title}
                            </Typography>

                            <Typography
                                sx={{
                                    fontFamily: "Poppins",
                                    fontWeight: 400,
                                    fontSize: "18px", // Adjusted 22px to 18px for better fit in cards
                                    lineHeight: "140%",
                                    color: "#000000",
                                }}
                            >
                                {item.desc}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default LandingPage;
