'use client';
import Link from 'next/link';
import { ArrowRight, MapPin, ShoppingBag } from 'lucide-react';

const GREEN = '#74C33D';
const BLUE = '#0E4FAF';

export default function ComoFuncionaPage() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ═══ HERO ═══ */}
      <section style={{
        background: 'linear-gradient(170deg, #061840 0%, #0E4FAF 50%, #1565C0 100%)',
        padding: '80px 16px 100px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'radial-gradient(circle at 20% 80%, #74C33D 1px, transparent 1px), radial-gradient(circle at 80% 20%, #FFF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(116,195,61,0.12)', border: '1px solid rgba(116,195,61,0.2)',
            color: '#A3E635', padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
            letterSpacing: '1.5px', marginBottom: '24px',
          }}>
            SUPERENCASA
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: '900', color: '#FFF',
            lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.5px',
          }}>
            No es solo comprar.<br />
            Es <span style={{ color: GREEN }}>ser parte</span>.
          </h1>
          <p style={{ fontSize: '17px', color: '#BFDBFE', lineHeight: 1.7, marginBottom: '36px', maxWidth: '520px', margin: '0 auto 36px' }}>
            Un lugar donde hacer las compras de tu casa puede abrirte una puerta. Para vos, tu familia, tu bolsillo.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/productos" style={{
              background: GREEN, color: '#FFF', padding: '16px 32px', borderRadius: '12px',
              fontWeight: '800', fontSize: '15px', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '10px', letterSpacing: '0.3px',
            }}>
              <ShoppingBag size={18} /> Ver catálogo
            </Link>
            <a href="#como" style={{
              background: 'rgba(255,255,255,0.06)', color: '#FFF', padding: '16px 32px', borderRadius: '12px',
              fontWeight: '700', fontSize: '15px', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.1)',
            }}>
              ¿Cómo funciona? ↓
            </a>
          </div>
        </div>
        {/* Curva inferior */}
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: '40px', background: '#FFF', borderRadius: '40px 40px 0 0' }} />
      </section>

      {/* ═══ LOS 3 CAMINOS ═══ */}
      <section id="como" style={{ padding: '60px 16px 40px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: GREEN, fontWeight: '800', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>Tres caminos, una comunidad</span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginTop: '8px' }}>¿Cómo querés participar?</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Cliente */}
          <div style={{
            background: '#FFF', borderRadius: '24px', padding: '36px 28px', border: '2px solid #F1F5F9',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(14,79,175,0.06), transparent 70%)' }} />
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🛒</div>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: BLUE, marginBottom: '8px' }}>Cliente</h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, marginBottom: '16px' }}>
              Hacé las compras para tu casa desde el celular. Fácil, rápido y con envío a tu puerta.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {['Catálogo 24/7', 'Precios justos', 'Envío a domicilio', 'Beneficios por comprar'].map(t => (
                <span key={t} style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: BLUE, fontWeight: '700' }}>→</span> {t}
                </span>
              ))}
            </div>
            <Link href="/productos" style={{ color: BLUE, fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
              Ir al catálogo <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
            </Link>
          </div>

          {/* Revendedor */}
          <div style={{
            background: 'linear-gradient(160deg, #061840, #0E4FAF)', borderRadius: '24px', padding: '36px 28px',
            color: '#FFF', position: 'relative', overflow: 'hidden', transform: 'scale(1.03)',
            boxShadow: '0 12px 32px rgba(14,79,175,0.2)',
          }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(116,195,61,0.15), transparent 70%)' }} />
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>💰</div>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: GREEN, marginBottom: '8px' }}>Revendedor/a</h3>
            <p style={{ fontSize: '14px', color: '#BFDBFE', lineHeight: 1.7, marginBottom: '16px' }}>
              Compartí el catálogo, recomendá productos y generá ingresos. Sin inversión, sin stock, desde tu casa.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {['Vos recomendás', 'Nosotros vendemos', 'Vos ganás'].map(t => (
                <span key={t} style={{ fontSize: '13px', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: GREEN, fontWeight: '700' }}>→</span> {t}
                </span>
              ))}
            </div>
            <Link href="#" style={{ color: '#FFF', fontWeight: '700', fontSize: '14px', textDecoration: 'none', background: GREEN, padding: '10px 20px', borderRadius: '8px', display: 'inline-block' }}>
              Quiero ser revendedor/a
            </Link>
          </div>

          {/* Equipo */}
          <div style={{
            background: '#FFF', borderRadius: '24px', padding: '36px 28px', border: '2px solid #F1F5F9',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)' }} />
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>👥</div>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#D97706', marginBottom: '8px' }}>Líder de equipo</h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, marginBottom: '16px' }}>
              Armá tu propia red de recomendadores. Para emprendedores, familias y cualquiera con ganas de crecer.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {['Creá tu red', 'Multiplicá resultados', 'Beneficios escalables'].map(t => (
                <span key={t} style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#D97706', fontWeight: '700' }}>→</span> {t}
                </span>
              ))}
            </div>
            <Link href="#" style={{ color: '#D97706', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
              Quiero armar un equipo <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ PASOS ═══ */}
      <section style={{ background: '#F8FAFC', padding: '60px 16px', marginTop: '40px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: BLUE, fontWeight: '800', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>Simple, de verdad</span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', marginTop: '8px', marginBottom: '40px' }}>Así funciona</h2>
        </div>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* Línea vertical */}
          <div style={{ position: 'absolute', left: '23px', top: '40px', bottom: '40px', width: '2px', background: `linear-gradient(to bottom, ${BLUE}, ${GREEN})` }} />
          {[
            { emoji: '📲', title: 'Elegís', desc: 'Navegá el catálogo y elegí lo que necesitás' },
            { emoji: '🛒', title: 'Pedís', desc: 'Completá tus datos y confirmá en segundos' },
            { emoji: '📦', title: 'Preparamos', desc: 'Armamos tu pedido y lo dejamos listo' },
            { emoji: '🏠', title: 'Recibís', desc: 'Entregamos en tu casa, el día que coordinamos' },
            { emoji: '⭐', title: 'Sumás', desc: 'Beneficios por comprar y por recomendar' },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: i < 4 ? '28px' : '0', position: 'relative' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', background: '#FFF',
                border: `3px solid ${i === 0 ? BLUE : i === 4 ? GREEN : '#CBD5E1'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', flexShrink: 0, position: 'relative', zIndex: 1,
              }}>
                {step.emoji}
              </div>
              <div>
                <h4 style={{ fontSize: '17px', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>{step.title}</h4>
                <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CLUB ═══ */}
      <section style={{ background: '#0F172A', color: '#FFF', padding: '64px 16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle, #74C33D 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
          <span style={{ color: GREEN, fontWeight: '800', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>Club SuperEnCasa</span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginTop: '8px', marginBottom: '16px' }}>Comprar tiene recompensa</h2>
          <p style={{ fontSize: '15px', color: '#94A3B8', lineHeight: 1.7, marginBottom: '36px', maxWidth: '450px', margin: '0 auto 36px' }}>
            Puntos, descuentos, promociones especiales. Cuanto más participás, más beneficios.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px', marginBottom: '36px' }}>
            {['Puntos', 'Premios', 'Ofertas', 'Descuentos', 'Sorteos'].map(b => (
              <div key={b} style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '16px 8px',
                border: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', fontWeight: '600',
              }}>{b}</div>
            ))}
          </div>
          <Link href="/productos" style={{
            display: 'inline-block', background: GREEN, color: '#FFF', padding: '14px 32px',
            borderRadius: '10px', fontWeight: '800', fontSize: '15px', textDecoration: 'none',
          }}>
            Empezá a sumar
          </Link>
        </div>
      </section>

      {/* ═══ COBERTURA ═══ */}
      <section style={{ padding: '56px 16px', textAlign: 'center' }}>
        <div style={{ marginBottom: '8px', color: GREEN, fontWeight: '800', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase' }}>Dónde estamos</div>
        <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', marginBottom: '24px' }}>Empezamos acá. Vamos por más.</h3>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
          {['Pigüé', 'Bahía Blanca', 'Viedma', 'Patagones'].map(city => (
            <span key={city} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 18px', borderRadius: '10px', background: '#EFF6FF',
              color: BLUE, fontWeight: '600', fontSize: '14px',
            }}>
              <MapPin size={15} /> {city}
            </span>
          ))}
        </div>
        <p style={{ color: '#94A3B8', fontSize: '13px' }}>🚀 Próximamente más ciudades</p>
      </section>

      {/* ═══ FOOTER ═══ */}
      <div style={{
        background: BLUE, color: '#BFDBFE', padding: '32px 16px', textAlign: 'center',
        fontSize: '14px', lineHeight: 1.8,
      }}>
        <p style={{ margin: 0, fontWeight: '800', color: '#FFF', fontSize: '16px' }}>
          Super<span style={{ color: GREEN }}>EnCasa</span>
        </p>
        <p style={{ margin: '4px 0 16px' }}>Comprás para vos. Ganás recomendando.</p>
        <a href="https://wa.me/5491112345678" target="_blank" rel="noopener" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: GREEN, color: '#FFF', padding: '10px 22px', borderRadius: '8px',
          fontWeight: '700', textDecoration: 'none', fontSize: '13px',
        }}>
          💬 Escribinos por WhatsApp
        </a>
      </div>
    </div>
  );
}
