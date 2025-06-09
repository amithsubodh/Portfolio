import { ExternalLink, Github } from 'lucide-react';

function Projects() {
  const projects = [
    {
      id: 1,
      title: 'CraveHaven',
      description: 'CraveHaven is a food delivery app that allows users to order food from their favorite restaurants. It is built using React, Node.js, MySQL, NodeJS, and Express.',
      tags: ['React', 'Node.js', 'MySQL', 'NodeJS', 'Express'],
      image: 'cull.png',
      size: 'large',
      featured: true
    },
    // {
    //   id: 2,
    //   title: 'CulinAIry',
    //   longDescription: 'A powerful task management application that enables teams to collaborate effectively. Features include real-time updates using Socket.io, drag-and-drop kanban boards, team member assignments, deadline tracking, and comprehensive project analytics.',
    //   tags: [],
    //   image: 'task.jpg',
    //   size: 'medium',
    //   featured: false
    // },
    {
      id: 3,
      title: 'CulinAIry',
      description: 'CulinAIry is a recipe generator that allows users to generate recipes based on their ingredients. It is built using Vite + React, Node.js, MySQL, NodeJS, and Express.',
      tags: ['Vite + React', 'Node.js', 'MongoDB', 'NodeJS', 'Express'],
      image: 'Crave.png',
      size: 'medium',
      featured: true
    },
    // {
    //   id: 4,
    //   title: 'Tic Tac Toe Game',
    //   description: 'The Tic Tac Toe Game is a simple interactive web application built using HTML and JavaScript. It allows two players to take turns marking X and O on a 3x3 grid. The game checks for winning conditions after each move and displays the result (win, draw, or ongoing). Designed with basic styling, it enhances JavaScript skills by implementing event handling, game logic, and dynamic UI updates.',
    //   tags: ['HTML','JavaScript'],
    //   image: 'tic.jpg',
    //   size: 'medium',
    //   featured: true
    // }
  ];

  const featuredProjects = projects.filter(project => project.featured);
  const otherProjects = projects.filter(project => !project.featured);

  return (
    <div className="page">
      <section className="projects-page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">My Projects</h1>
            <p className="page-description">
              Here's a collection of projects I've worked on, showcasing different technologies and problem-solving approaches.
            </p>
          </div>

          {/* Featured Projects */}
          <div className="featured-section">
            <h2 className="section-title">Featured Projects</h2>
            <div className="projects-bento">
              {featuredProjects.map(project => (
                <div key={project.id} className={`project-card ${project.size}`}>
                  <div className="project-image">
                    <h3 className="project-title">{project.title}</h3>
                    <img src={project.image} alt={project.title} />
                  </div>
                  <div className="project-content">
                    <p className="project-description">{project.description}</p>
                    <div className="project-tags">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="project-tag">{tag+"  "}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Projects */}
          {/* <div className="other-projects">
            <h2 className="section-title">Other Projects</h2>
            <div className="projects-grid">
              {otherProjects.map(project => (
                <div key={project.id} className="project-card-simple">
                  <div className="project-header">
                    <h3 className="project-title">{project.title}</h3>
                    <img src={project.image} alt={project.title} />
                  </div>
                  <p className="project-description">{project.longDescription}</p>
                  <div className="project-tags">
                    {project.tags.map((tag, index) => (
                      <span key={index} className="project-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </section>
    </div>
  );
}

export default Projects;