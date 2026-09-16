// ─────────────────────────────────────────────────────────────
//  All the content on your site lives in this file.
//  Edit text here; you don't need to touch the components.
//
//  Anything set to null shows up on the site as a hatched
//  "Unmapped" box so you can see what's left to fill in.
//  When you're ready to share the site, set SHOW_PLACEHOLDERS
//  to false and every unfilled box disappears.
// ─────────────────────────────────────────────────────────────

export const SHOW_PLACEHOLDERS = false;

export const profile = {
  name: "Vishwas B M",
  role: "Robotics & AI engineering student",
  intro:
    "I build with ROS 2: robot descriptions, Gazebo and RViz simulations, and robotics tools that run in the browser. Open to robotics internships.",
  location: "Shivamogga, Karnataka, India",
  email: "vishwasvishu376@gmail.com",
  resume: "/vishwas_resume.pdf",
  availability: "I'm available for internships and remote or on-site",
};

export const socials = [
  { label: "GitHub", handle: "vishwasvishubm", url: "https://github.com/vishwasvishubm" },
  { label: "LinkedIn", handle: "Vishwas B M", url: "https://www.linkedin.com/in/vishwas-b-m-b3445a218" },
  { label: "X", handle: "@Vishwas369", url: "https://x.com/Vishwas369" },
  { label: "Instagram", handle: "@ofcoursevish", url: "https://www.instagram.com/ofcoursevish" },
];

// status can be: "done", "in-progress", "planned"
export const projects = [
  {
    id: "v-mitra",
    featured: true,
    name: "V-M.I.T.R.A",
    fullName: "Virtual Mentor for Intelligent Technical and Robotics Analysis",
    status: "in-progress",
    summary:
      "V–M.I.T.R.A is a smart virtual robotics laboratory that connects an interactive learning platform with ROS 2 and simulation tools, enabling students to learn, execute, and analyze robotics experiments in a guided environment.",
    role: "Team lead, 4 members",
    image: null,
    stack: ["ROS 2 Jazzy", "Python", "URDF", "ament_cmake", "Ubuntu"],
    links: { code: null, demo: null, video: null },
  },
  {
    id: "ros2-web-terminal",
    name: "ROS 2 Web Terminal",
    status: "done",
    summary:
      "A real Ubuntu terminal in the browser for running ROS 2. Run a launch file and the Gazebo or RViz view opens in its own tab, rendered on a headless server.",
    role: "Personal project",
    highlights: [
      "Real bash shell streamed over WebSockets, protected with a token",
      "Detects ros2 launch and opens the simulation view automatically",
      "Headless Gazebo and RViz shown in the browser with Xvfb, x11vnc and noVNC",
    ],
    image: null,
    stack: ["React", "Vite", "xterm.js", "Node.js", "node-pty", "WebSockets", "noVNC", "ROS 2"],
    links: { code: null, demo: null, video: null },
  },
  {
    id: "friday-os",
    name: "FRIDAY OS",
    status: "done",
    summary:
      "A lightweight, modular AI-powered desktop assistant inspired by JARVIS and FRIDAY from the Iron Man universe. It provides voice-based interaction, wake-word detection, intelligent task execution, memory management and desktop automation without needing a large language model running locally. Built with Python, OpenWakeWord and audio-processing tools, it runs as an unobtrusive personal assistant on Windows 11, and its modular architecture leaves room for speech recognition, AI services, application control and desktop awareness.",
    role: "Personal project",
    image: null,
    stack: ["Python", "OpenWakeWord", "Speech and audio processing", "Windows 11"],
    links: { code: null, demo: null, video: null },
  },
  {
    id: "classpulse",
    name: "ClassPulse",
    status: "done",
    summary:
      "A real-time class notification and timetable management system that improves communication between college students and teachers. Students get timely reminders about upcoming classes, live class countdowns and important academic announcements, while administrators manage the schedules behind it. Built with React, Vite and Tailwind CSS, it reduces missed classes and makes academic communication more efficient.",
    role: "Personal project",
    image: null,
    stack: ["React", "Vite", "Tailwind CSS", "JavaScript"],
    links: { code: null, demo: null, video: null },
  },
  {
    id: "routex",
    name: "RouteX",
    status: "done",
    summary:
      "An AI-assisted collaborative travel and expense planning platform that simplifies group trip organisation. It uses the OpenAI API for itinerary assistance, Google Maps and Mapbox for route planning and geographic visualisation, and OpenWeatherMap for destination weather. Built with Python, HTML, CSS, JavaScript and Tailwind CSS, it brings routes, structured itineraries and shared travel expenses into one web platform.",
    role: "Personal project",
    image: null,
    stack: ["Python", "JavaScript", "Tailwind CSS", "OpenAI API", "Google Maps API", "Mapbox", "OpenWeatherMap API"],
    links: { code: null, demo: null, video: null },
  },
  {
    id: "jnnce-bus-app",
    name: "JNNCE Bus App",
    status: "in-progress",
    summary:
      "A bus tracking and timetable app for JNNCE college buses, so students can check routes, stops and timings from their phone instead of waiting without information.",
    role: "Personal project",
    image: null,
    stack: ["React", "JavaScript"],
    links: { code: null, demo: null, video: null },
  },
];

