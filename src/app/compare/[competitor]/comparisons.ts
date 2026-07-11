export interface ComparisonData {
  competitor: string;
  tagline: string;
  description: string;
  features: {
    name: string;
    lessonsChurch: boolean | string;
    competitor: boolean | string;
  }[];
  pricing: { lessonsChurch: string; competitor: string; };
  verdict: string;
  ageGroups?: string;
}

export const comparisons: Record<string, ComparisonData> = {
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
      { name: "Open Source", lessonsChurch: true, competitor: false }
    ],
    pricing: { lessonsChurch: "100% Free", competitor: "$450-600/year" },
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
      { name: "Open Source", lessonsChurch: true, competitor: false }
    ],
    pricing: { lessonsChurch: "100% Free", competitor: "$1,800-2,400/year" },
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
      { name: "Open Source", lessonsChurch: true, competitor: false }
    ],
    pricing: { lessonsChurch: "100% Free", competitor: "$7/person/month (~$2,000-5,000/year)" },
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
      { name: "Open Source", lessonsChurch: true, competitor: false }
    ],
    pricing: { lessonsChurch: "100% Free", competitor: "$999+/year" },
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
      { name: "Open Source", lessonsChurch: true, competitor: false }
    ],
    pricing: { lessonsChurch: "100% Free", competitor: "$200-800/quarter" },
    verdict: "Group Publishing has decades of experience with hands-on, experiential curriculum. The quarterly purchase model adds up quickly. Lessons.church offers video-based curriculum with digital tools at no ongoing cost."
  }
};
