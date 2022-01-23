import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@bcticketing/common';

const router = express.Router();

router.post('/api/tickets', [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),
], requireAuth, validateRequest, async (req: Request, res: Response) => {
  return res.sendStatus(200);
});

export { router as createTicketRouter };