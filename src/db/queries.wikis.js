const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;
const Authorizer = require("../policies/application");
const Private = require("../policies/wiki");
const Public = require("../policies/application");

module.exports = {

  getAllWikis(callback) {
    return Wiki.all({
      include: [
        {
          model: Collaborator,
          as: "collaborators"
        }
      ]
    })
      .then((wikis) => {
        callback(null, wikis);
      })
      .catch((err) => {
        callback(err);
      })
  },

  addWiki(newWiki, callback) {
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      userId: newWiki.userId,
      private: newWiki.private
    })
      .then((wiki) => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      })
  },

  getWiki(id, callback) {
    return Wiki.findById(id, {
      include: [{
        model: Collaborator, as: "collaborators"
      }]
    })
      .then((wiki) => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      })
  },

  deleteWiki(req, callback) {
    return Wiki.findById(req.params.id)
      .then((wiki) => {

        const authorized = new Authorizer(req.user, wiki).destroy();

        if (authorized) {
          wiki.destroy()
            .then((res) => {
              callback(null, wiki);
            })
        } else {
          req.flash("notice", "You are not authorized to do that.")
          callback(401);
        }
      })
      .catch((err) => {
        callback(err);
      });
  },

  updateWiki(req, updatedWiki, callback) {
    return Wiki.findById(req.params.id)
      .then((wiki) => {
        Collaborator.findOne({
          where: {
            userId: req.user.id,
            wikiId: wiki.id
          }
        })
          .then((collaborator) => {
            if (!wiki) {
              return callback("Wiki not not found.");
            }

            let authorized = new Authorizer(req.user, wiki).update();

            if (wiki.private == false) {
              authorized = new Public(req.user, wiki).update();

            } else {
              authorized = new Private(req.user, wiki, collaborator).update();
            }

            if (authorized) {

              wiki.update(updatedWiki, {
                fields: Object.keys(updatedWiki)
              })
                .then(() => {
                  callback(null, wiki);
                })
                .catch((err) => {
                  callback(err);
                });
            } else {
              req.flash("notice", "You are not authorized to do that.");
              callback("Forbidden");
            }
          })
      });
  }
}