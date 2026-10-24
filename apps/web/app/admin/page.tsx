'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  BarChart3, Users, ShoppingCart, AlertTriangle, TrendingUp,
  Store, CheckCircle2, RefreshCw, Search, ShieldCheck, Building2,
  ArrowUpRight, Clock, XCircle, Package, ChevronRight,
} from 'lucide-react'
import { sellers as mockSellers, mockOrders } from '@/lib/data'
import { formatKES, timeAgo } from '@/lib/utils'
import { api, type ApiOrder, type ApiSeller, type ApiVerificationRequest, type ApiTenant } from '@/lib/api'


// ─── Style maps (dark theme) ─────────────────────────────────────────────────

const BADGE: Record<string, string> = {
  authorized: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  premium:    'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  verified:   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  basic:      'bg-white/5 text-white/40 border border-white/10',
}

const ORDER_STATUS_STYLE: Record<string, string> = {
  delivered:  'bg-emerald-500/10 text-emerald-400',
  processing: 'bg-blue-500/10 text-blue-400',
  shipped:    'bg-violet-500/10 text-violet-400',
  cancelled:  'bg-red-500/10 text-red-400',
  pending:    'bg-yellow-500/10 text-yellow-400',
  confirmed:  'bg-teal-500/10 text-teal-400',
}

const KYC_STYLE: Record<string, string> = {
  pending:      'bg-yellow-500/10 text-yellow-400',
  under_review: 'bg-blue-500/10 text-blue-400',
  approved:     'bg-emerald-500/10 text-emerald-400',
  rejected:     'bg-red-500/10 text-red-400',
}

const PLAN_STYLE: Record<string, string> = {
  starter:    'bg-white/5 text-white/50',
  growth:     'bg-blue-500/10 text-blue-400',
  enterprise: 'bg-violet-500/10 text-violet-400',
}

const TENANT_STATUS_STYLE: Record<string, string> = {
  active:       'bg-emerald-500/10 text-emerald-400',
  provisioning: 'bg-yellow-500/10 text-yellow-400',
  suspended:    'bg-red-500/10 text-red-400',
  deleted:      'bg-white/5 text-white/30',
}

const ORDER_STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

// ─── Sub-components ──────────────────────────────────────────────────────────

