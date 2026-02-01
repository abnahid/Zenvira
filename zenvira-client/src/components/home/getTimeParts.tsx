"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const THREE_DAYS = 3 * 24 * 60 * 60; // seconds

function getTimeParts(seconds: number) {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return { days, hours, minutes, secs };
}

export default function HotOfferSection() {
  const [timeLeft, setTimeLeft] = useState(THREE_DAYS);

  useEffect(() => {
    // Get or set the start time in localStorage
    const storedStartTime = localStorage.getItem("offerStartTime");
    const now = Math.floor(Date.now() / 1000); // current time in seconds

    let startTime: number;

    if (storedStartTime) {
      startTime = parseInt(storedStartTime, 10);
      const elapsed = now - startTime;
      const remaining = THREE_DAYS - elapsed;

      // If time expired, reset the timer
      if (remaining <= 0) {
        startTime = now;
        localStorage.setItem("offerStartTime", startTime.toString());
        setTimeLeft(THREE_DAYS);
      } else {
        setTimeLeft(remaining);
      }
    } else {
      // First time - store current time
      startTime = now;
      localStorage.setItem("offerStartTime", startTime.toString());
      setTimeLeft(THREE_DAYS);
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer finished - reset with new start time
          const newStart = Math.floor(Date.now() / 1000);
          localStorage.setItem("offerStartTime", newStart.toString());
          return THREE_DAYS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { days, hours, minutes, secs } = getTimeParts(timeLeft);

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* LEFT CONTENT */}
        <div>
          <span className="text-sm text-primary font-semibold">
            Today’s Hot Offer
          </span>

          <h2 className="text-4xl font-bold mt-2 mb-4 leading-tight">
            Free Covid-19 Vaccine <br />
            Campaign Ticket
          </h2>

          <p className="text-gray-600 max-w-md mb-6">
            Cur tantas regiones barbarorum oblit, tot maria transmitt summo bono
            fruittur et voluptate barbarorum.
          </p>

          {/* TIMER */}
          <div className="flex gap-4 mb-6">
            <TimerBox label="Days" value={days} />
            <TimerBox label="Hours" value={hours} />
            <TimerBox label="Minutes" value={minutes} highlight />
            <TimerBox label="Seconds" value={secs} />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <Link href="/shops">
              <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition">
                Shop Now
              </button>
            </Link>

            <button className="text-primary font-medium hover:underline">
              Deal of the Day
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE PLACEHOLDER */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-lg aspect-square  flex items-center justify-center">
            {/* Replace this Image with your real one */}
            <Image
              src="/assets/ilastration.svg"
              alt="Offer Illustration"
              fill
              className="object-contain p-6"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* TIMER BOX COMPONENT */
function TimerBox({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`px-6 py-4 rounded-lg text-center min-w-[90px] transition ${
          highlight
            ? "bg-primary text-white shadow-lg"
            : "bg-white text-gray-900 shadow"
        }`}
      >
        <div
          className={`text-3xl font-bold ${
            highlight ? "text-white" : "text-primary"
          }`}
        >
          {String(value).padStart(2, "0")}
        </div>
      </div>
      <div className="text-lg font-medium text-gray-900">{label}</div>
    </div>
  );
}
