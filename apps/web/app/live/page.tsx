'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Radio, Users, ShoppingCart, MessageCircle, Bell, Play, Clock,
  Star, Zap, ChevronRight, Heart,
} from 'lucide-react'
import { products } from '@/lib/data'
import { formatKES } from '@/lib/utils'
import { useCartStore } from '@/lib/store'

const liveSession = {
  id: 'live-1',
  host: 'Grace Njeri',
  hostRole: 'Tech Reviewer · TikTok 280K',
  avatar: 'GN',
  title: '🔥 Unboxing & LIVE Deals – Smartphones & Laptops',
  viewers: 312,
  startedAgo: '14 min ago',
  products: products.slice(0, 4),
}

const upcomingSessions = [
  { id: 'u1', host: 'Brian Omondi', title: 'Best 4K TVs Under KES 60K – LIVE Reveal', date: 'Today 7:00 PM', avatar: 'BO', category: 'Televisions', viewers: 0 },
  { id: 'u2', host: 'Aisha Mohamed', title: 'Fridge & Washing Machine Flash Sale LIVE', date: 'Tomorrow 12:00 PM', avatar: 'AM', category: 'Appliances', viewers: 0 },
  { id: 'u3', host: 'Kevin Mwangi', title: 'Gaming Laptops & Accessories Deep Dive', date: 'Sat 3:00 PM', avatar: 'KM', category: 'Laptops', viewers: 0 },
]

const replays = [
  { id: 'r1', host: 'Grace Njeri', title: 'Samsung Galaxy S24 Unboxing + M-PESA Tips', views: 4800, duration: '42 min', thumbnail: products[0]?.images[0] ?? '' },
  { id: 'r2', host: 'Brian Omondi', title: 'Top 5 Laptops Under KES 70K – Oct 2025', views: 3200, duration: '35 min', thumbnail: products[1]?.images[0] ?? '' },
  { id: 'r3', host: 'Aisha Mohamed', title: 'LG Fridge vs Samsung Fridge – Honest Review', views: 2100, duration: '28 min', thumbnail: products[3]?.images[0] ?? '' },
]

function pad(n: number) { return String(n).padStart(2, '0') }

