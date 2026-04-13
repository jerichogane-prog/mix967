"use client";

import { useEffect, useState } from "react";

/* Elko, NV coordinates */
const LAT = 40.8324;
const LON = -115.7631;

interface WeatherData {
  temp: number;
  high: number;
  low: number;
  description: string;
  icon: string;
}

/**
 * Sidebar weather widget — fetches from Open-Meteo (free, no API key).
 */
export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles&forecast_days=1`;

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        const code = d.current?.weather_code ?? 0;
        setWeather({
          temp: Math.round(d.current?.temperature_2m ?? 0),
          high: Math.round(d.daily?.temperature_2m_max?.[0] ?? 0),
          low: Math.round(d.daily?.temperature_2m_min?.[0] ?? 0),
          description: weatherDescription(code),
          icon: weatherEmoji(code),
        });
      })
      .catch(() => {});
  }, []);

  if (!weather) return null;

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
    >
      <div
        className="border-b px-4 py-3"
        style={{ borderColor: "oklch(0% 0 0 / 0.06)" }}
      >
        <h3 className="font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wide">
          Elko Weather
        </h3>
      </div>

      <div
        className="flex items-center gap-4 px-4 py-4"
        style={{ background: "var(--color-surface-raised)" }}
      >
        {/* Icon + temp */}
        <div className="flex items-center gap-2">
          <span className="text-3xl">{weather.icon}</span>
          <span
            className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight"
          >
            {weather.temp}&deg;
          </span>
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{weather.description}</p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            H: {weather.high}&deg; &middot; L: {weather.low}&deg;
          </p>
          <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
            Elko, NV
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact header weather badge — shows temp + icon inline.
 */
export function HeaderWeatherBadge() {
  const [weather, setWeather] = useState<{ temp: number; icon: string } | null>(
    null
  );

  useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America%2FLos_Angeles`;

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        const code = d.current?.weather_code ?? 0;
        setWeather({
          temp: Math.round(d.current?.temperature_2m ?? 0),
          icon: weatherEmoji(code),
        });
      })
      .catch(() => {});
  }, []);

  if (!weather) return null;

  return (
    <div
      className="hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium lg:flex"
      style={{ borderColor: "oklch(0% 0 0 / 0.1)", color: "var(--color-text-secondary)" }}
    >
      <span>{weather.icon}</span>
      <span className="font-semibold">{weather.temp}&deg;F</span>
      <span style={{ color: "var(--color-text-muted)" }}>Elko</span>
    </div>
  );
}

/* ---------- WMO weather code → description + emoji ---------- */

function weatherDescription(code: number): string {
  if (code === 0) return "Clear sky";
  if (code <= 3) return "Partly cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rain";
  if (code <= 79) return "Snow";
  if (code <= 84) return "Rain showers";
  if (code <= 86) return "Snow showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

function weatherEmoji(code: number): string {
  if (code === 0) return "\u2600\uFE0F";        // sunny
  if (code <= 2) return "\u26C5";                // partly cloudy
  if (code === 3) return "\u2601\uFE0F";         // cloudy
  if (code <= 49) return "\uD83C\uDF2B\uFE0F";   // fog
  if (code <= 59) return "\uD83C\uDF26\uFE0F";   // drizzle
  if (code <= 69) return "\uD83C\uDF27\uFE0F";   // rain
  if (code <= 79) return "\uD83C\uDF28\uFE0F";   // snow
  if (code <= 84) return "\uD83C\uDF26\uFE0F";   // rain showers
  if (code <= 86) return "\u2744\uFE0F";          // snow showers
  if (code <= 99) return "\u26C8\uFE0F";          // thunderstorm
  return "\uD83C\uDF24\uFE0F";
}
