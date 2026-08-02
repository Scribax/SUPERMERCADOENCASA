'use client';
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface Locality {
  id: string;
  name: string;
  isActive: boolean;
}

export default function CityBar() {
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/localities')
      .then(res => res.json())
      .then(data => {
        if (data.localities) {
          const active = data.localities
            .filter((l: Locality) => l.isActive)
            .map((l: Locality) => l.name);
          setCities(active);
        }
      })
      .catch(() => {
        // fallback
        setCities(['Pigué', 'Bahía Blanca', 'Patagones', 'Viedma']);
      });
  }, []);

  if (cities.length === 0) return null;

  return (
    <div style={{ backgroundColor: '#0E4FAF', color: '#FFFFFF', width: '100%', borderTop: '2px solid #74C33D' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', fontSize: '14px', fontWeight: '600' }}>
        <span style={{ color: '#93C5FD', fontWeight: '700' }}>Estamos en:</span>
        {cities.map((city, i) => (
          <span key={city} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {i > 0 && <span style={{ color: '#60A5FA', margin: '0 4px' }}>·</span>}
            <MapPin size={14} style={{ color: '#74C33D' }} />
            <span>{city}</span>
          </span>
        ))}
        <span style={{ marginLeft: '12px', color: '#93C5FD', fontSize: '13px' }}>
          Próximamente más ciudades 🚀
        </span>
      </div>
    </div>
  );
}