export default function LivePage() {
  const addItem = useCartStore((s) => s.addItem)
  const [viewers, setViewers] = useState(liveSession.viewers)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Wanjiku', msg: 'Is the Galaxy S24 available in blue?' },
    { id: 2, user: 'Kamau', msg: 'How long does delivery take to Kisumu?' },
    { id: 3, user: 'Aisha', msg: 'Omg that price!! 🔥🔥' },
    { id: 4, user: 'Brian', msg: 'Does it support M-PESA payments?' },
    { id: 5, user: 'Njeri', msg: 'Love this show! Tuned in from Mombasa 🌊' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [pinnedProductIdx, setPinnedProductIdx] = useState(0)
  const [notified, setNotified] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 23, s: 47 })

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 3) - 1)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        const total = t.h * 3600 + t.m * 60 + t.s - 1
        if (total <= 0) return { h: 0, m: 0, s: 0 }
        return { h: Math.floor(total / 3600), m: Math.floor((total % 3600) / 60), s: total % 60 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    setChatMessages((msgs) => [...msgs.slice(-19), { id: Date.now(), user: 'You', msg: chatInput.trim() }])
    setChatInput('')
  }

  const pinnedProduct = liveSession.products[pinnedProductIdx]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Radio size={22} className="text-red-500 animate-pulse" />
            Live Shopping
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Real-time demos, instant deals, M-PESA checkout</p>
        </div>
        <Link href="/products" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
          Browse all products <ChevronRight size={14} />
        </Link>
      </div>

      {/* Live now */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        {/* Stream player */}
        <div className="lg:col-span-2">
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden">
            {/* Simulated stream background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-brand-950 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play size={36} className="text-white ml-1" />
                </div>
                <p className="text-white font-semibold">Live Stream Preview</p>
                <p className="text-slate-400 text-sm">Connect your stream via OBS / TikTok LIVE</p>
              </div>
            </div>

            {/* Live badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> LIVE
              </span>
              <span className="flex items-center gap-1 bg-black/60 text-white text-xs px-2.5 py-1.5 rounded-full">
                <Users size={11} /> {Math.max(viewers, 1)} watching
              </span>
            </div>

            {/* Host info */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="w-9 h-9 bg-brand-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                {liveSession.avatar}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{liveSession.host}</p>
                <p className="text-slate-300 text-xs">{liveSession.hostRole}</p>
              </div>
            </div>

            {/* Flash deal timer overlay */}
            <div className="absolute top-4 right-4 bg-flash-DEFAULT text-white px-3 py-2 rounded-xl text-center">
              <p className="text-[9px] font-medium uppercase tracking-wide">Flash deal ends</p>
              <p className="text-lg font-extrabold tabular-nums">{pad(timeLeft.m)}:{pad(timeLeft.s)}</p>
            </div>
          </div>

          {/* Session title */}
          <div className="mt-3">
            <h2 className="font-bold text-slate-900 text-lg">{liveSession.title}</h2>
            <p className="text-slate-500 text-sm">Started {liveSession.startedAgo}</p>
          </div>

          {/* Pinned products in session */}
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Products in this session</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {liveSession.products.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setPinnedProductIdx(i)}
                  className={`shrink-0 flex items-center gap-2 border rounded-2xl p-2 transition-colors ${pinnedProductIdx === i ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                >
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-50">
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-slate-800 max-w-[100px] truncate">{p.name}</p>
                    <p className="text-xs font-bold text-brand-700">{formatKES(p.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* Pinned product buy card */}
          {pinnedProduct && (
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Zap size={14} className="text-flash-DEFAULT" fill="currentColor" />
                <span className="text-xs font-bold text-flash-DEFAULT uppercase">Live Deal</span>
              </div>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3">
                <Image src={pinnedProduct.images[0]} alt={pinnedProduct.name} fill className="object-contain p-2" sizes="200px" />
                {pinnedProduct.discount && (
                  <span className="absolute top-2 left-2 bg-flash-DEFAULT text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    -{pinnedProduct.discount}%
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-800 line-clamp-2 mb-1">{pinnedProduct.name}</p>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-extrabold text-slate-900">{formatKES(pinnedProduct.price)}</span>
                {pinnedProduct.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">{formatKES(pinnedProduct.originalPrice)}</span>
                )}
              </div>
              <button
                onClick={() => addItem({ id: pinnedProduct.id, name: pinnedProduct.name, brand: pinnedProduct.brand, price: pinnedProduct.price, image: pinnedProduct.images[0], category: pinnedProduct.category, sellerId: pinnedProduct.seller.id, sellerName: pinnedProduct.seller.name })}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-2xl font-semibold text-sm transition-colors mb-2"
              >
                <ShoppingCart size={16} /> Buy Now · M-PESA
              </button>
              <p className="text-[10px] text-center text-slate-400">🔒 Secure M-PESA checkout · Delivered to your door</p>
            </div>
          )}

          {/* Live chat */}
          <div className="bg-white rounded-2xl border border-slate-100 flex flex-col" style={{ height: '260px' }}>
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <MessageCircle size={15} className="text-brand-600" />
              <span className="text-sm font-semibold text-slate-800">Live Chat</span>
              <span className="ml-auto text-[10px] text-slate-400">{Math.max(viewers, 1)} online</span>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-xs">
                  <span className={`font-semibold ${msg.user === 'You' ? 'text-brand-600' : 'text-slate-700'}`}>{msg.user}: </span>
                  <span className="text-slate-600">{msg.msg}</span>
                </div>
              ))}
            </div>
            <form onSubmit={sendChat} className="px-3 py-2 border-t border-slate-100 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Say something..."
                className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-400"
              />
              <button type="submit" className="bg-brand-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium">Send</button>
            </form>
          </div>
        </div>
      </div>

      {/* Upcoming sessions */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock size={18} className="text-brand-600" /> Upcoming Live Sessions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-3">
              <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">
                {session.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">{session.title}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock size={10} /> {session.date}</p>
                <p className="text-xs text-brand-600 mt-0.5">{session.category}</p>
              </div>
              <button
                onClick={() => setNotified((n) => n.includes(session.id) ? n : [...n, session.id])}
                className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${notified.includes(session.id) ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-brand-100 hover:text-brand-600'}`}
                title={notified.includes(session.id) ? 'Reminder set' : 'Notify me'}
              >
                <Bell size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Replays */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Play size={18} className="text-brand-600" /> Session Replays
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {replays.map((replay) => (
            <div key={replay.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative aspect-video bg-slate-900">
                {replay.thumbnail && (
                  <Image src={replay.thumbnail} alt={replay.title} fill className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" sizes="(max-width: 640px) 100vw, 33vw" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Play size={20} className="text-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                  {replay.duration}
                </span>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-slate-800 line-clamp-2">{replay.title}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                  <span>{replay.host}</span>
                  <span className="flex items-center gap-1"><Users size={10} /> {replay.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
