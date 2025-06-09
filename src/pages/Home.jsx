import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail, Download } from 'lucide-react';

function Home() {
  const handleResumeDownload = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resume/download');
      if (!response.ok) throw new Error('Failed to download resume');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Amith_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again later.');
    }
  };

  return (
    <div className="page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Hi, I'm <span className="highlight">Amith Subodh</span>
            </h1>
            <p className="hero-subtitle">Full Stack Developer</p>
            <p className="hero-description">
              I create modern web applications with cutting-edge technologies.
              Passionate about clean code, user experience, and solving complex problems.
            </p>
            <div className="hero-buttons">
              <Link to="/projects" className="btn-primary">
                View Projects
              </Link>
              <a href="#contact" className="btn-secondary">
                Get In Touch
              </a>
              <button onClick={handleResumeDownload} className="btn-secondary">
                <Download size={20} style={{ marginRight: '8px' }} />
                Download Resume
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-elements">
              <div className="floating-element">💻</div>
              <div className="floating-element">🚀</div>
              <div className="floating-element">⚡</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About Me</h2>
              <p className="about-description">
                I'm a passionate full-stack developer with years of experience 
                building web applications. I love turning complex problems into simple, 
                beautiful designs. When I'm not coding, you'll find me exploring new 
                technologies or contributing to open-source projects.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <h3>2</h3>
                  <p>Projects Completed</p>
                </div>
                <div className="stat">
                  <h3>1+</h3>
                  <p>Years Experience</p>
                </div>
                
              </div>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <span>👨‍💻</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Let's Connect</h2>
          <p className="contact-description">
            I'm always open to discussing new opportunities and interesting projects.
          </p>
          <div className="contact-links">
            <a 
              href="https://github.com/amithsubodh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link"
            >
              <Github size={50} />
            </a>
            <a 
              href="https://www.linkedin.com/in/amith-subodh-1a7b7a267/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="contact-link"
            >
              <Linkedin size={50} />
            </a>
            <a 
              href="mailto:amithsubodh99@gmail.com"
              className="contact-link"
            >
              <Mail size={50} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;