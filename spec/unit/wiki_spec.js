const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {

  beforeEach((done) => {
    this.user;
    this.wiki;
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
            });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });

  });

  describe("#create()", () => {
    it("should create a wiki with a title, body, a privacy flag and an assigned user", (done) => {
      Wiki.create({
        title: "Sports",
        body: "Best soccer teams of all times",
        private: false,
        userId: this.user.id
      })
        .then((wiki) => {
          expect(wiki.title).toBe("Sports");
          expect(wiki.body).toBe("Best soccer teams of all times");
          done();

        })
        .catch((err) => {
          console.log(err);
          done();
        });
    });

    it("should not create a wiki with missing title, body, privacy flag, or assigned user", (done) => {
      Wiki.create({
        title: "Sports",
      })
        .then((wiki) => {
          done();
        })
        .catch((err) => {
          expect(err.message).toContain("Wiki.body cannot be null");
          expect(err.message).toContain("Wiki.private cannot be null");
          expect(err.message).toContain("Wiki.userId cannot be null");
          done();

        })
    });

  });

  describe("#setUser()", () => {
    it("should associate a wiki and a user together", (done) => {
      User.create({
        username: "user",
        email: "user@example.com",
        password: "123456"
      })
        .then((newUser) => {
          expect(this.wiki.userId).toBe(this.user.id);
          this.wiki.setUser(newUser)
            .then((wiki) => {
              expect(wiki.userId).toBe(newUser.id);
              done();
            });
        })
    });
  });

  describe("#getUser()", () => {
    it("should return the associated user", (done) => {
      this.wiki.getUser()
        .then((associatedUser) => {
          expect(associatedUser.username).toBe("user");
          done();
        });
    });
  });
});