const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require("body-parser")
const methodOverride = require('method-override')
const Restaurant = require('./models/restaurant')
const port = 3000

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express()

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error!");
});

db.once("open", () => {
  console.log("mongodb connected!");
});

app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" }));
app.set("view engine", "hbs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  Restaurant.find()
  .lean()
  .then(restaurants => res.render('index', { restaurants }))
  .catch(error => console.error(error))
})

app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.get("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurant) => res.render("show", { restaurant }))
    .catch((err) => console.log(err));
});

app.post('/restaurants', validateData, (req, res) => {
  Restaurant.create(req.body)
  .then(() => res.redirect('/'))
  .catch(err => console.log(err))
})

app.get("/restaurants/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => res.render("edit", { restaurantData }))
    .catch((err) => console.log(err));
});

app.put("/restaurants/:restaurantId", validateData, (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    .then(() => res.redirect(`/restaurants/${restaurantId}`))
    .catch((err) => console.log(err));
});

app.delete("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  return Restaurant.findById(restaurantId)
  .then(restaurant => restaurant.remove())
  .then(() => res.redirect('/'))
  .catch(error => console.log(error))
});

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
})

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
