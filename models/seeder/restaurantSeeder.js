const Restaurant = require("../restaurant");
const restaurantList = require('../../restaurant.json').results

const db = require('../../config/mongoose')

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
});

