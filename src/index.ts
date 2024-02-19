import "reflect-metadata";
import express from "express";
import { DataSource, getRepository } from "typeorm";
import { Quote } from "./entities/quotes";
const NodeCache = require('node-cache');
const axios = require('axios');
const app = express();
const rateLimit = require("express-rate-limit");
app.use(express.json());
const port = 8004;

console.log("Make sure JSON Server is running on port 3001");
const cache = new NodeCache({ stdTTL: 60 });

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "shannu12",
    database: "postgres",
    entities: ["src/entities/*{.ts,.js}"],
    synchronize: true,
    logging: true
});

AppDataSource.initialize().then(() => {
    console.log("database connected");

}).catch((err) => console.log("error", err));

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later"
});
app.use(limiter);


app.post("/api/quotes", async (req, res) => {
    try {
        // Extract user details from the request body
        const { name, age, carModel, yearsOfDrivingExperience } = req.body;

        const cacheKey = `${name}_${age}_${carModel}_${yearsOfDrivingExperience}`;
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
           return res.json(cachedData);
        }

        // Make a GET request to json-server to fetch quotes based on input
        const response = await axios.get("http://localhost:3001/quotes");
        const quotesData = response.data;
        console.log(quotesData);

        // Filter quotes based on user details
        const filteredQuotes = quotesData.filter((quote: any) =>
            quote.name === name &&
            quote.age === age &&
            quote.carModel === carModel &&
            quote.drivingExperience === yearsOfDrivingExperience
        );

        cache.set(cacheKey, filteredQuotes);
        console.log(filteredQuotes);

        res.json(filteredQuotes);
        await Promise.all(filteredQuotes.map(async (quotesData: any) => {
            const quoteRepository = AppDataSource.getRepository(Quote);
            try {
                const existingQuote = await quoteRepository.findOne({
                where: {
                name,
                age,
                carModel
                }
                });
                console.log("Quote repository:", quoteRepository);
                if (!existingQuote) {
                    const quote = quoteRepository.create(quotesData);
                    await quoteRepository.save(quote);
                    console.log("saved successfully");
                } else {
                    console.log("already existing");
                }
            }
            catch (error) {
                console.error("Error processing quote:", error);
            }
        }));

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/api/quotes/best-three", async (req, res) => {
    try {
      // Fetch all users from the database

      const cachedData = cache.get("bestThreeQuotes");
        if (cachedData) {
            console.log("Data retrieved from cache");
            return res.json(cachedData);
        }
      const quoteRepository = AppDataSource.getRepository(Quote);
      const quotes = await quoteRepository.find();
      quotes.sort((a, b) => a.price - b.price);
      const quotesCount = await quoteRepository.count();

      
        // Get the count of available quotes
        // const quotesCount = quotes.length;

        // Determine the number of quotes to return (up to three)
        const numQuotes = Math.min(3, quotesCount);

        // Get the first three quotes
        const bestThreeQuotes = quotes.slice(0, numQuotes);

        // Cache the retrieved data
        cache.set("bestThreeQuotes", bestThreeQuotes);

        res.json(bestThreeQuotes);

    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

app.listen(port, () => {
    console.log(`app is running on port ${port}.`);
});