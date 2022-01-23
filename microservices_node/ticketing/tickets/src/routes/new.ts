import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@bcticketing/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post('/api/tickets', [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),
], requireAuth, validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    try {
      const newTicket = Ticket.build({
        title,
        price,
        userId: req.currentUser!.id
      });

      await newTicket.save();

      res.status(201).send(newTicket.toJSON());
    } catch (e) {
    }
  });

export { router as createTicketRouter };