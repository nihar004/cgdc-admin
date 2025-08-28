const express = require("express");
const cors = require("cors");

const students = require("./routes/students");
const batches = require("./routes/batches");
const companies = require("./routes/companies");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/students", students);
app.use("/batches", batches);
app.use("/companies", companies);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
