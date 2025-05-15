"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Send } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function EcrirePage() {
  const [eulogy, setEulogy] = useLocalStorage("eulogy-text", "")
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

  const handleExportPDF = () => {
    // Logique d'export PDF à implémenter
    alert("Fonctionnalité d'export PDF à implémenter")
  }

  const handleSendEmail = () => {
    const subject = encodeURIComponent("Mon éloge funèbre - YourEulogy.io")
    const body = encodeURIComponent(eulogy)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

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
          <h1 className="text-2xl md:text-3xl font-serif ml-2">Votre éloge funèbre</h1>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-serif mb-2 text-stone-700">
            Voici la vie que vous aimeriez qu'on célèbre à votre mort
          </h2>
          <p className="text-sm text-stone-500 mb-4">
            Écrivez librement. Vos mots ne sont stockés que sur votre appareil.
          </p>
        </div>

        <div className="mb-8">
          <textarea
            value={eulogy}
            onChange={(e) => setEulogy(e.target.value)}
            className="eulogy-editor w-full font-serif text-lg"
            placeholder="Commencez à écrire votre éloge funèbre idéal..."
          />
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-medium mb-2 text-stone-600">Suggestions</h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 bg-stone-200 text-stone-700 rounded-full text-sm hover:bg-stone-300 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button variant="outline" className="flex items-center gap-2" onClick={handleExportPDF}>
            <Download className="h-4 w-4" />
            Télécharger en PDF
          </Button>

          <Button variant="outline" className="flex items-center gap-2" onClick={handleSendEmail}>
            <Send className="h-4 w-4" />
            M'envoyer par email
          </Button>

          <Link href="/valeurs">
            <Button className="bg-stone-900 hover:bg-stone-800">Continuer</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
