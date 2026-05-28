import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const pillars = [
  { k: 'Preserve', d: 'Hold space for songs and steps passed down for generations.' },
  { k: 'Access', d: 'Every body, every age, every level — no audition required.' },
  { k: 'Build', d: 'Run a year-round community, not just a Navratri pop-up.' },
  { k: 'Modernise', d: 'Treat the dance as a living art — choreograph it forward.' },
]

export default function About() {
  return (
    <section id="about" className="relative isolate overflow-hidden pt-32 pb-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-900 via-[#0a0d22] to-navy-900" />
      <div className="absolute -left-32 top-0 -z-10 h-[60vh] w-[40vw] bg-[radial-gradient(circle,rgba(90,24,154,0.4),transparent_70%)] blur-3xl" />
      <div className="absolute -right-20 bottom-0 -z-10 h-[50vh] w-[40vw] bg-[radial-gradient(circle,rgba(244,185,66,0.25),transparent_70%)] blur-3xl" />

      <div className="container-wide">
        {/* Oversized editorial label */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-12"
        >
          <div className="col-span-12 lg:col-span-10">
            <div className="section-label">About · The Story</div>
            <h2 className="display-serif mt-6 text-[clamp(2.8rem,8vw,7.5rem)] font-medium leading-[0.9] tracking-tight text-cream">
              We didn’t set out to build a dance class.
              <br />
              <span className="gold-text-gradient italic">We set out to keep a tradition awake.</span>
            </h2>
          </div>
        </motion.div>

        <div className="mt-20 grid grid-cols-12 gap-x-10 gap-y-16">
          {/* Left — layered visual stack */}
          <div className="relative col-span-12 lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative mx-auto w-full max-w-[560px]"
            >
              {/* photo card — the very first workshop */}
              <div className="relative aspect-[4/3] w-full">
                <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-cream/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
                  <img
                    src="/Garba2025Workshop.jpg"
                    alt="Rangtaal’s first Garba workshop in a Schaumburg warehouse, 2025"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* warm cinematic grade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/15 to-transparent" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(247,127,0,0.18),transparent_60%)]" />
                  <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />

                  {/* caption */}
                  <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[0.6rem] uppercase tracking-[0.34em] text-gold/90">
                        Where it started
                      </p>
                      <p className="display-serif mt-1 text-xl leading-tight text-cream md:text-2xl">
                        Our very first circle
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-cream/20 bg-black/40 px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.26em] text-cream/85 backdrop-blur-md">
                      Schaumburg · 2025
                    </span>
                  </div>
                </div>

                {/* floating polaroid — top right */}
                <motion.div
                  initial={{ rotate: -8, y: 20, opacity: 0 }}
                  whileInView={{ rotate: -6, y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="absolute -right-5 -top-8 w-40 rounded-2xl border border-cream/15 bg-cream/95 p-2 shadow-xl"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-[#7B1E3A] to-[#5A189A]">
                    <div className="absolute inset-0 grid place-items-center">
                      <svg width="72" height="72" viewBox="0 0 40 40">
                        <g stroke="#F4B942" strokeWidth="2.4" strokeLinecap="round">
                          <line x1="10" y1="10" x2="30" y2="30" />
                          <line x1="30" y1="10" x2="10" y2="30" />
                        </g>
                        <circle cx="20" cy="20" r="3.5" fill="#F4B942" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-2 text-center font-display text-xs italic text-navy-900">
                    Est. 2025 · Naperville
                  </p>
                </motion.div>

                {/* floating stat plate — bottom left */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute -bottom-8 -left-5 w-56 rounded-2xl border border-cream/15 bg-navy-900/85 p-5 backdrop-blur-xl shadow-glow-maroon"
                >
                  <div className="text-[0.6rem] uppercase tracking-[0.32em] text-gold/80">
                    Our community
                  </div>
                  <p className="display-serif mt-2 text-4xl font-medium text-cream">
                    150+ dancers
                  </p>
                  <p className="mt-2 text-xs text-cream/55">
                    Led by 8 instructors — and growing every single Tuesday.
                  </p>
                </motion.div>
              </div>

              {/* quote card */}
              <div className="mt-14 rounded-[28px] border border-cream/10 bg-gradient-to-br from-[#3E1071]/40 via-navy-800/50 to-[#7B1E3A]/40 p-7 md:p-8">
                <p className="display-serif text-2xl italic leading-tight text-cream md:text-3xl">
                  “If the music is playing and someone is dancing, the tradition
                  is alive. Our job is simply to keep the music playing.”
                </p>
                <p className="mt-4 text-[0.7rem] uppercase tracking-[0.32em] text-cream/70">
                  Nik Patel · Founder, Rangtaal
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right — story body and pillars */}
          <div className="col-span-12 lg:col-span-6 lg:pl-6">
            {/* Founder introduction */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6"
            >
              <div className="relative shrink-0">
                <div className="relative aspect-[3/4] w-24 overflow-hidden rounded-2xl border border-cream/15 bg-navy-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] sm:w-32">
                  <img
                    src="/nik-patel.jpg"
                    alt="Nik Patel, founder of Rangtaal, in traditional Garba attire mid-dance"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent" />
                </div>
                {/* warm glow behind the portrait */}
                <div className="absolute -inset-3 -z-10 rounded-3xl bg-[radial-gradient(circle,rgba(247,127,0,0.4),transparent_70%)] blur-xl" />
              </div>
              <div className="min-w-0">
                <div className="section-label">Meet the founder</div>
                <p className="display-serif mt-2 text-3xl font-medium leading-none text-cream">
                  Nik Patel
                </p>
                <p className="mt-2 text-sm text-cream/60">
                  Founder &amp; lead instructor, Rangtaal
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-8 space-y-5 text-lg leading-relaxed text-cream/80"
            >
              <p>
                Hi, I’m <span className="text-cream">Nik Patel</span>. I’ve always
                wanted to do something for my community — and Garba is something
                I’ve been deeply passionate about my whole life.
              </p>
              <p className="text-cream/65">
                So in 2025, along with my wife and a few close friends, we ran our
                very first Garba workshop — in a Schaumburg warehouse, with nothing
                but my speaker and a circle of twenty people.
              </p>
              <p className="text-cream/65">
                As they started learning, word spread and more dancers kept showing
                up. Today Rangtaal is a community of more than{' '}
                <span className="text-cream">150 students and 8 instructors</span> —
                and we’re only just getting started.
              </p>
            </motion.div>

            {/* pillars */}
            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.k}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="rounded-2xl border border-cream/10 bg-cream/[0.03] p-5 transition hover:border-gold/40 hover:bg-cream/[0.06]"
                >
                  <div className="display-serif text-2xl font-medium text-cream">
                    {p.k}
                    <span className="text-gold">.</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-cream/65">
                    {p.d}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <button
                onClick={() => document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-ghost"
              >
                Why people join
              </button>
              <Link to="/workshops" className="text-sm text-cream/70 hover:text-gold underline-offset-4 hover:underline">
                See the class →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
