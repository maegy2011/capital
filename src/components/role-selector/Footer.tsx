"use client"

import { useLanguage } from '@/lib/language-context'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <div className="text-center mt-16 text-gray-500">
      <p className="text-lg mb-2">{t('copyright')}</p>
      <p className="text-base">{t('poweredBy')}</p>
    </div>
  )
}