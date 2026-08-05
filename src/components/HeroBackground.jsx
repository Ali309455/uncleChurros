'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'

function pseudoRand(seed) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

function subscribeReduced(callback) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getReducedSSR() {
  return false
}

export default function HeroBackground() {
  const canvasRef = useRef(null)
  const starsRef = useRef([])
  const sparklesRef = useRef([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef(0)
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getReducedSSR)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      initStars()
    }

    const initStars = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      starsRef.current = Array.from({ length: 110 }, (_, i) => {
        const r = (s) => pseudoRand(i * 17.3 + s)
        const x = r(1) * W
        const y = r(2) * H * 0.82
        const sz = r(3) > 0.8 ? 2.8 : r(3) > 0.55 ? 1.8 : 1.1
        return {
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          size: sz,
          opacity: 0.3 + r(4) * 0.65,
          isGold: i % 9 === 0,
          twinkleSpeed: 0.0008 + r(5) * 0.0015,
          twinkleOffset: r(6) * Math.PI * 2,
        }
      })
    }

    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const onClick = (e) => {
      if (reduced) return
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const hues = [0, 35, 55, 160, 210, 270]
      for (let i = 0; i < 18; i++) {
        const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.4
        const speed = 1.5 + Math.random() * 3.5
        sparklesRef.current.push({
          x: mx,
          y: my,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          life: 1,
          maxLife: 0.6 + Math.random() * 0.8,
          size: 1.2 + Math.random() * 2.2,
          hue: hues[Math.floor(Math.random() * hues.length)],
        })
      }
    }

    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('click', onClick)
    canvas.addEventListener('mouseleave', onMouseLeave)

    const tick = (time) => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // — Draw stars —
      for (const s of starsRef.current) {
        if (!reduced) {
          const dx = s.x - mx
          const dy = s.y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          const repulse = 100

          if (dist < repulse && dist > 0.5) {
            const force = ((repulse - dist) / repulse) ** 2 * 4
            s.vx += (dx / dist) * force
            s.vy += (dy / dist) * force
          }

          // Spring back
          s.vx += (s.baseX - s.x) * 0.06
          s.vy += (s.baseY - s.y) * 0.06
          s.vx *= 0.84
          s.vy *= 0.84
          s.x += s.vx
          s.y += s.vy
        }

        const twinkle = 0.55 + 0.45 * Math.sin(time * s.twinkleSpeed + s.twinkleOffset)
        const r = s.isGold ? 201 : 248
        const g = s.isGold ? 150 : 247
        const b = s.isGold ? 44 : 242
        const alpha = s.opacity * twinkle

        // Glow halo for larger stars
        if (s.size > 1.6) {
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5)
          grd.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.45})`)
          grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
          ctx.fillStyle = grd
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.size * 5, 0, Math.PI * 2)
          ctx.fill()
        }

        // Proximity glow: brighten stars near cursor
        let proximityBoost = 1
        if (!reduced) {
          const dd = Math.sqrt((s.x - mx) ** 2 + (s.y - my) ** 2)
          if (dd < 160) proximityBoost = 1 + (1 - dd / 160) * 1.6
        }

        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, alpha * proximityBoost)})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * Math.min(2, proximityBoost * 0.7 + 0.3), 0, Math.PI * 2)
        ctx.fill()
      }

      // — Draw sparkles —
      sparklesRef.current = sparklesRef.current.filter((sp) => sp.life > 0)
      for (const sp of sparklesRef.current) {
        sp.x += sp.vx
        sp.y += sp.vy
        sp.vy += 0.06
        sp.vx *= 0.97
        sp.life -= 0.016 / sp.maxLife

        const t = Math.max(0, sp.life)
        const fade = t < 0.3 ? t / 0.3 : 1
        ctx.fillStyle = `hsla(${sp.hue}, 90%, 75%, ${fade * 0.9})`
        ctx.beginPath()
        ctx.arc(sp.x, sp.y, sp.size * t, 0, Math.PI * 2)
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('click', onClick)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [reduced])

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(175deg, #080f20 0%, #0B1226 45%, #111d38 100%)' }}
    >
      {/* Interactive canvas — stars */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        style={{ opacity: 1 }}
        title="Click to burst sparkles · Move to push stars"
      />

      {/* Rainbow arc */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1440 700"
          preserveAspectRatio="xMidYMax meet"
          style={{ animation: 'rainbow-reveal 3s 0.8s ease forwards', opacity: 0 }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F25C54" />
              <stop offset="18%" stopColor="#F2A65A" />
              <stop offset="36%" stopColor="#F2E86D" />
              <stop offset="55%" stopColor="#7ED6A5" />
              <stop offset="74%" stopColor="#6CB4EE" />
              <stop offset="100%" stopColor="#B48CE0" />
            </linearGradient>
            <radialGradient id="rf" cx="50%" cy="100%" r="55%">
              <stop offset="30%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="rm">
              <rect width="1440" height="700" fill="url(#rf)" />
            </mask>
            <filter id="arc-blur">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          {/* Soft glow pass */}
          {[0, 24, 48, 72, 96, 120, 144].map((o, i) => (
            <path
              key={`blur-${i}`}
              d={`M ${80 - o * 0.25},690 A ${620 + o},${500 + o} 0 0,1 ${1360 + o * 0.25},690`}
              fill="none"
              stroke="url(#rg)"
              strokeWidth={28}
              strokeOpacity={0.18}
              mask="url(#rm)"
              filter="url(#arc-blur)"
            />
          ))}
          {/* Sharp arcs */}
          {[0, 24, 48, 72, 96, 120, 144].map((o, i) => (
            <path
              key={i}
              d={`M ${80 - o * 0.25},690 A ${620 + o},${500 + o} 0 0,1 ${1360 + o * 0.25},690`}
              fill="none"
              stroke="url(#rg)"
              strokeWidth={20}
              strokeOpacity={0.72 - i * 0.07}
              mask="url(#rm)"
            />
          ))}
        </svg>
      </div>

      {/* Castle silhouette */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <svg
          viewBox="0 0 1440 520"
          preserveAspectRatio="xMidYMax meet"
          className="w-full"
          style={{ display: 'block' }}
          aria-hidden="true"
        >
          <defs>
            <filter id="castle-glow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="castle-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#233558" />
              <stop offset="60%" stopColor="#1A2E52" />
              <stop offset="100%" stopColor="#152540" />
            </linearGradient>
            <linearGradient id="castle-mid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E3260" />
              <stop offset="100%" stopColor="#172848" />
            </linearGradient>
            <radialGradient id="win-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4A843" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#C9962C" stopOpacity="0" />
            </radialGradient>
            {/* Faint edge highlight on castle top */}
            <linearGradient id="edge-hi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E4878" stopOpacity="0.8" />
              <stop offset="8%" stopColor="#1A2E52" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* ── Distant haze hills ── */}
          <path d="M0,430 Q180,370 360,400 Q540,430 720,390 Q900,350 1080,395 Q1260,440 1440,415 L1440,520 L0,520Z"
            fill="#0F1C35" opacity="0.7" />

          {/* ══ FAR OUTER LEFT TOWER ══ */}
          <g fill="#152540">
            <rect x="18" y="330" width="62" height="190" />
            {/* Tapered spire */}
            <polygon points="49,282 24,332 74,332" />
            {/* Battlement */}
            {[18,30,42,54,66].map((x) => <rect key={x} x={x} y="320" width="9" height="13" fill="#0F1C35"/>)}
            {/* Tiny window */}
            <rect x="40" y="370" width="18" height="26" rx="9" fill="#0B1226" />
          </g>

          {/* ══ OUTER LEFT CURTAIN WALL ══ */}
          <rect x="80" y="365" width="85" height="155" fill="#152540" />
          {[80,93,106,119,132,145,158].map((x) => <rect key={x} x={x} y="355" width="9" height="13" fill="#0F1C35"/>)}

          {/* ══ LEFT FLANKING TOWER ══ */}
          <g fill="url(#castle-grad)">
            <rect x="165" y="278" width="90" height="242" />
            {/* Layered spire: main + mini side */}
            <polygon points="210,224 168,280 252,280" />
            <polygon points="178,252 165,278 192,278" />
            <polygon points="242,252 228,278 256,278" />
            {/* Battlement row */}
            {[165,179,193,207,221,235,249].map((x) => <rect key={x} x={x} y="268" width="10" height="14" fill="#0F1C35"/>)}
            {/* Windows with glow */}
            <rect x="195" y="330" width="30" height="42" rx="15" fill="#0B1226" />
            <ellipse cx="210" cy="330" rx="12" ry="6" fill="url(#win-glow)" opacity="0.8" filter="url(#castle-glow)" />
            <rect x="195" y="420" width="30" height="22" rx="5" fill="#0B1226" />
          </g>

          {/* ══ LEFT INNER CURTAIN WALL ══ */}
          <rect x="255" y="318" width="90" height="202" fill="url(#castle-grad)" />
          {[255,268,281,294,307,320,333].map((x) => <rect key={x} x={x} y="308" width="10" height="13" fill="#0F1C35"/>)}
          {/* Wall arrow-slit windows */}
          <rect x="282" y="360" width="12" height="28" rx="6" fill="#0B1226" />
          <rect x="314" y="360" width="12" height="28" rx="6" fill="#0B1226" />

          {/* ══ LEFT INNER TOWER ══ */}
          <g fill="url(#castle-mid)">
            <rect x="345" y="228" width="110" height="292" />
            {/* Spire with a finial */}
            <polygon points="400,162 350,230 450,230" />
            <polygon points="400,162 393,172 407,172" fill="#1E3260" />
            <circle cx="400" cy="162" r="5" fill="#2A4070" />
            {/* Battlement row */}
            {[345,359,373,387,401,415,429,443].map((x) => <rect key={x} x={x} y="218" width="10" height="14" fill="#0F1C35"/>)}
            {/* Flag */}
            <rect x="397" y="118" width="3" height="46" fill="#1E3A6E" />
            <polygon points="400,120 420,128 400,136" fill="#C9962C" opacity="0.8" />
            {/* Arched windows */}
            <rect x="375" y="278" width="28" height="44" rx="14" fill="#0B1226" />
            <ellipse cx="389" cy="278" rx="11" ry="5" fill="url(#win-glow)" filter="url(#castle-glow)" />
            <rect x="416" y="278" width="22" height="38" rx="11" fill="#0B1226" />
            <rect x="375" y="380" width="50" height="30" rx="5" fill="#0B1226" />
          </g>

          {/* ══ CENTRAL KEEP — the grand main structure ══ */}
          <g fill="url(#castle-mid)">
            {/* Main body */}
            <rect x="455" y="108" width="530" height="412" />

            {/* Horizontal ledge detail halfway up */}
            <rect x="455" y="240" width="530" height="8" fill="#243F70" opacity="0.5" />

            {/* ── Central keep top battlement row ── */}
            {Array.from({length:18},(_,i)=>455+i*30).map((x) => (
              <rect key={x} x={x} y="94" width="18" height="18" fill="#0F1C35"/>
            ))}

            {/* ── MAIN CENTRAL SPIRE (tallest) ── */}
            {/* Octagonal base cap */}
            <rect x="565" y="108" width="110" height="18" fill="#243F70" />
            {/* Spire body */}
            <polygon points="620,18 568,108 672,108" />
            {/* Spire edge highlight */}
            <line x1="620" y1="18" x2="568" y2="108" stroke="#2E4878" strokeWidth="1.5" opacity="0.6"/>
            <line x1="620" y1="18" x2="672" y2="108" stroke="#2E4878" strokeWidth="1.5" opacity="0.6"/>
            {/* Flag pole + banner */}
            <rect x="617" y="18" width="3" height="50" fill="#1E3A6E" />
            <polygon points="620,20 648,30 620,40" fill="#C9962C" />
            <line x1="648" y1="30" x2="620" y2="40" stroke="#C9962C" strokeWidth="1" opacity="0.6" />

            {/* ── LEFT SUB-SPIRE ── */}
            <rect x="480" y="124" width="80" height="14" fill="#243F70" opacity="0.8" />
            <polygon points="520,58 482,124 558,124" />
            <rect x="517" y="58" width="3" height="36" fill="#1E3A6E" />
            <polygon points="520,60 540,68 520,76" fill="#C9962C" opacity="0.75" />

            {/* ── RIGHT SUB-SPIRE ── */}
            <rect x="880" y="124" width="80" height="14" fill="#243F70" opacity="0.8" />
            <polygon points="920,58 882,124 958,124" />
            <rect x="917" y="58" width="3" height="36" fill="#1E3A6E" />
            <polygon points="920,60 940,68 920,76" fill="#C9962C" opacity="0.75" />

            {/* ── SMALLER FLANKING SPIRES (4 total on main keep) ── */}
            <polygon points="475,88 458,108 492,108" fill="#243F70" />
            <polygon points="965,88 948,108 982,108" fill="#243F70" />

            {/* ── Rose window (decorative circle) ── */}
            <circle cx="620" cy="190" r="28" fill="#0B1226" />
            <circle cx="620" cy="190" r="22" fill="#0E1525" />
            {/* Rose window spokes */}
            {Array.from({length:8},(_,i)=>{
              const a = (Math.PI*2*i)/8
              return <line key={i} x1={620} y1={190} x2={620+Math.cos(a)*22} y2={190+Math.sin(a)*22} stroke="#1E3260" strokeWidth="1.5"/>
            })}
            <circle cx="620" cy="190" r="7" fill="#1A2E52" />
            {/* Subtle glow behind rose window */}
            <circle cx="620" cy="190" r="26" fill="url(#win-glow)" opacity="0.5" filter="url(#castle-glow)" />

            {/* ── Gothic arched windows — top row ── */}
            {[490, 548, 668, 726].map((x) => (
              <g key={x}>
                <rect x={x} y="148" width="26" height="48" rx="13" fill="#0B1226"/>
                <ellipse cx={x+13} cy={148} rx={9} ry={4} fill="url(#win-glow)" opacity="0.6" filter="url(#castle-glow)" />
              </g>
            ))}
            {/* Right side top row */}
            {[748, 806, 864, 918].map((x) => (
              <g key={x}>
                <rect x={x} y="148" width="26" height="48" rx="13" fill="#0B1226"/>
                <ellipse cx={x+13} cy={148} rx={9} ry={4} fill="url(#win-glow)" opacity="0.6" filter="url(#castle-glow)" />
              </g>
            ))}

            {/* ── Mid-level windows — wider arched ── */}
            {[470, 540, 672, 760, 830, 900].map((x) => (
              <g key={x}>
                <rect x={x} y="272" width="32" height="54" rx="16" fill="#0B1226"/>
                <ellipse cx={x+16} cy={272} rx={11} ry={5} fill="url(#win-glow)" opacity="0.7" filter="url(#castle-glow)" />
              </g>
            ))}

            {/* ── Grand entrance arch ── */}
            <rect x="572" y="330" width="96" height="190" fill="#0B1226" />
            <ellipse cx="620" cy="330" rx="48" ry="32" fill="#0B1226" />
            {/* Arch keystone */}
            <rect x="617" y="312" width="6" height="18" rx="2" fill="#1E3260" />
            {/* Portcullis bars */}
            {[576,588,600,612,624,636,648,660].map((x) => (
              <rect key={x} x={x} y="332" width="3" height="120" fill="#0F1C35" opacity="0.7"/>
            ))}
            {[348,368,388,408,428].map((y) => (
              <rect key={y} x="576" y={y} width="90" height="3" fill="#0F1C35" opacity="0.7"/>
            ))}
            {/* Arch decorative moulding */}
            <path d="M572,330 A48,32 0 0,1 668,330" fill="none" stroke="#243F70" strokeWidth="3" opacity="0.6" />
            <path d="M578,330 A42,28 0 0,1 662,330" fill="none" stroke="#1E3260" strokeWidth="2" opacity="0.4" />

            {/* Edge highlight top */}
            <rect x="455" y="108" width="530" height="12" fill="url(#edge-hi)" />
          </g>

          {/* ══ RIGHT INNER TOWER (mirror of left) ══ */}
          <g fill="url(#castle-mid)">
            <rect x="985" y="228" width="110" height="292" />
            <polygon points="1040,162 990,230 1090,230" />
            <circle cx="1040" cy="162" r="5" fill="#2A4070" />
            {[985,999,1013,1027,1041,1055,1069,1083].map((x) => <rect key={x} x={x} y="218" width="10" height="14" fill="#0F1C35"/>)}
            <rect x="1037" y="118" width="3" height="46" fill="#1E3A6E" />
            <polygon points="1040,120 1060,128 1040,136" fill="#C9962C" opacity="0.8" />
            <rect x="1040" y="278" width="28" height="44" rx="14" fill="#0B1226" />
            <ellipse cx="1054" cy="278" rx="11" ry="5" fill="url(#win-glow)" filter="url(#castle-glow)" />
            <rect x="1005" y="278" width="22" height="38" rx="11" fill="#0B1226" />
            <rect x="1015" y="380" width="50" height="30" rx="5" fill="#0B1226" />
          </g>

          {/* ══ RIGHT INNER CURTAIN WALL ══ */}
          <rect x="1095" y="318" width="90" height="202" fill="url(#castle-grad)" />
          {[1095,1108,1121,1134,1147,1160,1173].map((x) => <rect key={x} x={x} y="308" width="10" height="13" fill="#0F1C35"/>)}
          <rect x="1116" y="360" width="12" height="28" rx="6" fill="#0B1226" />
          <rect x="1148" y="360" width="12" height="28" rx="6" fill="#0B1226" />

          {/* ══ RIGHT FLANKING TOWER ══ */}
          <g fill="url(#castle-grad)">
            <rect x="1185" y="278" width="90" height="242" />
            <polygon points="1230,224 1188,280 1272,280" />
            <polygon points="1198,252 1185,278 1212,278" />
            <polygon points="1262,252 1248,278 1276,278" />
            {[1185,1199,1213,1227,1241,1255,1269].map((x) => <rect key={x} x={x} y="268" width="10" height="14" fill="#0F1C35"/>)}
            <rect x="1215" y="330" width="30" height="42" rx="15" fill="#0B1226" />
            <ellipse cx="1230" cy="330" rx="12" ry="6" fill="url(#win-glow)" opacity="0.8" filter="url(#castle-glow)" />
            <rect x="1215" y="420" width="30" height="22" rx="5" fill="#0B1226" />
          </g>

          {/* ══ RIGHT OUTER CURTAIN WALL ══ */}
          <rect x="1275" y="365" width="85" height="155" fill="#152540" />
          {[1275,1288,1301,1314,1327,1340,1353].map((x) => <rect key={x} x={x} y="355" width="9" height="13" fill="#0F1C35"/>)}

          {/* ══ FAR OUTER RIGHT TOWER ══ */}
          <g fill="#152540">
            <rect x="1360" y="330" width="62" height="190" />
            <polygon points="1391,282 1366,332 1416,332" />
            {[1360,1372,1384,1396,1408].map((x) => <rect key={x} x={x} y="320" width="9" height="13" fill="#0F1C35"/>)}
            <rect x="1382" y="370" width="18" height="26" rx="9" fill="#0B1226" />
          </g>

          {/* Ground base fill */}
          <rect x="0" y="510" width="1440" height="12" fill="#0B1226" />
        </svg>
      </div>

      {/* Vignette bottom */}
      <div
        className="absolute bottom-0 left-0 w-full h-44 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(11,18,38,0.85) 0%, transparent 100%)' }}
      />
    </div>
  )
}