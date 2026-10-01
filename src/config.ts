// Values come from the root .env (template in setup/env.template)

export const GoogleMapsApiKey: string = import.meta.env.MAPS_API_KEY ?? '';

// Advanced Markers need a map ID; DEMO_MAP_ID is Google's ID for development
export const GoogleMapId: string = import.meta.env.MAPS_MAP_ID || 'DEMO_MAP_ID';
