import { useEffect, useState } from 'react';
import { TripInfo } from './ChatBox';
import { SuggestionsData } from './SuggestionsPanel';

export function useSuggestions(tripDetail?: TripInfo): SuggestionsData | undefined {
  const [data, setData] = useState<SuggestionsData>();

  useEffect(() => {
    if (!tripDetail) return;
    // Monta dados de sugestão a partir do tripDetail
    const suggestions: SuggestionsData = {
      route: tripDetail.origin && tripDetail.destination ? {
        origin: tripDetail.origin,
        destination: tripDetail.destination,
        mapUrl: `https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY&origin=${encodeURIComponent(tripDetail.origin)}&destination=${encodeURIComponent(tripDetail.destination)}`
      } : undefined,
      hotels: Array.isArray(tripDetail.hotels) ? tripDetail.hotels : undefined,
      itinerary: Array.isArray(tripDetail.itinerary) ? tripDetail.itinerary : undefined,
      // Adicione lógica para aeroportos e preços se vierem no tripDetail
    };
    setData(suggestions);
  }, [tripDetail]);

  return data;
}
