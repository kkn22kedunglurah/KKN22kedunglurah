"use client";

import { useState, useEffect } from "react";

// Target date: 27 Juni 2026
const TARGET_DATE = new Date("2026-06-27T00:00:00").getTime();

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <div className="glass p-6 md:p-8 rounded-2xl flex flex-wrap justify-center gap-4 md:gap-8 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 w-full text-center mb-2">
        <h3 className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-wider">
          Menuju Pelaksanaan KKN
        </h3>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-card/80 backdrop-blur-sm border border-border rounded-xl text-3xl md:text-4xl font-display font-bold text-foreground shadow-sm">
          {timeLeft.days}
        </div>
        <span className="text-xs md:text-sm font-medium mt-2 text-muted-foreground">HARI</span>
      </div>
      
      <div className="text-3xl font-bold text-muted-foreground/50 self-start mt-4 hidden sm:block">:</div>
      
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-card/80 backdrop-blur-sm border border-border rounded-xl text-3xl md:text-4xl font-display font-bold text-foreground shadow-sm">
          {timeLeft.hours}
        </div>
        <span className="text-xs md:text-sm font-medium mt-2 text-muted-foreground">JAM</span>
      </div>

      <div className="text-3xl font-bold text-muted-foreground/50 self-start mt-4 hidden sm:block">:</div>
      
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-card/80 backdrop-blur-sm border border-border rounded-xl text-3xl md:text-4xl font-display font-bold text-foreground shadow-sm">
          {timeLeft.minutes}
        </div>
        <span className="text-xs md:text-sm font-medium mt-2 text-muted-foreground">MENIT</span>
      </div>

      <div className="text-3xl font-bold text-muted-foreground/50 self-start mt-4 hidden sm:block">:</div>

      <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-card/80 backdrop-blur-sm border border-border rounded-xl text-3xl md:text-4xl font-display font-bold text-primary shadow-sm">
          {timeLeft.seconds}
        </div>
        <span className="text-xs md:text-sm font-medium mt-2 text-primary">DETIK</span>
      </div>
    </div>
  );
}
