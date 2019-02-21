const User = require("./models").User;
const Wiki = require("./models").Wiki;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
      .then((user) => {
        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      })
  },

  getUser(id, callback) {
    return User.findById(id, {
      include: [{
        mode: Wiki,
        as: "wikis"
      }]
    })
      .then((user) => {
        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      })
  },

  upgradeUser(req, callback) {
    return User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          return callback("Could not find user")

        } else {
          user.update({ role: 1 })
            .then(() => {
              callback(null, user);
            })
            .catch((err) => {
              callback(err);
            });
        }
      });
  },

  downgradeUser(req, callback) {
    User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          callback("User not found");

        } else {
          user.update({
            role: 0
          })
            .then((user) => {
              Wiki.findAll({ where: { userId: user.id } })
                .then((wikis) => {
                  wikis.forEach((wiki) => {
                    wiki.update({
                      private: false
                    })
                      .then(() => {
                        callback(null, user);
                      })
                      .catch((err) => {
                        callback(err);
                      })
                  })
                    .catch((err) => {
                      callback(err);
                    });
                })
            });
        };
      });
  }




  // downgradeUser(req, callback) {
  //   return User.findById(req.params.id)
  //     .then((user) => {
  //       if (!user) {
  //         return callback("Could not find user")
  //       }
  //       user.update({ role: 0 })
  //         .then(() => {
  //           callback(null, user);
  //           console.log("user id: ", id);
  //           return Wiki.findAll({
  //             where: { userId: id }
  //           })
  //             .then((wikis) => {
  //               console.log("found wiki");
  //               console.log(wikis[0].title);
  //               return wikis.forEach((wiki) => {
  //                 wiki.update({ private: false })
  //               })
  //                 .then(() => {
  //                   callback(null, user);
  //                   callback(null, wikis);
  //                 })
  //             })
  //         })
  //         .catch((err) => {
  //           callback(err);
  //         });
  //     })
  // }

}