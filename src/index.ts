
import express from 'express';
import  { Request, Response, NextFunction } from 'express'
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Initialize the Express application
dotenv.config();

const app = express();
const PORT = process.env.portal;
const apiUrl=process.env.url;
const apiKey=process.env.key;

// Needed to resolve __dirname in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define a function to query the API
const query = async (data: { inputs: string }) => {
  const response = await fetch(
    `${apiUrl}`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  const buffer = await response.buffer();
  return buffer;
};

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Define a route to handle image generation
app.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prompt = req.body.prompt; // Get prompt from the request body
    const imageBuffer = await query({ inputs: prompt });
    const imagePath = path.join(__dirname, '../public/images/generated_image.png');
    fs.writeFileSync(imagePath, imageBuffer);
    res.json({ url: '/images/generated_image.png' });
  } catch (error) {
    console.error('Error:', error);
    next(error); // Pass error to the next middleware
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
