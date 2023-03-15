const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
//====================================

// options============================
const {
  ANZAHL_FUER_FOOTER_STAEDTE,
  KEYWORDS,
  UNTERORDNER,
  KEYWORD_REVERSE,
} = require("../__OPTIONS");
//====================================

//costume Modules=====================
const { randomnArr } = require("./randomItem");
const StaedteListe = require("./staedte_liste");
const { hauptortRegex, ortRegex } = require("./regEx");
const { mapBoxApiUrl, geoData, geoShortCode } = require("./geocoding");

//====================================

const modRoutes = (KEYWORD_REVERSE, UNTERORDNER, keyword) => {
  //Datenbankzugriff====================
  const dbLocal = "mongodb://localhost:27017/staedte_liste";
  const dbURL = process.env.DB_URL || dbLocal;

  mongoose
    .connect(dbURL)
    .then(() => console.log("Verbindung ist hergestellt!!!"))
    .catch((err) => {
      console.log("Verbindung ist fehlgeschlagen!!");
      console.log(err);
    });
  //====================================

  if (!KEYWORD_REVERSE) {
    //Unterseiten=========================
    router.get(`/${keyword}-:hauptort`, async (req, res) => {
      const { hauptort } = req.params;
      const stadt = await StaedteListe.find({
        hauptortUrl: hauptortRegex(hauptort.replace(/[0-9]/g, "")),
      });
      const stadtone = await StaedteListe.findOne({
        hauptortUrl: hauptortRegex(hauptort.replace(/[0-9]/g, "")),
      });
      let arr = randomnArr(stadt, ANZAHL_FUER_FOOTER_STAEDTE);
      const mbURL = mapBoxApiUrl(stadtone.hauptort, stadtone.bundesland);
      const geolocationInvers = geoData(mbURL).coordinates;
      const short_code = geoShortCode(mbURL);
      const geolocation = `${geolocationInvers[1]},${geolocationInvers[0]}`;
      const geopos = `${geolocationInvers[1]};${geolocationInvers[0]}`;

      res.render(`${UNTERORDNER}${keyword}-{hauptort}/`, {
        stadtone,
        arr,
        keyword,
        geolocation,
        short_code,
        geopos,
      });
    });
    router.get(`/${keyword}-:hauptort/:ort/`, async (req, res) => {
      const { hauptort, ort } = req.params;
      const stadt = await StaedteListe.find({
        hauptortUrl: hauptortRegex(hauptort.replace(/[0-9]/g, "")),
      });
      const stadtone = await StaedteListe.findOne({
        ortUrl: ortRegex(ort.replace(/[0-9]/g, "")),
        hauptortUrl: hauptortRegex(hauptort.replace(/[0-9]/g, "")),
      });
      let arr = randomnArr(stadt, ANZAHL_FUER_FOOTER_STAEDTE);
      const mbURL = mapBoxApiUrl(
        stadtone.ort.replace(/[0-9]/g, ""),
        stadtone.bundesland
      );
      const geolocationInvers = geoData(mbURL).coordinates;
      const short_code = geoShortCode(mbURL);

      const geolocation = `${geolocationInvers[1]},${geolocationInvers[0]}`;
      const geopos = `${geolocationInvers[1]};${geolocationInvers[0]}`;
      res.render(`${UNTERORDNER}${keyword}-{hauptort}/{ort}`, {
        stadtone,
        arr,
        keyword,
        geolocation,
        short_code,
        geopos,
      });
    });
    //====================================
  } else {
    //Unterseiten Umgekehrte Reihenfolge==
    router.get("/:hauptort", async (req, res) => {
      const { hauptort } = req.params;
      const stadt = await StaedteListe.find({
        hauptortUrl: hauptortRegex(hauptort.replace(/[0-9]/g, "")),
      });
      const stadtone = await StaedteListe.findOne({
        hauptortUrl: hauptortRegex(hauptort.replace(/[0-9]/g, "")),
      });
      let arr = randomnArr(stadt, ANZAHL_FUER_FOOTER_STAEDTE);
      const mbURL = mapBoxApiUrl(stadtone.hauptort, stadtone.bundesland);
      const geolocationInvers = geoData(mbURL).coordinates;
      const short_code = geoShortCode(mbURL);

      const geolocation = `${geolocationInvers[1]},${geolocationInvers[0]}`;
      const geopos = `${geolocationInvers[1]};${geolocationInvers[0]}`;
      res.render(`${UNTERORDNER}{hauptort}/`, {
        stadtone,
        arr,
        keyword,
        geolocation,
        short_code,
        geopos,
      });
    });

    router.get(`/:hauptort/${keyword}-:ort/`, async (req, res) => {
      const { hauptort, ort } = req.params;
      const stadt = await StaedteListe.find({
        hauptortUrl: hauptortRegex(hauptort.replace(/[0-9]/g, "")),
      });
      const stadtone = await StaedteListe.findOne({
        ortUrl: ortRegex(ort),
        hauptortUrl: hauptortRegex(hauptort.replace(/[0-9]/g, "")),
      });
      let arr = randomnArr(stadt, ANZAHL_FUER_FOOTER_STAEDTE);
      const mbURL = mapBoxApiUrl(
        `${stadtone.hauptort} ${stadtone.ort}`,
        stadtone.bundesland
      );
      const geolocationInvers = geoData(mbURL).coordinates;
      const short_code = geoShortCode(mbURL);

      const geolocation = `${geolocationInvers[1]},${geolocationInvers[0]}`;
      const geopos = `${geolocationInvers[1]};${geolocationInvers[0]}`;
      res.render(`${UNTERORDNER}{hauptort}/${keyword}-{ort}`, {
        stadtone,
        arr,
        keyword,
        geolocation,
        short_code,
        geopos,
      });
    });
    //====================================
  }
};

KEYWORDS.forEach((keyword) => modRoutes(KEYWORD_REVERSE, UNTERORDNER, keyword));

module.exports = router;
