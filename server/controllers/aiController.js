import OpenAI from "openai";
import sql from '../configs/db.js';
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from 'cloudinary';
import FormData from "form-data";
import fs from 'fs';


import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule.default || pdfParseModule; 

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (plan !== "premium" && free_usage >= 10) 
      return res.json({ success: false, message: "Limit reached. Upgrade to continue." });

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are an assistant that writes high-quality articles." },
        { role: "user", content: `Write a ${length}-word article about: ${prompt}` }
      ],
      temperature: 0.7,
      max_tokens: length
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, { privateMetadata: { free_usage: free_usage + 1 } });
    }

    return res.json({ success: true, content });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length = 50 } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (plan !== "premium" && free_usage >= 10) 
      return res.json({ success: false, message: "Limit reached. Upgrade to continue." });

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are an assistant that writes high-quality blog titles." },
        { role: "user", content: `Write a catchy blog title about: ${prompt}` }
      ],
      temperature: 0.7,
      max_tokens: length
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, { privateMetadata: { free_usage: free_usage + 1 } });
    }

    return res.json({ success: true, content });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const userId = req.auth()?.userId;
    const { prompt, publish } = req.body;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!prompt?.trim())
      return res.status(400).json({ success: false, message: "Prompt required" });

    const formData = new FormData();
    formData.append("prompt", prompt);

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
          ...formData.getHeaders()
        },
        responseType: "arraybuffer"
      }
    );

    const base64Image = `data:image/png;base64,${Buffer.from(response.data).toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image);

    return res.json({
      success: true,
      content: uploadResult.secure_url
    });

  } catch (error) {
  console.log("======= IMAGE ERROR =======");
  console.log("Message:", error.message);
  console.log("Response:", error.response?.data);
  console.log("===========================");

  return res.status(500).json({
    success: false,
    message: error.response?.data?.error || error.message
  });
}

};


export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const  image  = req.file;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (plan !== "premium" && free_usage >= 10)
      return res.json({ success: false, message: "Limit reached. Upgrade to continue." });

    const uploadResult = await cloudinary.uploader.upload(image.path, {
      transformation: [{ effect: 'background_removal' }]
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Removed background', ${uploadResult.secure_url}, 'image')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, { privateMetadata: { free_usage: free_usage + 1 } });
    }

    return res.json({ success: true, content: uploadResult.secure_url });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const  image  = req.file;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (plan !== "premium" && free_usage >= 10)
      return res.json({ success: false, message: "Limit reached. Upgrade to continue." });

    const uploadResult = await cloudinary.uploader.upload(image.path);
    const imageUrl = cloudinary.url(uploadResult.public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: 'image'
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, { privateMetadata: { free_usage: free_usage + 1 } });
    }

    return res.json({ success: true, content: imageUrl });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth(); 
    const resume = req.file;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    if (plan !== "premium" && free_usage >= 10)
      return res.json({ success: false, message: "Limit reached. Upgrade to continue." });

    if (resume.size > 5 * 1024 * 1024)
      return res.json({ success: false, message: "Resume file size exceeds allowed size (5MB)." });

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdfParse(dataBuffer);

    const prompt = `Review the following resume and provide constructive feedback on strengths, weaknesses, and areas for improvement:\n\n${pdfData.text}`;

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are an assistant that writes high-quality resume reviews." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Resume Review', ${content}, 'resume-review')
    `;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    return res.json({ success: true, content });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
