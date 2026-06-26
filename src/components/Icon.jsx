const PATHS = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>,
  map: <><path d="M9 4 3 6.5v14L9 18l6 3 6-2.5v-14L15 7 9 4Z" /><path d="M9 4v14M15 7v14" /></>,
  gift: <><rect x="3.5" y="8.5" width="17" height="5" rx="1" /><path d="M5 13.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6.5M12 8.5V21" /><path d="M12 8.5S10.5 3.5 8 4.2c-2 .6-1.3 4.3 4 4.3 5.3 0 6-3.7 4-4.3C17.5 3.5 12 8.5 12 8.5Z" /></>,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 5.2a3.2 3.2 0 0 1 0 5.8M17 14.6a5.5 5.5 0 0 1 3.5 5.4" /></>,
  user: <><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
  chart: <><path d="M4 4v16h16" /><rect x="7.5" y="11" width="2.6" height="6" rx=".6" /><rect x="12.5" y="7" width="2.6" height="10" rx=".6" /><rect x="17" y="13" width="2.4" height="4" rx=".6" /></>,
  book: <><path d="M5 4.5h11a2 2 0 0 1 2 2V21l-2.5-1.5L13 21l-2.5-1.5L8 21V6.5a2 2 0 0 0-2-2H5Z" /><path d="M5 4.5V19" /></>,
  trophy: <><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" /><path d="M16 5h3v2a3 3 0 0 1-3 3M8 5H5v2a3 3 0 0 0 3 3" /><path d="M12 12v4M9 20h6M10 20l.5-4h3l.5 4" /></>,
  flame: <><path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s.5 1.5 2 1.5C11 11.5 9 8 12 3Z" /></>,
  leaf: <><path d="M5 19C4 12 9 5 20 5c0 11-7 16-14 15Z" /><path d="M9 15c2-3 5-5 8-6" /></>,
  droplet: <><path d="M12 3.5S6 10 6 14a6 6 0 0 0 12 0c0-4-6-10.5-6-10.5Z" /></>,
  share: <><circle cx="6" cy="12" r="2.4" /><circle cx="17.5" cy="6" r="2.4" /><circle cx="17.5" cy="18" r="2.4" /><path d="M8.1 10.9 15.4 7.1M8.1 13.1l7.3 3.8" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6" /></>,
  logout: <><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 12h10M16 8l4 4-4 4" /></>,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  store: <><path d="M4 9.5 5 5h14l1 4.5a2.5 2.5 0 0 1-4.9.6 2.5 2.5 0 0 1-4.2 0 2.5 2.5 0 0 1-4.9-.6Z" /><path d="M5 11v9h14v-9M10 20v-5h4v5" /></>,
  coffee: <><path d="M5 8h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" /><path d="M16 9h2.5a2 2 0 0 1 0 4H16M5 21h12" /></>,
  sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.6" fill="currentColor" /></>,
  cloud: <><path d="M7 18a4 4 0 0 1-.5-7.97A5 5 0 0 1 16 9.5a3.5 3.5 0 0 1 .5 8.5H7Z" /></>,
  dollar: <><path d="M12 3v18M16 7.5c0-1.7-1.8-2.5-4-2.5s-4 .9-4 2.6c0 3.7 8 2.2 8 5.9 0 1.7-1.8 2.5-4 2.5s-4-.8-4-2.5" /></>,
  recycle: <><path d="M7.5 8 9.8 4.2a2 2 0 0 1 3.4 0L15 7" /><path d="M16.5 9.5 19 14a2 2 0 0 1-1.7 3H14" /><path d="M9 17H5a2 2 0 0 1-1.7-3L5 11" /><path d="M12.5 19 14 17l-2-1M16 7l1-2.6L19.5 5M5 11l-2.4.6L2 9" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="9.5" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>,
  check: <path d="M5 12.5 10 17l9-10" />,
  pin: <><path d="M12 21s7-6.3 7-11a7 7 0 0 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.4" /></>,
  bottle: <><path d="M10 2.5h4M10.5 2.5v2.2c0 .8-.4 1.2-1 1.8C8.7 7.3 8.5 8 8.5 9.2V19a2.5 2.5 0 0 0 2.5 2.5h2A2.5 2.5 0 0 0 15.5 19V9.2c0-1.2-.2-1.9-1-2.7-.6-.6-1-1-1-1.8V2.5" /><path d="M8.5 12h7" /></>,
  external: <><path d="M14 4h6v6" /><path d="M20 4l-8.5 8.5" /><path d="M18 13.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4.5" /></>,
  trash: <><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6" /></>,
  refresh: <><path d="M3.5 12a8.5 8.5 0 0 1 14.5-6l2 2" /><path d="M20 4v4h-4" /><path d="M20.5 12a8.5 8.5 0 0 1-14.5 6l-2-2" /><path d="M4 20v-4h4" /></>,
  download: <><path d="M12 3.5v11" /><path d="M7.5 10.5 12 15l4.5-4.5" /><path d="M5 20h14" /></>,
  minus: <path d="M5 12h14" />,
  calendar: <><rect x="4" y="5.5" width="16" height="15" rx="2" /><path d="M4 9.5h16M8 3.5v4M16 3.5v4" /></>,
}

export default function Icon({ name, size = 22, stroke = 1.7, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name] || null}
    </svg>
  )
}
