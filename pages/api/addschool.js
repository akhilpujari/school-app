import formidable from "formidable";
import fs from "fs";
import path from "path";
import db from "../../config/db";

export const config = { api: { bodyParser: false } };

const uploadDir = path.join(process.cwd(), "schoolsImages");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Parse form
    const form = formidable({ uploadDir, keepExtensions: true });
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // Get field values
    const schoolName = fields.schoolName[0];
    const email = fields.email[0];
    const address = fields.address[0];
    const city = fields.city[0];
    const state = fields.state[0];
    const contact = fields.contact[0];
    const schoolImage = files.schoolImage[0];

    // Generate filename
    const newFilename = `school_${Date.now()}_${Math.random().toString(36).substring(7)}${path.extname(schoolImage.originalFilename)}`;
    const newFilePath = path.join(uploadDir, newFilename);
    fs.renameSync(schoolImage.filepath, newFilePath);

    // Insert into database
    const query = `
      INSERT INTO schools (name, email, address, city, state, contact, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    
    const result = await db.query(query, [
      schoolName, email, address, city, state, contact, newFilename
    ]);

    res.status(200).json({ success: true, message: "School added successfully" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}