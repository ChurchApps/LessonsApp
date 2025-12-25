"use client";

import { Layout } from "@/components/Layout";
import { Container, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

interface ComparisonData {
  competitor: string;
  tagline: string;
  description: string;
  features: {
    name: string;
    lessonsChurch: boolean | string;
    competitor: boolean | string;
  }[];
  pricing: {
    lessonsChurch: string;
    competitor: string;
  };
  verdict: string;
  ageGroups?: string;
}

const comparisons: Record<string, ComparisonData> = {
  "answers-in-genesis": {
    competitor: "Answers in Genesis",
    tagline: "Free alternative to ABC Curriculum",
    description: "Answers in Genesis offers creation-focused curriculum through their ABC program. Lessons.church provides comparable children's curriculum completely free.",
    ageGroups: "Children (Preschool - Elementary)",
    features: [
      { name: "Video Lessons", lessonsChurch: "1,100+", competitor: "Included" },
      { name: "Preschool Curriculum", lessonsChurch: true, competitor: true },
      { name: "Elementary Curriculum", lessonsChurch: true, competitor: true },
      { name: "Printable Materials", lessonsChurch: true, competitor: true },
      { name: "Leader Guides", lessonsChurch: true, competitor: true },
      { name: "Multi-Campus Use", lessonsChurch: "Unlimited free", competitor: "Per-site cost" },
      { name: "Classroom Scheduling", lessonsChurch: true, competitor: false },
      { name: "TV/Display App", lessonsChurch: true, competitor: false },
      { name: "Mobile Volunteer App", lessonsChurch: true, competitor: false },
      { name: "Open Source", lessonsChurch: true, competitor: false },
    ],
    pricing: {
      lessonsChurch: "100% Free",
      competitor: "$450-600/year"
    },
    verdict: "Both offer quality biblical curriculum for children. Answers in Genesis focuses on creation science, while Lessons.church offers broader topics - completely free. For budget-conscious churches, Lessons.church is the clear choice."
  },
  "think-orange": {
    competitor: "Orange",
    tagline: "Free alternative to Orange curriculum",
    description: "Orange offers First Look, 252 Kids, and XP3 curriculum for different age groups. Lessons.church provides comparable content at no cost.",
    ageGroups: "All Ages (Preschool - High School)",
    features: [
      { name: "Video Lessons", lessonsChurch: "1,100+", competitor: "Included" },
      { name: "Preschool (First Look)", lessonsChurch: true, competitor: true },
      { name: "Elementary (252 Kids)", lessonsChurch: true, competitor: true },
      { name: "Youth (XP3)", lessonsChurch: true, competitor: true },
      { name: "Small Group Guides", lessonsChurch: true, competitor: true },
      { name: "Parent Resources", lessonsChurch: "Basic", competitor: "Extensive" },
      { name: "Multi-Campus Use", lessonsChurch: "Unlimited free", competitor: "Per-site cost" },
      { name: "Classroom Scheduling", lessonsChurch: true, competitor: true },
      { name: "TV/Display App", lessonsChurch: true, competitor: true },
      { name: "ChMS Integration", lessonsChurch: "Full (B1 Admin)", competitor: "Limited" },
      { name: "FreeShow Integration", lessonsChurch: "Free", competitor: "Paid subscription" },
      { name: "Open Source", lessonsChurch: true, competitor: false },
    ],
    pricing: {
      lessonsChurch: "100% Free",
      competitor: "$1,800-2,400/year"
    },
    verdict: "Orange curriculum is highly polished with extensive parent resources. However, at $1,800+/year, it's out of reach for many churches. Lessons.church offers similar video-based curriculum with full ChMS integration and free FreeShow support at zero cost."
  },
  "rightnow-media": {
    competitor: "RightNow Media",
    tagline: "Free curriculum vs video library",
    description: "RightNow Media is a video streaming library for churches. Lessons.church offers structured curriculum with teaching tools - both have different purposes but Lessons.church is free.",
    ageGroups: "All Ages (Kids - Adults)",
    features: [
      { name: "Video Content", lessonsChurch: "1,100+ curriculum lessons", competitor: "25,000+ library videos" },
      { name: "Children's Content", lessonsChurch: true, competitor: true },
      { name: "Youth Content", lessonsChurch: true, competitor: true },
      { name: "Adult Bible Studies", lessonsChurch: true, competitor: true },
      { name: "Structured Curriculum", lessonsChurch: true, competitor: "Limited" },
      { name: "Lesson Plans", lessonsChurch: true, competitor: false },
      { name: "Classroom Scheduling", lessonsChurch: true, competitor: false },
      { name: "TV/Display App", lessonsChurch: true, competitor: true },
      { name: "Per-Member Pricing", lessonsChurch: "None", competitor: "$7/person/month" },
      { name: "Open Source", lessonsChurch: true, competitor: false },
    ],
    pricing: {
      lessonsChurch: "100% Free",
      competitor: "$7/person/month (~$2,000-5,000/year)"
    },
    verdict: "RightNow Media excels as a video library for personal devotions and small groups. Lessons.church focuses on structured classroom curriculum with scheduling tools. If you need classroom curriculum, Lessons.church is free and purpose-built."
  },
  "grow-curriculum": {
    competitor: "Grow Curriculum",
    tagline: "Free alternative to Grow Curriculum",
    description: "Grow Curriculum offers video-based children's ministry curriculum. Lessons.church provides similar content with additional classroom technology - completely free.",
    ageGroups: "Children (Preschool - Preteen)",
    features: [
      { name: "Video Lessons", lessonsChurch: "1,100+", competitor: "52/year" },
      { name: "Preschool Curriculum", lessonsChurch: true, competitor: true },
      { name: "Elementary Curriculum", lessonsChurch: true, competitor: true },
      { name: "Preteen Curriculum", lessonsChurch: true, competitor: true },
      { name: "Volunteer Guides", lessonsChurch: true, competitor: true },
      { name: "Graphics Package", lessonsChurch: "Basic", competitor: "Extensive" },
      { name: "Multi-Campus Use", lessonsChurch: "Unlimited free", competitor: "Included" },
      { name: "Classroom Scheduling", lessonsChurch: true, competitor: false },
      { name: "TV/Display App", lessonsChurch: true, competitor: false },
      { name: "Open Source", lessonsChurch: true, competitor: false },
    ],
    pricing: {
      lessonsChurch: "100% Free",
      competitor: "$999+/year"
    },
    verdict: "Grow Curriculum offers quality content with strong graphics packages. At $999/year, it's a significant investment. Lessons.church provides comparable video curriculum plus classroom technology tools at no cost."
  },
  "group-publishing": {
    competitor: "Group Publishing",
    tagline: "Free alternative to Group curriculum",
    description: "Group Publishing offers various curriculum lines including DIG IN and Simply Loved. Lessons.church provides similar structured curriculum for free.",
    ageGroups: "Children (Nursery - Preteen)",
    features: [
      { name: "Video Lessons", lessonsChurch: "1,100+", competitor: "Included" },
      { name: "Nursery/Toddler", lessonsChurch: "Preschool", competitor: true },
      { name: "Elementary Curriculum", lessonsChurch: true, competitor: true },
      { name: "Preteen Content", lessonsChurch: true, competitor: true },
      { name: "Hands-On Activities", lessonsChurch: true, competitor: "Extensive" },
      { name: "Leader Guides", lessonsChurch: true, competitor: true },
      { name: "Quarterly Updates", lessonsChurch: "Ongoing", competitor: "Per quarter purchase" },
      { name: "Classroom Scheduling", lessonsChurch: true, competitor: false },
      { name: "TV/Display App", lessonsChurch: true, competitor: false },
      { name: "Open Source", lessonsChurch: true, competitor: false },
    ],
    pricing: {
      lessonsChurch: "100% Free",
      competitor: "$200-800/quarter"
    },
    verdict: "Group Publishing has decades of experience with hands-on, experiential curriculum. The quarterly purchase model adds up quickly. Lessons.church offers video-based curriculum with digital tools at no ongoing cost."
  }
};

export default function ComparePage() {
  const params = useParams();
  const competitor = params.competitor as string;
  const data = competitor ? comparisons[competitor] : null;

  useEffect(() => {
    if (data) {
      document.title = `Lessons.church vs ${data.competitor} - Free Church Curriculum Comparison`;

      const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `Lessons.church vs ${data.competitor} Comparison`,
        "description": data.description,
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "SoftwareApplication",
              "name": "Lessons.church",
              "applicationCategory": "EducationalApplication",
              "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
            },
            {
              "@type": "SoftwareApplication",
              "name": data.competitor,
              "applicationCategory": "EducationalApplication"
            }
          ]
        }
      };

      const existingSchema = document.getElementById("compare-schema");
      if (existingSchema) existingSchema.remove();

      const script = document.createElement("script");
      script.id = "compare-schema";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);

      return () => {
        const el = document.getElementById("compare-schema");
        if (el) el.remove();
      };
    }
  }, [data]);

  const renderFeatureValue = (value: boolean | string) => {
    if (value === true) {
      return <CheckCircleIcon sx={{ color: "#4caf50" }} />;
    } else if (value === false) {
      return <CancelIcon sx={{ color: "#f44336" }} />;
    } else {
      return <span style={{ fontSize: "0.9rem" }}>{value}</span>;
    }
  };

  if (!data) {
    return (
      <Layout pageTitle="Curriculum Comparison - Lessons.church">
        <div className="homeSection" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <Container fixed>
            <div style={{ textAlign: "center" }}>
              <h1>Curriculum Comparisons</h1>
              <p style={{ color: "#666", marginBottom: 40 }}>
                See how Lessons.church compares to paid curriculum providers
              </p>
              <Grid container spacing={3} justifyContent="center">
                {Object.keys(comparisons).map(key => (
                  <Grid key={key}>
                    <Link href={`/compare/${key}`} style={{ textDecoration: "none" }}>
                      <Chip
                        label={`vs ${comparisons[key].competitor}`}
                        clickable
                        sx={{ fontSize: "1rem", padding: "20px 10px" }}
                      />
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </div>
          </Container>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle={`Lessons.church vs ${data.competitor}`} metaDescription={data.description}>
      <div className="homeSection" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <Container fixed>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 50 }}>
            <Chip
              label={data.tagline}
              color="success"
              sx={{ marginBottom: 3, fontSize: "0.95rem", padding: "20px 10px" }}
            />
            <h1 style={{ fontSize: "2.5rem", marginBottom: 16 }}>
              Lessons.church vs {data.competitor}
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#666", maxWidth: 700, margin: "0 auto" }}>
              {data.description}
            </p>
            {data.ageGroups && (
              <p style={{ marginTop: 12, color: "#888" }}>
                <strong>Age Groups:</strong> {data.ageGroups}
              </p>
            )}
          </div>

          {/* Pricing Comparison */}
          <Grid container spacing={4} sx={{ marginBottom: 6 }}>
            <Grid size={{ md: 6, xs: 12 }}>
              <Paper sx={{ padding: 4, textAlign: "center", border: "3px solid #1976d2", borderRadius: 3 }}>
                <h3 style={{ marginBottom: 8 }}>Lessons.church</h3>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#1976d2", marginBottom: 8 }}>
                  {data.pricing.lessonsChurch}
                </div>
                <p style={{ color: "#666" }}>No hidden fees, forever</p>
              </Paper>
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Paper sx={{ padding: 4, textAlign: "center", borderRadius: 3, backgroundColor: "#f5f5f5" }}>
                <h3 style={{ marginBottom: 8 }}>{data.competitor}</h3>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#666", marginBottom: 8 }}>
                  {data.pricing.competitor}
                </div>
                <p style={{ color: "#888" }}>Plus any add-on costs</p>
              </Paper>
            </Grid>
          </Grid>

          {/* Feature Comparison Table */}
          <TableContainer component={Paper} sx={{ marginBottom: 6, borderRadius: 3, overflow: "hidden" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Feature</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem", color: "#1976d2" }}>
                    Lessons.church
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                    {data.competitor}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.features.map((feature, index) => (
                  <TableRow key={index} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#fafafa" } }}>
                    <TableCell sx={{ fontWeight: 500 }}>{feature.name}</TableCell>
                    <TableCell align="center">{renderFeatureValue(feature.lessonsChurch)}</TableCell>
                    <TableCell align="center">{renderFeatureValue(feature.competitor)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Verdict */}
          <Paper sx={{ padding: 4, marginBottom: 6, borderRadius: 3, borderLeft: "4px solid #1976d2" }}>
            <h2 style={{ marginBottom: 16 }}>Our Take</h2>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "#444" }}>
              {data.verdict}
            </p>
          </Paper>

          {/* CTA */}
          <div style={{ textAlign: "center", padding: 40, backgroundColor: "#f0f7ff", borderRadius: 16 }}>
            <h2 style={{ marginBottom: 16 }}>Ready to save your church money?</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>
              Switch to Lessons.church and redirect your curriculum budget to ministry.
            </p>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="/register"
            >
              Get Started Free
            </Button>
          </div>

          {/* Other Comparisons */}
          <div style={{ marginTop: 60, textAlign: "center" }}>
            <h3 style={{ marginBottom: 24 }}>Other Comparisons</h3>
            <Grid container spacing={2} justifyContent="center">
              {Object.keys(comparisons)
                .filter(key => key !== competitor)
                .map(key => (
                  <Grid key={key}>
                    <Link href={`/compare/${key}`} style={{ textDecoration: "none" }}>
                      <Chip
                        label={`vs ${comparisons[key].competitor}`}
                        clickable
                        variant="outlined"
                        sx={{ fontSize: "0.9rem" }}
                      />
                    </Link>
                  </Grid>
                ))}
            </Grid>
          </div>
        </Container>
      </div>
    </Layout>
  );
}
