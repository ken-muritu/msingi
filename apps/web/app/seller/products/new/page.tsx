'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Plus, X, Package, CheckCircle2, AlertCircle,
  ImageIcon, Tag, Wrench, ToggleLeft,
} from 'lucide-react'
import { categories, sellers } from '@/lib/data'
import { useSellerProductsStore } from '@/lib/store'
import { slugify } from '@/lib/utils'

const activeSeller = sellers[0]

interface SpecEntry { key: string; value: string }

interface FormState {
  name: string
  brand: string
  category: string
  description: string
  price: string
  originalPrice: string
  stockCount: string
  imageUrl: string
  warranty: string
  deliveryDays: string
  requiresInstallation: boolean
  installationFee: string
  bnplAvailable: boolean
  monthlyInstallment: string
  isFeatured: boolean
  isFlashSale: boolean
  isTrending: boolean
  features: string[]
  newFeature: string
  tags: string[]
  newTag: string
  specs: SpecEntry[]
  newSpecKey: string
  newSpecValue: string
}

const initialState: FormState = {
  name: '', brand: '', category: '', description: '',
  price: '', originalPrice: '', stockCount: '',
  imageUrl: '', warranty: '', deliveryDays: '2-3 business days',
  requiresInstallation: false, installationFee: '',
  bnplAvailable: false, monthlyInstallment: '',
  isFeatured: false, isFlashSale: false, isTrending: false,
  features: [], newFeature: '',
  tags: [], newTag: '',
  specs: [], newSpecKey: '', newSpecValue: '',
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <h2 className="flex items-center gap-2 font-semibold text-slate-800 mb-4">
        <Icon size={16} className="text-brand-600" />
        {title}
      </h2>
      {children}
    </div>
  )
}

