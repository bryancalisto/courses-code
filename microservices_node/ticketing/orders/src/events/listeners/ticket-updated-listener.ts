import { Message } from 'node-nats-streaming'
import { Listener, Subjects, TicketUpdatedEvent } from "@bcticketing/common";
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      console.error(`Ticket with ID(${data.id}) not found: `);
      return;
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }

}
