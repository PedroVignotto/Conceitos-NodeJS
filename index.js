const express = require('express');

const server = express();

server.use(express.json());

let NumberReq = 0;
const projects = [];

server.use((req,res, next) => {
  next();
  NumberReq++;
  console.log(`Number of request: ${NumberReq}`);
});

function checkIdInArray(req, res, next) {
  const { id } = req.params;

  const project = projects.find(project => project.id == id);

  if(!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }

  return next();
};

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.post('/projects/:id/tasks', checkIdInArray, (req,res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id == id);

  project.tasks = [title];

  return res.json(project);
});

server.put('/projects/:id', checkIdInArray, (req,res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id == id);

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkIdInArray, (req,res) => {
  const { id } = req.params;

  const project = projects.find(project => project.id == id);

  projects.splice(project,1);

  return res.send();
});

server.listen(3000);