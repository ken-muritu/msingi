'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

const apiExamples = [
  {
    title: 'List Products',
    method: 'GET',
    endpoint: '/api/v1/products?brand=Samsung&page=1&pageSize=10',
    response: `{
  "data": [
    {
      "id": "clx...",
      "name": "Samsung Galaxy S24 Ultra",
      "price": 189999,
      "brand": "Samsung",
      "rating": 4.8,
      "images": [{ "url": "...", "isPrimary": true }],
      "seller": { "businessName": "Samsung Kenya", "verified": true }
    }
  ],
  "total": 4,
  "page": 1,
  "totalPages": 1,
  "hasNext": false
}`,
  },
  {
    title: 'Search Products',
    method: 'GET',
    endpoint: '/api/v1/search?q=laptop&minPrice=50000',
    response: `{
  "query": "laptop",
  "results": [...],
  "totalCount": 3,
  "responseTimeMs": 12,
  "facets": {
    "brands": [{ "name": "HP", "count": 2 }],
    "priceRange": { "min": 52999, "max": 159999 }
  }
}`,
  },
  {
    title: 'Auth Login',
    method: 'POST',
    endpoint: '/api/v1/auth/login',
    response: `// Body: { "identifier": "buyer@test.com", "password": "buyer123456" }

{
  "user": {
    "id": "clx...",
    "email": "buyer@test.com",
    "name": "Test Buyer",
    "role": "buyer"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}`,
  },
]

export default function Demo() {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(apiExamples[activeTab].response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="demo" className="relative py-24 sm:py-32 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-emerald-400 text-sm font-medium mb-3">Live API</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Production-ready endpoints
          </h2>
          <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
            Every endpoint is documented with Swagger, validated with DTOs, and returns clean JSON responses.
          </p>
        </div>

        {/* API demo */}
        <div className="max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-1 mb-4 overflow-x-auto scrollbar-hide">
            {apiExamples.map((example, i) => (
              <button
                key={example.title}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === i
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                {example.title}
              </button>
            ))}
          </div>

          {/* Request */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  apiExamples[activeTab].method === 'GET' 
                    ? 'bg-blue-500/10 text-blue-400' 
                    : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {apiExamples[activeTab].method}
                </span>
                <span className="text-zinc-400">{apiExamples[activeTab].endpoint}</span>
              </div>
              <button
                onClick={handleCopy}
                className="text-zinc-500 hover:text-white transition-colors p-1"
                aria-label="Copy response"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
            <pre className="p-5 text-sm font-mono text-zinc-400 leading-relaxed overflow-x-auto max-h-80">
              {apiExamples[activeTab].response}
            </pre>
          </div>

          {/* Swagger link */}
          <p className="text-center mt-6 text-sm text-zinc-500">
            Full interactive docs at{' '}
            <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-xs">
              /api/docs
            </code>{' '}
            (Swagger UI)
          </p>
        </div>
      </div>
    </section>
  )
}
