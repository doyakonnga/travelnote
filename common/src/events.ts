
export enum Topics {
  J = "journey",
  C = "consumption",
  P = "photo",
  A = "Album"
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

export interface PhotoEvent extends Event {
  topic: Topics.P
  value: {
    action: "created" | "modified" | "deleted"
    photos: {
      ids: string[]
      albumId: string
      albumName: string
    }
  }
}

export interface AlbumEvent extends Event {
  topic: Topics.A
  value: {
    action: "created" | "modified" | "deleted"
    album: {
      id: string
      name: string
      oldName?: string
    }
  }
}