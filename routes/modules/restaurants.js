const express = require('express')
const router = express.Router()
const Restaurant = require("../../models/restaurant");

router.get("/new", (req, res) => {
  return res.render("new");
});

router.get("/:id", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;
  Restaurant.findOne({_id, userId})
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((err) => console.log(err));
});

router.post("/", validateData, (req, res) => {
  const userId = req.user._id;
  const {name, name_en, category, image, location, phone, google_map, rating, description} = req.body
  Restaurant.create({
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
    userId,
  })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

router.get("/:id/edit", (req, res) => {
  const userId = req.user._id
  const _id = req.params.id;
  Restaurant.findOne({ _id, userId})
    .lean()
    .then((restaurantData) => { 
      res.render("edit", { restaurantData })
    })
    .catch((err) => console.log(err));
});

router.put("/:id", validateData, (req, res) => {
  const userId = req.user._id
  const _id = req.params.id;
  Restaurant.findOne({ _id, userId })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch((err) => console.log(err));
});

router.delete("/:id", (req, res) => {
  const userId = req.user._id
 const _id = req.params.id;
  return Restaurant.findOne({ _id, userId })
    .then((restaurant) => restaurant.remove())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

//資料驗證
function validateData(req, res, next) {
  const {
    name,
    name_en,
    category,
    image,
    location,
    phone,
    google_map,
    rating,
    description,
  } = req.body;

  // 檢查是否存在必要的屬性
  if (
    !name ||
    !name_en ||
    !category ||
    !image ||
    !location ||
    !phone ||
    !google_map ||
    !rating ||
    !description
  ) {
    return res.status(400).send("缺少必要資料");
  }

  next();
}

module.exports = router