const express = require('express');
const { v4: uuidv4, isUuid } = require('uuid');
const isuuid = require('isuuid');
const app = express();

app.use(express.json());
const projects = [];

//log -
function logRequests(request, response, next){
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log(logLabel);
  return next();
}

function validateProjectId(request, response, next){
  const { id } = request.params;
  if(!isuuid(id)) return response.status(400).json({error: "Invalid project ID"});
  return next();
} 

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

//rota get/pegar
app.get('/projects', (request, response) => {
  const { title } = request.query;

  const results = title ? 
    projects.filter(project => project.title.includes(title))
    : projects;
  return response.json(results);
});

//rota post/criar
app.post('/projects', (request, response) => {
  const {title, owner} = request.body; // pode ser usado em get e put
  const project = {id:uuidv4(), title, owner};

  projects.push(project);
  return response.json(project);
});

//rota put/atualizar
app.put('/projects/:id', (request, response) => {
  const {id} = request.params;
  const {title, owner} = request.body;
  const projectIndex = projects.findIndex(project => project.id == id);

  if(projectIndex < 0) return response.status(400).json({error: 'Project not found'});
  //novas informacoes
  const project = {
    id, 
    title,
    owner,
  };
  //atualiza array projetos pegando o index procurado e colocando nesse index o novo projeto
  projects[projectIndex] = project;
  return response.json(project);
});

//rota delete
app.delete('/projects/:id', (request, response) => {
  const {id} = request.params;
  const projectIndex = projects.findIndex(project => project.id == id);

  if(projectIndex < 0) return response.status(400).json({error: 'Project not found'});
  projects.splice(projectIndex, 1);
  return response.status(204).json();
});

app.listen(3333, () => {
  console.log('Backend started!');
});