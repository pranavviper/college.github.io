const express = require('express');
const router = express.Router();
const {
    getStats,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleApproval
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.route('/users')
    .get(getAllUsers)
    .post(createUser);
router.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);
router.patch('/users/:id/approve', toggleApproval);

module.exports = router;
