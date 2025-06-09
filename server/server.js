const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const PDFDocument = require('pdfkit');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

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

// Generate PDF from resume data
function generatePDF(resumeData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      const primaryColor = '#333333'; // Dark grey for general text
      const accentColor = '#667eea'; // A purple/blue for headings and accents

      doc.fillColor(primaryColor);

      // Header
      doc.fontSize(28).font('Helvetica-Bold').fillColor(accentColor).text(resumeData.personalInfo.name.toUpperCase(), { align: 'center' });
      doc.fontSize(16).font('Helvetica').fillColor(primaryColor).text(resumeData.personalInfo.title, { align: 'center' });
      doc.moveDown(0.5);

      // Contact Information
      doc.fontSize(10).fillColor(primaryColor);
      doc.text(`${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location} | LinkedIn: ${resumeData.personalInfo.linkedin} | GitHub: ${resumeData.personalInfo.github}`, { align: 'center' });
      doc.moveDown(1);

      // Horizontal Rule after header
      doc.strokeColor('#cccccc').lineWidth(0.5).moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
      doc.moveDown(1);

      // Helper function for section titles
      const addSectionTitle = (title) => {
        doc.moveDown(0.5);
        doc.fontSize(18).font('Helvetica-Bold').fillColor(accentColor).text(title.toUpperCase());
        doc.strokeColor('#dddddd').lineWidth(0.5).moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
        doc.moveDown(0.8);
        doc.fillColor(primaryColor); // Reset color for content
      };

      // Summary
      addSectionTitle('Professional Summary');
      doc.fontSize(11).font('Helvetica').text(resumeData.summary, { align: 'justify' });
      doc.moveDown(0.8);

      // Education
      addSectionTitle('Education');
      resumeData.education.forEach(edu => {
        doc.fontSize(12).font('Helvetica-Bold').text(`${edu.degree} - ${edu.institution}`);
        doc.fontSize(10).font('Helvetica').text(`${edu.location} | ${edu.duration}`);
        doc.text(`GPA: ${edu.gpa}`);
        if (edu.achievements && edu.achievements.length > 0) {
          edu.achievements.forEach(achievement => {
            doc.text(`• ${achievement}`, { indent: 15, continued: false, align: 'justify' });
          });
        }
        doc.moveDown(0.6);
      });

      // Experience
      addSectionTitle('Professional Experience');
      resumeData.experience.forEach(exp => {
        doc.fontSize(12).font('Helvetica-Bold').text(`${exp.title} at ${exp.company}`);
        doc.fontSize(10).font('Helvetica').text(`${exp.location} | ${exp.duration}`);
        if (exp.responsibilities && exp.responsibilities.length > 0) {
          exp.responsibilities.forEach(resp => {
            doc.text(`• ${resp}`, { indent: 15, continued: false, align: 'justify' });
          });
        }
        if (exp.achievements && exp.achievements.length > 0) {
          exp.achievements.forEach(achievement => {
            doc.text(`• ${achievement}`, { indent: 15, continued: false, align: 'justify' });
          });
        }
        doc.moveDown(0.6);
      });

      // Skills
      addSectionTitle('Skills');
      resumeData.skills.forEach(skillGroup => {
        doc.fontSize(11).font('Helvetica-Bold').text(`${skillGroup.category}:`, { continued: true }).font('Helvetica').text(` ${skillGroup.items.join(', ')}`, { align: 'justify' });
        doc.moveDown(0.4);
      });
      doc.moveDown(0.5); // Extra space after skills

      // Projects
      doc.addPage(); // Add a new page for projects
      addSectionTitle('Projects');
      resumeData.projects.forEach(project => {
        doc.fontSize(12).font('Helvetica-Bold').text(project.name);
        doc.fontSize(10).font('Helvetica').text(project.description, { indent: 15, align: 'justify' });
        doc.text(`Technologies: ${project.technologies.join(', ')}`, { indent: 15, align: 'justify' });
        if (project.achievements && project.achievements.length > 0) {
          project.achievements.forEach(achievement => {
            doc.text(`• ${achievement}`, { indent: 15, continued: false, align: 'justify' });
          });
        }
        doc.moveDown(0.6);
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Resume Download Endpoint
app.get('/api/resume/download', async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ updatedAt: -1 });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const pdfBuffer = await generatePDF(resume);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Amith_Resume.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating resume:', error);
    res.status(500).json({ message: 'Error generating resume' });
  }
});

// Update Resume Endpoint
app.post('/api/resume/update', async (req, res) => {
  try {
    const resumeData = req.body;
    
    const existingResume = await Resume.findOne();
    if (existingResume) {
      Object.assign(existingResume, resumeData);
      existingResume.updatedAt = new Date();
      await existingResume.save();
    } else {
      const newResume = new Resume(resumeData);
      await newResume.save();
    }

    res.status(200).json({ message: 'Resume updated successfully' });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ message: 'Error updating resume' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 