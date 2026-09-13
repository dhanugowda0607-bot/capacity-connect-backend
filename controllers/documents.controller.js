const pool = require('../config/database');
const { isValidAadhaarChecksum } = require('../utils/verhoeff');
const { extractText, extractNameAndDob } = require('../utils/ocr');

async function uploadDocuments(req, res) {
  try {
    const { email, aadhaarNumber } = req.body;
    const files = req.files || {};

    if (!email || !aadhaarNumber) {
      return res.status(400).json({ error: 'Email and Aadhaar number are required' });
    }

    if (!isValidAadhaarChecksum(aadhaarNumber)) {
      return res.status(400).json({ error: 'Invalid Aadhaar number (checksum failed)' });
    }

    const userResult = await pool.query(
      'SELECT id, role, status FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found — please sign up first' });
    }

    const user = userResult.rows[0];

    const requiredDocs = ['aadhaar', 'marksheet10', 'marksheet12'];
    if (user.role === 'trainer') requiredDocs.push('degree');

    for (const doc of requiredDocs) {
      if (!files[doc] || files[doc].length === 0) {
        return res.status(400).json({ error: `${doc} document is required` });
      }
    }

    await pool.query('UPDATE users SET aadhaar_number = $1 WHERE id = $2', [
      aadhaarNumber,
      user.id,
    ]);

    const docTypeMap = {
      aadhaar: 'aadhaar',
      marksheet10: 'marksheet_10',
      marksheet12: 'marksheet_12',
      degree: 'degree',
      experienceLetter: 'experience_letter',
    };

    const insertedDocs = [];

    for (const field of Object.keys(files)) {
      const docType = docTypeMap[field];
      if (!docType) continue;

      for (const file of files[field]) {
        let ocrName = null;
        let ocrDob = null;

        try {
          const text = await extractText(file.path);
          const extracted = extractNameAndDob(text);
          ocrName = extracted.name;
          ocrDob = extracted.dob;
        } catch (ocrErr) {
          console.error('OCR failed for', file.path, ocrErr.message);
        }

        const docResult = await pool.query(
          `INSERT INTO documents (user_id, doc_type, file_path, ocr_name, ocr_dob)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING id, doc_type, ocr_name, ocr_dob`,
          [user.id, docType, file.path, ocrName, ocrDob]
        );
        insertedDocs.push(docResult.rows[0]);
      }
    }

    const names = insertedDocs.map((d) => d.ocr_name).filter(Boolean)
      .map((n) => n.toLowerCase().replace(/\s+/g, ''));
    const dobs = insertedDocs.map((d) => d.ocr_dob).filter(Boolean);

    const mismatch = new Set(names).size > 1 || new Set(dobs).size > 1;

    if (mismatch) {
      await pool.query('UPDATE documents SET mismatch_flag = TRUE WHERE user_id = $1', [
        user.id,
      ]);
    }

    res.status(201).json({
      message: 'Documents uploaded. Your account is pending admin verification.',
      documents: insertedDocs,
      mismatchFlag: mismatch,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while uploading documents' });
  }
}

module.exports = { uploadDocuments };
