'use client';
import { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface Locality {
  id: string;
  name: string;
  isActive: boolean;
}

export default function LocationSelector() {
  const [open, setOpen] = useState(false);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [selected, setSelected] = useState('Pigué');
  const ref = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button
        whileHover={{ backgroundColor: '#F1F5F9' }}
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF',
          padding: '8px 12px', borderRadius: '9999px', fontSize: '14px',
          fontWeight: '500', color: '#334155',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', cursor: 'pointer',
        }}
      >
        <MapPin size={16} color="#0E4FAF" />
        <span>Enviar a: {selected}</span>
        <ChevronDown size={14} color="#64748B" />
      </motion.button>

      {open && localities.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: '4px',
          backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, minWidth: '180px',
          overflow: 'hidden',
        }}>
          {localities.map(loc => (
            <button
              key={loc.id}
              onClick={() => { setSelected(loc.name); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                padding: '10px 16px', border: 'none', background: loc.name === selected ? '#EFF6FF' : '#FFF',
                color: loc.name === selected ? '#0E4FAF' : '#334155',
                fontSize: '13px', fontWeight: loc.name === selected ? '600' : '400',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <MapPin size={14} color="#0E4FAF" />
              {loc.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
