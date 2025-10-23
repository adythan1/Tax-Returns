import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create user-specific folder only once per request
    if (!req.userFolder) {
      const timestamp = Date.now();
      const userFolder = path.join(uploadsDir, `${timestamp}_${req.body.firstName || 'user'}_${req.body.lastName || ''}`);
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }
      req.userFolder = userFolder; // Store for reuse across all files
    }
    cb(null, req.userFolder);
  },
  filename: (req, file, cb) => {
    // Keep original filename with timestamp prefix
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    // Accept common document formats
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, Word documents, and images are allowed'));
    }
  }
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Portal submission endpoint
app.post('/api/submit-portal', upload.any(), async (req, res) => {
  try {
    console.log('Received submission:', {
      body: req.body,
      files: req.files?.length || 0
    });

    const {
      firstName,
      lastName,
      email,
      phone,
      ssn,
      address,
      filingStatus,
      taxYear,
      serviceType,
      additionalInfo
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: firstName, lastName, email'
      });
    }

    // Organize files by field name
    const filesByField = {};
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (!filesByField[file.fieldname]) {
          filesByField[file.fieldname] = [];
        }
        filesByField[file.fieldname].push({
          originalName: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size
        });
      });
    }

    // Save metadata for admin dashboard
    const userFolderPath = req.userFolder || path.join(uploadsDir, `${Date.now()}_${firstName}_${lastName}`);
    
    // Create file mapping with field names
    const filesMetadata = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        filesMetadata.push({
          fieldName: file.fieldname,
          fileName: file.filename,
          originalName: file.originalname,
          size: file.size,
          type: path.extname(file.originalname)
        });
      });
    }
    
    const metadata = {
      firstName,
      lastName,
      email,
      phone,
      ssn,
      address,
      filingStatus,
      taxYear,
      serviceType,
      additionalInfo,
      submittedAt: new Date().toISOString(),
      filesCount: req.files?.length || 0,
      files: filesMetadata
    };
    
    try {
      fs.writeFileSync(
        path.join(userFolderPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );
    } catch (err) {
      console.error('Error saving metadata:', err);
    }

    // Prepare email content
    const submissionDate = new Date().toLocaleString();
    const folderPath = userFolderPath;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;">
          New Portal Submission
        </h2>
        
        <h3 style="color: #0066cc; margin-top: 20px;">Personal Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 5px; font-weight: bold;">Name:</td><td style="padding: 5px;">${firstName} ${lastName}</td></tr>
          <tr><td style="padding: 5px; font-weight: bold;">Email:</td><td style="padding: 5px;">${email}</td></tr>
          <tr><td style="padding: 5px; font-weight: bold;">Phone:</td><td style="padding: 5px;">${phone || 'N/A'}</td></tr>
          <tr><td style="padding: 5px; font-weight: bold;">SSN:</td><td style="padding: 5px;">${ssn || 'N/A'}</td></tr>
          <tr><td style="padding: 5px; font-weight: bold;">Address:</td><td style="padding: 5px;">${address || 'N/A'}</td></tr>
        </table>

        <h3 style="color: #0066cc; margin-top: 20px;">Tax Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 5px; font-weight: bold;">Filing Status:</td><td style="padding: 5px;">${filingStatus || 'N/A'}</td></tr>
          <tr><td style="padding: 5px; font-weight: bold;">Tax Year:</td><td style="padding: 5px;">${taxYear || 'N/A'}</td></tr>
          <tr><td style="padding: 5px; font-weight: bold;">Service Type:</td><td style="padding: 5px;">${serviceType || 'N/A'}</td></tr>
        </table>

        ${additionalInfo ? `
          <h3 style="color: #0066cc; margin-top: 20px;">Additional Information</h3>
          <p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${additionalInfo}</p>
        ` : ''}

        <h3 style="color: #0066cc; margin-top: 20px;">Uploaded Documents</h3>
        ${Object.keys(filesByField).length > 0 ? `
          <ul style="list-style: none; padding: 0;">
            ${Object.entries(filesByField).map(([fieldName, files]) => `
              <li style="margin-bottom: 10px;">
                <strong style="color: #003366;">${formatFieldName(fieldName)}:</strong>
                <ul style="margin-top: 5px;">
                  ${files.map(f => `
                    <li style="margin-left: 20px; color: #666;">
                      📄 ${f.originalName} <span style="color: #999;">(${formatFileSize(f.size)})</span>
                    </li>
                  `).join('')}
                </ul>
              </li>
            `).join('')}
          </ul>
          <p style="background: #e8f4fd; padding: 10px; border-radius: 5px; color: #003366;">
            <strong>Files Location:</strong><br>
            <code style="background: white; padding: 5px; border-radius: 3px; display: inline-block; margin-top: 5px;">${folderPath}</code>
          </p>
        ` : '<p style="color: #999;">No documents uploaded</p>'}

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">
          <em>Submitted on ${submissionDate}</em>
        </p>
      </div>
    `;

    // Send email to admin
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || 'info@mytaxreturns.com',
      subject: `New Portal Submission - ${firstName} ${lastName}`,
      html: emailHtml,
      // Optional: Attach small files directly (under 5MB total)
      // attachments: req.files?.map(file => ({
      //   filename: file.originalname,
      //   path: file.path
      // }))
    };

    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully to:', mailOptions.to);

    // Send success response
    res.json({
      success: true,
      message: 'Submission received successfully',
      filesUploaded: req.files?.length || 0,
      folderPath: path.basename(folderPath)
    });

  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process submission',
      error: error.message
    });
  }
});

// Helper functions
function formatFieldName(fieldName) {
  const nameMap = {
    w2: 'W2 Form',
    driversLicense: "Driver's License",
    ssnCard: 'Social Security Card',
    form1095: '1095 Form',
    form1099: '1099 Form',
    k1: 'K1 Form',
    other: 'Other Documents'
  };
  return nameMap[fieldName] || fieldName;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ========================================
// ADMIN API ENDPOINTS
// ========================================

// Get all submissions
app.get('/api/admin/submissions', (req, res) => {
  try {
    const submissions = [];
    const folders = fs.readdirSync(uploadsDir);

    folders.forEach(folder => {
      const folderPath = path.join(uploadsDir, folder);
      const stats = fs.statSync(folderPath);
      
      if (stats.isDirectory()) {
        // Parse folder name: timestamp_FirstName_LastName
        const parts = folder.split('_');
        const timestamp = parts[0];
        const firstName = parts[1] || '';
        const lastName = parts.slice(2).join('_') || '';

        // Try to read metadata file if it exists
        const metadataPath = path.join(folderPath, 'metadata.json');
        let metadata = {};
        let files = [];
        
        if (fs.existsSync(metadataPath)) {
          try {
            metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            // Use files from metadata which includes field names
            files = metadata.files || [];
          } catch (e) {
            console.error('Error reading metadata:', e);
          }
        }
        
        // If no metadata or no files in metadata, read from directory
        if (files.length === 0) {
          files = fs.readdirSync(folderPath)
            .filter(filename => filename !== 'metadata.json')
            .map(filename => {
              const filePath = path.join(folderPath, filename);
              const fileStats = fs.statSync(filePath);
              return {
                fileName: filename,
                originalName: filename,
                fieldName: 'unknown',
                size: fileStats.size,
                type: path.extname(filename)
              };
            });
        }

        submissions.push({
          id: folder,
          timestamp,
          firstName: metadata.firstName || firstName,
          lastName: metadata.lastName || lastName,
          email: metadata.email || '',
          phone: metadata.phone || '',
          ssn: metadata.ssn || '',
          address: metadata.address || '',
          filingStatus: metadata.filingStatus || '',
          taxYear: metadata.taxYear || '',
          serviceType: metadata.serviceType || '',
          additionalInfo: metadata.additionalInfo || '',
          files,
          folder
        });
      }
    });

    // Sort by timestamp (newest first)
    submissions.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));

    res.json({ success: true, submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch submissions' });
  }
});

// Download a specific file
app.get('/api/admin/download', (req, res) => {
  try {
    const { folder, file } = req.query;

    if (!folder || !file) {
      return res.status(400).json({ success: false, message: 'Missing folder or file parameter' });
    }

    const filePath = path.join(uploadsDir, folder, file);

    // Security check: ensure the path is within uploads directory
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(uploadsDir)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    // Send file for download
    res.download(filePath, file, (err) => {
      if (err) {
        console.error('Download error:', err);
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: 'Download failed' });
        }
      }
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ success: false, message: 'Failed to download file' });
  }
});

// Download all files in a folder as ZIP
app.get('/api/admin/download-zip', (req, res) => {
  try {
    const { folder } = req.query;

    if (!folder) {
      return res.status(400).json({ success: false, message: 'Missing folder parameter' });
    }

    const folderPath = path.join(uploadsDir, folder);

    // Security check: ensure the path is within uploads directory
    const normalizedPath = path.normalize(folderPath);
    if (!normalizedPath.startsWith(uploadsDir)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Check if folder exists
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
      return res.status(404).json({ success: false, message: 'Folder not found' });
    }

    // Set response headers for ZIP download
    const zipFilename = `${folder}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFilename}"`);

    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Handle errors
    archive.on('error', (err) => {
      console.error('Archive error:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Failed to create ZIP' });
      }
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add all files from folder to archive (except metadata.json)
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
      if (file !== 'metadata.json') {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isFile()) {
          archive.file(filePath, { name: file });
        }
      }
    });

    // Finalize the archive
    archive.finalize();
  } catch (error) {
    console.error('Error creating ZIP:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to create ZIP' });
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📧 Email configured: ${process.env.EMAIL_USER || 'Not set'}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`\n🚀 Ready to receive Portal submissions!\n`);
});

export default app;
