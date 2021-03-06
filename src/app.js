const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const id = uuid()
  console.log(isUuid(id))

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  }

  if (!isUuid(id)) {
    return response.status(500).json({ error: 'Ocorreu um erro na criação do id ;-;' })
  }

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params

  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repos => repos.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository with that ID was not found' })
  }

  const result = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = result

  return response.json(result)
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params

  const repositoryIndex = repositories.findIndex(repos => repos.id === id)

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'repository with that ID was not found' })
  }

  repositories.splice(repositoryIndex, 1)

  return res.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  
  const repositoryIndex = repositories.findIndex(repos => repos.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository with that ID was not found' })
  }

  const repository = repositories[repositoryIndex]

  repository.likes = repository.likes + 1

  return response.json(repository)
});

module.exports = app;
