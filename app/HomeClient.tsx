"use client";
import Page1 from "../components/Landing/landing1";
import Page2 from "../components/Landing/landing2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomeClient() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background behind everything, including under navbar */}
      <div
        className="fixed inset-0 z-0 bg-[#0a0a0a] pointer-events-none"
        aria-hidden="true"
      />
      <Navbar />
      <div className="pt-16 relative z-10">
        <div className="animate-hero-fade-in">
          <Page1 />
        </div>
        <div id="features" className="animate-slide-in-up delay-400">
          <Page2 />
        </div>
      </div>
      <Footer />
      {/* Minimal floating particles script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
        (function(){
          const c=document.getElementById('landing-bg-particles');
          if(!c) return;
          let dots=[];
          const n=18, w=window.innerWidth, h=window.innerHeight;
          for(let i=0;i<n;i++){
            const d=document.createElement('div');
            d.style.position='absolute';
            d.style.left=Math.random()*100+'vw';
            d.style.top=Math.random()*100+'vh';
            d.style.width=d.style.height=(Math.random()*8+6)+'px';
            d.style.borderRadius='50%';
            d.style.background='rgba(254,235,216,0.10)';
            d.style.boxShadow='0 0 16px 4px rgba(138,111,227,0.10)';
            d.style.opacity=0.18+Math.random()*0.18;
            d.style.transition='opacity 0.7s';
            c.appendChild(d);
            dots.push({el:d, x:parseFloat(d.style.left), y:parseFloat(d.style.top), r:Math.random()*2+0.5, t:Math.random()*360});
          }
          function animate(){
            for(let i=0;i<dots.length;i++){
              const dot=dots[i];
              dot.t+=0.003+dot.r*0.002;
              dot.x+=Math.sin(dot.t)*0.04*dot.r;
              dot.y+=Math.cos(dot.t)*0.03*dot.r;
              dot.el.style.left=dot.x+'vw';
              dot.el.style.top=dot.y+'vh';
            }
            requestAnimationFrame(animate);
          }
          animate();
        })();
      `,
        }}
      />
      {/* Custom Animations (global) + Alpha Button Glass Styles */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.9;
          }
        }
        .animate-pulse-slower {
          animation: pulse-slower 10s ease-in-out infinite;
        }
        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.08);
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        /* Hero Section Animations (from /alpha) */
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 1.2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.2s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(80px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in-up {
          animation: slide-in-up 1.3s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-hero-fade-in {
          opacity: 0;
          transform: translateY(40px);
          animation: hero-fade-in 1.1s cubic-bezier(0.77, 0, 0.18, 1) forwards;
        }
        .animate-hero-fade-in.delay-200 {
          animation-delay: 0.2s;
        }
        .animate-hero-fade-in.delay-400 {
          animation-delay: 0.4s;
        }
        @keyframes hero-fade-in {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-orb1 {
          animation: orb1 7s cubic-bezier(0.77, 0, 0.18, 1) infinite alternate;
        }
        .animate-orb2 {
          animation: orb2 9s cubic-bezier(0.77, 0, 0.18, 1) infinite alternate;
        }
        .animate-orb3 {
          animation: orb3 8s cubic-bezier(0.77, 0, 0.18, 1) infinite alternate;
        }
        @keyframes orb1 {
          0% {
            transform: translateY(0) scale(1);
            filter: blur(16px);
          }
          100% {
            transform: translateY(-30px) scale(1.08);
            filter: blur(24px);
          }
        }
        @keyframes orb2 {
          0% {
            transform: translateY(0) scale(1);
            filter: blur(18px);
          }
          100% {
            transform: translateY(40px) scale(1.12);
            filter: blur(28px);
          }
        }
        @keyframes orb3 {
          0% {
            transform: translateY(0) scale(1);
            filter: blur(12px);
          }
          100% {
            transform: translateY(-20px) scale(1.15);
            filter: blur(20px);
          }
        }
      `}</style>
    </div>
  );
}
