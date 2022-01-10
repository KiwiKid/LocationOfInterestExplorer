
type LocationOverride = {
    eventName?: string  // Indirect Override (preferred)
    eventId?: string  // Direct Override
    city?: string // Last resort
    lat: string
    lng: string
  }