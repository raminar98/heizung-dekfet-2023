const express = require("express");
const app = express();
const compression = require("compression");
const robots = require("./modules/3rd-party-costum-module/express-robots-txt/commonjs");
require("dotenv").config();

//options ===========================================
const { STANDARD_ROUTEN, DOMAIN } = require("./__OPTIONS");

//costum Routes =====================================
const modRoutes = require("./modules/modulareRouten");
const sitemap = require("./modules/sitemapRoutes");

//Express relevanter Code============================
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(compression());

//Root-Route ========================================
app.get(`/`, (req, res) => {
  res.render(`index`);
});

//Statische Routen, welche immer gleich bleiben. ====
//(z.B. Über uns, FAQ, Leistungen usw.) =============
STANDARD_ROUTEN.forEach((route) => {
  app.get(`/${route}`, (req, res) => {
    res.render(`${route}/`);
  });
});
//Robots.txt-Route ==================================
app.use(
  robots({
    UserAgent: "*",
    Allow: "/",
    Sitemap: `https://${DOMAIN}/sitemap_index.xml`,
  })
);
//Sitemaps-Route ====================================
app.use(sitemap);

//Unterseiten-Routen=================================
app.use(modRoutes);

//404 Weiterleitung
app.get("*", function (req, res, next) {
  return res.status(404).render("404/index");
});

//Express relevanter Code ===========================
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`APP IS LISTENING ON PORT ${port}`);
});
