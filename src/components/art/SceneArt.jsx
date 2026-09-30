/**
 * Illustration set for the sample/demo imagery.
 *
 * These are self-contained, dependency-free vector scenes so the app has zero
 * network image dependencies and stays crisp at every size. They represent the
 * demo gallery entries only — real user uploads are rendered from their File.
 */

const SCENES = {
  'dog-park': (
    <>
      <defs>
        <linearGradient id="sky-dog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="55%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
        <linearGradient id="hill-dog" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <radialGradient id="sun-dog" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fff7ed" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="url(#sky-dog)" />
      <circle cx="640" cy="150" r="170" fill="url(#sun-dog)" />
      <circle cx="640" cy="150" r="52" fill="#fef3c7" opacity="0.9" />
      <path d="M0 380 Q180 300 380 372 T800 350 L800 600 L0 600 Z" fill="#15803d" opacity="0.55" />
      <path d="M0 430 Q220 350 430 424 T800 404 L800 600 L0 600 Z" fill="url(#hill-dog)" />
      <g fill="#0b1220">
        <ellipse cx="392" cy="398" rx="104" ry="56" />
        <path d="M470 356 q52 -18 66 -50 q10 -18 -6 -24 q-16 -6 -24 10 q-14 26 -50 38 z" />
        <circle cx="536" cy="286" r="32" />
        <path d="M558 280 q38 -6 46 12 q3 12 -14 14 l-32 3 z" />
        <path d="M524 258 q-20 -8 -22 -34 q26 6 30 30 z" />
        <path d="M296 372 q-58 -8 -74 -52 q-5 -16 9 -18 q12 -2 16 12 q9 27 53 36 z" />
        <path d="M330 444 l-14 62 l26 0 l20 -54 z" />
        <path d="M300 438 l-8 54 l24 0 l14 -46 z" />
        <path d="M452 446 l16 58 l-26 0 l-18 -52 z" />
        <path d="M486 440 l22 48 l-24 4 l-20 -44 z" />
      </g>
      <g stroke="#bbf7d0" strokeWidth="3" strokeLinecap="round" opacity="0.5">
        <path d="M212 486 q18 -10 34 0" />
        <path d="M600 470 q20 -12 38 0" />
        <path d="M660 520 q18 -10 34 0" />
        <path d="M120 540 q18 -10 34 0" />
      </g>
    </>
  ),

  'cat-window': (
    <>
      <defs>
        <linearGradient id="room-cat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0b0a1f" />
        </linearGradient>
        <linearGradient id="light-cat" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ddd6fe" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="win-cat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#room-cat)" />
      <rect x="180" y="70" width="440" height="360" rx="14" fill="url(#win-cat)" />
      <circle cx="540" cy="150" r="42" fill="#f8fafc" opacity="0.85" />
      <g fill="#1e1b4b" opacity="0.85">
        <circle cx="270" cy="150" r="3" />
        <circle cx="330" cy="110" r="2.5" />
        <circle cx="420" cy="190" r="2.5" />
        <circle cx="480" cy="120" r="2" />
        <circle cx="600" cy="230" r="2.5" />
        <circle cx="250" cy="250" r="2" />
      </g>
      <g stroke="#1e1b4b" strokeWidth="14" strokeLinecap="round">
        <path d="M400 70 V430" />
        <path d="M180 250 H620" />
      </g>
      <rect x="160" y="424" width="480" height="22" rx="8" fill="#312e81" />
      <path d="M180 446 L520 446 L760 600 L120 600 Z" fill="url(#light-cat)" />
      <g fill="#08070f">
        <ellipse cx="392" cy="400" rx="86" ry="44" />
        <circle cx="326" cy="352" r="38" />
        <path d="M296 322 q-16 -34 6 -40 q14 -4 20 30 z" />
        <path d="M356 320 q10 -38 30 -32 q14 4 4 36 z" />
        <path d="M470 386 q56 -4 62 -44 q2 -14 -10 -14 q-10 0 -12 12 q-4 30 -42 34 z" />
        <rect x="322" y="428" width="18" height="42" rx="8" />
        <rect x="418" y="428" width="18" height="42" rx="8" />
      </g>
      <g fill="#a78bfa" opacity="0.9">
        <circle cx="316" cy="348" r="5" />
        <circle cx="342" cy="348" r="5" />
      </g>
    </>
  ),

  'beach-sunset': (
    <>
      <defs>
        <linearGradient id="sky-beach" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fcd34d" />
        </linearGradient>
        <linearGradient id="sea-beach" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c4a6e" />
          <stop offset="100%" stopColor="#082f49" />
        </linearGradient>
        <linearGradient id="sand-beach" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#sky-beach)" />
      <circle cx="400" cy="330" r="120" fill="#fff7ed" opacity="0.55" />
      <circle cx="400" cy="330" r="76" fill="#fffbeb" />
      <rect y="350" width="800" height="120" fill="url(#sea-beach)" />
      <g stroke="#fcd34d" strokeWidth="5" opacity="0.45" strokeLinecap="round">
        <path d="M300 372 H500" />
        <path d="M330 400 H470" />
        <path d="M310 428 H490" />
      </g>
      <path d="M0 470 Q200 440 400 468 T800 452 L800 600 L0 600 Z" fill="url(#sand-beach)" />
      <g fill="#7c2d12">
        <path d="M140 470 q10 -170 12 -190 q4 22 14 34 q-16 8 -18 26 z" />
        <path d="M152 280 q-60 -22 -74 6 q44 26 84 6 z" />
        <path d="M156 286 q62 -14 70 14 q-42 20 -80 -2 z" />
        <rect x="144" y="466" width="18" height="60" rx="8" />
      </g>
      <g fill="#3f1d0b">
        <circle cx="470" cy="452" r="17" />
        <path d="M456 470 h28 l10 74 h-48 z" />
        <circle cx="530" cy="462" r="14" />
        <path d="M519 476 h22 l8 62 h-38 z" />
        <circle cx="560" cy="470" r="11" />
        <path d="M551 481 h18 l6 48 h-30 z" />
      </g>
    </>
  ),

  'city-traffic': (
    <>
      <defs>
        <linearGradient id="night-city" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#020617" />
          <stop offset="60%" stopColor="#0b1a3a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="trail2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fb7185" stopOpacity="0" />
          <stop offset="100%" stopColor="#fb7185" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#night-city)" />
      <g fill="#111d38">
        <rect x="20" y="180" width="90" height="330" />
        <rect x="126" y="120" width="70" height="390" />
        <rect x="212" y="220" width="96" height="290" />
        <rect x="324" y="90" width="76" height="420" />
        <rect x="416" y="190" width="104" height="320" />
        <rect x="536" y="140" width="72" height="370" />
        <rect x="624" y="230" width="90" height="280" />
        <rect x="730" y="170" width="60" height="340" />
      </g>
      <g fill="#fcd34d" opacity="0.65">
        {Array.from({ length: 46 }, (_, i) => {
          const x = 34 + (i % 9) * 84
          const y = 200 + Math.floor(i / 9) * 52
          return <rect key={i} x={x} y={y} width="10" height="16" rx="2" opacity={i % 3 ? 1 : 0.35} />
        })}
      </g>
      <rect y="470" width="800" height="130" fill="#0f172a" />
      <g opacity="0.9">
        <rect x="0" y="516" width="420" height="8" rx="4" fill="url(#trail)" />
        <rect x="380" y="556" width="420" height="8" rx="4" fill="url(#trail2)" />
      </g>
      <g fill="#e2e8f0">
        <path d="M470 540 q0 -46 40 -46 h60 q40 0 40 46 v18 h-140 z" />
        <rect x="462" y="540" width="156" height="30" rx="12" />
      </g>
      <g fill="#38bdf8">
        <rect x="476" y="548" width="34" height="12" rx="6" />
      </g>
      <g fill="#fb7185">
        <rect x="576" y="548" width="34" height="12" rx="6" />
      </g>
      <g fill="#0f172a">
        <circle cx="500" cy="574" r="16" />
        <circle cx="586" cy="574" r="16" />
      </g>
    </>
  ),

  'coffee-shop': (
    <>
      <defs>
        <linearGradient id="cafe" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#451a03" />
          <stop offset="100%" stopColor="#1c1207" />
        </linearGradient>
        <linearGradient id="cafe-win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="cup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#cafe)" />
      <rect x="70" y="60" width="250" height="300" rx="12" fill="url(#cafe-win)" opacity="0.85" />
      <g stroke="#451a03" strokeWidth="12">
        <path d="M70 210 H320" />
        <path d="M195 60 V360" />
      </g>
      <g stroke="#fef3c7" strokeWidth="6" strokeLinecap="round" opacity="0.5" fill="none">
        <path d="M420 220 q-22 -34 0 -62 q22 -28 0 -56" />
        <path d="M470 220 q-22 -34 0 -62 q22 -28 0 -56" />
      </g>
      <ellipse cx="500" cy="520" rx="260" ry="46" fill="#78350f" />
      <ellipse cx="500" cy="508" rx="260" ry="46" fill="#92400e" />
      <g>
        <path d="M560 400 h120 l-16 108 h-88 z" fill="url(#cup)" />
        <path d="M680 420 q56 0 56 42 q0 42 -56 42 l-6 -26 q32 0 32 -16 q0 -16 -32 -16 z" fill="#e2e8f0" />
        <ellipse cx="620" cy="400" rx="60" ry="14" fill="#f8fafc" />
        <ellipse cx="620" cy="400" rx="48" ry="10" fill="#78350f" />
      </g>
      <g fill="#2a1a08">
        <path d="M330 300 q60 -46 120 0 l-16 210 h-88 z" />
        <circle cx="390" cy="242" r="52" />
      </g>
      <path d="M330 320 q-70 60 -110 130 l40 22 q40 -70 96 -110 z" fill="#2a1a08" />
    </>
  ),

  'mountain-trail': (
    <>
      <defs>
        <linearGradient id="sky-mt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c4a6e" />
          <stop offset="55%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
        <linearGradient id="mt-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="mt-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="100%" stopColor="#052e16" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#sky-mt)" />
      <circle cx="150" cy="120" r="60" fill="#f0f9ff" opacity="0.6" />
      <path d="M-40 470 L220 210 L420 470 Z" fill="url(#mt-far)" />
      <path d="M220 210 L300 320 L260 300 L180 300 Z" fill="#e0f2fe" opacity="0.9" />
      <path d="M300 470 L560 180 L860 470 Z" fill="url(#mt-near)" />
      <path d="M560 180 L650 300 L600 276 L510 300 Z" fill="#dcfce7" opacity="0.7" />
      <g fill="#052e16">
        <path d="M90 470 l30 -78 l30 78 z" />
        <path d="M140 470 l24 -62 l24 62 z" />
        <path d="M690 470 l34 -88 l34 88 z" />
        <path d="M740 470 l24 -62 l24 62 z" />
      </g>
      <path d="M0 470 Q200 440 420 466 T800 452 L800 600 L0 600 Z" fill="#14532d" />
      <path
        d="M300 600 Q380 520 460 476 Q540 432 620 468"
        stroke="#a16207"
        strokeWidth="34"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />
      <g fill="#0b1220">
        <circle cx="456" cy="404" r="16" />
        <path d="M444 420 h24 l10 56 h-44 z" />
        <path d="M446 476 l-10 34 l16 0 l8 -28 z" />
        <path d="M466 476 l12 32 l-16 2 l-8 -28 z" />
        <rect x="452" y="410" width="7" height="52" rx="3" />
      </g>
    </>
  ),
}

const FALLBACK = SCENES['dog-park']

/**
 * @param {object} props
 * @param {keyof typeof SCENES} [props.variant]
 * @param {string} [props.className]
 * @param {string} [props.title] Accessible label describing the scene.
 */
export default function SceneArt({ variant = 'dog-park', className = '', title }) {
  const scene = SCENES[variant] ?? FALLBACK

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={title ?? 'Sample illustration used in Jarvas Image Captioning AI demo mode'}
      className={className}
    >
      {scene}
    </svg>
  )
}
