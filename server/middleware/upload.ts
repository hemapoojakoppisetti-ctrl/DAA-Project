import multer, { StorageEngine, FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

interface UploadRequest extends Request {
  uploadFolder?: string;
}

const storage: StorageEngine = multer.diskStorage({
  destination: (req: UploadRequest, file, cb) => {
    const dir = path.join(
      __dirname,
      '../uploads',
      req.uploadFolder || 'general'
    );

    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    const unique =
      Date.now() + '-' + Math.round(Math.random() * 1e9);

    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (
  req: UploadRequest,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowed =
    /pdf|doc|docx|jpg|jpeg|png|gif|xls|xlsx|ppt|pptx/;

  const ext = path
    .extname(file.originalname)
    .toLowerCase()
    .replace('.', '');

  cb(null, allowed.test(ext));
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }
});