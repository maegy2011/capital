"use client"

import { Bus } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import LanguageSwitcher from '@/components/language-switcher'

export default function Header() {
  const { t } = useLanguage()

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-95"></div>
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative z-10">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-20 rounded-3xl mb-6 backdrop-blur-sm border border-white border-opacity-30">
              <Bus className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4">
              {t('appTitle')}
            </h1>
            <p className="text-2xl text-blue-100 mb-2">
              {t('appSubtitle')}
            </p>
            <p className="text-lg text-blue-200">
              {t('appLocation')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}