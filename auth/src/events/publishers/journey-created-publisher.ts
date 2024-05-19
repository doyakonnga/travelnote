import { Publisher, JourneyCreatedEvent, Topics } from "../../common";


export class JourneyCreatedPublisher extends Publisher<JourneyCreatedEvent> {
  topic = Topics.JourneyCreated as const
}