
import { Journey } from "@prisma/client";
import { JourneyEvent, Listener, Topics } from "../../common";
import { createJourney, modifyJourney } from "../../prisma-client";

export class JourneyListener extends Listener<JourneyEvent> {
  topic = Topics.J as const
  onMessage = async ({ value, offset, commit } : {
    value: JourneyEvent["value"]
    offset: string
    commit: () => Promise<void>
  }) => {
    const { action, journey: j } = value
    let journey: Journey
    if (action === 'created') 
      journey = await createJourney(j)
    else if ( action === 'modified')
      journey = await modifyJourney(j)
    else throw 'wrong action type'
    
    await commit();
    console.log(`event consumed: journey-${action}, id: ${journey.id}`)
    return
  }
}
