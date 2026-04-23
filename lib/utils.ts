import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-KE').format(n)
}

export function calculateDiscount(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100)
}

export function generateWhatsAppProductMessage(
  productName: string,
  price: number,
  productUrl: string,
  sellerName: string
): string {
  const text = `🛒 *${productName}*\n\n💰 Price: ${formatKES(price)}\n\n🔗 ${productUrl}\n\n_Sold by ${sellerName} on Jenga Electronics_\n\nHi, I'm interested in this item. Is it available?`
  return encodeURIComponent(text)
}

export function generateWhatsAppCartMessage(
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
): string {
  const list = items
    .map((i) => `• ${i.name} ×${i.quantity} — ${formatKES(i.price * i.quantity)}`)
    .join('\n')
  const text = `🛒 *My Jenga Cart*\n\n${list}\n\n──────────────\n*Total: ${formatKES(total)}*\n\nPlease confirm availability, delivery & timeline. Ready to pay via M-PESA! 🙏`
  return encodeURIComponent(text)
}

export function generateMpesaTransactionId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 10; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '…' : str
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

export function getDeliveryDate(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString('en-KE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
