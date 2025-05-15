"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Send } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { usePdfExport } from "@/hooks/use-pdf-export"
import { EulogyPdfTemplate } from "@/components/EulogyPdfTemplate"

export default function EcrirePage() {
  const [eulogy, setEulogy] = useLocalStorage("eulogy-text", "")
  const { exportToPdf } = usePdfExport()
  const [suggestions, setSuggestions] = useState<string[]>([
    "famille",
    "intégrité",
    "transmission",
    "impact",
    "joie",
    "courage",
    "sagesse",
  ])

  const handleSuggestionClick = (suggestion: string) => {
    setEulogy((prev) => `${prev} ${suggestion}`)
  }

  const handleExportPDF = async () => {
    try {
      console.log('Exporting PDF with content:', eulogy.substring(0, 100) + (eulogy.length > 100 ? '...' : ''))
      await exportToPdf('eulogy-pdf-template', 'mon-eloge-funebre.pdf')
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error)
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.')
    }
  }

  const handleSendEmail = () => {
    const subject = encodeURIComponent("Mon éloge funèbre - Momento Virtus")
    const body = encodeURIComponent(eulogy)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  // Effet pour journaliser l'état du texte de l'éloge
  useEffect(() => {
    console.log('Eulogy content updated:', eulogy.substring(0, 50) + (eulogy.length > 50 ? '...' : ''))
  }, [eulogy])

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8 bg-stone-50">
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="p-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-xl md:text-3xl font-serif ml-2 truncate">Votre éloge funèbre</h1>
        </div>

        <div className="mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-serif mb-2 text-stone-700">
            Voici la vie que vous aimeriez qu'on célèbre à votre mort
          </h2>
          <p className="text-xs md:text-sm text-stone-500 mb-4">
            Écrivez librement. Vos mots ne sont stockés que sur votre appareil.
          </p>
        </div>

        <div id="eulogy-content" className="mb-6 md:mb-8 bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <textarea
            value={eulogy}
            onChange={(e) => setEulogy(e.target.value)}
            className="eulogy-editor w-full font-serif text-base md:text-lg border-none focus:outline-none focus:ring-0 resize-none min-h-[250px] md:min-h-[450px]"
            placeholder="Commencez à écrire votre éloge funèbre idéal..."
          />
        </div>

        <div className="mb-6 md:mb-8">
          <h3 className="text-xs md:text-sm font-medium mb-2 text-stone-600">Suggestions</h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-2 md:px-3 py-1 bg-stone-200 text-stone-700 rounded-full text-xs md:text-sm hover:bg-stone-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-end">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-xs md:text-sm py-1 md:py-2" 
            onClick={handleExportPDF}
          >
            <Download className="h-3 w-3 md:h-4 md:w-4" />
            Télécharger en PDF
          </Button>

          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-xs md:text-sm py-1 md:py-2" 
            onClick={handleSendEmail}
          >
            <Send className="h-3 w-3 md:h-4 md:w-4" />
            M'envoyer par email
          </Button>

          <Link href="/valeurs" className="w-full sm:w-auto">
            <Button className="bg-stone-900 hover:bg-stone-800 w-full text-xs md:text-sm py-1 md:py-2">Continuer</Button>
          </Link>
        </div>
      </div>

      {/* Template pour le PDF (caché) */}
      <EulogyPdfTemplate content={eulogy} />
    </main>
  )
}
