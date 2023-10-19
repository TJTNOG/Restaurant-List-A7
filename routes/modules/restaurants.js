const express = require('express')
const router = express.Router()
const Restaurant = require("../../models/restaurant");

router.get("/new", (req, res) => {
  return res.render("new");
});

router.get("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((err) => console.log(err));
});

router.post("/", validateData, (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

router.get("/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => res.render("edit", { restaurantData }))
    .catch((err) => console.log(err));
});

router.put("/:restaurantId", validateData, (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    .then(() => res.redirect(`/restaurants/${restaurantId}`))
    .catch((err) => console.log(err));
});

router.delete("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  return Restaurant.findById(restaurantId)
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