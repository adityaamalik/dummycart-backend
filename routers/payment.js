require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Order } = require("../models/order");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = express.Router();

router.post("/orders", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/success", async (req, res) => {
  try {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      ourOrderId,
    } = req.body;

    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    const updatedOrder = await Order.findByIdAndUpdate(ourOrderId, {
      paymentstatus:
        "Payment received through razorpay with payment id : " +
        razorpayPaymentId,
    });

    if (!updatedOrder)
      return res.status(400).send("the order cannot be update!");

    if (updatedOrder) {
      const finalOrder = await Order.findById(ourOrderId);

      if (finalOrder) {
        const msg = {
          to: finalOrder.email, // Change to your recipient
          from: "aditya.malik.cs.2018@miet.ac.in", // Change to your verified sender
          subject: "Order placed successfully at DummyStore.com",
          text: "Thanks for your order at DummyStore.com",
          html: `
                <h1>Thanks for your order at DummyStore.com</h1>
                <br />
                <br />
                <h3>Order Summary</h3>
                <p>Name : ${finalOrder.name}</p>
                <p>E-Mail : ${finalOrder.email}</p>
                <p>Phone Number : ${finalOrder.phone}</p>
                <p>Shipping Address 1 : ${finalOrder.shippingAddress1}</p>
                <p>Shipping Address 2 : ${finalOrder.shippingAddress2}</p>
                <p>State : ${finalOrder.state}</p>
                <p>City : ${finalOrder.city}</p>
                <p>Zip : ${finalOrder.zip}</p>
                <br />
                <br />
                <h3>Total amount paid : ₹ ${finalOrder.totalPrice} /-</h3>
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
    }

    res.json({
      msg: "Payment Successful",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
