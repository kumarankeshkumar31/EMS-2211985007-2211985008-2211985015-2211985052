import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { addLeave,getLeave,getLeaveDetail,getLeaves,updateLeave,adminAddLeave } from '../controllers/leaveController.js';


const router = express.Router();

router.post('/add',authMiddleware,addLeave);
router.get('/detail/:id',authMiddleware,getLeaveDetail);
router.get('/:id/:role',authMiddleware,getLeave);
router.get('/',authMiddleware,getLeaves);
router.put('/:id',authMiddleware,updateLeave);
router.post("/:id/admin",authMiddleware, adminAddLeave);
export default router;