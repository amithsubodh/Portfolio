const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Resume Schema
const resumeSchema = new mongoose.Schema({
  personalInfo: {
    name: String,
    title: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    github: String
  },
  summary: String,
  education: [{
    degree: String,
    institution: String,
    location: String,
    duration: String,
    gpa: String,
    achievements: [String]
  }],
  experience: [{
    title: String,
    company: String,
    location: String,
    duration: String,
    responsibilities: [String],
    achievements: [String]
  }],
  skills: [{
    category: String,
    items: [String]
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    achievements: [String]
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Resume = mongoose.model('Resume', resumeSchema);

// Example resume data - Replace this with your actual resume data
const resumeData = {
  personalInfo: {
    name: "Amith Subodh",
    title: "Full Stack Developer",
    email: "amithsubodh99@gmail.com",
    phone: "Your Phone Number",
    location: "Your Location",
    linkedin: "https://www.linkedin.com/in/amith-subodh-1a7b7a267/",
    github: "https://github.com/amithsubodh"
  },
  summary: "I'm a passionate full-stack developer with experience building web applications. I love turning complex problems into simple, beautiful designs.",
  education: [
    {
      degree: "B.E Computer Science",
      institution: "Malnad College of Engineering, Hassan",
      location: "Hassan",
      duration: "2022 - 2026",
      gpa: "9.0",
      achievements: [
        "Achievement 1",
        "Achievement 2"
      ]
    }
  ],
  experience: [
    {
      title: "Your Job Title",
      company: "Company Name",
      location: "Location",
      duration: "Duration",
      responsibilities: [
        "Responsibility 1",
        "Responsibility 2"
      ],
      achievements: [
        "Achievement 1",
        "Achievement 2"
      ]
    }
  ],
  skills: [
    {
      category: "Frontend",
      items: ["React", "JavaScript", "HTML5", "CSS3"]
    },
    {
      category: "Backend",
      items: ["Node.js", "Python", "Express.js", "MongoDB", "Java"]
    }
  ],
  projects: [
    {
      name: "CraveHaven",
      description: "A food delivery app that allows users to order food from their favorite restaurants.",
      technologies: ["React", "Node.js", "MySQL", "Express"],
      achievements: [
        "Achievement 1",
        "Achievement 2"
      ]
    },
    {
      name: "CulinAIry",
      description: "A recipe generator that allows users to generate recipes based on their ingredients.",
      technologies: ["Vite + React", "Node.js", "MongoDB", "Express"],
      achievements: [
        "Achievement 1",
        "Achievement 2"
      ]
    }
  ]
};

async function addResumeData() {
  try {
    // Check if resume already exists
    const existingResume = await Resume.findOne();
    if (existingResume) {
      console.log('Updating existing resume...');
      Object.assign(existingResume, resumeData);
      existingResume.updatedAt = new Date();
      await existingResume.save();
    } else {
      console.log('Adding new resume...');
      const newResume = new Resume(resumeData);
      await newResume.save();
    }

    console.log('Resume data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding resume data:', error);
    process.exit(1);
  }
}

addResumeData(); 