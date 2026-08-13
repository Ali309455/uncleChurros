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
  const lastAutoRef = useRef(0)
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

    const burst = (x, y, count) => {
      const hues = [0, 35, 55, 160, 210, 270]
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4
        const speed = 1.5 + Math.random() * 3.5
        sparklesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          life: 1,
          maxLife: 0.6 + Math.random() * 0.8,
          size: 1.2 + Math.random() * 2.2,
          hue: hues[Math.floor(Math.random() * hues.length)],
        })
      }
    }

    const onClick = (e) => {
      if (reduced) return
      const rect = canvas.getBoundingClientRect()
      burst(e.clientX - rect.left, e.clientY - rect.top, 18)
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

      // — Auto fireworks (slow) —
      if (!reduced && time - lastAutoRef.current > 2000 + Math.random() * 1000) {
        lastAutoRef.current = time
        burst(W * (0.2 + Math.random() * 0.6), H * (0.15 + Math.random() * 0.45), 10)
      }

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

      {/* Castle image */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <img
          src="/castle.png"
          alt=""
          draggable={false}
          className="w-full  h-full object-cover sm:object-contain object-bottom  max-sm:h-[52vh] max-sm:translate-y-6 brightness-[0.55] sm:brightness-[0.6]"
          style={{ display: 'block' }}
          aria-hidden="true"
        />
      </div>
      {/* Readability overlay — darkens the zone behind the hero copy */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 78% 58% at 50% 42%, rgba(8,15,32,0.78) 0%, rgba(8,15,32,0.45) 55%, rgba(8,15,32,0) 100%)' }}
      />
      {/* Vignette bottom */}
      <div
        className="absolute bottom-0 left-0 w-full h-44 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(11,18,38,0.85) 0%, transparent 100%)' }}
      />
    </div>
  )
}