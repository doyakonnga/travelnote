import { Publisher, JourneyEvent, Topics } from "../../common";


export class JourneyPublisher extends Publisher<JourneyEvent> {
  topic = Topics.J
}