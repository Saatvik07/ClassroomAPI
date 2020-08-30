require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const morgan = require("morgan");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const PORT = process.env.PORT || 8080;
const app = express();
const server = require("http").createServer(app);
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser());
app.use(morgan("dev"));

app.use(function (req, res, next) {
	req.server = server;
	next();
});

mongoose.connect(
	`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@reviewerdb.n4mee.mongodb.net/USERS?retryWrites=true&w=majority`,
	{ useUnifiedTopology: true, useNewUrlParser: true },
	(error) => {
		if (error) {
			console.log("Trouble Connecting to USERS DB", error);
		} else {
			console.log("Connected to USERS DB");
		}
	},
);
app.use("/api", authRouter);

app.use(errorHandler());
server.listen(PORT, () => {
	console.log(`Listening at port ${PORT}`);
});
