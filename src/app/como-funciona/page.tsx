'use client';
import Link from 'next/link';
import { ShoppingCart, Users, Gift, Truck, MapPin, Star, ArrowRight, MessageCircle } from 'lucide-react';

export default function ComoFuncionaPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0E4FAF 0%, #1565C0 40%, #1976D2 100%)',
        color: '#FFFFFF', padding: '60px 16px', textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '16px' }}>
          Comprás, ahorrás y también podés <span style={{ color: '#74C33D' }}>ganar</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#DBEAFE', maxWidth: '600px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          En SuperEnCasa encontrás productos para tu hogar, alimentos, bebidas, limpieza y mucho más. Pero también podés formar parte de algo más grande.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/productos" style={{
            backgroundColor: '#74C33D', color: '#FFF', padding: '14px 28px', borderRadius: '10px',
            fontWeight: '800', textDecoration: 'none', fontSize: '15px', display: 'inline-flex', alignItems: 'center', gap: '8px',
          }}>
            <ShoppingCart size={18} /> VER CATÁLOGO
          </Link>
          <a href="https://wa.me/5491112345678" target="_blank" rel="noopener" style={{
            backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', padding: '14px 28px', borderRadius: '10px',
            fontWeight: '700', textDecoration: 'none', fontSize: '15px', border: '1px solid rgba(255,255,255,0.2)',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
          }}>
            <MessageCircle size={18} /> Contactanos
          </a>
        </div>
      </section>

      {/* Cómo funciona */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', textAlign: 'center', color: '#0F172A', marginBottom: '32px' }}>
          ¿Cómo funciona?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px', marginBottom: '48px' }}>
          {[
            { icon: '📲', title: 'Elegís', desc: 'productos del catálogo' },
            { icon: '🛒', title: 'Hacés', desc: 'tu pedido' },
            { icon: '🏠', title: 'Recibís', desc: 'tu compra' },
            { icon: '⭐', title: 'Acumulás', desc: 'beneficios' },
            { icon: '📣', title: 'Recomendás', desc: 'y generás ingresos' },
          ].map((step, i) => (
            <div key={i} style={{
              backgroundColor: '#FFF', borderRadius: '14px', padding: '24px 16px',
              textAlign: 'center', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>{step.icon}</div>
              <h4 style={{ fontWeight: '700', fontSize: '15px', color: '#1E293B', marginBottom: '4px' }}>{step.title}</h4>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Beneficios */}
      <section style={{ backgroundColor: '#FFF', padding: '48px 16px', borderTop: '1px solid #F1F5F9' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', textAlign: 'center', color: '#0F172A', marginBottom: '32px' }}>
            💰 Tu compra puede darte más
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <BenefitCard icon={<ShoppingCart size={22} color="#0E4FAF" />} title="Comprá desde tu celular" desc="Elegí tus productos desde nuestro catálogo digital. Alimentos, Bebidas, Limpieza, Hogar y mucho más." cta="Ver catálogo" href="/productos" />
            <BenefitCard icon={<Users size={22} color="#74C33D" />} title="¿Querés generar ingresos?" desc="Convertite en Revendedor/a. Compartí nuestro catálogo por WhatsApp, Facebook o Instagram. Vos recomendás, nosotros vendemos." cta="Quiero ser revendedor/a" href="#" />
            <BenefitCard icon={<Gift size={22} color="#F59E0B" />} title="Club SuperEnCasa" desc="Puntos por compras, beneficios por recomendaciones, premios, promociones y ofertas especiales." cta="Conocé el club" href="#" />
          </div>
        </div>
      </section>

      {/* Armá tu equipo */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', textAlign: 'center', color: '#0F172A', marginBottom: '16px' }}>
          👥 Armá tu propio equipo
        </h2>
        <p style={{ textAlign: 'center', color: '#64748B', marginBottom: '32px', fontSize: '15px', lineHeight: 1.6 }}>
          ¿Conocés personas que también quieran generar una oportunidad? Formá tu equipo de recomendadores.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
          {['Mujeres emprendedoras', 'Ingreso extra', 'Jubilados', 'Familias', 'Amigos y vecinos', 'Organizaciones'].map(tag => (
            <span key={tag} style={{
              backgroundColor: '#EFF6FF', color: '#0E4FAF', padding: '6px 14px',
              borderRadius: '20px', fontSize: '12px', fontWeight: '600',
            }}>{tag}</span>
          ))}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link href="#" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#0E4FAF', color: '#FFF', padding: '14px 28px', borderRadius: '10px',
            fontWeight: '700', textDecoration: 'none', fontSize: '15px',
          }}>
            Quiero armar un equipo <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Cobertura */}
      <section style={{ backgroundColor: '#0E4FAF', color: '#FFF', padding: '40px 16px', textAlign: 'center' }}>
        <Truck size={32} color="#74C33D" style={{ marginBottom: '12px' }} />
        <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>📍 Empezamos cerca</h3>
        <p style={{ color: '#93C5FD', fontSize: '15px', marginBottom: '16px' }}>
          Queremos crecer primero junto a nuestras comunidades y después llegar cada vez más lejos.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '14px', fontWeight: '600' }}>
          {['Pigüé', 'Bahía Blanca', 'Viedma', 'Carmen de Patagones'].map(city => (
            <span key={city} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} color="#74C33D" /> {city}
            </span>
          ))}
        </div>
        <p style={{ marginTop: '16px', color: '#60A5FA', fontSize: '13px' }}>Y seguimos creciendo 🚀</p>
      </section>

      {/* CTA Final */}
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 16px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', marginBottom: '20px' }}>
          🚀 ¿Qué querés hacer hoy?
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
          <CTAButton icon="🛒" label="Quiero comprar" href="/productos" />
          <CTAButton icon="💰" label="Quiero recomendar" href="#" />
          <CTAButton icon="👥" label="Quiero armar un equipo" href="#" />
          <CTAButton icon="🤝" label="Quiero ser comercio adherido" href="#" />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#0B3D7A', color: '#93C5FD', padding: '24px 16px', textAlign: 'center', fontSize: '13px' }}>
        <p style={{ margin: '0 0 8px', fontWeight: '700', color: '#FFF', fontSize: '15px' }}>
          Super<span style={{ color: '#74C33D' }}>EnCasa</span>
        </p>
        <p style={{ margin: '0 0 16px' }}>Comprás. Recomendás. Ganás beneficios.</p>
        <a href="https://wa.me/5491112345678" target="_blank" rel="noopener" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          backgroundColor: '#74C33D', color: '#FFF', padding: '10px 20px', borderRadius: '8px',
          fontWeight: '700', textDecoration: 'none', fontSize: '14px',
        }}>
          <MessageCircle size={16} /> Contactanos por WhatsApp
        </a>
      </footer>
    </div>
  );
}

function BenefitCard({ icon, title, desc, cta, href }: { icon: React.ReactNode; title: string; desc: string; cta: string; href: string }) {
  return (
    <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', padding: '24px', border: '1px solid #F1F5F9' }}>
      <div style={{ width: '46px', height: '46px', borderRadius: '12px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
        {icon}
      </div>
      <h4 style={{ fontWeight: '700', fontSize: '16px', color: '#1E293B', marginBottom: '8px' }}>{title}</h4>
      <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, marginBottom: '16px' }}>{desc}</p>
      <Link href={href} style={{
        color: '#0E4FAF', fontWeight: '700', fontSize: '13px', textDecoration: 'none',
        display: 'inline-flex', alignItems: 'center', gap: '4px',
      }}>
        {cta} <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function CTAButton({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <Link href={href} style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '10px',
      padding: '14px 20px', textDecoration: 'none', color: '#1E293B',
      fontWeight: '600', fontSize: '15px', transition: 'all 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#0E4FAF'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
    >
      <span style={{ fontSize: '22px' }}>{icon}</span>
      {label}
      <ArrowRight size={16} style={{ marginLeft: 'auto', color: '#94A3B8' }} />
    </Link>
  );
}
