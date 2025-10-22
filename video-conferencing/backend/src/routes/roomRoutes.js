import express from 'express';
import {
  createRoom,
  getRoomDetails,
  getChatHistory,
  getMyRooms,
  endRoom,
} from '../controllers/roomController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createRoom);
router.get('/my-rooms', protect, getMyRooms);
router.get('/:roomId', protect, getRoomDetails);
router.get('/:roomId/messages', protect, getChatHistory);
router.put('/:roomId/end', protect, endRoom);

export default router;
