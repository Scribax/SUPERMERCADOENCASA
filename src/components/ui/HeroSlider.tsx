'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
}

interface HeroSliderProps {
  banners: Banner[];
}

export default function HeroSlider({ banners }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  // Auto-play interval
  useEffect(() => {
    if (isHovered || banners.length <= 1) return;
    const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [nextSlide, isHovered, banners.length]);

  if (!banners || banners.length === 0) return null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        height: '480px',
        backgroundColor: '#1F2937',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Slides */}
      {banners.map((banner, idx) => {
        const isActive = idx === currentSlide;
        return (
          <div
            key={banner.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.25)), url(${banner.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              color: 'white',
              opacity: isActive ? 1 : 0,
              visibility: isActive ? 'visible' : 'hidden',
              transition: 'opacity 0.8s ease-in-out, visibility 0.8s ease-in-out',
              zIndex: isActive ? 2 : 1,
            }}
          >
            <div className="container" style={{ padding: '0 40px' }}>
              <div
                style={{
                  maxWidth: '650px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                  opacity: isActive ? 1 : 0,
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
                }}
              >
                {banner.title && (
                  <h1
                    style={{
                      fontSize: '46px',
                      fontWeight: '800',
                      lineHeight: '1.15',
                      textShadow: '0 4px 12px rgba(0,0,0,0.4)',
                      color: 'white',
                      margin: 0,
                    }}
                  >
                    {banner.title}
                  </h1>
                )}
                {banner.subtitle && (
                  <p
                    style={{
                      fontSize: '18px',
                      textShadow: '0 2px 6px rgba(0,0,0,0.4)',
                      color: '#F9FAFB',
                      margin: 0,
                      lineHeight: '1.4',
                    }}
                  >
                    {banner.subtitle}
                  </p>
                )}
                <Link
                  href={banner.linkUrl || '/productos'}
                  style={{
                    backgroundColor: 'var(--success)',
                    color: 'white',
                    padding: '14px 32px',
                    borderRadius: 'var(--radius-md)',
                    alignSelf: 'flex-start',
                    fontWeight: '700',
                    boxShadow: '0 4px 14px rgba(124, 181, 24, 0.4)',
                    transition: 'all 0.2s ease',
                    marginTop: '8px',
                    textDecoration: 'none',
                  }}
                  className="hero-cta-btn"
                >
                  Comprar Ahora
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              top: '50%',
              left: '20px',
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease, background-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.35)')}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              top: '50%',
              right: '20px',
              transform: 'translateY(-50%)',
              zIndex: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease, background-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.35)')}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Indicators */}
      {banners.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            zIndex: 10,
          }}
        >
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: idx === currentSlide ? '24px' : '8px',
                height: '8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: idx === currentSlide ? 'var(--success)' : 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
