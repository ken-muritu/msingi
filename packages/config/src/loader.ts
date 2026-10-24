import type { MsingiConfig } from '@msingi/types';
import { defaultConfig } from './defaults';

function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key of Object.keys(source) as Array<keyof T>) {
    const sourceVal = source[key];
    const targetVal = target[key];

    if (
      sourceVal !== null &&
      sourceVal !== undefined &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal) &&
      targetVal !== null
    ) {
      result[key] = deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as Record<string, unknown>
      ) as T[keyof T];
    } else if (sourceVal !== undefined) {
      result[key] = sourceVal as T[keyof T];
    }
  }

  return result;
}

let _config: MsingiConfig | null = null;

export function defineConfig(userConfig: MsingiConfig): MsingiConfig {
  const merged = deepMerge(
    defaultConfig as Record<string, unknown>,
    userConfig as unknown as Record<string, unknown>
  ) as unknown as MsingiConfig;

  // Ensure core is always true
  merged.modules.core = true;

  _config = merged;
  return merged;
}

export function getConfig(): MsingiConfig {
  if (!_config) {
    throw new Error(
      '[Msingi] Configuration not loaded. Call defineConfig() with your msingi.config.ts first.'
    );
  }
  return _config;
}

export function isModuleEnabled(
  module: keyof MsingiConfig['modules']
): boolean {
  const config = getConfig();
  const value = config.modules[module];

  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value !== 'none';
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).some((v) => v !== false);
  }
  return false;
}

export function getInstanceName(): string {
  return getConfig().instance.name;
}

export function getInstanceSlug(): string {
  return getConfig().instance.slug;
}

export function getVertical(): string {
  return getConfig().instance.vertical;
}

export function getCurrency(): string {
  return getConfig().business.currency;
}

export function getTaxRate(): number {
  return getConfig().business.taxRate;
}

export function isMarketplace(): boolean {
  return (
    getConfig().business.type === 'marketplace' ||
    getConfig().business.type === 'hybrid'
  );
}

export function formatPrice(amount: number): string {
  const config = getConfig();
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: config.business.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
