import { Publisher, Subjects, OrderCancelledEvent } from "@bcticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}