export const skills = [
  {
    group: "Robotics",
    items: ["ROS 2 (Jazzy)", "ROS 1 (Noetic)", "URDF", "Gazebo", "RViz", "colcon and ament_cmake"],
  },
  {
    group: "Programming",
    items: ["Python", "C", "C++", "JavaScript", "Bash"],
  },
  {
    group: "Web and systems",
    items: ["React and Vite", "Node.js", "WebSockets", "HTML and CSS", "Ubuntu Linux", "Xvfb, x11vnc, noVNC", "Git and GitHub"],
  },
  {
    group: "AI and 3D",
    items: ["Machine learning", "Prompt engineering"],
  },
];

export const leadership = [
  {
    title: "Technical team head, FOSSHACK",
    detail: "Led the technical side of FOSSHACK, a 36-hour hackathon we conducted.",
    year: "2025",
    more: null,
    moreHint: null,
  },
  {
    title: "Team lead, V-M.I.T.R.A",
    detail: "Led a team of four to design and build the first version in three months.",
    year: "2026",
    more: null,
    moreHint: null,
  },
];

// Add your certificates here.
export const certifications = [
  {
    title: "The Ultimate 2025 Fullstack Web Development Bootcamp",
    issuer: "Udemy",
    year: "2026",
    url: "/certificates/fullstack-web-development-udemy.pdf",
  },
  {
    title: "Understanding LLMs and Basic Prompting Techniques",
    issuer: "CodeSignal",
    year: "2026",
    url: "/certificates/prompt-engineering-codesignal.pdf",
  },
  {
    title: "Maths for Machine Learning",
    issuer: "Scaler Topics",
    year: "2026",
    url: "/certificates/maths-for-machine-learning-scaler.pdf",
  },
  {
    title: "Employability Skill Training Programme",
    issuer: "Mahindra Pride Classroom, Naandi Foundation",
    year: "2026",
    url: "/certificates/employability-skill-training-mahindra.pdf",
  },
  {
    title: "Electric Drive Systems: Batteries, Powertrains and Transmissions",
    issuer: "L&T EduTech",
    year: "2025",
    url: "/certificates/lt-electric-drive-systems.pdf",
  },
  {
    title: "Fundamentals of Electric and Hybrid Electric Vehicle Technology",
    issuer: "L&T EduTech",
    year: "2024",
    url: "/certificates/lt-electric-hybrid-vehicle.pdf",
  },
  {
    title: "Adobe India Hackathon, Round 1",
    issuer: "Adobe",
    year: "2025",
    url: "/certificates/adobe-india-hackathon.pdf",
  },
  {
    title: "Agentic AI Day",
    issuer: "Google Cloud and Hack2skill",
    year: "2025",
    url: "/certificates/google-agentic-ai-day.pdf",
  },
  {
    title: "SHE Secure 2025, national 24-hour hackathon",
    issuer: "AI & ML Department, JNNCE with Hack2skill",
    year: "2025",
    url: "/certificates/she-secure-2025.pdf",
  },
];

export const channels = [
  {
    handle: "@ofcoursevish",
    platform: "Instagram",
    url: "https://www.instagram.com/ofcoursevish",
    about:
      "My learning journey, documented as I go. Right now that's ROS 2 projects, including the parts that break and how I fix them.",
    series: "Current series: ZERO → ROBOT",
  },
  {
    handle: "@brotechkannada",
    platform: "Instagram",
    url: "https://www.instagram.com/brotechkannada",
    about: "Where I explore and talk about tech, AI, and useful tips and tricks.",
    series: null,
  },
];

export const about = {
  paragraphs: [
    "I'm a Robotics and AI engineering student at JNNCE, Shivamogga. Most of my time goes into ROS 2: describing robots in URDF, running them in Gazebo and RViz, and building tools that make robotics easier to learn.",
    "I learn in public. I document what I'm building, including the bugs, and I'm working toward a simulated autonomous mobile robot as the end of my first season.",
  ],
  languages: ["English (fluent)", "Kannada (native)", "Hindi (intermediate)", "Spanish (intermediate)"],
  offTheClock: ["Chess", "Basketball", "Video games"],
};

export const education = [
  {
    degree: "B.E. in Robotics and Artificial Intelligence",
    school: "JNNCE, Shivamogga",
    years: "2023 – 2027",
    score: "CGPA 7.68",
  },
  {
    degree: "Pre-University",
    school: "PACE U.M.P.U College, Shivamogga",
    years: "2021 – 2023",
    score: "81.17%",
  },
  {
    degree: "SSLC",
    school: "S.R.V.K, Shivamogga",
    years: "2021",
    score: "84.69%",
  },
];
