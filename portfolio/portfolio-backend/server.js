const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = 'https://my-portfolio-fe-55cn.onrender.com';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Mock portfolio data
const portfolioData = {
  projects: [
    {
      id: 1,
      title: "EMS Luxe Supply",
      description: "E-commerce site for medical equipment",
      technologies: ["HTML", "CSS", "JavaScript", "Node.js"],
      imageUrl: "https://placehold.co/600x400/3A2010/D4AF37?text=EMS+Site"
    },
    {
      id: 2,
      title: "Portfolio Website",
      description: "Personal portfolio showcasing skills and projects",
      technologies: ["React", "Node.js", "MongoDB"],
      imageUrl: "https://placehold.co/600x400/5D4037/D4AF37?text=Portfolio"
    }
  ],
  skills: [
    { name: "JavaScript", level: 90 },
    { name: "React", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "Python", level: 75 },
    { name: "SQL", level: 70 }
  ],
  contactInfo: {
    email: "your.email@example.com",
    linkedin: "https://linkedin.com/in/yourprofile",
    github: "https://github.com/yourprofile"
  }
};

// API Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'Portfolio Backend API',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/projects', (req, res) => {
  res.status(200).json(portfolioData.projects);
});

app.get('/api/skills', (req, res) => {
  res.status(200).json(portfolioData.skills);
});

app.get('/api/contact', (req, res) => {
  res.status(200).json(portfolioData.contactInfo);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  // Simulate processing
  console.log(`New contact form submission:
    Name: ${name}
    Email: ${email}
    Message: ${message}
  `);
  
  res.status(200).json({ 
    success: true, 
    message: 'Message received! I\'ll get back to you soon.' 
  });
});

// Main endpoint
app.get('/api/portfolio', (req, res) => {
  res.status(200).json({
    name: "ROHIT RAJ",
    title: "MCA Student & DEVELOPER",
    description: "A developer passionate about creating web experiences",
    ...portfolioData
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Portfolio Backend API is running!',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      portfolio: 'GET /api/portfolio',
      projects: 'GET /api/projects',
      skills: 'GET /api/skills',
      contact: 'GET/POST /api/contact'
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;