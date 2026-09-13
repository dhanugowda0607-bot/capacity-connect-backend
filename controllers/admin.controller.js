const pool = require('../config/database');

async function getPendingUsers(req, res) {
  try {
    const usersResult = await pool.query(
      `SELECT id, name, email, role, status, aadhaar_number, created_at
       FROM users WHERE status = 'pending_verification'
       ORDER BY created_at ASC`
    );
    const users = usersResult.rows;

    for (const user of users) {
      const docsResult = await pool.query(
        `SELECT id, doc_type, file_path, ocr_name, ocr_dob, mismatch_flag
         FROM documents WHERE user_id = $1`,
        [user.id]
      );
      user.documents = docsResult.rows;
    }

    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching pending users' });
  }
}

async function approveUser(req, res) {
  try {
    const result = await pool.query(
      `UPDATE users SET status = 'active' WHERE id = $1
       RETURNING id, name, email, status`,
      [req.params.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while approving user' });
  }
}

async function rejectUser(req, res) {
  try {
    const result = await pool.query(
      `UPDATE users SET status = 'rejected' WHERE id = $1
       RETURNING id, name, email, status`,
      [req.params.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while rejecting user' });
  }
}

async function requestReupload(req, res) {
  try {
    const result = await pool.query(
      `UPDATE users SET status = 'reupload_requested' WHERE id = $1
       RETURNING id, name, email, status`,
      [req.params.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while requesting re-upload' });
  }
}

module.exports = { getPendingUsers, approveUser, rejectUser, requestReupload };
