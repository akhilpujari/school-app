import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { filename } = req.query;
  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ message: 'Filename is required' });
  }
  const cleanFilename = path.basename(filename);
  if (cleanFilename.includes('..') || cleanFilename.includes('/') || cleanFilename.includes('\\')) {
    return res.status(400).json({ message: 'Invalid filename' });
  }
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(cleanFilename).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return res.status(400).json({ message: 'Invalid file type' });
  }

  try {
    const imagePath = path.join(process.cwd(), 'schoolsImages', cleanFilename);
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: 'Image not found' });
    }
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';
    const imageBuffer = fs.readFileSync(imagePath);    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(imageBuffer);

  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ message: 'Error serving image' });
  }
}