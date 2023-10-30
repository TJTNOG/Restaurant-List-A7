const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const Restaurant = require("../restaurant");
const restaurantList = require('../../restaurant.json')
const User = require('../users')
const db = require('../../config/mongoose')

const SEED_USER_01 = {
  email: "user1@example.com",
  password: "12345678",
  restaurantOwns: [1, 2, 3], //陣列內容為restaurant的id
};
const SEED_USER_02 = {
  email: "user2@example.com",
  password: "12345678",
  restaurantOwns: [4, 5, 6],
};

db.once("open", () => {
  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(SEED_USER_01.password, salt))
    .then((hash) =>
      User.create({
        email: SEED_USER_01.email,
        password: hash,
      })
    )
    .then((user) => {
      const userId = user._id;
      return Promise.all(
        Array.from({ length: SEED_USER_01.restaurantOwns.length }, (_, i) =>
          Restaurant.create({
            ...restaurantList.results[SEED_USER_01.restaurantOwns[i] - 1],
            userId,
          })
        )
      );
    })
    .then(() => {
      console.log("User1 is done.");
      //process.exit()
    });

  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(SEED_USER_02.password, salt))
    .then((hash) =>
      User.create({
        email: SEED_USER_02.email,
        password: hash,
      })
    )
    .then((user) => {
      const userId = user._id;
      return Promise.all(
        Array.from({ length: SEED_USER_02.restaurantOwns.length }, (_, i) =>
          Restaurant.create({
            ...restaurantList.results[SEED_USER_02.restaurantOwns[i] - 1],
            userId,
          })
        )
      );
    })
    .then(() => {
      console.log("User2 is done.");
      process.exit();
    });
});