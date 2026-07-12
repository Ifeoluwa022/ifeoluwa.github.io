// Portfolio content — single source of truth for all pages.
const profile = {
  name: "Ifeoluwa Salau",
  role: "Software Engineering Student @ Miva Open University",
  tagline: "I build for the web — one line of code at a time.",
  welcome: "Hi, I'm Ifeoluwa.",
  bio: "I'm a Software Engineering student with a passion for web development. I enjoy turning ideas into clean, responsive websites while learning new technologies and improving my skills. Open for internships.",
  email: "Ifeoluwasalau2007@gmail.com",
  phone: "08133675071",
  location: "Lagos · Nigeria",
  discord: "unknownuser04827",
  github: "https://github.com/lfeoluwa022/ifeoluwa.github.io",
  linkedin: "https://www.linkedin.com/in/ifeoluwa-salau-a155783b8",
  portrait: "profile.jpg.jpeg",
};

const education = {
  background:
    "I'm currently studying Computer Software Engineering at Miva Open University. Along the way, I've been learning programming, web development, and software design through coursework and personal projects. Every project helps me become a better developer.",
  aspirations:
    "I'm working toward becoming a full-stack software engineer. I want to build web applications that are fast, reliable, and useful, while continuing to learn, take on new challenges, and grow as a developer.",
};

const skills = [
  { name: "HTML", level: 90 },
  { name: "CSS", level: 85 },
  { name: "JavaScript", level: 80 },
  { name: "Git & GitHub", level: 78 },
  { name: "Python", level: 65 },
  { name: "Problem Solving", level: 88 },
];

const hobbies = [
  "Exploring new technologies",
  "Practicing coding",
  "Reading about software development trends",
  "Working on personal projects",
  "Collaborating with others",
  "Finding creative solutions to technical challenges",
];

const projects = [
  {
    title: "Personal Portfolio Website",
    description:
      "A responsive multi-page portfolio built with HTML, CSS and JavaScript demonstrating semantic markup, flexbox/grid layouts and smooth animations.",
    image:
      "https://images.unsplash.com/photo-1617040619263-41c5a9ca7521?crop=entropy&cs=srgb&fm=jpg&q=80&w=800",
    tags: ["HTML", "CSS", "JavaScript"],
    demo: "#",
    source: "https://github.com/lfeoluwa022/ifeoluwa.github.io",
  },
  {
    title: "Academic Task Planner",
    description:
      "An interactive task manager where students can add, complete and delete academic tasks. Data persists in the browser using localStorage and dynamic DOM updates.",
    image:
      "https://images.unsplash.com/photo-1591439657848-9f4b9ce436b9?crop=entropy&cs=srgb&fm=jpg&q=80&w=800",
    tags: ["JavaScript", "DOM", "LocalStorage"],
    demo: "planner.html",
    source: "https://github.com/lfeoluwa022/ifeoluwa.github.io",
  },
  {
    title: "Weather Lookup App",
    description:
      "A simple app that fetches and displays live weather data for any city using a public API, with clean error handling and a mobile-friendly interface.",
    image:
      "https://images.unsplash.com/photo-1604591259403-81d6c9cf87d7?crop=entropy&cs=srgb&fm=jpg&q=80&w=800",
    tags: ["JavaScript", "API", "Fetch"],
    demo: "#",
    source: "https://github.com/lfeoluwa022/ifeoluwa.github.io",
  },
];
