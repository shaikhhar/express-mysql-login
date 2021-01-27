const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const userMiddleware = require("../middleware/users");

const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

const db = require("../db/db-connection.js");

router.post("/signup", userMiddleware.validateRegister, (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE LOWER(username) = LOWER(${db.escape(
      req.body.username
    )})`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({ msg: "Username already exists" });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({ msg: err });
          } else {
            db.query(
              `INSERT INTO users(id, username, password, role, createdAt) VALUES ('${uuid.v4()}', ${db.escape(
                req.body.username
              )},
                      ${db.escape(hash)}, 'user', now()
                      )`,
              (err, result) => {
                if (err) {
                  return res.status(400).send({
                    msg: err,
                  });
                }
                return res.status(400).send({
                  msg: "User Registered",
                });
              }
            );
          }
        });
      }
    }
  );
});

router.post("/login", (req, res, next) => {
  console.log("Logging in ", req.body.username);
  db.query(
    `SELECT * FROM users WHERE username = '${req.body.username}';`,
    (err, result) => {
      if (err) {
        return res.status(400).send({ msg: err });
      }
      if (!result.length) {
        return res.send({
          msg: "Username or password is wrong",
        });
      }

      //check pw
      bcrypt.compare(
        req.body.password,
        result[0]["password"],
        (bErr, bResult) => {
          if (bErr) {
            return res.status.send({
              msg: "Username or password is wrong",
            });
          }

          if (bResult) {
            const token = jwt.sign(
              {
                username: result[0].username,
                userId: result[0].id,
                role: result[0].role,
              },
              process.env.SECRET_JWT,
              {
                expiresIn: "100d",
              }
            );
            return res.status(200).send({
              msg: "Logged in",
              token,
              user: result[0],
            });
          }
          return res.send({
            msg: "Username or password is wrong",
          });
        }
      );
    }
  );
});

router.get("/user-access", userMiddleware.isLoggedIn, (req, res, next) => {
  res.send("User and admin can access");
});

router.get("/admin-access", userMiddleware.isLoggedIn, (req, res, next) => {
  if (req.userData.role === "Admin") {
    res.send("Only admin can access");
  } else {
    res.send("Unauthorized");
  }
});

module.exports = router;
