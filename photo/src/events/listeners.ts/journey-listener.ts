
import { Journey } from "@prisma/client";
import { JourneyEvent, Listener, Topics } from "../../common";
import { createAlbum, createJourney, modifyJourney } from "../../prisma-client";

export class JourneyListener extends Listener<JourneyEvent> {
  topic = Topics.J as const
  onMessage = async ({ value, offset, commit }: {
    value: JourneyEvent["value"]
    offset: string
    commit: () => Promise<void>
  }) => {
    const { action, journey: j } = value
    let journey: Journey
    if (action === 'created') {
      journey = await createJourney(j)
      await createAlbum({
        name: 'unclassified',
        userId: journey.memberIds[0],
        journeyId: journey.id
      })
    }
    else if (action === 'modified')
      journey = await modifyJourney(j)
    else console.log('wrong action type')

    await commit();
    console.log(`event consumed: journey-${action}`)
    return
  }
}

