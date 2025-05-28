"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function VantaWaves() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    let vantaInstance: any;

    async function loadVanta() {
      const THREEjs = await import("three");
      const vanta = await import("vanta/dist/vanta.waves.min");

      if (vantaRef.current && !vantaEffect.current) {
        vantaEffect.current = vanta.default({
          el: vantaRef.current,
          THREE: THREEjs,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xc8e95,
          shininess: 30,
          waveHeight: 15,
          waveSpeed: 1,
          zoom: 1,
        });
      }
    }

    loadVanta();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return <div ref={vantaRef} className="fixed inset-0 -z-10" />;
}
