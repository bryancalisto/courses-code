import { TicketUpdatedEvent } from "@bcticketing/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from 'mongoose';
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  });

  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'new concert',
    price: 999,
    version: ticket.version + 1,
    userId: "asdf"
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn()
  };

  return { listener, data, message, ticket };
};

it('finds, updates and saves a ticket', async () => {
  const { listener, data, message, ticket } = await setup();

  await listener.onMessage(data, message);

  const foundTicket = await Ticket.findById(ticket.id);

  expect(foundTicket).toBeDefined();
  expect(foundTicket!.title).toEqual(data.title);
  expect(foundTicket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, message } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});
