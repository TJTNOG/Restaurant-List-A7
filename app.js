const express = require('express')
const session = require("express-session");
const exphbs = require('express-handlebars')
const bodyParser = require("body-parser")
const methodOverride = require('method-override')
const flash = require('connect-flash')

const routes = require("./routes");
require("./config/mongoose");

const usePassport = require('./config/passport')

const app = express()
const port = 3000;

app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" }));
app.set("view engine", "hbs");

app.use(
  session({
    secret: "ThisIsMySecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

usePassport(app)
usePassport(app);
app.use(flash()); // 掛載套件
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg"); // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash("warning_msg"); // 設定 warning_msg 訊息
  next();
});
app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

app.use(routes)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
})