function Pill({ label, style }: { label: string; style: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${style}`}>
      {label.replace(/_/g, ' ')}
    </span>
  )
}

function StatCard({ label, value, icon: Icon, sub, accent = false }: {
  label: string; value: string; icon: any; sub?: string; accent?: boolean
}) {
  return (
    <div className={`rounded-2xl border p-4 flex flex-col gap-3 ${accent ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.03] border-white/[0.07]'}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40 font-medium">{label}</p>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent ? 'bg-emerald-500/15' : 'bg-white/[0.06]'}`}>
          <Icon size={14} className={accent ? 'text-emerald-400' : 'text-white/40'} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function SectionHeader({ title, count, onRefresh, loading }: { title: string; count?: number; onRefresh?: () => void; loading?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {count !== undefined && (
          <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-xs text-white/40 font-medium">{count}</span>
        )}
      </div>
      {onRefresh && (
        <button onClick={onRefresh} disabled={loading} className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors disabled:opacity-40">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      )}
    </div>
  )
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left py-3 px-4 text-[11px] font-semibold text-white/30 uppercase tracking-wider">{children}</th>
}

function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-16 text-center">
      <Icon size={36} className="text-white/10 mx-auto mb-3" />
      <p className="text-white/30 text-sm">{message}</p>
    </div>
  )
}

export default function AdminPage() {
  const [tab, setTab] = useState<'overview' | 'orders' | 'sellers' | 'kyc' | 'tenants'>('overview')
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [liveSellers, setLiveSellers] = useState<ApiSeller[]>([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [orderPage, setOrderPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [orderSearch, setOrderSearch] = useState('')
  const [sellerSearch, setSellerSearch] = useState('')
  const [isLive, setIsLive] = useState(false)
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [kycRequests, setKycRequests] = useState<ApiVerificationRequest[]>([])
  const [totalKyc, setTotalKyc] = useState(0)
  const [kycReviewing, setKycReviewing] = useState<string | null>(null)
  const [tenants, setTenants] = useState<ApiTenant[]>([])
  const [totalTenants, setTotalTenants] = useState(0)
  const [tenantForm, setTenantForm] = useState({ name: '', slug: '', plan: 'starter' })
  const [creatingTenant, setCreatingTenant] = useState(false)
  const [tenantError, setTenantError] = useState<string | null>(null)

  // ─── Data fetching ────────────────────────────────────────────────────────

  const fetchOrders = useCallback(async (page = 1, status?: string) => {
    setLoading(true)
    const result = await api.adminGetAllOrders(page, status)
    if (result) { setOrders(result.data); setTotalOrders(result.total); setIsLive(true) }
    else {
      setOrders(mockOrders.map((o: any) => ({ ...o, orderNumber: o.id, paymentStatus: 'paid', items: [], tax: 0, deliveryFee: 0, discount: 0, subtotal: o.total, mpesaReceiptNumber: null, mpesaTransactionId: null, shippingAddress: {} })))
      setIsLive(false)
    }
    setLoading(false)
  }, [])

  const fetchSellers = useCallback(async () => {
    const r = await api.adminGetSellers(); if (r) setLiveSellers(r.data)
  }, [])

  const fetchKyc = useCallback(async () => {
    const r = await api.adminGetVerifications(1); if (r) { setKycRequests(r.data); setTotalKyc(r.total) }
  }, [])

  const fetchTenants = useCallback(async () => {
    const r = await api.getTenants(); if (r) { setTenants(r.data); setTotalTenants(r.total) }
  }, [])

  useEffect(() => { fetchOrders(orderPage, statusFilter) }, [orderPage, statusFilter, fetchOrders])
  useEffect(() => { fetchSellers() }, [fetchSellers])
  useEffect(() => { fetchKyc() }, [fetchKyc])
  useEffect(() => { fetchTenants() }, [fetchTenants])

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId)
    await api.adminUpdateOrderStatus(orderId, status)
    await fetchOrders(orderPage, statusFilter)
    setUpdatingId(null)
  }

  const handleKycReview = async (id: string, status: 'approved' | 'rejected') => {
    setKycReviewing(id)
    await api.adminReviewVerification(id, status, status === 'rejected' ? 'Documents insufficient or incomplete' : undefined)
    await fetchKyc()
    setKycReviewing(null)
  }

  const handleCreateTenant = async () => {
    if (!tenantForm.name || !tenantForm.slug) return
    setCreatingTenant(true); setTenantError(null)
    const r = await api.createTenant(tenantForm)
    if (r) { setTenantForm({ name: '', slug: '', plan: 'starter' }); await fetchTenants() }
    else setTenantError('Slug already taken or invalid.')
    setCreatingTenant(false)
  }

  const handleTenantToggle = async (slug: string, current: string) => {
    await api.updateTenant(slug, { status: current === 'active' ? 'suspended' : 'active' })
    await fetchTenants()
  }

  // ─── Derived ──────────────────────────────────────────────────────────────

  const displaySellers = useMemo(() => {
    const base = liveSellers.length > 0
      ? liveSellers.map((s) => ({ ...s, name: s.businessName, isVerified: s.verified }))
      : mockSellers
    const q = sellerSearch.toLowerCase()
    return q ? base.filter((s) => s.name.toLowerCase().includes(q)) : base
  }, [liveSellers, sellerSearch])

  const displayOrders = useMemo(() => {
    const q = orderSearch.toLowerCase()
    return q ? orders.filter((o) => o.orderNumber?.toLowerCase().includes(q)) : orders
  }, [orders, orderSearch])

  const kycPending = kycRequests.filter((r) => r.status === 'pending').length

  // ─── UI ───────────────────────────────────────────────────────────────────

  const TABS = [
    { key: 'overview', label: 'Overview', icon: TrendingUp },
    { key: 'orders',   label: 'Orders',   icon: ShoppingCart, count: totalOrders },
    { key: 'sellers',  label: 'Sellers',  icon: Store,        count: liveSellers.length || mockSellers.length },
    { key: 'kyc',      label: 'KYC',      icon: ShieldCheck,  count: kycPending, alert: kycPending > 0 },
    { key: 'tenants',  label: 'Tenants',  icon: Building2,    count: totalTenants },
  ]

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Platform Overview</h1>
          <p className="text-sm text-white/40 mt-0.5">
            {isLive ? (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                Live data · backend connected
              </span>
            ) : 'Showing mock data — start backend on :4000 to connect'}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Orders"    value={isLive ? totalOrders.toLocaleString() : '1,248'} icon={ShoppingCart} sub="all time" accent />
        <StatCard label="Active Sellers"  value={String(liveSellers.length || mockSellers.length)} icon={Store}        sub="on platform" />
        <StatCard label="KYC Pending"     value={String(kycPending)}             icon={ShieldCheck} sub="awaiting review" />
        <StatCard label="Tenants"         value={String(totalTenants)}            icon={Building2}   sub="provisioned" />
      </div>

      {/* KYC alert banner */}
      {kycPending > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
          <AlertTriangle size={15} className="text-yellow-400 shrink-0" />
          <p className="text-sm text-yellow-300 font-medium">{kycPending} KYC request{kycPending > 1 ? 's' : ''} pending review</p>
          <button onClick={() => setTab('kyc')} className="ml-auto flex items-center gap-1 text-xs text-yellow-400 hover:text-yellow-300 font-medium">
            Review <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.04] p-1 rounded-xl w-fit flex-wrap">
        {TABS.map(({ key, label, icon: Icon, count, alert }) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === key ? 'bg-white/[0.08] text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
          >
            <Icon size={14} />
            {label}
            {count !== undefined && count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none
                ${alert ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/[0.08] text-white/40'}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Overview ─────────────────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={15} className="text-white/40" />
              <h3 className="text-sm font-semibold text-white">Top Categories</h3>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Smartphones', pct: 35, value: 'KES 4.3M' },
                { name: 'Laptops',     pct: 22, value: 'KES 2.7M' },
                { name: 'Televisions', pct: 18, value: 'KES 2.2M' },
                { name: 'Fridges',     pct: 14, value: 'KES 1.7M' },
                { name: 'Accessories', pct: 11, value: 'KES 1.4M' },
              ].map(({ name, pct, value }) => (
                <div key={name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/60">{name}</span>
                    <span className="text-white/30">{value}</span>
                  </div>
                  <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-5">
              <Clock size={15} className="text-white/40" />
              <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
            </div>
            <div className="space-y-4">
              {[
                { icon: CheckCircle2, c: 'text-emerald-400', t: 'New seller "TechHub Kenya" verified',  d: '2h ago' },
                { icon: ShoppingCart, c: 'text-blue-400',    t: '48 new orders received today',         d: '3h ago' },
                { icon: AlertTriangle,c: 'text-yellow-400',  t: 'Dispute filed for order ORD-8821',     d: '5h ago' },
                { icon: Users,        c: 'text-violet-400',  t: '127 new customer registrations',       d: '1d ago' },
                { icon: Package,      c: 'text-white/40',    t: 'Samsung added 15 new products',        d: '1d ago' },
              ].map(({ icon: Icon, c, t, d }) => (
                <div key={t} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                    <Icon size={12} className={c} />
                  </div>
                  <span className="flex-1 text-xs text-white/60 leading-relaxed">{t}</span>
                  <span className="text-[10px] text-white/25 shrink-0">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Orders ───────────────────────────────────────────────────────────── */}
      {tab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search order #…"
                className="pl-8 pr-3 py-2 text-xs bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-emerald-500/40 w-44"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[undefined, ...ORDER_STATUSES].map((s) => (
                <button key={s ?? 'all'} onClick={() => { setStatusFilter(s); setOrderPage(1) }}
                  className={`px-3 py-1.5 text-[11px] font-medium rounded-lg capitalize transition-all
                    ${statusFilter === s ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'text-white/40 border border-white/[0.07] hover:border-white/20 hover:text-white/60'}`}>
                  {s ?? 'All'}
                </button>
              ))}
            </div>
            <SectionHeader title="" onRefresh={() => fetchOrders(orderPage, statusFilter)} loading={loading} />
          </div>

          {displayOrders.length === 0
            ? <EmptyState icon={ShoppingCart} message="No orders found" />
            : (
            <TableWrap>
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <Th>Order</Th><Th>Customer</Th><Th>Total</Th><Th>Payment</Th><Th>Status</Th><Th>Date</Th>
                  {isLive && <Th>Update</Th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {displayOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-xs font-semibold text-emerald-400">{o.orderNumber}</p>
                      <p className="text-[10px] text-white/25 mt-0.5">{o.id.slice(0, 8)}…</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-xs text-white/70">{(o.shippingAddress as any)?.name ?? '—'}</p>
                      <p className="text-[10px] text-white/30">{o.paymentMethod}</p>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-white">{formatKES(o.total)}</td>
                    <td className="py-3 px-4">
                      <Pill label={o.paymentStatus} style={o.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'} />
                    </td>
                    <td className="py-3 px-4">
                      <Pill label={o.status} style={ORDER_STATUS_STYLE[o.status] ?? 'bg-white/5 text-white/40'} />
                    </td>
                    <td className="py-3 px-4 text-[11px] text-white/30">{timeAgo(o.createdAt)}</td>
                    {isLive && (
                      <td className="py-3 px-4">
                        <select
                          defaultValue={o.status}
                          disabled={updatingId === o.id}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="text-[11px] bg-white/[0.06] border border-white/[0.08] text-white/70 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500/40 capitalize disabled:opacity-40"
                        >
                          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}

          {isLive && totalOrders > 20 && (
            <div className="flex items-center justify-between text-xs text-white/30">
              <span>Showing {((orderPage - 1) * 20) + 1}–{Math.min(orderPage * 20, totalOrders)} of {totalOrders.toLocaleString()}</span>
              <div className="flex gap-2">
                <button disabled={orderPage <= 1} onClick={() => setOrderPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-lg border border-white/[0.07] hover:border-white/20 disabled:opacity-30 transition-colors">← Prev</button>
                <button disabled={orderPage * 20 >= totalOrders} onClick={() => setOrderPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg border border-white/[0.07] hover:border-white/20 disabled:opacity-30 transition-colors">Next →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Sellers ──────────────────────────────────────────────────────────── */}
      {tab === 'sellers' && (
        <div className="space-y-4">
          <div className="relative w-52">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={sellerSearch} onChange={(e) => setSellerSearch(e.target.value)}
              placeholder="Search seller…"
              className="pl-8 pr-3 py-2 w-full text-xs bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-emerald-500/40" />
          </div>
          {displaySellers.length === 0
            ? <EmptyState icon={Store} message="No sellers found" />
            : (
            <TableWrap>
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <Th>Seller</Th><Th>Location</Th><Th>Rating</Th><Th>Sales</Th><Th>Badge</Th><Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {displaySellers.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-xs font-semibold text-white/80">{s.name}</p>
                      <p className="text-[10px] text-white/30">{s.salesCount?.toLocaleString()} sales</p>
                    </td>
                    <td className="py-3 px-4 text-xs text-white/40">{s.location ?? '—'}</td>
                    <td className="py-3 px-4 text-xs text-yellow-400 font-medium">★ {s.rating}</td>
                    <td className="py-3 px-4 text-xs text-white/50">{s.salesCount?.toLocaleString() ?? '0'}</td>
                    <td className="py-3 px-4"><Pill label={s.badge} style={BADGE[s.badge] ?? 'bg-white/5 text-white/40'} /></td>
                    <td className="py-3 px-4">
                      {s.isVerified
                        ? <span className="flex items-center gap-1.5 text-[11px] text-emerald-400"><CheckCircle2 size={11} />Verified</span>
                        : <span className="flex items-center gap-1.5 text-[11px] text-yellow-400"><Clock size={11} />Pending</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </div>
      )}

      {/* ── KYC ──────────────────────────────────────────────────────────────── */}
      {tab === 'kyc' && (
        <div className="space-y-4">
          <SectionHeader title="Verification Requests" count={totalKyc} onRefresh={fetchKyc} />
          {kycRequests.length === 0
            ? <EmptyState icon={CheckCircle2} message="No pending verification requests" />
            : (
            <TableWrap>
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <Th>Seller</Th><Th>Tier</Th><Th>Documents</Th><Th>Status</Th><Th>Submitted</Th><Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {kycRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-xs font-semibold text-white/80">{req.seller.businessName}</p>
                      <p className="text-[10px] text-white/30">{req.seller.slug}</p>
                    </td>
                    <td className="py-3 px-4"><Pill label={req.tier} style={BADGE[req.tier] ?? 'bg-white/5 text-white/40'} /></td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {req.documents.map((d) => (
                          <a key={d.key} href={d.url} target="_blank" rel="noopener noreferrer"
                            className="text-[10px] bg-white/[0.06] hover:bg-white/[0.1] text-white/50 px-2 py-0.5 rounded capitalize transition-colors flex items-center gap-1">
                            {d.type.replace(/_/g, ' ')} <ArrowUpRight size={9} />
                          </a>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4"><Pill label={req.status} style={KYC_STYLE[req.status] ?? 'bg-white/5 text-white/40'} /></td>
                    <td className="py-3 px-4 text-[11px] text-white/30">{timeAgo(req.submittedAt)}</td>
                    <td className="py-3 px-4">
                      {(req.status === 'pending' || req.status === 'under_review') && (
                        <div className="flex gap-2">
                          <button disabled={kycReviewing === req.id} onClick={() => handleKycReview(req.id, 'approved')}
                            className="flex items-center gap-1 text-[11px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-2.5 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-40">
                            <CheckCircle2 size={11} /> Approve
                          </button>
                          <button disabled={kycReviewing === req.id} onClick={() => handleKycReview(req.id, 'rejected')}
                            className="flex items-center gap-1 text-[11px] bg-red-500/10 hover:bg-red-500/20 text-red-400 px-2.5 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-40">
                            <XCircle size={11} /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </div>
      )}

      {/* ── Tenants ──────────────────────────────────────────────────────────── */}
      {tab === 'tenants' && (
        <div className="space-y-5">
          {/* Provision form */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={14} className="text-white/40" />
              <h3 className="text-sm font-semibold text-white">Provision New Tenant</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <input placeholder="Business name" value={tenantForm.name}
                onChange={(e) => setTenantForm((f) => ({ ...f, name: e.target.value }))}
                className="px-3 py-2.5 text-xs bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-emerald-500/40" />
              <input placeholder="slug (e.g. techshop)" value={tenantForm.slug}
                onChange={(e) => setTenantForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                className="px-3 py-2.5 text-xs bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-emerald-500/40" />
              <select value={tenantForm.plan} onChange={(e) => setTenantForm((f) => ({ ...f, plan: e.target.value }))}
                className="px-3 py-2.5 text-xs bg-white/[0.05] border border-white/[0.08] rounded-xl text-white/70 focus:outline-none focus:border-emerald-500/40">
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            {tenantError && <p className="text-red-400 text-xs mt-2">{tenantError}</p>}
            <button disabled={creatingTenant || !tenantForm.name || !tenantForm.slug} onClick={handleCreateTenant}
              className="mt-3 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-xl transition-colors disabled:opacity-40">
              {creatingTenant ? 'Provisioning…' : 'Create Tenant'}
            </button>
          </div>

          {tenants.length === 0
            ? <EmptyState icon={Building2} message="No tenants provisioned yet" />
            : (
            <TableWrap>
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <Th>Tenant</Th><Th>Schema</Th><Th>Domain</Th><Th>Plan</Th><Th>Status</Th><Th>Created</Th><Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-xs font-semibold text-white/80">{t.name}</p>
                      <p className="text-[10px] text-white/30">{t.slug}</p>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-[10px] bg-white/[0.06] px-2 py-0.5 rounded text-white/50">{t.schemaName}</code>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-white/40">{t.domain ?? `${t.subdomain}.msingi.co.ke`}</td>
                    <td className="py-3 px-4"><Pill label={t.plan} style={PLAN_STYLE[t.plan] ?? 'bg-white/5 text-white/40'} /></td>
                    <td className="py-3 px-4"><Pill label={t.status} style={TENANT_STATUS_STYLE[t.status] ?? 'bg-white/5 text-white/40'} /></td>
                    <td className="py-3 px-4 text-[11px] text-white/30">{timeAgo(t.createdAt)}</td>
                    <td className="py-3 px-4">
                      {t.status !== 'provisioning' && (
                        <button onClick={() => handleTenantToggle(t.slug, t.status)}
                          className={`text-[11px] px-2.5 py-1.5 rounded-lg font-medium transition-colors
                            ${t.status === 'active' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                          {t.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </div>
      )}
    </div>
  )
}
