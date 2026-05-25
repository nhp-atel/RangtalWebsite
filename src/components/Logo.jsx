import { Link } from 'react-router-dom'

export default function Logo({ className = '', size = 'sm' }) {
  const sizes = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14',
    lg: 'h-20 w-20',
  }
  return (
    <Link to="/" className={`group inline-flex items-center ${className}`} aria-label="Rangtaal — home">
      <span className="relative inline-block">
        <span className="absolute inset-0 rounded-full bg-gold/30 opacity-0 blur-md transition group-hover:opacity-100" />
        <img
          src="/logo.png"
          alt="Rangtaal"
          className={`relative ${sizes[size]} rounded-full object-cover ring-1 ring-cream/15 transition-transform duration-500 group-hover:scale-105`}
          loading="eager"
          decoding="async"
        />
      </span>
    </Link>
  )
}
