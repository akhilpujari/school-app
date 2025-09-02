import db from "../../config/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const query = `
      SELECT id, name, email, address, city, state, contact, image 
      FROM schools 
      ORDER BY id DESC
    `;
    const result = await db.query(query);
    const schools = result.rows;

    const schoolsWithImageUrl = schools.map((school) => {
      let cleanFilename = school.image;
      if (cleanFilename.includes("/")) {
        cleanFilename = cleanFilename.split("/").pop();
      }

      return {
        ...school,
        image: cleanFilename,
        imageUrl: `/api/schoolImage?filename=${cleanFilename}`,
      };
    });

    return res.status(200).json({ schools: schoolsWithImageUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Database error" });
  }
}
