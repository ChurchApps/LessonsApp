import { Layout } from "@/components/Layout";
import { Container, Grid, Accordion, AccordionSummary, AccordionDetails, Typography, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Metadata } from "next";
import { MetaHelper } from "@/helpers/MetaHelper";
import Link from "next/link";

const faqs = [
  {
    question: "Is Lessons.church really free?",
    answer: "Yes, Lessons.church is 100% free. We are a 501(c)(3) non-profit ministry (Live Church Solutions/ChurchApps) dedicated to providing free resources to churches. There are no hidden fees, no premium tiers, and no limits on usage."
  },
  {
    question: "What curriculum is available on Lessons.church?",
    answer: "We offer Ark Kids curriculum for children (preschool and elementary), For Ministry Resources for youth groups, Next Level for adult Bible studies, and curriculum from partner churches and ministries. Christian curriculum companies also donate their older or newly created content to help churches. All curriculum includes video lessons, downloadable materials, and leader guides. We're always looking for more open-source, quality, biblically-based curriculum. If you'd like to contribute, please contact support@churchapps.org."
  },
  {
    question: "What age groups does Ark Kids curriculum cover?",
    answer: "Ark Kids covers preschool (ages 2-5) and elementary (K-5th grade). Each age group has age-appropriate video content, activities, and teaching materials designed for their developmental stage."
  },
  {
    question: "How many video lessons are available?",
    answer: "We currently have over 1,100 lessons available across 189 studies from 12 curriculum providers. New content is added regularly as partner churches and curriculum companies contribute."
  },
  {
    question: "Can I use Lessons.church for multiple campuses?",
    answer: "Yes, there are no limits on the number of campuses or classrooms. Use Lessons.church across all your locations at no additional cost."
  },
  {
    question: "How does the classroom scheduling work?",
    answer: "Our portal allows you to schedule which lessons play in each classroom. You can plan weeks or months in advance, and the Venue TV app will automatically display the scheduled content."
  },
  {
    question: "What is the Venue TV app?",
    answer: "The Venue app is an Android TV application that displays your scheduled lessons on classroom screens. Simply install it on an Android TV device, connect it to your church account, and it will automatically play the correct lesson for each classroom."
  },
  {
    question: "Is there a mobile app for volunteers?",
    answer: "Yes, the B1.church mobile app includes volunteer guides for Lessons.church curriculum. Volunteers can follow along with lesson scripts, activities, and timing on their phones while the video plays."
  },
  {
    question: "Does Lessons.church integrate with FreeShow?",
    answer: "Yes, Lessons.church integrates seamlessly with FreeShow, our free presentation software. You can display curriculum content directly in your worship and classroom presentations."
  },
  {
    question: "How does Lessons.church compare to paid curriculum like Planning Center or Think Orange?",
    answer: "While paid curriculum providers charge $1,000-3,000+ per year, Lessons.church provides comparable video-based curriculum completely free. We offer the same features: video lessons, printable materials, scheduling tools, and classroom apps - all at no cost."
  },
  {
    question: "What makes Lessons.church different from RightNow Media?",
    answer: "RightNow Media is a video library (like Netflix for churches) charging per-person fees. Lessons.church is structured curriculum with lesson plans, activities, and classroom tools - completely free. They serve different purposes but Lessons.church costs nothing."
  },
  {
    question: "Can I download materials for offline use?",
    answer: "Yes, all printable materials including activity sheets, coloring pages, and leader guides can be downloaded. Video content can be cached in the Venue app for offline classroom use."
  },
  {
    question: "Is the curriculum theologically sound?",
    answer: "Yes, all curriculum on Lessons.church is created by and for Christian churches. The Ark Kids curriculum teaches biblical truth in an engaging, age-appropriate way. We welcome churches from various denominations."
  },
  {
    question: "How do I get started with Lessons.church?",
    answer: "Simply register for a free account at lessons.church/register, browse the available curriculum, schedule lessons for your classrooms, and download the Venue app. You can be up and running in minutes."
  },
  {
    question: "Is Lessons.church open source?",
    answer: "Yes, all our code is open source and available on GitHub at github.com/ChurchApps. Churches can contribute improvements, and developers can see exactly how the platform works."
  }
];

export async function generateMetadata(): Promise<Metadata> {
  const description = "Frequently asked questions about Lessons.church - free church curriculum for children, youth, and adults. Learn about our features, pricing (free!), and how to get started.";
  return MetaHelper.getMetaData("FAQ - Lessons.church", description);
}

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Layout pageTitle="FAQ - Lessons.church" metaDescription="Frequently asked questions about Lessons.church free church curriculum">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="homeSection" style={{ paddingTop: 60, paddingBottom: 60 }}>
        <Container fixed>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="title">
              <span>Help Center</span>
            </div>
            <h1 style={{ fontSize: "2.5rem", marginBottom: 16 }}>Frequently Asked Questions</h1>
            <p style={{ fontSize: "1.1rem", color: "#666", maxWidth: 600, margin: "0 auto" }}>
              Everything you need to know about Lessons.church - the free curriculum platform for churches.
            </p>
          </div>

          <Grid container spacing={3}>
            <Grid size={{ md: 2, sm: 0 }} />
            <Grid size={{ md: 8, sm: 12 }}>
              {faqs.map((faq, index) => (
                <Accordion key={index} sx={{ mb: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: "8px !important", "&:before": { display: "none" } }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      "&.Mui-expanded": { borderRadius: "8px 8px 0 0" }
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, color: "#333" }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: "#fff", padding: "20px 24px" }}>
                    <Typography sx={{ color: "#555", lineHeight: 1.7 }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          </Grid>

          <div style={{ textAlign: "center", marginTop: 60, padding: "40px", backgroundColor: "#f0f7ff", borderRadius: 16 }}>
            <h2 style={{ marginBottom: 16 }}>Ready to Get Started?</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>
              Join thousands of churches using free curriculum from Lessons.church
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                href="/register"
              >
                Start Free Today
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                href="https://support.churchapps.org/"
                target="_blank"
              >
                View Documentation
              </Button>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Typography variant="body2" color="textSecondary">
              Still have questions? Contact us at{" "}
              <a href="mailto:support@churchapps.org" style={{ color: "#1976d2" }}>
                support@churchapps.org
              </a>
            </Typography>
          </div>
        </Container>
      </div>
    </Layout>
  );
}
