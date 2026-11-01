export function ArteHero() {
  return <div className="arte-hero" aria-hidden="true">
    <svg viewBox="0 0 600 420" fill="none">
      <defs>
        <linearGradient id="ribbon" x1="140" y1="40" x2="400" y2="340" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff7ecf" /><stop offset=".23" stopColor="#d2e9ff" /><stop offset=".42" stopColor="#45c9f4" /><stop offset=".62" stopColor="#7b40ce" /><stop offset=".82" stopColor="#ff8adc" /><stop offset="1" stopColor="#9fe8ff" />
        </linearGradient>
        <linearGradient id="edge" x1="170" y1="50" x2="400" y2="320" gradientUnits="userSpaceOnUse"><stop stopColor="#fff" /><stop offset=".5" stopColor="#ffd2fa" stopOpacity=".1" /><stop offset="1" stopColor="#fff" stopOpacity=".8" /></linearGradient>
        <radialGradient id="orb"><stop stopColor="#fff0fb" /><stop offset=".23" stopColor="#99dcff" /><stop offset=".47" stopColor="#9064ef" /><stop offset=".72" stopColor="#f0aadf" /><stop offset=".88" stopColor="#4277d1" /><stop offset="1" stopColor="#d1c5ff" /></radialGradient>
        <filter id="shadow"><feDropShadow dx="0" dy="20" stdDeviation="14" floodColor="#130c61" floodOpacity=".35" /></filter>
      </defs>
      <path d="M305 73c12-18 30-16 37 4l68 180c9 24 1 36-24 31l-193-37c-24-5-28-19-13-38L305 73Z" stroke="url(#ribbon)" strokeWidth="49" strokeLinejoin="round" filter="url(#shadow)" />
      <path d="M305 73c12-18 30-16 37 4l68 180c9 24 1 36-24 31l-193-37c-24-5-28-19-13-38L305 73Z" stroke="url(#edge)" strokeWidth="3" />
      <path d="M154 267c18-12 39 8 48 25 31-17 51 3 44 28 26 17 21 50-5 57-3 28-35 39-55 22-24 14-53-3-51-27-32-9-39-36-17-57-8-22 10-45 36-48Z" fill="url(#orb)" filter="url(#shadow)" />
      <path d="M460 255c20-14 43-1 47 21 30-3 44 17 32 40 24 22 14 51-14 52-12 28-39 27-53 10-28 13-52-5-49-29-26-7-30-36-12-51-8-21 11-45 28-40 6-18 12-18 21-3Z" fill="url(#orb)" filter="url(#shadow)" />
      <path d="M144 294c42 5 6 68 47 85M456 279c41 12-3 64 36 79" stroke="url(#edge)" strokeWidth="5" strokeLinecap="round" />
    </svg>
    <span className="selo-hero">IDEIAS EM MOVIMENTO <span>↗</span></span>
  </div>;
}
