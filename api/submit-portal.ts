import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google, drive_v3 } from 'googleapis';
import formidable, { File as FormidableFile, Fields, Files } from 'formidable';
import fs from 'fs';
import nodemailer from 'nodemailer';

// Configure multipart form parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Google Drive setup
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const PARENT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

// Email setup
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@mytaxreturns.com';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ssn: string;
  address: string;
  filingStatus: string;
  taxYear: string;
  serviceType: string;
  additionalInfo: string;
}

interface UploadedFile {
  field: string;
  id: string;
  name: string;
  webViewLink?: string;
}

async function getDriveService() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  return google.drive({ version: 'v3', auth });
}

async function createUserFolder(drive: drive_v3.Drive, userName: string, date: string) {
  const folderName = `${userName}_${date}`;
  
  const folderMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [PARENT_FOLDER_ID],
  };

  const folder = await drive.files.create({
    requestBody: folderMetadata,
    fields: 'id, webViewLink',
  });

  return folder.data;
}

async function uploadFileToDrive(drive: drive_v3.Drive, file: FormidableFile, folderId: string) {
  const fileMetadata = {
    name: file.originalFilename || file.newFilename,
    parents: [folderId],
  };

  const media = {
    mimeType: file.mimetype || 'application/octet-stream',
    body: fs.createReadStream(file.filepath),
  };

  const uploadedFile = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id, name, webViewLink',
  });

  // Clean up temp file
  fs.unlinkSync(file.filepath);

  return uploadedFile.data;
}

async function sendEmailNotification(formData: FormData, folderLink: string, uploadedFiles: UploadedFile[]) {
  // Configure email transport (using Gmail as example - can swap for SendGrid/AWS SES)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
    },
  });

  const fileList = uploadedFiles.map(f => `- ${f.name}`).join('\n');

  const emailHtml = `
    <h2>New Portal Submission</h2>
    
    <h3>Personal Information</h3>
    <ul>
      <li><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</li>
      <li><strong>Email:</strong> ${formData.email}</li>
      <li><strong>Phone:</strong> ${formData.phone}</li>
      <li><strong>SSN:</strong> ${formData.ssn}</li>
      <li><strong>Address:</strong> ${formData.address}</li>
    </ul>

    <h3>Tax Information</h3>
    <ul>
      <li><strong>Filing Status:</strong> ${formData.filingStatus}</li>
      <li><strong>Tax Year:</strong> ${formData.taxYear}</li>
      <li><strong>Service Type:</strong> ${formData.serviceType}</li>
      <li><strong>Additional Info:</strong> ${formData.additionalInfo || 'N/A'}</li>
    </ul>

    <h3>Uploaded Documents</h3>
    <p><strong>Google Drive Folder:</strong> <a href="${folderLink}">${folderLink}</a></p>
    
    <p><strong>Files uploaded:</strong></p>
    <pre>${fileList}</pre>

    <hr>
    <p><em>Submitted on ${new Date().toLocaleString()}</em></p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: ADMIN_EMAIL,
    subject: `New Portal Submission - ${formData.firstName} ${formData.lastName}`,
    html: emailHtml,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    const form = formidable({ multiples: true, maxFileSize: 10 * 1024 * 1024 }); // 10MB max per file

    const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
      form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // Extract form data
    const formData = {
      firstName: fields.firstName?.[0] || '',
      lastName: fields.lastName?.[0] || '',
      email: fields.email?.[0] || '',
      phone: fields.phone?.[0] || '',
      ssn: fields.ssn?.[0] || '',
      address: fields.address?.[0] || '',
      filingStatus: fields.filingStatus?.[0] || '',
      taxYear: fields.taxYear?.[0] || '',
      serviceType: fields.serviceType?.[0] || '',
      additionalInfo: fields.additionalInfo?.[0] || '',
    };

    // Initialize Google Drive
    const drive = await getDriveService();

    // Create user folder
    const date = new Date().toISOString().split('T')[0];
    const userName = `${formData.firstName}_${formData.lastName}`.replace(/\s+/g, '_');
    const folder = await createUserFolder(drive, userName, date);
    
    if (!folder.id || !folder.webViewLink) {
      throw new Error('Failed to create Google Drive folder');
    }

    // Upload all files to Drive
    const uploadedFiles: UploadedFile[] = [];
    for (const [fieldName, fileArray] of Object.entries(files)) {
      const fileList = Array.isArray(fileArray) ? fileArray : [fileArray];
      for (const file of fileList) {
        if (file && file.size > 0) {
          const uploaded = await uploadFileToDrive(drive, file, folder.id);
          uploadedFiles.push({ field: fieldName, ...uploaded } as UploadedFile);
        }
      }
    }

    // Send email notification
    await sendEmailNotification(formData, folder.webViewLink, uploadedFiles);

    return res.status(200).json({
      success: true,
      message: 'Submission successful',
      folderLink: folder.webViewLink,
      filesUploaded: uploadedFiles.length,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Portal submission error:', error);
    return res.status(500).json({
      error: 'Submission failed',
      message: errorMessage,
    });
  }
}
