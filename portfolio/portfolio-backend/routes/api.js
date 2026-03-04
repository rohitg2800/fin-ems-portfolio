const express = require('express');
const router = express.Router();

// Mock portfolio data - replace with your actual data
const portfolioData = {
  // Projects data
  projects: [
    {
      id: 1,
      title: "EMS Luxe Supply",
      description: "E-commerce site for medical equipment with modern design",
      technologies: ["HTML", "CSS", "JavaScript", "Node.js", "Express"],
      imageUrl: "https://placehold.co/600x400/3A2010/D4AF37?text=EMS+Site",
      liveUrl: "https://ems-luxe-supply.onrender.com",
      githubUrl: "https://github.com/yourusername/ems-project",
      category: "fullstack"
    },
    {
      id: 2,
      title: "Employee Management System",
      description: "Complete HR solution with authentication and analytics",
      technologies: ["React", "Node.js", "MongoDB", "JWT"],
      imageUrl: "https://placehold.co/600x400/5D4037/D4AF37?text=Employee+System",
      liveUrl: "#",
      githubUrl: "https://github.com/yourusername/employee-system",
      category: "fullstack"
    },
    {
      id: 3,
      title: "Portfolio Website",
      description: "Personal portfolio showcasing skills and projects",
      technologies: ["HTML", "CSS", "JavaScript", "Animations"],
      imageUrl: "https://placehold.co/600x400/8D6E63/D4AF37?text=Portfolio",
      liveUrl: "https://my-portfolio.onrender.com",
      githubUrl: "https://github.com/yourusername/portfolio",
      category: "frontend"
    },
    {
      id: 4,
      title: "ML Flood Prediction API",
      description: "Machine learning model predicting flood severity",
      technologies: ["Python", "scikit-learn", "Flask", "API"],
      imageUrl: "https://placehold.co/600x400/2c1a12/D4AF37?text=ML+Prediction",
      liveUrl: "https://rohit-portfolio-28.netlify.app/flood.html",
      githubUrl: "https://github.com/yourusername/ml-flood-prediction",
      category: "datascience"
    }
  ],

  // Skills data
  skills: {
    programming: [
      { name: "JavaScript", level: 90, category: "frontend" },
      { name: "Python", level: 85, category: "datascience" },
      { name: "Java", level: 80, category: "backend" },
      { name: "C++", level: 75, category: "backend" },
      { name: "Ruby", level: 70, category: "backend" }
    ],
    webDevelopment: [
      { name: "HTML/CSS", level: 95, category: "frontend" },
      { name: "React", level: 88, category: "frontend" },
      { name: "Node.js/Express", level: 85, category: "backend" },
      { name: "Vue.js", level: 80, category: "frontend" }
    ],
    databases: [
      { name: "MySQL", level: 88, category: "database" },
      { name: "PostgreSQL", level: 85, category: "database" },
      { name: "MongoDB", level: 82, category: "database" },
      { name: "Redis", level: 80, category: "database" }
    ],
    datascience: [
      { name: "TensorFlow", level: 82, category: "ml" },
      { name: "Scikit-learn", level: 85, category: "ml" },
      { name: "Pandas & NumPy", level: 90, category: "data" },
      { name: "Data Visualization", level: 80, category: "data" }
    ],
    devops: [
      { name: "Docker", level: 85, category: "devops" },
      { name: "Kubernetes", level: 80, category: "devops" },
      { name: "AWS", level: 88, category: "cloud" },
      { name: "CI/CD", level: 90, category: "devops" },
      { name: "Terraform", level: 75, category: "devops" },
      { name: "Monitoring", level: 82, category: "devops" }
    ]
  },

  // Contact information
  contact: {
    email: "your.email@example.com",
    phone: "+1 (555) 123-4567",
    location: "Pune, India",
    social: {
      linkedin: "https://linkedin.com/in/yourprofile",
      github: "https://github.com/yourprofile",
      twitter: "https://twitter.com/yourprofile"
    }
  }
};

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'Portfolio API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get all portfolio data
router.get('/portfolio', (req, res) => {
  res.status(200).json({
    name: "Rohit Raj",
    title: "MCA Student & Full-Stack Developer",
    description: "Passionate about creating amazing web experiences with modern 
technologies",
    ...portfolioData
  });
});

// Get projects
router.get('/projects', (req, res) => {
  const { category } = req.query;
  
  if (category) {
    const filteredProjects = portfolioData.projects.filter(
      project => project.category === category
    );
    res.status(200).json(filteredProjects);
  } else {
    res.status(200).json(portfolioData.projects);
  }
});

// Get project by ID
router.get('/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const project = portfolioData.projects.find(p => p.id === projectId);
  
  if (project) {
    res.status(200).json(project);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// Get skills
router.get('/skills', (req, res) => {
  const { category } = req.query;
  
  if (category && portfolioData.skills[category]) {
    res.status(200).json(portfolioData.skills[category]);
  } else {
    res.status(200).json(portfolioData.skills);
  }
});

// Get contact info
router.get('/contact', (req, res) => {
  res.status(200).json(portfolioData.contact);
});

// Submit contact form
router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ 
      error: 'Name, email, and message are required' 
    });
  }
  
  // Simulate processing (in real app, you'd send email or save to database)
  console.log(`New contact form submission:
    Name: ${name}
    Email: ${email}
    Subject: ${subject || 'No subject'}
    Message: ${message}
  `);
  
  // In a real application, you might:
  // 1. Save to database
  // 2. Send email notification
  // 3. Integrate with CRM
  
  res.status(200).json({ 
    success: true, 
    message: 'Thank you for your message! I\'ll get back to you soon.',
    data: { name, email, subject }
  });
});

// Get statistics/metrics
router.get('/stats', (req, res) => {
  const stats = {
    totalProjects: portfolioData.projects.length,
    totalSkills: Object.values(portfolioData.skills).reduce(
      (total, category) => total + category.length, 0
    ),
    yearsOfExperience: 2, // Update this with your actual experience
    projectsByCategory: portfolioData.projects.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {}),
    topTechnologies: [
      "JavaScript", "React", "Node.js", "Python", "HTML/CSS"
    ]
  };
  
  res.status(200).json(stats);
});

// Search projects
router.get('/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ 
      error: 'Query parameter "q" is required' 
    });
  }
  
  const query = q.toLowerCase();
  const results = portfolioData.projects.filter(project => 
    project.title.toLowerCase().includes(query) ||
    project.description.toLowerCase().includes(query) ||
    project.technologies.some(tech => 
      tech.toLowerCase().includes(query)
    )
  );
  
  res.status(200).json({
    query: q,
    results: results,
    count: results.length
  });
});

module.exports = router;