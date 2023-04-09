const httpStatus = require("http-status");
const sectionService = require("../services/SectionService");

const index = (req, res) => {
  if (!req?.params?.projectId)
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ error: "Project ID is required" });

  sectionService
    .list({ project_id: req.params.projectId })
    .then((response) => {
      res.status(httpStatus.OK).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const create = (req, res) => {
  req.body.user_id = req.user;
  sectionService
    .create(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((e) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(e);
    });
};

const update = (req, res) => {
  if (!req.params?.id)
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: "ID field is required" });

  sectionService
    .update(req.body, req.params.id)
    .then((updatedDoc) => {
      res.status(httpStatus.OK).send(updatedDoc);
    })
    .catch((e) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Internal Server Error" });
    });
};

const deleteSection = (req, res) => {
  if (!req.params?.id)
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: "ID field is required" });

  sectionService
    .delete(req.params.id)
    .then((deletedDoc) => {
      if (!deletedDoc)
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: "Section not found " });
      res.status(httpStatus.OK).send(deletedDoc);
    })
    .catch((e) => {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: "Internal Server Error" });
    });
};

module.exports = {
  create,
  index,
  update,
  deleteSection,
};