function Field({ label, error, children, hint }: { label: string; error?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

const inputCls = 'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 placeholder:text-slate-400'

export default function NewProductPage() {
  const router = useRouter()
  const addProduct = useSellerProductsStore((s) => s.addProduct)
  const [form, setForm] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [saved, setSaved] = useState(false)

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }))

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.brand.trim()) e.brand = 'Required'
    if (!form.category) e.category = 'Required'
    if (!form.description.trim()) e.description = 'Required'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Enter a valid price'
    if (!form.stockCount || isNaN(Number(form.stockCount))) e.stockCount = 'Enter stock count'
    return e
  }

  const addFeature = () => {
    const v = form.newFeature.trim()
    if (v && !form.features.includes(v)) set({ features: [...form.features, v], newFeature: '' })
  }

  const addTag = () => {
    const v = form.newTag.trim()
    if (v && !form.tags.includes(v)) set({ tags: [...form.tags, v], newTag: '' })
  }

  const addSpec = () => {
    const k = form.newSpecKey.trim()
    const v = form.newSpecValue.trim()
    if (k && v && !form.specs.find((s) => s.key === k))
      set({ specs: [...form.specs, { key: k, value: v }], newSpecKey: '', newSpecValue: '' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const price = Number(form.price)
    const originalPrice = form.originalPrice ? Number(form.originalPrice) : undefined
    const discount = originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined

    addProduct({
      id: `sp-${Date.now()}`,
      name: form.name.trim(),
      slug: slugify(form.name.trim()),
      brand: form.brand.trim(),
      category: form.category,
      price,
      originalPrice,
      discount,
      images: [
        form.imageUrl.trim() || 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=600&auto=format&q=80',
      ],
      rating: 0,
      reviewCount: 0,
      inStock: Number(form.stockCount) > 0,
      stockCount: Number(form.stockCount),
      description: form.description.trim(),
      features: form.features,
      specifications: Object.fromEntries(form.specs.map(({ key, value }) => [key, value])),
      warranty: form.warranty.trim() || '1 year seller warranty',
      requiresInstallation: form.requiresInstallation,
      installationFee: form.requiresInstallation && form.installationFee ? Number(form.installationFee) : undefined,
      seller: activeSeller,
      tags: form.tags,
      bnplAvailable: form.bnplAvailable,
      monthlyInstallment: form.bnplAvailable && form.monthlyInstallment ? Number(form.monthlyInstallment) : undefined,
      isFeatured: form.isFeatured,
      isFlashSale: form.isFlashSale,
      isTrending: form.isTrending,
      deliveryDays: form.deliveryDays.trim() || '2-3 business days',
    })

    setSaved(true)
    setTimeout(() => router.push('/seller/dashboard'), 2000)
  }

  if (saved) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Product Listed!</h2>
        <p className="text-slate-500 text-sm">Your product has been added to the catalog. Redirecting to dashboard…</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/seller/dashboard" className="text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
          <p className="text-sm text-slate-500">{activeSeller.name} · {activeSeller.badge} seller</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <SectionCard title="Basic Information" icon={Package}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product Name *" error={errors.name}>
              <input className={inputCls} placeholder="e.g. Samsung Galaxy S24 Ultra" value={form.name}
                onChange={(e) => set({ name: e.target.value })} />
            </Field>
            <Field label="Brand *" error={errors.brand}>
              <input className={inputCls} placeholder="e.g. Samsung, Apple, LG" value={form.brand}
                onChange={(e) => set({ brand: e.target.value })} />
            </Field>
            <Field label="Category *" error={errors.category}>
              <select className={inputCls} value={form.category} onChange={(e) => set({ category: e.target.value })}>
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Delivery Timeframe">
              <input className={inputCls} placeholder="e.g. 1-3 business days" value={form.deliveryDays}
                onChange={(e) => set({ deliveryDays: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Description *" error={errors.description}>
              <textarea className={`${inputCls} min-h-[90px] resize-y`} placeholder="Describe your product in detail — what makes it great for Kenyan buyers?"
                value={form.description} onChange={(e) => set({ description: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Warranty">
              <input className={inputCls} placeholder="e.g. 12 months manufacturer warranty" value={form.warranty}
                onChange={(e) => set({ warranty: e.target.value })} />
            </Field>
          </div>
        </SectionCard>

        {/* Pricing & Inventory */}
        <SectionCard title="Pricing & Inventory" icon={Tag}>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Selling Price (KES) *" error={errors.price}>
              <input className={inputCls} type="number" min="0" placeholder="0" value={form.price}
                onChange={(e) => set({ price: e.target.value })} />
            </Field>
            <Field label="Original Price (KES)" hint="Leave blank if no discount">
              <input className={inputCls} type="number" min="0" placeholder="0" value={form.originalPrice}
                onChange={(e) => set({ originalPrice: e.target.value })} />
            </Field>
            <Field label="Stock Count *" error={errors.stockCount}>
              <input className={inputCls} type="number" min="0" placeholder="0" value={form.stockCount}
                onChange={(e) => set({ stockCount: e.target.value })} />
            </Field>
          </div>

          {/* BNPL */}
          <div className="mt-4 p-4 bg-slate-50 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set({ bnplAvailable: !form.bnplAvailable })}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.bnplAvailable ? 'bg-brand-600' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.bnplAvailable ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm font-medium text-slate-700">Enable Buy Now, Pay Later (BNPL)</span>
            </label>
            {form.bnplAvailable && (
              <div className="mt-3">
                <Field label="Monthly Installment (KES)" hint="Suggested monthly payment shown to buyers">
                  <input className={inputCls} type="number" min="0" placeholder="0" value={form.monthlyInstallment}
                    onChange={(e) => set({ monthlyInstallment: e.target.value })} />
                </Field>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Media */}
        <SectionCard title="Product Image" icon={ImageIcon}>
          <Field label="Image URL" hint="Use a direct image URL from Unsplash or your hosting service">
            <input className={inputCls} type="url" placeholder="https://images.unsplash.com/photo-…?w=600&auto=format&q=80"
              value={form.imageUrl} onChange={(e) => set({ imageUrl: e.target.value })} />
          </Field>
          {form.imageUrl && (
            <div className="mt-3 w-32 h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/128x128?text=No+Image' }} />
            </div>
          )}
        </SectionCard>

        {/* Features */}
        <SectionCard title="Key Features" icon={CheckCircle2}>
          <div className="flex gap-2 mb-3">
            <input className={inputCls} placeholder="Add a key feature…" value={form.newFeature}
              onChange={(e) => set({ newFeature: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }} />
            <button type="button" onClick={addFeature}
              className="shrink-0 bg-brand-600 text-white px-3 py-2.5 rounded-xl hover:bg-brand-700 transition-colors">
              <Plus size={16} />
            </button>
          </div>
          {form.features.length > 0 ? (
            <ul className="space-y-2">
              {form.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 text-sm">
                  <span className="flex-1 text-slate-700">{f}</span>
                  <button type="button" onClick={() => set({ features: form.features.filter((_, j) => j !== i) })}
                    className="text-slate-400 hover:text-red-500 transition-colors"><X size={13} /></button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">No features added yet. Add bullet points that highlight your product.</p>
          )}
        </SectionCard>

        {/* Tags */}
        <SectionCard title="Tags" icon={Tag}>
          <div className="flex gap-2 mb-3">
            <input className={inputCls} placeholder="Add a tag…" value={form.newTag}
              onChange={(e) => set({ newTag: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }} />
            <button type="button" onClick={addTag}
              className="shrink-0 bg-brand-600 text-white px-3 py-2.5 rounded-xl hover:bg-brand-700 transition-colors">
              <Plus size={16} />
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((t, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {t}
                  <button type="button" onClick={() => set({ tags: form.tags.filter((_, j) => j !== i) })}
                    className="hover:text-red-500 transition-colors"><X size={10} /></button>
                </span>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Specifications */}
        <SectionCard title="Specifications" icon={AlertCircle}>
          <div className="flex gap-2 mb-3">
            <input className={inputCls} placeholder="Spec name (e.g. Display)" value={form.newSpecKey}
              onChange={(e) => set({ newSpecKey: e.target.value })} />
            <input className={inputCls} placeholder="Value (e.g. 6.8&quot; AMOLED)" value={form.newSpecValue}
              onChange={(e) => set({ newSpecValue: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSpec() } }} />
            <button type="button" onClick={addSpec}
              className="shrink-0 bg-brand-600 text-white px-3 py-2.5 rounded-xl hover:bg-brand-700 transition-colors">
              <Plus size={16} />
            </button>
          </div>
          {form.specs.length > 0 ? (
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-100 overflow-hidden">
              {form.specs.map((s, i) => (
                <div key={i} className="flex items-center text-sm px-3 py-2">
                  <span className="w-36 text-slate-500 font-medium shrink-0">{s.key}</span>
                  <span className="flex-1 text-slate-800">{s.value}</span>
                  <button type="button" onClick={() => set({ specs: form.specs.filter((_, j) => j !== i) })}
                    className="text-slate-400 hover:text-red-500 transition-colors ml-2"><X size={13} /></button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No specs added yet.</p>
          )}
        </SectionCard>

        {/* Installation & Listing Flags */}
        <SectionCard title="Installation & Listing Options" icon={Wrench}>
          <div className="space-y-4">
            {/* Installation */}
            <div className="p-4 bg-slate-50 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => set({ requiresInstallation: !form.requiresInstallation })}
                  className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${form.requiresInstallation ? 'bg-brand-600' : 'bg-slate-300'}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.requiresInstallation ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-sm font-medium text-slate-700">Requires Professional Installation</span>
              </label>
              {form.requiresInstallation && (
                <div className="mt-3">
                  <Field label="Installation Fee (KES)" hint="Enter 0 for free installation">
                    <input className={inputCls} type="number" min="0" placeholder="0" value={form.installationFee}
                      onChange={(e) => set({ installationFee: e.target.value })} />
                  </Field>
                </div>
              )}
            </div>

            {/* Listing flags */}
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { key: 'isFeatured' as const, label: 'Featured', desc: 'Show on homepage Featured section' },
                { key: 'isFlashSale' as const, label: 'Flash Sale', desc: 'Show flash sale badge' },
                { key: 'isTrending' as const, label: 'Trending', desc: 'Show on Trending section' },
              ].map(({ key, label, desc }) => (
                <label key={key} className={`flex flex-col gap-1 p-3 rounded-xl border-2 cursor-pointer transition-colors ${form[key] ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white hover:border-brand-300'}`}>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={form[key]} onChange={() => set({ [key]: !form[key] })} className="accent-brand-600" />
                    <span className="text-sm font-semibold text-slate-800">{label}</span>
                  </div>
                  <p className="text-xs text-slate-500">{desc}</p>
                </label>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Submit */}
        <div className="flex gap-3 pb-8">
          <Link href="/seller/dashboard"
            className="flex-1 text-center border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
          <button type="submit"
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <Package size={16} />
            List Product
          </button>
        </div>
      </form>
    </div>
  )
}
