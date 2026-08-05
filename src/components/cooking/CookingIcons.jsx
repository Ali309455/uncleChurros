const IconBase = ({ size = 24, className = '', children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
)

export const IconChurro = (props) => (
  <IconBase {...props}>
    <rect x="8.5" y="2.5" width="7" height="19" rx="3.5" />
    <path d="M8.5 6.5h7M8.5 9.5h7M8.5 12.5h7M8.5 15.5h7M8.5 18.5h7" />
    <circle cx="5" cy="10" r="0.6" />
    <circle cx="19" cy="14" r="0.6" />
    <circle cx="18" cy="5" r="0.6" />
  </IconBase>
)

export const IconBeignet = (props) => (
  <IconBase {...props}>
    <rect x="5" y="5" width="14" height="14" rx="2.5" transform="rotate(45 12 12)" />
    <circle cx="8.2" cy="8.2" r="0.6" />
    <circle cx="12" cy="6.4" r="0.6" />
    <circle cx="15.8" cy="8.2" r="0.6" />
    <circle cx="6.4" cy="12" r="0.6" />
    <circle cx="17.6" cy="12" r="0.6" />
    <circle cx="8.2" cy="15.8" r="0.6" />
    <circle cx="12" cy="17.6" r="0.6" />
    <circle cx="15.8" cy="15.8" r="0.6" />
  </IconBase>
)

export const IconChimichanga = (props) => (
  <IconBase {...props}>
    <path d="M3.5 8.5c1.8-2.6 15.2-2.6 17 0" />
    <path d="M3.5 15.5c1.8 2.6 15.2 2.6 17 0" />
    <path d="M3.5 8.5v7M20.5 8.5v7" />
    <path d="M10.8 7 8 17.5M13.2 7l2.8 10.5" />
  </IconBase>
)

export const IconAirFryer = (props) => (
  <IconBase {...props}>
    <rect x="4" y="6.5" width="16" height="12" rx="3" />
    <rect x="7" y="9.5" width="10" height="5" rx="1.5" />
    <path d="M12 9.5V8" />
    <path d="M16 4.5h1.4M12.6 4.5H14" />
  </IconBase>
)

export const IconOven = (props) => (
  <IconBase {...props}>
    <rect x="3.5" y="6" width="17" height="12" rx="2" />
    <rect x="6.5" y="9" width="11" height="6.5" rx="1.25" />
    <path d="M8 12.25h1.4l1-1.25 1 1.25 1-1.25 1 1.25 1-1.25 1 1.25" />
    <path d="M7 20.5h2M15 20.5h2" />
  </IconBase>
)

export const IconPan = (props) => (
  <IconBase {...props}>
    <ellipse cx="9.5" cy="14.5" rx="5.5" ry="3" />
    <path d="M14.5 13l5-2.2" />
    <rect x="7" y="13" width="5" height="3" rx="1" />
  </IconBase>
)

export const IconDeepFryer = (props) => (
  <IconBase {...props}>
    <rect x="3.5" y="8.5" width="17" height="8.5" rx="3" />
    <path d="M3.5 9.5h17" />
    <path d="M12 8.5V5.5" />
    <path d="M12 5.5h1.8M10.2 5.5H12" />
    <circle cx="7.5" cy="13" r="0.7" />
    <circle cx="12" cy="14.5" r="0.7" />
    <circle cx="16.5" cy="13" r="0.7" />
    <path d="M7 20.5h3M14 20.5h3" />
  </IconBase>
)

export const IconMicrowave = (props) => (
  <IconBase {...props}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <rect x="5.5" y="8" width="9.5" height="8" rx="1" />
    <circle cx="17.8" cy="10" r="0.8" />
    <circle cx="17.8" cy="13" r="0.8" />
    <circle cx="17.8" cy="16" r="0.8" />
    <path d="M15 8v8" />
  </IconBase>
)

export const IconClock = (props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </IconBase>
)

export const IconTemp = (props) => (
  <IconBase {...props}>
    <path d="M12 4v10" />
    <circle cx="12" cy="16" r="3.5" />
    <path d="M12 5.5h2M12 8.5h2" />
    <path d="M10.5 16h3" />
  </IconBase>
)

export const IconServe = (props) => (
  <IconBase {...props}>
    <ellipse cx="12" cy="15" rx="8" ry="3.5" />
    <ellipse cx="12" cy="14" rx="4.5" ry="1.9" />
    <path d="M9.5 7.5c-.7 0-.7 1.1 0 1.1s.7 1.1 0 1.1" />
    <path d="M13.5 6c-.7 0-.7 1.1 0 1.1s.7 1.1 0 1.1" />
  </IconBase>
)

export const IconBook = (props) => (
  <IconBase {...props}>
    <path d="M4 6.5c2.4 0 4.7.4 7 2v10c-2.3-1.6-4.6-2-7-2z" />
    <path d="M20 6.5c-2.4 0-4.7.4-7 2v10c2.3-1.6 4.6-2 7-2z" />
  </IconBase>
)

export const IconSnowflake = (props) => (
  <IconBase {...props}>
    <path d="M12 3v18" />
    <path d="M4.2 7.8l15.6 8.4" />
    <path d="M4.2 16.2l15.6-8.4" />
    <path d="M12 3l-1.4 2.2M12 3l1.4 2.2M12 21l-1.4-2.2M12 21l1.4-2.2" />
  </IconBase>
)

export const IconLightbulb = (props) => (
  <IconBase {...props}>
    <path d="M12 3a5.5 5.5 0 0 1 3.1 10c-.7.5-.9 1.1-.9 1.8V16H9.8v-1.2c0-.7-.2-1.3-.9-1.8A5.5 5.5 0 0 1 12 3z" />
    <path d="M10 18.5h4M10.8 21h2.4" />
    <path d="M12 6.5V9" />
  </IconBase>
)

export const CATEGORY_ICONS = {
  churros: IconChurro,
  beignets: IconBeignet,
  chimichangas: IconChimichanga,
}

export const METHOD_ICONS = {
  deepfryer: IconDeepFryer,
  airfryer: IconAirFryer,
  oven: IconOven,
  pan: IconPan,
  microwave: IconMicrowave,
}