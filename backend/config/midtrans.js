import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === "production", // Set to true for production
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export default snap;
