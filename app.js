const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "myindianthingsDB",
});

app.use(express.static(path.join(__dirname + "//../../public/uploads/")));

const categoriesRouter = require("./routers/categories");
const productsRouter = require("./routers/products");
const ordersRoutes = require("./routers/orders");
const reviewsRoutes = require("./routers/reviews");
const blogsRoutes = require("./routers/blogs");
const contactRoutes = require("./routers/contacts");
const paymentRoutes = require("./routers/payment");
const mailRoutes = require("./routers/mail");

//routes
app.use("/categories", categoriesRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/blogs", blogsRoutes);
app.use("/contacts", contactRoutes);
app.use("/payment", paymentRoutes);
app.use("/mail", mailRoutes);

app.get("/", (req, res) => {
  res.send("API is working fine !");
});

app.listen(process.env.PORT || "3000", () => console.log("Server is running"));
