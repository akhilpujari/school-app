import db from "../../config/db";

export default async function handler(req, res) {
  try {
    const result = await db.query('SELECT NOW() as current_time');
    res.status(200).json({ success: true, time: result.rows[0].current_time });
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}