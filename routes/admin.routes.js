const express = require('express');
const router = express.Router();

const {
  getPendingUsers,
  approveUser,
  rejectUser,
  requestReupload,
} = require('../controllers/admin.controller');

const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/pending-users', verifyToken, requireRole('admin'), getPendingUsers);
router.put('/users/:userId/approve', verifyToken, requireRole('admin'), approveUser);
router.put('/users/:userId/reject', verifyToken, requireRole('admin'), rejectUser);
router.put('/users/:userId/request-reupload', verifyToken, requireRole('admin'), requestReupload);

module.exports = router;
