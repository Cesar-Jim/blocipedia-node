const collaboratorQueries = require("../../src/db/queries.collaborators.js");


module.exports = {
  add(req, res, next) {
    if (req.user) {
      collaboratorQueries.addCollaborator(req, (err, collaborator) => {
        if (err) {
          req.flash("error", err)
        }
        res.redirect(req.headers.referer)
      })

    } else {
      req.flash("notice", "Please sign in to do that.");
      res.redirect(req.headers.referer);
    }
  },

  remove(req, res, next) {
    if (req.user) {
      collaboratorQueries.removeCollaborator(req, (err, collaborator) => {
        if (err) {
          req.flash("error", err);
        }
        req.flash("notice", "This user is no longer a collaborator");
        res.redirect(req.headers.referer);
      });

    } else {
      req.flash("notice", "Please sign in to do that.");
      res.redirect(req.headers.referer);
    }
  }


}

// const collaboratorQueries = require("../db/queries.collaborators.js");

// module.exports = {
//   addCollaborator(req, res, next) {

//     let newCollaborator = {
//       username: requestAnimationFrame.body.username,
//       email: requestAnimationFrame.body.email,
//       wikiId: requestAnimationFrame.params.wikiId
//     };

//     console.log(`Collaborator email: ${newCollaborator.email}`);
//     console.log(`WikiId: ${newCollaborator.wikiId}`);

//     collaboratorQueries.addMember(newCollaborator.username, newCollaborator.email, newCollaborator.wikiId, (err, member) => {
//       if (err) {
//         req.flash("error", err);
//       }
//       res.redirect(req.headers.referer);
//     });
//   }
// }