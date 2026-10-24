'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Smartphone, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { formatKES } from '@/lib/utils'
import { api } from '@/lib/api'

type Step = 'input' | 'processing' | 'success' | 'failed'

interface MPesaModalProps {
  orderId: string
  phone: string
  amount: number
  onClose: () => void
  onSuccess: (transactionId: string) => void
}

export default function MPesaModal({ orderId, phone: defaultPhone, amount, onClose, onSuccess }: MPesaModalProps) {
  const [phone, setPhone] = useState(defaultPhone || '0700')
  const [step, setStep] = useState<Step>('input')
  const [checkoutRequestId, setCheckoutRequestId] = useState('')
  const [receiptRef, setReceiptRef] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollCount = useRef(0)

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  const startPolling = (cid: string) => {
    pollCount.current = 0
    pollRef.current = setInterval(async () => {
      pollCount.current += 1
      if (pollCount.current > 30) { // 30 × 3s = 90s timeout
        clearInterval(pollRef.current!)
        setStep('failed')
        setErrorMsg('Payment timed out. Please try again.')
        return
      }

      try {
        const result = await api.queryMpesaStatus(cid)
        if (!result) return

        if (result.isPaid) {
          clearInterval(pollRef.current!)
          setReceiptRef(cid)
          setStep('success')
          setTimeout(() => onSuccess(cid), 2000)
        } else if (result.resultCode !== '0' && result.resultCode !== '' && pollCount.current > 2) {
          clearInterval(pollRef.current!)
          setStep('failed')
          setErrorMsg(result.resultDesc || 'Payment failed or was cancelled.')
        }
      } catch { /* keep polling */ }
    }, 3000)
  }

  const handleSend = async () => {
    const cleaned = phone.replace(/[\s\D]/g, '')
    if (cleaned.length < 9) return

    setStep('processing')
    setErrorMsg('')

    try {
      const result = await api.initiateMpesa(orderId, phone)
      if (!result) throw new Error('Could not initiate M-PESA payment')

      setCheckoutRequestId(result.checkoutRequestId)
      startPolling(result.checkoutRequestId)
    } catch (err: any) {
      setStep('failed')
      setErrorMsg(err?.message || 'Failed to send STK push. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* M-PESA header */}
        <div className="bg-[#00A651] px-6 py-5 text-white">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-xs text-green-200 font-medium uppercase tracking-widest">Lipa Na</p>
              <h2 className="text-2xl font-extrabold tracking-tight">M-PESA</h2>
            </div>
            <button
              onClick={onClose}
              disabled={step === 'processing'}
              className="text-white/70 hover:text-white transition-colors disabled:opacity-40"
            >
              <X size={20} />
            </button>
          </div>
          <div className="mt-3 bg-white/20 rounded-2xl px-4 py-3">
            <p className="text-green-100 text-xs mb-0.5">Amount to pay</p>
            <p className="text-3xl font-extrabold">{formatKES(amount)}</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {step === 'input' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  M-PESA Phone Number
                </label>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-100 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 shrink-0">
                    +254
                  </div>
                  <input
                    type="tel"
                    className="flex-1 border border-slate-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A651] focus:border-transparent"
                    placeholder="7XX XXX XXX"
                    value={phone.startsWith('0') ? phone.slice(1) : phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    maxLength={9}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  You will receive a push notification on this number.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-xs text-green-800 flex items-start gap-2">
                <Smartphone size={14} className="shrink-0 mt-0.5" />
                <span>
                  An STK push will be sent to your phone. Enter your M-PESA PIN when prompted to complete payment.
                </span>
              </div>

              <button
                onClick={handleSend}
                disabled={phone.replace(/\D/g, '').length < 9}
                className="w-full bg-[#00A651] hover:bg-[#008742] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 rounded-2xl transition-colors text-sm"
              >
                Send M-PESA STK Push →
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <Loader2 size={32} className="text-[#00A651] animate-spin" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Processing Payment…</p>
                <p className="text-sm text-slate-500 mt-1">
                  Check your phone for the M-PESA prompt and enter your PIN.
                </p>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-[#00A651] rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center text-center py-6 gap-3">
              <CheckCircle2 size={52} className="text-[#00A651]" />
              <div>
                <p className="font-bold text-slate-900 text-lg">Payment Successful!</p>
                <p className="text-sm text-slate-500 mt-1">Your order has been confirmed.</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-xs text-green-800 font-mono">
                Ref: {receiptRef || checkoutRequestId}
              </div>
              <p className="text-xs text-slate-400">Redirecting to confirmation…</p>
            </div>
          )}

          {step === 'failed' && (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <XCircle size={52} className="text-red-500" />
              <div>
                <p className="font-bold text-slate-900">Payment Failed</p>
                <p className="text-sm text-slate-500 mt-1">
                  {errorMsg || 'Transaction was cancelled or timed out. Please try again.'}
                </p>
              </div>
              <button
                onClick={() => setStep('input')}
                className="w-full bg-[#00A651] text-white font-bold py-3 rounded-2xl text-sm"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
