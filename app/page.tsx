'use client'

import { useState } from 'react'
import { Bluetooth, ChevronRight, CircleHelp, MessageCircle, MoreHorizontal, RefreshCw, Settings, ShieldCheck, Signal } from 'lucide-react'

const devices = [
  { name: 'Maya’s Pixel 9', id: 'Pikc · 7A 3F', initials: 'MP', signal: 'Strong', color: 'green' },
  { name: 'Alex’s iPhone', id: 'Pikc · 11 C8', initials: 'AI', signal: 'Good' },
  { name: 'Jordan’s MacBook', id: 'Pikc · 42 D1', initials: 'JM', signal: 'Good' },
]

export default function Home() {
  const [scanning, setScanning] = useState(false)
  const [connected, setConnected] = useState(2)
  const [activeDevice, setActiveDevice] = useState('Maya’s Pixel 9')
  const scan = async () => {
    setScanning(true)
    try {
      if ('bluetooth' in navigator) {
        const bluetooth = (navigator as Navigator & { bluetooth: { requestDevice: (options: { acceptAllDevices: boolean }) => Promise<unknown> } }).bluetooth
        await bluetooth.requestDevice({ acceptAllDevices: true })
      }
    } catch {
      // User cancellation is a normal part of the discovery flow.
    } finally {
      window.setTimeout(() => setScanning(false), 500)
    }
  }
  return <main className="page-shell">
    <header className="topbar">
      <div className="brand"><span className="brand-mark"><Bluetooth size={15} strokeWidth={2.5} /></span>pikc</div>
      <div className="top-actions"><div className="network-pill"><span className="dot" /> <span>Offline network active</span></div><button className="icon-button" aria-label="Settings"><Settings size={17} /></button><button className="icon-button" aria-label="More options"><MoreHorizontal size={18} /></button></div>
    </header>
    <div className="content">
      <section className="hero"><div><div className="eyebrow">Private proximity network / 01</div><h1>Talk to people<br /><span>nearby.</span></h1></div><p className="hero-copy">Pikc creates a private, offline network around you. No towers, no accounts, no trail — just a direct connection.</p></section>
      <section className="grid">
        <article className="glass card map-card"><div className="card-header"><div><h2 className="card-title">Your nearby network</h2><p className="card-subtitle">Devices within Bluetooth range</p></div><button className="icon-button" onClick={scan} aria-label="Scan for nearby devices"><RefreshCw size={16} className={scanning ? 'spin' : ''} /></button></div>
          <div className="map-stage"><div className="orbit" /><div className="orbit two" /><div className="orbit three" /><div className="core" aria-label="Your device"><span /></div><div className="node one">Maya</div><div className="node two">Alex</div><div className="node three">Jordan</div><div className="node four">Sam</div></div>
          <div className="stat-row"><div className="stat"><strong>{connected}</strong><small>connected now</small></div><div className="stat"><strong>48m</strong><small>network radius</small></div><div className="stat"><strong>0 kb</strong><small>internet used</small></div></div>
        </article>
        <aside className="glass card"><div className="card-header"><div><h2 className="card-title">Nearby devices</h2><p className="card-subtitle">Tap to start a conversation</p></div><Signal size={16} color="#79e2ac" /></div>
          <div className="device-list">{devices.map((device, index) => <button key={device.name} className={'device ' + (activeDevice === device.name ? 'active' : '')} onClick={() => setActiveDevice(device.name)}><span className="device-avatar">{device.initials}</span><span className="device-info"><span className="device-name">{device.name}</span><span className="device-meta">{device.id}</span></span><span className="device-signal">{device.signal}</span><ChevronRight className="arrow" size={15} /></button>)}</div>
          <div className="action-row"><button className="button" onClick={() => setConnected((value) => Math.min(4, value + 1))}><MessageCircle size={15} /> Message {activeDevice.split('’')[0]}</button><button className="button secondary" onClick={scan}>{scanning ? 'Scanning' : 'Scan'}</button></div>
        </aside>
      </section>
      <div className="footer-note"><ShieldCheck size={14} color="#79e2ac" /><span><b>End-to-end nearby.</b> Messages stay on your device and travel directly over Bluetooth.</span><CircleHelp size={14} /></div>
    </div>
    <style jsx global>{`.spin { animation: spin .8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </main>
}
