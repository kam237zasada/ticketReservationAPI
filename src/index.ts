import express from "express";
import cors from "cors";
import db from "./DBModels/index";
import config from "./config";
import halls from "./routes/halls";
import events from "./routes/events";
import reservations from "./routes/reservations";
import payments from "./routes/payments";


db.sequelize.sync({force: true});

const app = express();


app.listen(config.port, () => {
    console.log(`Server started at http://localhost:${config.port}`);
})

app.use(express.json());
app.use(cors());

app.use("/api/halls", halls);
app.use("/api/events", events);
app.use("/api/reservations", reservations);
app.use("/api/payments", payments);

app.use(function (req, res) {
    res.status(404).end("404. Ooops. There is nothing here!");
});

export default app;
