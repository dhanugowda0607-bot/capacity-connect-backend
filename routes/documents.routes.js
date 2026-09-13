const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const { uploadDocuments } = require('../controllers/documents.controller');

const documentUpload = upload.fields([
  { name: 'aadhaar', maxCount: 1 },
  { name: 'marksheet10', maxCount: 1 },
  { name: 'marksheet12', maxCount: 1 },
  { name: 'degree', maxCount: 1 },
  { name: 'experienceLetter', maxCount: 1 },
]);

router.post('/upload', documentUpload, uploadDocuments);

module.exports = router;
