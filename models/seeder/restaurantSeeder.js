const mongoose = require("mongoose");
const Restaurant = require("../restaurant");
const restaurantList = require('../../restaurant.json').results

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error!");
});

db.once("open", () => {
  for(let i = 0; i < restaurantList.length; i++) {
    Restaurant.create({
    name: `${restaurantList[i].name}`,
    name_en: `${restaurantList[i].name_en}`,
    category: `${restaurantList[i].category}`,
    image: `${restaurantList[i].image}`,
    location: `${restaurantList[i].location}`,
    phone: `${restaurantList[i].phone}`,
    google_map: `${restaurantList[i].google_map}`,
    rating: `${restaurantList[i].rating}`,
    description: `${restaurantList[i].description}`,
  })
  }
  console.log('mongodb connected!')
  
});
