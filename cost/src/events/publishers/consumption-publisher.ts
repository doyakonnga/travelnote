import { Publisher, ConsumptionEvent, Topics } from '../../common'

export class ConsumptionPublisher extends Publisher<ConsumptionEvent>{
  topic = Topics.C as const
}