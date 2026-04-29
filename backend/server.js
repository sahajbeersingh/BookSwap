const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const listingROutes = require("./routes/listingRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const collectionRoutes = require("./routes/collectionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/listing", listingROutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/collection", collectionRoutes);

app.get("/", (req, res) => {
  res.send("BookSwap Backend Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
