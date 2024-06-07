
import express from 'express';
import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.port; 
const apiKey=process.env.key;
const apiUrl=process.env.url;

app.use(express.json());

// Endpoint to generate image
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send('Prompt is required.');
  }

  try {
    const response = await axios({
      url: `${apiUrl}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      data: { inputs: prompt },
      responseType: 'arraybuffer'
    });

    const imageUrl = `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
    res.send({imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).send('Error generating image.');
  }
});

// Endpoint to download image
app.post('/download-image', async (req, res) => {
  const { imageUrl, prompt } = req.body;

  if (!imageUrl) {
    return res.status(400).send('Image URL is required.');
  }

  const folderPath = path.join(__dirname, 'images');
  const fileName = `${prompt}_${Date.now()}.png`;
  const filePath = path.join(folderPath, fileName);

  try {
    // Ensure the "images" folder exists
    await fs.ensureDir(folderPath);

    // Extract base64 data from the data URL
    const base64Data = imageUrl.replace(/^data:image\/png;base64,/, '');
    const binaryData = Buffer.from(base64Data, 'base64');

    // Write the file to the server
    await fs.writeFile(filePath, binaryData);

    res.send('Image saved successfully.');
  } catch (error) {
    console.error('Error saving the image:', error);
    res.status(500).send('Error saving the image.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

