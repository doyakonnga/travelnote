
import { JourneyEvent, Listener, Topics } from "../../common";
import { createJourney } from "../../prisma-client";

export class JourneyListener extends Listener<JourneyEvent> {
  topic = Topics.J
  onMessage = async ({ value, partition, offset, commit } : {
    value: JourneyEvent["value"]
    partition: number
    offset: string
    commit: () => Promise<void>
  }) => {
    if (value.action === 'created') {
      const journey = await createJourney(value.journey)
      await commit();
      console.log('event consumed: journey-created, id: ', journey.id)
    }
    
  }
}
