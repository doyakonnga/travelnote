
export enum Topics {
  JourneyCreated = "journey-created"

}

export interface Event {
  topic: Topics
  value: any
}

export interface JourneyCreatedEvent extends Event {
  topic: Topics.JourneyCreated
  value: {
    
  }
}