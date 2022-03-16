import { Publisher, OrderCreatedEvent, Subjects } from "@bcticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}