import formidable from "formidable";
import fs from "fs";
import path from "path";
import db from "../../config/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "schoolsImages");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

function generateUniqueFilename(originalFilename) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(originalFilename);
  return `school_${timestamp}_${randomString}${extension}`;
}

function validateData(data) {
  const required = ["schoolName", "address", "city", "state", "email", "contact", "image"];
  for (let field of required) {
    const value = data[field];
    if (!value || (typeof value === "string" && value.trim() === "")) return field;

    if (field === "email") {
      const regex = /^[^\.\s][\w\-]+(\.[\w\-]+)*@([\w-]+\.)+[\w-]{2,}$/;
      if (!regex.test(value)) return field;
    }

    if (field === "contact") {
      const regex = /^[0-9]{10}$/;
      if (!regex.test(value)) return field;
    }

    if (field === "image") {
      const file = value;
      if (!file || !file.originalFilename) return "image";
      const extRegex = /\.(jpg|jpeg|png|gif)$/i;
      if (!extRegex.test(file.originalFilename)) return "image (invalid type)";
      if (file.size > 2 * 1024 * 1024) return "image (max 2MB)";
    }
  }
  return null;
}

function parseForm(req) {
  const form = formidable({ uploadDir, keepExtensions: true, multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function addSchool(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { fields, files } = await parseForm(req);

    const schoolImage = Array.isArray(files.schoolImage)
      ? files.schoolImage[0]
      : files.schoolImage;

    // Extract field values (formidable returns arrays)
    const schoolName = fields.schoolName?.[0] || '';
    const email = fields.email?.[0] || '';
    const address = fields.address?.[0] || '';
    const city = fields.city?.[0] || '';
    const state = fields.state?.[0] || '';
    const contact = fields.contact?.[0] || '';

    const data = { 
      schoolName, 
      email, 
      address, 
      city, 
      state, 
      contact, 
      image: schoolImage 
    };

    const error = validateData(data);
    if (error) {
      if (schoolImage && fs.existsSync(schoolImage.filepath)) fs.unlinkSync(schoolImage.filepath);
      return res.status(400).json({ message: `Please enter valid ${error}` });
    }

    const newFilename = generateUniqueFilename(schoolImage.originalFilename);
    const newFilePath = path.join(uploadDir, newFilename);
    fs.renameSync(schoolImage.filepath, newFilePath);

    // PostgreSQL parameterized query with $ placeholders
    const query = `
      INSERT INTO schools (name, email, address, city, state, contact, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    
    const result = await db.query(query, [
      schoolName,
      email,
      address,
      city,
      state,
      contact,
      newFilename,
    ]);

    return res.status(200).json({ ok: true, message: "School added successfully" });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}