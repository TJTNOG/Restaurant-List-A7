const express = require('express')
const router = express.Router()

const Restaurant = require("../../models/restaurant");

router.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render("index", { restaurants }))
    .catch((error) => console.error(error));
});

router.get('/search', (req, res) => {
  const keywords = req.query.keywords
  const keyword = keywords.trim().toLowerCase()
  if(!keywords) {
    res.redirect('/')
  }
  Restaurant.find({})
    .lean()
    .then(restaurantsData => {
      const filterRestaurantData = restaurantsData.filter(data =>
        data.name.toLowerCase().includes(keyword) ||
        data.category.includes(keyword))
        res.render('index', {restaurants: filterRestaurantData, keywords})
    })
})

module.exports = router