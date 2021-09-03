// Write your "projects" router here!
const express = require("express");
const Projects = require("./projects-model");

const {
  validateProjectId,
  validateProject
} = require("./projects-middleware");

const router = express.Router();

router.get("/", (req, res, next) => {
  Projects.get()
    .then(proj => {
      res.status(200).json(proj)
    })
    .catch(next)
})

router.get("/:id", validateProjectId, (req, res) => {
  res.json(req.project)
})

router.post("/:id", validateProject, (req, res, next) => {
  Projects.insert(req.body)
    .then(nProj => {
      res.status(201).json(nProj)
    })
    .catch(next())
})

router.put("/:id", validateProjectId, validateProject, (req, res, next) => {
  Projects.update(req.params.id, req.body)
    .then(() => {
      return Projects.get(req.params.id)
    })
    .then(proj => {
      res.json(proj)
    })
    .catch(next())
})

router.delete("/:id", validateProjectId, async (req, res, next) => {
  try{
    await Projects.remove(req.params.id)
    res.json(req.project)
  }catch(err){
    next(err)
  }
})

router.get("/:id/actions", validateProjectId, async (req, res, next) => {
  try{
    const act = await Projects.getProjectActions(req.params.id);
    res.json(act);
  }catch(err){
    next(err)
  }
})

router.use((err, req, res) => {
  res.status(err.status || 500).json({
    err: err.message,
    stack: err.stack
  })
})

module.exports = router;