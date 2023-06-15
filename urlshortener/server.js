const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./models/url");
const URL = require("./models/url");
const validUrl = require("valid-url");

const generateShortUrl = () => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  const urlLength = 6; // Change this value to adjust the length of the short URL

  for (let i = 0; i < urlLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/url", async (req, res) => {
  const { longUrl } = req.body;

  // Validate the submitted URL
  if (!validUrl.isWebUri(longUrl)) {
    return res.status(400).json({ message: "Invalid URL" });
  }

  try {
    const existingURL = await URL.findOne({ longUrl });

    if (existingURL) {
      res.json(existingURL);
    } else {
      let shortUrl;
      let isUnique = false;

      while (!isUnique) {
        shortUrl = generateShortUrl();

        const existingShortURL = await URL.findOne({ shortUrl });

        if (!existingShortURL) {
          isUnique = true;
        }
      }

      const newURL = new URL({ longUrl, shortUrl });
      await newURL.save();
      res.json(newURL);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const url = await URL.findOne({ shortUrl });

    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json({ message: "URL not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});