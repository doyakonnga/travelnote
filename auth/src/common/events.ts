
export enum Topics {
  J = "journey"

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