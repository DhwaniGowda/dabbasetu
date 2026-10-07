import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

/*
  Orange is the signature action colour and the primary button is where it
  lives. Ink on orange is the accessible pairing (6.2:1) and the one the
  deck uses for its own stamps. Secondary is a charcoal outline on cream.
*/
const TONES = {
  primary: {
    base: 'border border-orange bg-orange text-ink hover:bg-orange-deep hover:border-orange-deep active:bg-orange-deep',
    off: 'disabled:border-line disabled:bg-paper-3 disabled:text-faint',
  },
  ink: {
    base: 'border border-ink bg-ink text-paper hover:bg-ink-2 hover:border-ink-2 active:bg-ink-3',
    off: 'disabled:border-line disabled:bg-paper-3 disabled:text-faint',
  },
  secondary: {
    base: 'border border-ink bg-transparent text-ink hover:bg-ink/[0.07]',
    off: 'disabled:border-line disabled:text-faint',
  },
  success: {
    base: 'border border-green bg-green text-paper hover:bg-green-deep hover:border-green-deep',
    off: 'disabled:border-line disabled:bg-paper-3 disabled:text-faint',
  },
  quiet: {
    base: 'border border-line bg-transparent text-ink-3 hover:border-line-2 hover:text-ink',
    off: 'disabled:border-line disabled:text-faint',
  },
  ghost: {
    base: 'border border-transparent bg-transparent text-ink hover:bg-ink/[0.06]',
    off: 'disabled:text-faint',
  },
}

/* Nothing rounder than 16px — no pill buttons. */
const SIZES = {
  sm: 'h-11 gap-2 rounded-[10px] px-3.5 text-[0.8125rem]',
  md: 'h-[52px] gap-2.5 rounded-tile px-5 text-[0.9375rem]',
  lg: 'h-[58px] gap-3 rounded-panel px-6 text-[1rem]',
}

/**
 * One button for the whole product. Press feedback is CSS so it works
 * for <button> and <Link> alike and never fights the router.
 * Focus rings come from the surface (ink inside charcoal regions).
 */
export default function Button({
  children,
  tone: toneName = 'primary',
  size = 'md',
  to,
  href,
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  fullWidth = false,
  className = '',
  type = 'button',
  ...rest
}) {
  const tone = TONES[toneName] ?? TONES.primary

  const classes = [
    'group relative inline-flex select-none items-center justify-center whitespace-nowrap font-semibold',
    'transition-[background-color,border-color,color,transform,opacity] duration-150 ease-[var(--ease-setu)]',
    'active:scale-[0.98] motion-reduce:active:scale-100 disabled:pointer-events-none',
    tone.base,
    tone.off,
    SIZES[size] ?? SIZES.md,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const inner = (
    <>
      {loading ? (
        <Loader2 aria-hidden="true" size={18} className="animate-spin" />
      ) : (
        Icon && <Icon aria-hidden="true" size={size === 'sm' ? 16 : 18} strokeWidth={2.2} />
      )}
      <span>{children}</span>
      {IconRight && !loading && (
        <IconRight
          aria-hidden="true"
          size={size === 'sm' ? 16 : 18}
          strokeWidth={2.2}
          className="transition-transform duration-200 ease-[var(--ease-setu)] group-hover:translate-x-0.5"
        />
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {inner}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {inner}
      </a>
    )
  }

  return (
    <button {...rest} type={type} className={classes} disabled={loading || rest.disabled}>
      {inner}
    </button>
  )
}
