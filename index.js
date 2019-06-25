const express = require('express');
const server = express();

server.use(express.json());

let requests = 0;
const projects = [];

/**
 * Middleware que checa se o projeto existe
 */
function checkProjectExists(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id === id);
  
    if (!project)
      return res.status(400).json({ error: 'Project not found' });
  
    return next();
}

/**
 * Middleware que dá log no número de requisições
 */
function logRequests(req, res, next) {
    requests++;
  
    console.log(`Requests number: ${requests}`);
  
    return next();
}

server.use(logRequests);

/**
 * Lista todos os projetos
 */
server.get('/projects', (req, res) => {
    return res.json(projects);
});
  
/**
 * Cria um novo projeto
 */
server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const project = {
        id: id,
        title: title,
        tasks: []
    };

    projects.push(project);

    return res.json(project);
});
  
/**
 * Atualiza um projeto
 */
server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
  
    const project = projects.find(p => p.id === id);
  
    project.title = title;
  
    return res.json(project);
});

/**
 * Exclui um projeto
 */
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;
  
    const projectIndex = projects.findIndex(p => p.id === id);
  
    projects.splice(projectIndex, 1);
  
    return res.send();
});

/**
 * Adiciona nova tarefa a um projeto
 */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
  
    const project = projects.find(p => p.id === id);
  
    project.tasks.push(title);
  
    return res.json(project);
});
  
server.listen(3000);