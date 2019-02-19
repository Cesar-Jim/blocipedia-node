const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {

  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({ force: true }).then((res) => {
      User.create({
        username: "user",
        email: "user@example.com",
        password: "123456"
      })
        .then((user) => {
          this.user = user;

          Wiki.create({
            title: "Sports",
            body: "Best soccer teams of all times",
            private: false,
            userId: this.user.id
          })
            .then((wiki) => {
              this.wiki = wiki;
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
        });
    });

    /////////////////////////// ADMIN USER CONTEXT TEST SUITE ///////////////////////////
    describe("admin user performing CRUD actions for wikis", () => {
      beforeEach((done) => {
        User.create({
          name: "admin",
          email: "admin@example.com",
          password: "123456",
          role: 2
        })
          .then((user) => {
            request.get({
              url: "http://localhost:3000/auth/fake",
              form: {
                userId: user.id,
                name: user.username,
                email: user.email
              }
            },
              (err, res, body) => {
                done();
              });
          });
      });

    });
    /////////////////////////// END OF ADMIN CONTEXT ///////////////////////////


    /////////////////////////// PREMIUM USER CONTEXT TEST SUITE ///////////////////////////
    describe("premium user performing CRUD actions for wikis", () => {
      beforeEach((done) => {
        User.create({
          name: "premium",
          email: "premium@example.com",
          password: "123456",
          role: 1
        })
          .then((user) => {
            request.get({
              url: "http://localhost:3000/auth/fake",
              form: {
                userId: user.id,
                name: user.username,
                email: user.email
              }
            },
              (err, res, body) => {
                done();
              });
          });
      });

    });
    /////////////////////////// END OF PREMIUM CONTEXT ///////////////////////////


    /////////////////////////// STANDARD USER CONTEXT TEST SUITE ///////////////////////////
    describe("standard user performing CRUD actions for wikis", () => {
      beforeEach((done) => {
        User.create({
          name: "standard",
          email: "standard@example.com",
          password: "123456",
          role: 0
        })
          .then((user) => {
            request.get({
              url: "http://localhost:3000/auth/fake",
              form: {
                userId: user.id,
                name: user.username,
                email: user.email
              }
            },
              (err, res, body) => {
                done();
              });
          });
      });

      describe("GET /wikis/new", () => {
        it("should render a new wiki form", (done) => {
          request.get(`${base}/new`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("New Wiki");
            done();
          });
        });
      });

      describe("POST /wikis/create", () => {
        const options = {
          url: `${base}/create`,
          form: {
            title: "Sports",
            body: "Best soccer teams of all times",
          }
        };

        it("should create a new wiki and redirect", (done) => {
          request.post(options,
            (err, res, body) => {

              Wiki.findOne({ where: { title: "Sports" } })
                .then((wiki) => {
                  expect(wiki).not.toBeNull();
                  expect(wiki.title).toBe("Sports");
                  expect(wiki.body).toBe("Best soccer teams of all times");
                  done();
                })
                .catch((err) => {
                  console.log(err);
                  done();
                });
            }
          );
        });

      });

      describe("GET wikis/:id", () => {
        it("should render a view with the selected wiki", (done) => {
          request.get(`${base}/${this.wiki.id}`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("soccer teams");
            done();
          });
        });
      });

      describe("POST /wikis/:id/destroy", () => {
        it("should delete the wiki with the associated id", (done) => {
          Wiki.all()
            .then((wikis) => {
              expect(wikis.length).toBe(1);
              request.post(`${base}/${this.wiki.id}/destroy`, (err, res, body) => {
                Wiki.all()
                  .then((wikis) => {
                    expect(err).toBeNull();
                    expect(wikis.length).toBe(0);
                    done();
                  })
              });
            });
        });
      });

      describe("GET /wikis/:id/edit", () => {
        it("should render a view with an edit wiki form", (done) => {
          request.get(`${base}/${this.wiki.id}/edit`, (err, res, body) => {
            expect(err).toBeNull();
            expect(body).toContain("Edit Wiki");
            done();
          });
        });
      });

      describe("POST /wikis/:id/update", () => {
        it("should update the post with the given values", (done) => {
          const options = {
            url: `${base}/${this.wiki.id}/update`,
            form: {
              title: "Sports",
              body: "Best soccer teams of all times",
            }
          };
          request.post(options,
            (err, res, body) => {

              expect(err).toBeNull();
              Wiki.findOne({
                where: { id: this.wiki.id }
              })
                .then((wiki) => {
                  expect(wiki.title).toBe("Sports");
                  done();
                });
            });
        });

      });

    });
    /////////////////////////// END OF STANDARD CONTEXT ///////////////////////////
  });
});