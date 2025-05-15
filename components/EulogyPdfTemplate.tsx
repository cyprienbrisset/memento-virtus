"use client"

import { useState, useEffect } from 'react'

interface EulogyPdfTemplateProps {
  content: string
}

export function EulogyPdfTemplate({ content }: EulogyPdfTemplateProps) {
  const [dateString, setDateString] = useState('')
  
  // Mettre à jour la date côté client uniquement pour éviter les erreurs d'hydratation
  useEffect(() => {
    setDateString(new Date().toLocaleDateString('fr-FR'))
  }, [])
  
  // Forcer le contenu à être une chaîne de caractères
  const safeContent = typeof content === 'string' ? content : String(content || '')
  
  return (
    <div 
      id="eulogy-pdf-template" 
      style={{ 
        position: 'absolute', 
        left: '-9999px',
        top: 0,
        width: '800px',  // Largeur fixe pour garantir des dimensions correctes
        height: 'auto',
        overflow: 'hidden',
        zIndex: -100,
        visibility: 'hidden'
      }}
    >
      <div className="p-12 bg-white" style={{ fontFamily: 'serif', width: '100%' }}>
        {/* Logo en haut de la page - utiliser img standard au lieu de Image de Next.js */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <img
              src="/logo.png"
              alt="Momento Virtus"
              width={200}
              height={100}
              style={{ maxWidth: '200px', height: 'auto' }}
            />
          </div>
          <hr className="my-6 border-stone-200" />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Mon Éloge Funèbre</h1>
          <p className="text-sm text-stone-500">Réflexion personnelle</p>
        </div>
        
        <div className="whitespace-pre-wrap text-lg leading-relaxed" style={{ minHeight: '300px' }}>
          {safeContent || "Aucun contenu n'a été rédigé."}
        </div>
        
        <div className="mt-16 pt-8 border-t border-stone-200 text-sm text-stone-500">
          <div className="flex flex-col items-center">
            <p>Document personnel {dateString ? `- Généré le ${dateString}` : ''}</p>
            <p className="mt-2">momento-virtus.cyprienbrisset.fr</p>
          </div>
        </div>
      </div>
    </div>
  )
} 