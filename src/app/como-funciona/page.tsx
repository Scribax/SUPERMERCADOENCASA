'use client';
import Link from 'next/link';
import { ShoppingCart, Users, Gift, Truck, MapPin, Star, ArrowRight, MessageCircle, Sparkles, Target, TrendingUp, Heart, Shield } from 'lucide-react';

export default function ComoFuncionaPage() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* HERO */}
      <section style={{
        background: 'linear-gradient(160deg, #061840 0%, #0E4FAF 40%, #1565C0 100%)',
        color: '#FFF', padding: '100px 16px 80px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-120px', right: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(116,195,61,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(116,195,61,0.15)', border: '1px solid rgba(116,195,61,0.25)', padding: '6px 16px', borderRadius: '20px', marginBottom: '24px', fontSize: '13px', fontWeight: '600', color: '#A3E635' }}>
            <Sparkles size={14} /> NUEVA FORMA DE COMPRAR
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '900', lineHeight: 1.1, marginBottom: '20px' }}>
            Comprás, ahorrás<br />y también podés <span style={{ color: '#74C33D' }}>ganar</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#BFDBFE', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            Encontrá productos para tu hogar, alimentos, bebidas y mucho más. Pero SuperEnCasa es mucho más que comprar.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/productos" style={{
              background: 'linear-gradient(135deg, #74C33D, #65B030)', color: '#FFF', padding: '16px 32px',
              borderRadius: '12px', fontWeight: '800', fontSize: '16px', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              boxShadow: '0 8px 24px rgba(116,195,61,0.35)',
            }}>
              <ShoppingCart size={20} /> Ver catálogo
            </Link>
            <Link href="/productos" style={{
              backgroundColor: 'rgba(255,255,255,0.08)', color: '#FFF', padding: '16px 32px',
              borderRadius: '12px', fontWeight: '700', fontSize: '16px', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.15)', display: 'inline-flex', alignItems: 'center', gap: '10px',
            }}>
              Cómo funciona <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3 PILARES */}
      <section style={{ padding: '80px 16px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#0E4FAF', textTransform: 'uppercase', letterSpacing: '1px' }}>Tres maneras de participar</span>
          <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#0F172A', marginTop: '8px' }}>
            Comprar, recomendar y crecer
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <PilarCard
            icon={<ShoppingCart size={28} />}
            color="#0E4FAF"
            emoji="🛒"
            title="Comprá"
            subtitle="Para tu hogar"
            items={['Catálogo digital 24/7', 'Alimentos, bebidas, limpieza', 'Recibí en tu domicilio', 'Precios competitivos']}
          />
          <PilarCard
            icon={<Users size={28} />}
            color="#74C33D"
            emoji="💰"
            title="Recomendá"
            subtitle="Y generá ingresos"
            items={['Compartí por WhatsApp y redes', 'Vos recomendás, nosotros vendemos', 'Obtené beneficios', 'Sin inversión inicial']}
          />
          <PilarCard
            icon={<TrendingUp size={28} />}
            color="#F59E0B"
            emoji="👥"
            title="Creé tu equipo"
            subtitle="Y multiplicá"
            items={['Armá tu red de recomendadores', 'Para emprendedores y familias', 'Creé comunidad', 'Beneficios escalables']}
          />
        </div>
      </section>

      {/* CÓMO FUNCIONA - STEPS */}
      <section style={{ backgroundColor: '#F8FAFC', padding: '80px 16px', borderTop: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#0E4FAF', textTransform: 'uppercase', letterSpacing: '1px' }}>Simple y rápido</span>
            <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#0F172A', marginTop: '8px' }}>¿Cómo funciona?</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { step: '01', icon: '📲', title: 'Elegís tus productos', desc: 'Navegá nuestro catálogo digital y seleccioná lo que necesitás para tu hogar.' },
              { step: '02', icon: '🛒', title: 'Hacés tu pedido', desc: 'Completá tus datos, elegí el método de pago y confirmá la compra en segundos.' },
              { step: '03', icon: '📦', title: 'Preparamos tu envío', desc: 'Armamos tu pedido con los productos seleccionados y lo dejamos listo para despachar.' },
              { step: '04', icon: '🚚', title: 'Recibís en tu casa', desc: 'Entregamos tu compra en el día y horario coordinado. ¡Sin vueltas!' },
              { step: '05', icon: '⭐', title: 'Acumulás beneficios', desc: 'Cada compra suma. Cuanto más participás, más beneficios obtenés.' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '24px 0', borderBottom: i < 4 ? '1px solid #F1F5F9' : 'none' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0E4FAF, #1565C0)',
                  color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: '800', flexShrink: 0,
                }}>
                  {s.step}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '17px', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>{s.icon} {s.title}</h4>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVENDEDORES */}
      <section style={{ padding: '80px 16px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#74C33D', textTransform: 'uppercase', letterSpacing: '1px' }}>Oportunidad</span>
            <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#0F172A', marginTop: '8px', marginBottom: '16px' }}>
              ¿Querés generar ingresos recomendando?
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7, marginBottom: '24px' }}>
              Convertite en Revendedor/a SuperEnCasa. No necesitás local ni inversión. 
              Compartí nuestro catálogo por WhatsApp, Facebook o Instagram.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {['Vos recomendás', 'SuperEnCasa vende', 'Vos obtenés beneficios'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155', fontWeight: '600' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={12} color="#74C33D" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
            <Link href="#" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #74C33D, #65B030)', color: '#FFF',
              padding: '14px 28px', borderRadius: '10px', fontWeight: '700', textDecoration: 'none',
              fontSize: '15px', boxShadow: '0 4px 14px rgba(116,195,61,0.3)',
            }}>
              Quiero ser revendedor/a <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ backgroundColor: '#FFF', borderRadius: '20px', padding: '32px', border: '1px solid #F1F5F9', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>Pensado para:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { icon: '👩', label: 'Mujeres emprendedoras' },
                { icon: '💼', label: 'Ingreso extra' },
                { icon: '👴', label: 'Jubilados' },
                { icon: '👨‍👩‍👧', label: 'Familias' },
                { icon: '🤝', label: 'Amigos y vecinos' },
                { icon: '🏘️', label: 'Organizaciones' },
                { icon: '📱', label: 'Sin inversión' },
                { icon: '🏠', label: 'Desde tu casa' },
              ].map((tag, i) => (
                <span key={i} style={{
                  backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '10px',
                  padding: '10px 14px', fontSize: '13px', fontWeight: '500', color: '#334155',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}>
                  {tag.icon} {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLUB */}
      <section style={{ backgroundColor: '#0F172A', color: '#FFF', padding: '80px 16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <Gift size={40} color="#74C33D" style={{ marginBottom: '20px' }} />
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#74C33D', textTransform: 'uppercase', letterSpacing: '1px' }}>Beneficios</span>
          <h2 style={{ fontSize: '30px', fontWeight: '800', marginTop: '8px', marginBottom: '16px' }}>Club SuperEnCasa</h2>
          <p style={{ fontSize: '16px', color: '#94A3B8', maxWidth: '550px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Comprar y recomendar también tiene recompensa. Cuanto más participás, más oportunidades tenés.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {[
              { icon: '⭐', title: 'Puntos', desc: 'por compras' },
              { icon: '🎁', title: 'Premios', desc: 'y promociones' },
              { icon: '🏷️', title: 'Ofertas', desc: 'especiales' },
              { icon: '🤝', title: 'Comercios', desc: 'adheridos' },
              { icon: '📈', title: 'Beneficios', desc: 'escalables' },
            ].map((item, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '24px 16px',
                border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '700' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <Link href="#" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#FFF', color: '#0F172A', padding: '14px 28px', borderRadius: '10px',
            fontWeight: '700', textDecoration: 'none', fontSize: '15px',
          }}>
            Conocé el club <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* COBERTURA */}
      <section style={{ padding: '64px 16px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <Truck size={36} color="#0E4FAF" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>📍 Empezamos cerca, soñamos lejos</h3>
        <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '500px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          Nacemos con mirada local. Queremos crecer primero junto a nuestras comunidades.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
          {['Pigüé', 'Bahía Blanca', 'Viedma', 'Patagones'].map(city => (
            <div key={city} style={{
              backgroundColor: '#EFF6FF', borderRadius: '12px', padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '600', color: '#0E4FAF',
            }}>
              <MapPin size={16} /> {city}
            </div>
          ))}
        </div>
        <p style={{ color: '#94A3B8', fontSize: '14px', fontWeight: '500' }}>🚀 Y seguimos creciendo</p>
      </section>

      {/* CTA FINAL */}
      <section style={{ backgroundColor: '#F8FAFC', padding: '64px 16px', borderTop: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', marginBottom: '32px' }}>
            ¿Qué querés hacer hoy?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '14px' }}>
            {[
              { icon: '🛒', label: 'Quiero comprar', desc: 'Ver catálogo de productos', href: '/productos', primary: true },
              { icon: '💰', label: 'Quiero recomendar', desc: 'Ser revendedor/a', href: '#', primary: false },
              { icon: '👥', label: 'Quiero armar un equipo', desc: 'Crear mi red', href: '#', primary: false },
              { icon: '🤝', label: 'Quiero ser comercio adherido', desc: 'Sumar mi negocio', href: '#', primary: false },
            ].map((cta, i) => (
              <Link key={i} href={cta.href} style={{
                backgroundColor: cta.primary ? '#0E4FAF' : '#FFF',
                color: cta.primary ? '#FFF' : '#1E293B',
                border: cta.primary ? 'none' : '1px solid #E2E8F0',
                borderRadius: '14px', padding: '20px', textDecoration: 'none',
                textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px',
                transition: 'all 0.2s', boxShadow: cta.primary ? '0 4px 14px rgba(14,79,175,0.25)' : '0 1px 3px rgba(0,0,0,0.04)',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <span style={{ fontSize: '28px' }}>{cta.icon}</span>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>{cta.label}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '2px' }}>{cta.desc}</div>
                </div>
                <ArrowRight size={16} style={{ marginLeft: 'auto', opacity: 0.5 }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0B3D7A', color: '#BFDBFE', padding: '40px 16px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 4px', fontWeight: '900', color: '#FFF', fontSize: '20px' }}>
          Super<span style={{ color: '#74C33D' }}>EnCasa</span>
        </p>
        <p style={{ margin: '0 0 20px', fontSize: '14px' }}>Comprás. Recomendás. Ganás beneficios.</p>
        <a href="https://wa.me/5491112345678" target="_blank" rel="noopener" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          backgroundColor: '#74C33D', color: '#FFF', padding: '12px 24px', borderRadius: '10px',
          fontWeight: '700', textDecoration: 'none', fontSize: '14px',
        }}>
          <MessageCircle size={18} /> Contactanos por WhatsApp
        </a>
      </footer>
    </div>
  );
}

function PilarCard({ icon, color, emoji, title, subtitle, items }: {
  icon: React.ReactNode; color: string; emoji: string; title: string; subtitle: string; items: string[];
}) {
  return (
    <div style={{
      backgroundColor: '#FFF', borderRadius: '20px', padding: '32px 28px',
      border: '1px solid #F1F5F9', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      transition: 'all 0.3s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)'; }}
    >
      <div style={{ fontSize: '36px', marginBottom: '16px' }}>{emoji}</div>
      <h3 style={{ fontSize: '20px', fontWeight: '800', color, marginBottom: '2px' }}>{title}</h3>
      <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px' }}>{subtitle}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#475569' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
