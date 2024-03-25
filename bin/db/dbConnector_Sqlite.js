const sqlite3 = require('sqlite3');
const { open } = require("sqlite");

async function connect() {
    return open({
        filename: "./bin/db/IrrigationSolution.db",
        driver: sqlite3.Database,
    });
}

async function getBlackSoil() {
    try {
        const db = await connect();
        const blackSoilData = await db.all(`SELECT COUNT(*) AS count
            FROM Farm
            JOIN GeologicalRegion ON Farm.region_id = GeologicalRegion.region_id
            JOIN SoilType ON GeologicalRegion.soil_id = SoilType.soil_id
            WHERE SoilType.type = 'Black Soil';`);
        console.log("dbConnector got data", blackSoilData[0].count);
        return blackSoilData[0].count;
    } catch (error) {
        console.error("Error in getBlackSoil:", error);
        throw error;
    }
}

async function getAvgLocationForBlackSoil() {
    try {
        const db = await connect();
        const avgLocationForBlackSoil = await db.get(`
            SELECT AVG(location) AS avg_location
            FROM Farm
            WHERE region_id IN (
                SELECT Farm.region_id
                FROM Farm
                JOIN GeologicalRegion ON Farm.region_id = GeologicalRegion.region_id
                JOIN SoilType ON GeologicalRegion.soil_id = SoilType.soil_id
                WHERE SoilType.type = 'Black Soil'
            );
        `);
        console.log("dbConnector got average location data:", avgLocationForBlackSoil.avg_location);
        return avgLocationForBlackSoil.avg_location;
    } catch (error) {
        console.error("Error in getAverageLocationForBlackSoil:", error);
        throw error;
    }
}

async function analystMoreThanFive() {
    try {
        const db = await connect();
        const insightCounts = await db.all(`
            SELECT 
                i.analyst_id,
                COUNT(*) AS insight_count
            FROM 
                Insights i
            GROUP BY 
                i.analyst_id
            HAVING 
                COUNT(*) > 5;
        `);
        console.log("dbConnector got insight counts:", insightCounts);
        return insightCounts;
    } catch (error) {
        console.error("Error in getInsightCounts:", error);
        throw error;
    }
}

async function getWildCropFarms() {
    try {
        const db = await connect();
        const wildCropFarms = await db.all(`
            SELECT 
                Farm.farm_id,
                Farm.location,
                Crop.Name AS crop_name,
                SoilType.type AS soil_type
            FROM 
                Farm
            JOIN 
                Crop ON Farm.crop_id = Crop.crop_id
            JOIN 
                GeologicalRegion ON Farm.region_id = GeologicalRegion.region_id
            JOIN 
                SoilType ON GeologicalRegion.soil_id = SoilType.soil_id
            WHERE 
                Crop.Name LIKE '%Wild%'
                AND (SoilType.type = 'Loam Soil' OR SoilType.type = 'Red Soil' OR SoilType.type = 'Limestone Soil');
        `);
        console.log("dbConnector got wild crop farms:", wildCropFarms);
        return wildCropFarms;
    } catch (error) {
        console.error("Error in getWildCropFarms:", error);
        throw error;
    }
}

async function getFarmEnvironmentalData() {
    try {
        const db = await connect();
        const environmentalData = await db.all(`
            SELECT
                f.farm_id,
                AVG(rc.inchesOfRain) OVER (PARTITION BY f.farm_id) AS avg_rain_coverage,
                AVG(sm.waterSaturation) OVER (PARTITION BY f.farm_id) AS avg_soil_moisture
            FROM
                Farm f
            JOIN
                EnvironmentalFactors ef ON f.factors_id = ef.factors_id
            JOIN
                RainCoverage rc ON ef.coverage_id = rc.coverage_id
            JOIN
                SoilMoisture sm ON ef.moisture_id = sm.moisture_id;
        `);
        console.log("dbConnector got farm environmental data:", environmentalData);
        return environmentalData;
    } catch (error) {
        console.error("Error in getFarmEnvironmentalData:", error);
        throw error;
    }
}

module.exports = {
    getBlackSoil,
    getAvgLocationForBlackSoil,
    analystMoreThanFive,
    getWildCropFarms,
    getFarmEnvironmentalData
};


