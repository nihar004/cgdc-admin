const express = require("express");
const cors = require("cors");

const students = require("./routes/students");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/students", students);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
