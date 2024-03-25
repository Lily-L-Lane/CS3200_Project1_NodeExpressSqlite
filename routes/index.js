const express = require("express");
const router = express.Router();

const { getBlackSoil, getAvgLocationForBlackSoil, analystMoreThanFive, getWildCropFarms, getFarmEnvironmentalData } = require("../bin/db/dbConnector_Sqlite.js");

/* GET home page. */
router.get("/", async function(req, res) {
  //black Soil Count
  const blackSoilCount = await getBlackSoil();
  console.log("route / called - getBlackSoil.length", blackSoilCount.length);

  //avg Location Black Soil
  const avgLocationForBlackSoil = await getAvgLocationForBlackSoil();
  console.log("route / called - avgLocationForBlackSoil.length", avgLocationForBlackSoil.length);

  //returns all analysts that have made more than 5 insights
  const insightCounts = await analystMoreThanFive();
  console.log("route / called - insightCounts.length", insightCounts.length);

  //returns all farms that grow wild crop varieties
  const wildCropFarm = await getWildCropFarms();
  console.log("route / called - wildCropFarm.length", wildCropFarm.length);

  //returns average rainfall and rain coverage
  const environmentalData = await getFarmEnvironmentalData();
  console.log("route / called - environmentalData.length", environmentalData.length);

  const values = { 
    title: "Irrigation Solutions for farms", 
    blackSoilCount, 
    avgLocationForBlackSoil,
    insightCounts,
    wildCropFarm,
    environmentalData
  }

  res.render("index", values);
});

module.exports = router;
