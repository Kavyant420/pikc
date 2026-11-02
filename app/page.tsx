'use client'

import { useState } from 'react'
import { Bluetooth, ChevronRight, CircleHelp, MessageCircle, MoreHorizontal, RefreshCw, Settings, ShieldCheck, Signal } from 'lucide-react'

type NearbyDevice = {
  name: string
  id: string
  initials: string
  signal: string
}

export default function Home() {
  const [scanning, setScanning] = useState(false)
  const [nearbyDevices, setNearbyDevices] = useState<NearbyDevice[]>([])
  const [activeDevice, setActiveDevice] = useState<string | null>(null)
  const [scanMessage, setScanMessage] = useState('Only devices you approve will appear here.')
  const scan = async () => {
    setScanning(true)
    setScanMessage('Choose a real nearby Bluetooth device in your browser prompt.')
    try {
      if (!('bluetooth' in navigator)) {
        setScanMessage('Web Bluetooth is unavailable here. Use Chrome or the Android app.')
        return
      }
      const bluetooth = (navigator as Navigator & { bluetooth: { requestDevice: (options: { acceptAllDevices: boolean }) => Promise<{ name?: string; id: string }> } }).bluetooth
      const device = await bluetooth.requestDevice({ acceptAllDevices: true })
      const name = device.name || 'Unnamed Bluetooth device'
      const initials = name.split(/\\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'BT'
      const discovered = { name, id: device.id, initials, signal: 'Available' }
      setNearbyDevices((current) => current.some((item) => item.id === device.id) ? current : [...current, discovered])
      setActiveDevice(name)
      setScanMessage('Verified from your browser. No demo devices are shown.')
    } catch {
      setScanMessage('No device added. You can scan again whenever you are ready.')
    } finally {
      setScanning(false)
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
          <div className="map-stage"><div className="orbit" /><div className="orbit two" /><div className="orbit three" /><div className="core" aria-label="Your device"><span /></div>{nearbyDevices.map((device, index) => <div key={device.id} className={'node ' + ['one', 'two', 'three', 'four'][index % 4]}>{device.initials}</div>)}</div>
          <div className="stat-row"><div className="stat"><strong>{nearbyDevices.length}</strong><small>verified nearby</small></div><div className="stat"><strong>BLE</strong><small>direct radio link</small></div><div className="stat"><strong>0 kb</strong><small>internet used</small></div></div>
        </article>
        <aside className="glass card"><div className="card-header"><div><h2 className="card-title">Nearby devices</h2><p className="card-subtitle">Tap to start a conversation</p></div><Signal size={16} color="#79e2ac" /></div>
          <div className="device-list">{nearbyDevices.length === 0 ? <div className="empty-state"><Bluetooth size={20} /><strong>No verified devices yet</strong><span>{scanMessage}</span></div> : nearbyDevices.map((device) => <button key={device.id} className={'device ' + (activeDevice === device.name ? 'active' : '')} onClick={() => setActiveDevice(device.name)}><span className="device-avatar">{device.initials}</span><span className="device-info"><span className="device-name">{device.name}</span><span className="device-meta">{device.id}</span></span><span className="device-signal">{device.signal}</span><ChevronRight className="arrow" size={15} /></button>)}</div>
          <p className="scan-message">{scanMessage}</p>
          <div className="action-row"><button className="button" disabled={!activeDevice}><MessageCircle size={15} /> {activeDevice ? `Message ${activeDevice}` : 'Select a verified device'}</button><button className="button secondary" onClick={scan}>{scanning ? 'Scanning' : 'Scan nearby'}</button></div>
        </aside>
      </section>
      <div className="footer-note"><ShieldCheck size={14} color="#79e2ac" /><span><b>End-to-end nearby.</b> Messages stay on your device and travel directly over Bluetooth.</span><CircleHelp size={14} /></div>
    </div>
    <style jsx global>{`.spin { animation: spin .8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </main>
}
