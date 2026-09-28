const paths = [
  "M-50,120 C300,40 500,260 800,160 S1300,60 1650,200",
  "M-50,320 C250,420 550,200 850,330 S1350,450 1650,300",
  "M-50,520 C350,440 600,640 900,520 S1400,400 1650,560",
  "M200,-50 C260,200 120,400 300,700",
  "M1300,-50 C1200,220 1420,420 1250,700",
];

const chips = [
  { t: "UGX 250,000", x: "8%", y: "18%", d: "0s" },
  { t: "+ $120", x: "82%", y: "12%", d: "1.5s" },
  { t: "MoMo ✓", x: "70%", y: "70%", d: "3s" },
  { t: "Bank → Wallet", x: "18%", y: "75%", d: "2s" },
  { t: "KES 4,500", x: "48%", y: "8%", d: "4s" },
];

const MoneyFlowBackground = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
    <svg className="absolute inset-0 w-full h-full text-primary" viewBox="0 0 1600 650" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="coin" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {paths.map((d, i) => (
        <g key={i}>
          <path id={`flow-${i}`} d={d} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" strokeDasharray="6 8">
            <animate attributeName="stroke-dashoffset" from="0" to="-140" dur="4s" repeatCount="indefinite" />
          </path>
          {[0, 1, 2].map((k) => (
            <g key={k}>
              <circle r="14" fill="url(#coin)" opacity="0.35">
                <animateMotion dur={`${7 + i}s`} begin={`${k * 2.4 + i * 0.6}s`} repeatCount="indefinite">
                  <mpath href={`#flow-${i}`} />
                </animateMotion>
              </circle>
              <circle r="4" fill="currentColor" opacity="0.8">
                <animateMotion dur={`${7 + i}s`} begin={`${k * 2.4 + i * 0.6}s`} repeatCount="indefinite">
                  <mpath href={`#flow-${i}`} />
                </animateMotion>
              </circle>
            </g>
          ))}
        </g>
      ))}
    </svg>
    {chips.map((c) => (
      <span
        key={c.t}
        className="absolute glass rounded-full px-3 py-1.5 text-xs font-medium text-foreground/70 animate-float hidden md:inline-block"
        style={{ left: c.x, top: c.y, animationDelay: c.d }}
      >
        {c.t}
      </span>
    ))}
  </div>
);

export default MoneyFlowBackground;
