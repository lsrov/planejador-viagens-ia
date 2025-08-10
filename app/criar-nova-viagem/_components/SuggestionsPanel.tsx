import React from 'react';

export type SuggestionsData = {
  route?: { origin: string; destination: string; mapUrl?: string };
  airports?: Array<{ name: string; code: string; city: string }>;
  hotels?: Array<{ name: string; price: string; url?: string }>;
  prices?: { flight?: string; hotel?: string; total?: string };
  itinerary?: Array<{ day: string; activities: string[] }>;
};

interface SuggestionsPanelProps {
  data?: SuggestionsData;
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ data }) => {
  if (!data) return <div className="text-gray-400">Nenhuma sugestão disponível.</div>;

  return (
    <div className="space-y-6">
      {/* Rota/mapa */}
      {data.route && (
        <div>
          <h3 className="font-bold mb-2">Rota sugerida</h3>
          <p>De: {data.route.origin} para {data.route.destination}</p>
          {data.route.mapUrl && (
            <iframe
              src={data.route.mapUrl}
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>
      )}
      {/* Aeroportos */}
      {data.airports && data.airports.length > 0 && (
        <div>
          <h3 className="font-bold mb-2">Aeroportos próximos</h3>
          <ul className="list-disc ml-4">
            {data.airports.map((a, i) => (
              <li key={i}>{a.name} ({a.code}) - {a.city}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Hotéis */}
      {data.hotels && data.hotels.length > 0 && (
        <div>
          <h3 className="font-bold mb-2">Hotéis sugeridos</h3>
          <ul className="list-disc ml-4">
            {data.hotels.map((h, i) => (
              <li key={i}>
                {h.url ? <a href={h.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{h.name}</a> : h.name}
                {h.price && ` - ${h.price}`}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Preços */}
      {data.prices && (
        <div>
          <h3 className="font-bold mb-2">Preços estimados</h3>
          <ul className="list-disc ml-4">
            {data.prices.flight && <li>Voo: {data.prices.flight}</li>}
            {data.prices.hotel && <li>Hotel: {data.prices.hotel}</li>}
            {data.prices.total && <li>Total: {data.prices.total}</li>}
          </ul>
        </div>
      )}
      {/* Itinerário */}
      {data.itinerary && data.itinerary.length > 0 && (
        <div>
          <h3 className="font-bold mb-2">Itinerário sugerido</h3>
          <ul className="list-disc ml-4">
            {data.itinerary.map((it, i) => (
              <li key={i}><strong>{it.day}:</strong> {it.activities.join(', ')}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SuggestionsPanel;
