const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.static("public"));

const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET"
});

let transactions = [];

app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR"
  });

  res.json(order);
});

app.post("/verify", (req, res) => {
  const { razorpay_payment_id, name, cid, amount } = req.body;

  transactions.push({
    id: razorpay_payment_id,
    name,
    cid,
    amount,
    date: new Date().toLocaleString()
  });

  res.json({ status: "ok" });
});

app.get("/transactions", (req, res) => {
  res.json(transactions);
});

app.delete("/delete/:id", (req, res) => {
  transactions = transactions.filter(t => t.id !== req.params.id);
  res.send("deleted");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));
