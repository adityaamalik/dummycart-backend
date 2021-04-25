const { Order } = require("../models/order");
const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get(`/`, async (req, res) => {
  const orderList = await Order.find();
  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

router.post("/", async (req, res) => {
  let tPrice = 0;

  req.body.orderItems.forEach((item) => {
    tPrice = tPrice + item.price;
  });

  let order = new Order({
    orderItems: req.body.orderItems,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: tPrice,
    email: req.body.email,
    name: req.body.name,
    state: req.body.state,
    paymentMethod: req.body.paymentMethod,
  });
  order = await order.save();

  if (!order) return res.status(400).send("the order cannot be created!");

  if (order && req.body.paymentMethod === "COD") {
    const msg = {
      to: order.email, // Change to your recipient
      from: "aditya.malik.cs.2018@miet.ac.in", // Change to your verified sender
      subject: "Order placed successfully at MyIndianThings.com",
      text: "Thanks for your order at Myindianthings.com",
      html: `
            <h1>Thanks for your order at MyIndianThings.com</h1>
            <br />
            <br />
            <h3>Order Summary</h3>
            <p>Name : ${order.name}</p>
            <p>E-Mail : ${order.email}</p>
            <p>Phone Number : ${order.phone}</p>
            <p>Shipping Address 1 : ${order.shippingAddress1}</p>
            <p>Shipping Address 2 : ${order.shippingAddress2}</p>
            <p>State : ${order.state}</p>
            <p>City : ${order.city}</p>
            <p>Zip : ${order.zip}</p>
            <p>Payment Method : ${order.paymentMethod}</p>
            <br />
            <br />
            <h3>Total amount paid : ₹ ${order.totalPrice} /-</h3>
          `,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  res.send(order);
});

router.put("/:id", async (req, res) => {
  let params = {
    paymentstatus: req.body.paymentstatus,
    shippingstatus: req.body.shippingstatus,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];
  const order = await Order.findByIdAndUpdate(req.params.id, params, {
    new: true,
  });

  if (!order) return res.status(400).send("the order cannot be update!");

  res.send(order);
});

router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).send();
    }
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }

  res.send({ totalsales: totalSales.pop().totalsales });
});

router.get(`/get/count`, async (req, res) => {
  const orderCount = await Order.countDocuments((count) => count);

  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    orderCount: orderCount,
  });
});

module.exports = router;
