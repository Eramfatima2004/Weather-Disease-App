import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENWEATHER_API_KEY;

// 🔹 Fetch Weather + Air Pollution
app.get("/api/weather", async (req, res) => {
  try {
    const { city } = req.query;

    const weatherURL =
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const weather = await axios.get(weatherURL);

    const { lon, lat } = weather.data.coord;

    const airURL =
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    const air = await axios.get(airURL);

    res.json({
      weather: weather.data,
      air: air.data
    });

  } catch (error) {
    res.status(500).json({ error: "City not found or API error." });
  }
});

// 🔹 Disease Risk Prediction Route
app.post("/api/risk", (req, res) => {
  const { temp, humidity, aqi, pressure, rain } = req.body;

  const risk = {};

  // Heatstroke
  if (temp > 35 && humidity > 60) risk.heatstroke = "High";
  else risk.heatstroke = "Low";

  // Asthma
  if (aqi > 150) risk.asthma = "High";
  else risk.asthma = "Low";

  // Flu
  if (temp < 18 && humidity > 55) risk.flu = "Medium";
  else risk.flu = "Low";

  // Dengue
  if (humidity > 70 && rain > 5) risk.dengue = "High";
  else risk.dengue = "Low";

  res.json(risk);
});

app.listen(process.env.PORT, () =>
  console.log("Server running on port 5000")
);
