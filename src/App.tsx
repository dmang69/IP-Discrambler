import { useEffect, useMemo, useState } from 'react'

type DefenseMode = 'block' | 'poison'

type TrackerEvent = {
  domain: string
  category: string
  risk: 'low' | 'medium' | 'high'
  timestamp: string
  action: string
}

type SyntheticProfile = {
  device: string
  interest: string
  timezone: string
  language: string
  geo: string
  analyticsId: string
}

const trackerDomains = [
  'ads.orbit-stat.io',
  'pixel.deepmarket.net',
  'beacon.metricscloud.ai',
  'crosssite.tracehub.co',
  'fingerprint.spectra-id.dev',
]

const trackerCategories = [
  'Tracking Pixel',
  'Analytics Beacon',
  'Cross-site Request',
  'Fingerprint Script',
  'Persistent Ad Identifier',
]

const fakeDevices = [
  'SmartFridge Browser v3',
  'PlayStation Browser',
  'Nokia Phoenix 11',
  'Retro Tablet 2007',
  'Workstation VR Headset',
]

const fakeInterests = [
  'Competitive yodeling',
  'Underwater chess',
  'Medieval beekeeping',
  'Solar-powered knitting',
  'Zero-gravity gardening',
]

const fakeTimezones = ['UTC+09:00', 'UTC-03:00', 'UTC+01:00', 'UTC-08:00']
const fakeLanguages = ['en-US', 'de-DE', 'ja-JP', 'es-AR']
const fakeLocations = ['Oslo, NO', 'Lima, PE', 'Kyoto, JP', 'Reykjavik, IS']

const randomFrom = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

const createSyntheticProfile = (): SyntheticProfile => ({
  device: randomFrom(fakeDevices),
  interest: randomFrom(fakeInterests),
  timezone: randomFrom(fakeTimezones),
  language: randomFrom(fakeLanguages),
  geo: randomFrom(fakeLocations),
  analyticsId: `syn-${Math.random().toString(36).slice(2, 10)}`,
})

const createEvent = (mode: DefenseMode): TrackerEvent => ({
  domain: randomFrom(trackerDomains),
  category: randomFrom(trackerCategories),
  risk: randomFrom(['low', 'medium', 'high']),
  timestamp: new Date().toLocaleTimeString(),
  action: mode === 'block' ? 'Blocked' : 'Poisoned',
})

