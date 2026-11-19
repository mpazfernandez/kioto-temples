import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function SmoothScroll() {
  const { pathname } = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    const reducirMovimiento = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reducirMovimiento) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.055,
      smoothWheel: true,
      syncTouch: false,
      anchors: true
    });

    lenisRef.current = lenis;

    let animationFrame;

    function raf(time) {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    }

    animationFrame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        immediate: true
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }
  }, [pathname]);

  return null;
}