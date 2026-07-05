import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ADJECTIVES, NOUNS, CATEGORIES, DESCRIPTION_TEMPLATE, type ProductLang } from './productTerms';
import type { Product } from '@/types';

const SUPPORTED: ProductLang[] = ['en', 'ta', 'hi', 'ar', 'fr', 'de', 'es', 'zh', 'ja'];

function normalizeLang(lang: string | undefined): ProductLang {
  const base = (lang ?? 'en').split('-')[0];
  return SUPPORTED.includes(base as ProductLang) ? (base as ProductLang) : 'en';
}

/** Translate a composed "Adjective Noun" product name; unknown → original. */
export function translateProductName(name: string, lang: ProductLang): string {
  if (lang === 'en' || !name) return name;
  const parts = name.trim().split(/\s+/);
  const adj = parts[0];
  const noun = parts.slice(1).join(' ');
  const tAdj = ADJECTIVES[adj]?.[lang];
  const tNoun = NOUNS[noun]?.[lang];
  if (!tAdj && !tNoun) return name;
  return `${tAdj ?? adj} ${tNoun ?? noun}`.trim();
}

export function translateCategoryName(name: string | undefined, lang: ProductLang): string {
  if (!name || lang === 'en') return name ?? '';
  return CATEGORIES[name]?.[lang] ?? name;
}

export function translateProductDescription(
  product: Pick<Product, 'name' | 'description' | 'brand' | 'tags'>,
  lang: ProductLang,
): string {
  if (lang === 'en') return product.description;
  const parts = product.name.trim().split(/\s+/);
  const tAdj = ADJECTIVES[parts[0]]?.[lang];
  const tNoun = NOUNS[parts.slice(1).join(' ')]?.[lang];
  if (!tAdj || !tNoun) return product.description;
  const parentTag = product.tags?.[0];
  const parentKey = parentTag ? Object.keys(CATEGORIES).find((k) => k.toLowerCase() === parentTag) : undefined;
  const category = parentKey ? CATEGORIES[parentKey]?.[lang] ?? parentKey : '';
  return DESCRIPTION_TEMPLATE[lang]
    .replace('{adjective}', tAdj)
    .replace('{noun}', tNoun.toLowerCase())
    .replace('{brand}', product.brand ?? '')
    .replace('{category}', category.toLowerCase());
}

export function useProductI18n() {
  const { i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  return useMemo(
    () => ({
      lang,
      name: (p: Pick<Product, 'name'>) => translateProductName(p.name, lang),
      rawName: (name: string) => translateProductName(name, lang),
      category: (name: string | undefined) => translateCategoryName(name, lang),
      description: (p: Pick<Product, 'name' | 'description' | 'brand' | 'tags'>) =>
        translateProductDescription(p, lang),
    }),
    [lang],
  );
}
