const Collaborator = require("./models").Collaborator;
const User = require("./models").User;

module.exports = {
  addCollaborator(req, callback) {
    User.findOne({
      where: {
        email: req.body.addCollaborator
      }
    })
      .then((user) => {
        if (!user) {
          return callback("User not found");

        } else if (user.id === req.user.id) {
          return callback("Can not add yourself");
        }
        Collaborator.findOne({
          where: {
            userId: user.id,
            wikiId: req.params.id
          }
        })
          .then((collaborator) => {
            if (collaborator) {
              return callback("User is already a collaborator")
            }
            return Collaborator.create({
              wikiId: req.params.id,
              userId: user.id
            })
              .then((collaborator) => {
                callback(null, collaborator);
              })
              .catch((err) => {
                callback(null, err);
              })
          })
          .catch((err) => {
            callback(null, err)
          })
      })
      .catch((err) => {
        callback(err);
      })
  },

  removeCollaborator(req, callback) {
    Collaborator.destroy({
      where: {
        userId: req.params.userId
      }
    })
      .then((deleted) => {
        callback(null, deleted);
      })
      .catch((err) => {
        callback(err);
      });
  }

}