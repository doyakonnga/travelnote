import { Publisher, JourneyEvent, Topics } from "@dkprac/common";


export class JourneyPublisher extends Publisher<JourneyEvent> {
  topic = Topics.J
}