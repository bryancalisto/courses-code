import express, { Response, Request } from 'express';
import { requireAuth } from '@bcticketing/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', requireAuth, async (req: Request, res: Response) => {
  const tickets = await Ticket.find({});

  res.send(tickets);
});

export { router as indexTicketRouter };