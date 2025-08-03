"use client";

import { useState, useEffect, useRef } from "react";
import Page1 from "../components/Landing/landing1";
import Page2 from "../components/Landing/landing2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [animationDone, setAnimationDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Animasyon bittiğinde state'i güncelle
    const onAnimationEnd = () => {
      setAnimationDone(true);
    };

    el.addEventListener("animationend", onAnimationEnd);
    return () => {
      el.removeEventListener("animationend", onAnimationEnd);
    };
  }, []);

  return (
    <div className="">
      <Navbar />
      <div
        ref={containerRef}
        className={animationDone ? "" : "animate-hero-fade-in"}
      >
        <Page1 />
        <div id="features" className="animate-slide-in-up delay-400">
          <Page2 />
        </div>
      </div>
      <Footer />
    </div>
  );
}
