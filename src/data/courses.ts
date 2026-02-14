// =========================
// TYPES
// =========================

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "project" | "quiz";
  isPreview?: boolean; // Only preview lessons are accessible to expired free users
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lessons: Lesson[];
}

// =========================
// COURSES DATA
// =========================

export const trackCourses: Record<string, Course[]> = {
  frontend: [
    {
      id: "fe-1",
      title: "HTML & CSS Fundamentals",
      description:
        "Build responsive web pages from scratch with semantic HTML and modern CSS.",
      duration: "3 weeks",
      level: "Beginner",
      lessons: [
        {
          id: "fe-1-l1",
          title: "Introduction to HTML",
          duration: "15 mins",
          type: "video",
          isPreview: true,
        },
        {
          id: "fe-1-l2",
          title: "Semantic HTML Structure",
          duration: "20 mins",
          type: "video",
        },
        {
          id: "fe-1-l3",
          title: "CSS Fundamentals",
          duration: "25 mins",
          type: "video",
        },
        {
          id: "fe-1-l4",
          title: "Responsive Design Project",
          duration: "45 mins",
          type: "project",
        },
      ],
    },

    {
      id: "fe-2",
      title: "JavaScript Essentials",
      description:
        "Master core JavaScript concepts including DOM manipulation and async programming.",
      duration: "4 weeks",
      level: "Beginner",
      lessons: [
        {
          id: "fe-2-l1",
          title: "JavaScript Basics",
          duration: "20 mins",
          type: "video",
          isPreview: true,
        },
        {
          id: "fe-2-l2",
          title: "Functions & Scope",
          duration: "25 mins",
          type: "video",
        },
        {
          id: "fe-2-l3",
          title: "DOM Manipulation",
          duration: "30 mins",
          type: "video",
        },
        {
          id: "fe-2-l4",
          title: "Mini Interactive App",
          duration: "1 hr",
          type: "project",
        },
      ],
    },
  ],

  backend: [
    {
      id: "be-1",
      title: "Programming Fundamentals",
      description:
        "Learn core programming concepts with Node.js.",
      duration: "3 weeks",
      level: "Beginner",
      lessons: [
        {
          id: "be-1-l1",
          title: "Variables & Data Types",
          duration: "20 mins",
          type: "video",
          isPreview: true,
        },
        {
          id: "be-1-l2",
          title: "Control Flow",
          duration: "25 mins",
          type: "video",
        },
        {
          id: "be-1-l3",
          title: "Building Your First CLI App",
          duration: "1 hr",
          type: "project",
        },
      ],
    },
  ],

  fullstack: [
    {
      id: "fs-1",
      title: "Web Foundations",
      description:
        "HTML, CSS, JavaScript — the building blocks of the web.",
      duration: "4 weeks",
      level: "Beginner",
      lessons: [
        {
          id: "fs-1-l1",
          title: "How the Web Works",
          duration: "15 mins",
          type: "video",
          isPreview: true,
        },
        {
          id: "fs-1-l2",
          title: "Frontend vs Backend",
          duration: "20 mins",
          type: "video",
        },
        {
          id: "fs-1-l3",
          title: "Building Your First Web Page",
          duration: "40 mins",
          type: "project",
        },
      ],
    },
  ],

  foundation: [
    {
      id: "fn-1",
      title: "Introduction to Programming",
      description:
        "Learn programming logic, variables, loops, and functions.",
      duration: "3 weeks",
      level: "Beginner",
      lessons: [
        {
          id: "fn-1-l1",
          title: "What is Programming?",
          duration: "15 mins",
          type: "video",
          isPreview: true,
        },
        {
          id: "fn-1-l2",
          title: "Variables & Logic",
          duration: "20 mins",
          type: "video",
        },
        {
          id: "fn-1-l3",
          title: "First Coding Exercise",
          duration: "35 mins",
          type: "project",
        },
      ],
    },
  ],
};
