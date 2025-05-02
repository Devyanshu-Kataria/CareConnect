import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { authenticate } from '../auth/verifyToken.js';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dtrmxnntj',
    api_key: '394939318637234',
    api_secret: '5flruQWH9FBvmNrYlGRDNe8Hmwk'
});

// Configure multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'doctor_booking',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload route with authentication
router.post('/', authenticate, upload.single('file'), async (req, res) => {
    try {
        console.log('Upload request received:', req.file);
        
        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({ 
                success: false, 
                message: 'No file uploaded' 
            });
        }

        console.log('File uploaded successfully:', {
            path: req.file.path,
            filename: req.file.filename,
            size: req.file.size
        });

        // Return both URLs for flexibility
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            url: req.file.path,
            secure_url: req.file.path.replace('http:', 'https:'),
            public_id: req.file.filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error uploading file', 
            error: error.message 
        });
    }
});

export default router; 