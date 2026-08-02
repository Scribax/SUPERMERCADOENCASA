'use client';
import { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

interface Locality {
  id: string;
  name: string;
  isActive: boolean;
}

export default function LocationSelector() {
  const [open, setOpen] = useState(false);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [selected, setSelected] = useState('Pigué');

  useEffect(() => {
    fetch('/api/localities')
      .then(r => r.json())
      .then(d => {
        if (d.localities) {
          const active = d.localities.filter((l: Locality) => l.isActive);
          setLocalities(active);
          if (active.length > 0) setSelected(active[0].name);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF',
          padding: '8px 12px', borderRadius: '9999px', fontSize: '14px',
          fontWeight: '500', color: '#334155',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <MapPin size={16} color="#0E4FAF" />
        <span>Enviar a: {selected}</span>
        <ChevronDown size={14} color="#64748B" />
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: '4px',
          backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)', zIndex: 99999, minWidth: '180px',
        }}>
          {localities.length > 0 ? localities.map(loc => (
            <div
              key={loc.id}
              onClick={() => { setSelected(loc.name); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 16px',
                background: loc.name === selected ? '#EFF6FF' : '#FFF',
                color: loc.name === selected ? '#0E4FAF' : '#334155',
                fontSize: '13px', fontWeight: loc.name === selected ? '600' : '400',
                cursor: 'pointer',
              }}
            >
              <MapPin size={14} color="#0E4FAF" />
              {loc.name}
            </div>
          )) : (
            <div style={{ padding: '10px 16px', fontSize: '12px', color: '#94A3B8' }}>Cargando...</div>
          )}
          <div
            onClick={() => setOpen(false)}
            style={{
              padding: '8px 16px', borderTop: '1px solid #F1F5F9',
              fontSize: '12px', color: '#94A3B8', cursor: 'pointer', textAlign: 'center',
            }}
          >
            Cerrar
          </div>
        </div>
      )}
    </div>
  );
}
