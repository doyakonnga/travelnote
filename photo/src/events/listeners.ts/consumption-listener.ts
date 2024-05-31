
import { ConsumptionEvent, Listener, Topics } from "../../common";
import { createConsumption, deleteConsumptionById } from "../../prisma-client";


export class ConsumptionListener extends Listener<ConsumptionEvent> {
  topic = Topics.C as const
  onMessage = async ({ value, offset, commit }: {
    value: ConsumptionEvent['value'];
    offset: string;
    commit: () => Promise<void>
  }) => {
    const { action, consumption: c } = value
    switch( action ){
      case 'created':
        await createConsumption(c)
        break
      case 'modified':
        break
      case 'deleted':
        await deleteConsumptionById(c.id)
        break
      default:
        console.log('wrong action type')
    }
    await commit()
    return console.log(`event consumed: consumption-${action}`)
  }
}