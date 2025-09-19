const express = require("express");
const cors = require("cors");

const students = require("./routes/students");
const batches = require("./routes/batches");
const companies = require("./routes/companies");
const emails = require("./routes/emails");
const forms = require("./routes/forms");
const events = require("./routes/events");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/students", students);
app.use("/batches", batches);
app.use("/companies", companies);
app.use("/emails", emails);
app.use("/forms", forms);
app.use("/events", events);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
