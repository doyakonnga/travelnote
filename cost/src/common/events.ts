
export enum Topics {
  J = "journey",
  C = "consumption"
}

export interface Event {
  topic: Topics
  value: any
}

export interface JourneyEvent extends Event {
  topic: Topics.J
  value: {
    action: "created" | "modified"
    journey: {
      id: string
      name: string
      subtitle: string | null
      picture: string | null
      members: {
        id: string
      }[]
    }
  }
}

export interface ConsumptionEvent extends Event {
  topic: Topics.C
  value: {
    action: "created" | "modified" | "deleted"
    consumption: {
      id: string
      journeyId: string
    }
  }
}