function App() {
  const [mode, setMode] = useState<DefenseMode>('block')
  const [events, setEvents] = useState<TrackerEvent[]>(() => [createEvent('block')])
  const [blockedCount, setBlockedCount] = useState(1042)
  const [poisonedCount, setPoisonedCount] = useState(418)
  const [scanProgress, setScanProgress] = useState(28)
  const [profile, setProfile] = useState<SyntheticProfile>(() => createSyntheticProfile())

  useEffect(() => {
    const timer = setInterval(() => {
      setEvents((current) => [createEvent(mode), ...current].slice(0, 7))
      setBlockedCount((value) => value + (mode === 'block' ? 3 : 1))
      setPoisonedCount((value) => value + (mode === 'poison' ? 3 : 1))
      setScanProgress((value) => (value >= 100 ? 12 : value + 11))
      setProfile(createSyntheticProfile())
    }, 1800)

    return () => clearInterval(timer)
  }, [mode])

  const privacyScore = useMemo(() => Math.min(100, Math.max(42, 100 - events.length * 5 + (mode === 'block' ? 6 : 4))), [events.length, mode])

  const labSignals = [
    { name: 'Public IP Exposure', status: 'Exposed', tone: 'danger' },
    { name: 'DNS Exposure', status: 'Exposed', tone: 'danger' },
    { name: 'Cookie Exposure', status: mode === 'block' ? 'Protected' : 'Partial', tone: mode === 'block' ? 'safe' : 'warn' },
    { name: 'Fingerprint Uniqueness', status: mode === 'poison' ? 'Noisy' : 'Reduced', tone: 'safe' },
  ]

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 text-slate-100 sm:px-8">
      <header className="section-card relative overflow-hidden" aria-labelledby="hero-title">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-300">Privacy Command Center</p>
            <h1 id="hero-title" className="text-3xl font-semibold tracking-tight text-cyan-100 sm:text-5xl">IP Descrambler</h1>
            <p className="mt-4 text-slate-300">
              A browser-based privacy-defense concept showing how trackers profile users, how blocking can interrupt collection,
              and how synthetic identity rotation could reduce profiling accuracy.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard label="Blocked Requests" value={blockedCount.toLocaleString()} tone="danger" />
            <StatCard label="Poisoned Requests" value={poisonedCount.toLocaleString()} tone="cyan" />
            <StatCard label="Intercepted Domains" value={new Set(events.map((event) => event.domain)).size} tone="violet" />
            <StatCard label="Cross-site Risk" value={`${Math.max(10, 76 - privacyScore)}%`} tone="green" />
          </div>
        </div>
      </header>

      <section className="section-grid">
        <Panel title="Privacy threat overview">
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Third-party cookies, tracking pixels, and analytics beacons map browsing behavior.</li>
            <li>• Browser fingerprinting scripts can create persistent identifiers across sessions.</li>
            <li>• Cross-site requests and ad IDs can merge fragmented data into one profile.</li>
          </ul>
        </Panel>
        <Panel title="Live network visualization">
          <div className="network-map" role="img" aria-label="Animated tracker request network map">
            <div className="scan-line" />
            {events.slice(0, 5).map((event) => (
              <div key={`${event.timestamp}-${event.domain}`} className="network-node">
                <span>{event.domain}</span>
                <span className="text-xs text-slate-400">{event.timestamp}</span>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="section-grid">
        <Panel title="Identity scrambling demonstration">
          <dl className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
            <Signal term="Generated device" detail={profile.device} />
            <Signal term="Generated interest" detail={profile.interest} />
            <Signal term="Rotating analytics ID" detail={profile.analyticsId} />
            <Signal term="Randomized geolocation" detail={profile.geo} />
          </dl>
        </Panel>
        <Panel title="IP and fingerprint comparison">
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <CompareCard title="Observed Browser" rows={['IP: 198.51.100.xx', 'Fingerprint: High uniqueness', 'OS: Shared by browser']} />
            <CompareCard title="Simulated Profile" rows={['IP: Simulated in demo only', 'Fingerprint: Injected noise', `Device: ${profile.device}`]} />
          </div>
        </Panel>
      </section>

      <section className="section-card" aria-labelledby="defense-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 id="defense-title" className="text-xl font-semibold text-cyan-100">Tracker Defense dashboard</h2>
          <fieldset className="flex gap-2" aria-label="Defense mode selector">
            <ModeButton mode="block" activeMode={mode} onChange={setMode} />
            <ModeButton mode="poison" activeMode={mode} onChange={setMode} />
          </fieldset>
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-lg border border-cyan-500/30 bg-black/30 p-4">
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-300">Live intercepted events</h3>
            <ul className="space-y-2">
              {events.map((event) => (
                <li
                  key={`${event.timestamp}-${event.domain}-${event.category}`}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    mode === 'block'
                      ? 'border-red-400/50 bg-red-500/10 text-red-100'
                      : 'border-cyan-400/50 bg-cyan-500/10 text-cyan-100'
                  }`}
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <span>{event.action}: {event.domain}</span>
                    <span className="text-xs uppercase">{event.risk} risk</span>
                  </div>
                  <div className="text-xs opacity-80">{event.category} • {event.timestamp}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-violet-400/30 bg-black/30 p-4 text-sm text-slate-300">
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-violet-200">Block versus Poison</h3>
            <p>
              <strong>Block Mode:</strong> rejects tracker requests, strips third-party cookies, and prevents tracker scripts.
            </p>
            <p className="mt-2">
              <strong>Poison Mode:</strong> permits simulated requests but replaces identifiers with rotating synthetic values.
            </p>
          </div>
        </div>
      </section>

      <section className="section-grid">
        <Panel title="Live Privacy Lab">
          <div className="space-y-3 text-sm text-slate-300">
            <p>Scan progress</p>
            <div className="h-2 overflow-hidden rounded bg-slate-800">
              <div className="h-full bg-gradient-to-r from-cyan-400 via-violet-400 to-green-300 transition-all duration-500" style={{ width: `${scanProgress}%` }} />
            </div>
            <p>Privacy score: <span className="text-cyan-200">{privacyScore}/100</span></p>
            <div className="h-2 rounded bg-slate-800">
              <div className="h-full rounded bg-red-500" style={{ width: `${100 - privacyScore}%` }} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {labSignals.map((signal) => (
                <StatusCard key={signal.name} label={signal.name} status={signal.status} tone={signal.tone} />
              ))}
            </div>
          </div>
        </Panel>
        <Panel title="Generated synthetic identity profile">
          <ul className="space-y-2 text-sm text-slate-300">
            <li><span className="text-slate-400">Device:</span> {profile.device}</li>
            <li><span className="text-slate-400">Interest profile:</span> {profile.interest}</li>
            <li><span className="text-slate-400">Language / TZ:</span> {profile.language} / {profile.timezone}</li>
            <li><span className="text-slate-400">Geo hint:</span> {profile.geo}</li>
          </ul>
        </Panel>
      </section>

      <section className="section-grid">
        <Panel title="Features and technical capabilities">
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Reusable React + TypeScript components with local synthetic-data generation</li>
            <li>• Live-looking counters, risk levels, timestamps, and tracker categories</li>
            <li>• Animated privacy scoring, scan progress, and responsive command-center layout</li>
          </ul>
        </Panel>
        <Panel title="Product comparison">
          <table className="w-full text-left text-sm text-slate-300">
            <thead>
              <tr className="text-slate-400">
                <th className="py-1">Capability</th>
                <th className="py-1">IP Descrambler (Demo)</th>
                <th className="py-1">Typical Tracker Stack</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Profile visibility</td><td>Explained visually</td><td>Opaque to user</td></tr>
              <tr><td>Identity rotation</td><td>Simulated synthetic IDs</td><td>Persistent identifiers</td></tr>
              <tr><td>Risk scoring</td><td>Interactive scorecard</td><td>Not user-facing</td></tr>
            </tbody>
          </table>
        </Panel>
      </section>

      <section className="section-grid">
        <Panel title="Local demo instructions">
          <pre className="rounded-md border border-cyan-500/40 bg-black/40 p-3 text-xs text-cyan-100">npm.cmd install{`\n`}npm.cmd run dev{`\n`}npm.cmd run build</pre>
        </Panel>
        <Panel title="Development roadmap">
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Expand tracker taxonomy and synthetic-profile generation controls</li>
            <li>• Add opt-in backend modules for real interception where legally appropriate</li>
            <li>• Add exportable privacy-lab reports and comparative scan history</li>
          </ul>
        </Panel>
      </section>

      <section className="section-grid">
        <Panel title="Frequently asked questions">
          <dl className="space-y-3 text-sm text-slate-300">
            <div>
              <dt className="text-cyan-200">Does this page change my real public IP?</dt>
              <dd>No. This browser demo simulates analysis and defensive strategies.</dd>
            </div>
            <div>
              <dt className="text-cyan-200">Does Poison Mode rewrite real cookies or DNS?</dt>
              <dd>No. It visualizes how synthetic identity rotation could work in a full implementation.</dd>
            </div>
          </dl>
        </Panel>
        <Panel title="Privacy and simulation disclaimer">
          <p className="text-sm text-slate-300">
            IP Descrambler currently provides browser-only simulations. It does not install a VPN, intercept real network
            traffic, rewrite DNS, or alter browser cookies outside this local demonstration environment.
          </p>
        </Panel>
      </section>
    </main>
  )
}

type ModeButtonProps = {
  mode: DefenseMode
  activeMode: DefenseMode
  onChange: (value: DefenseMode) => void
}

function ModeButton({ mode, activeMode, onChange }: ModeButtonProps) {
  const active = mode === activeMode
  const style = mode === 'block' ? 'border-red-400/60 text-red-200' : 'border-cyan-300/60 text-cyan-200'

  return (
    <button
      type="button"
      className={`rounded-md border px-3 py-2 text-sm font-medium capitalize transition ${style} ${active ? 'bg-white/10' : 'bg-transparent'}`}
      onClick={() => onChange(mode)}
      aria-pressed={active}
    >
      {mode} mode
    </button>
  )
}

type StatCardProps = {
  label: string
  value: string | number
  tone: 'danger' | 'cyan' | 'violet' | 'green'
}

function StatCard({ label, value, tone }: StatCardProps) {
  const tones = {
    danger: 'border-red-400/40 text-red-100',
    cyan: 'border-cyan-400/40 text-cyan-100',
    violet: 'border-violet-400/40 text-violet-100',
    green: 'border-green-400/40 text-green-100',
  }

  return (
    <div className={`rounded-lg border bg-black/30 p-3 ${tones[tone]}`}>
      <p className="text-xs uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  )
}

type PanelProps = {
  title: string
  children: React.ReactNode
}

function Panel({ title, children }: PanelProps) {
  return (
    <section className="section-card" aria-label={title}>
      <h2 className="mb-3 text-lg font-semibold text-cyan-100">{title}</h2>
      {children}
    </section>
  )
}

type SignalProps = {
  term: string
  detail: string
}

function Signal({ term, detail }: SignalProps) {
  return (
    <div className="rounded-md border border-slate-700 bg-black/30 p-3">
      <dt className="text-slate-400">{term}</dt>
      <dd>{detail}</dd>
    </div>
  )
}

type CompareCardProps = {
  title: string
  rows: string[]
}

function CompareCard({ title, rows }: CompareCardProps) {
  return (
    <div className="rounded-md border border-slate-700 bg-black/30 p-3">
      <h3 className="mb-2 text-sm font-semibold text-violet-200">{title}</h3>
      <ul className="space-y-1 text-slate-300">
        {rows.map((row) => (
          <li key={row}>{row}</li>
        ))}
      </ul>
    </div>
  )
}

type StatusCardProps = {
  label: string
  status: string
  tone: string
}

function StatusCard({ label, status, tone }: StatusCardProps) {
  const tones: Record<string, string> = {
    safe: 'border-green-400/40 text-green-100',
    warn: 'border-amber-400/40 text-amber-100',
    danger: 'border-red-400/40 text-red-100',
  }

  return (
    <div className={`rounded-md border bg-black/40 p-3 text-xs uppercase tracking-wide ${tones[tone] ?? tones.warn}`}>
      <p>{label}</p>
      <p className="mt-1 text-sm font-semibold">{status}</p>
    </div>
  )
}

export default App
