const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const resourceRoutes=require("./routes/resourceRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/resources",resourceRoutes);
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "Capacity Connect Backend is running"
    });
});

const PORT = process.env.PORT || 5000;
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});