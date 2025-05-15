"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"

const REFLECTIONS = [
  "Et si vous mourriez dans 6 mois, que changeriez-vous cette semaine ?",
  "Quelle valeur avez-vous trahie ce mois-ci ? Pourquoi ?",
  "Qu'est-ce qui vous empêche de vivre pleinement selon vos valeurs ?",
  "Quelle trace souhaitez-vous laisser dans la vie de vos proches ?",
  "Quelle est la chose la plus importante que vous n'avez pas encore faite ?",
  "Si vous pouviez revivre une journée de votre vie, laquelle choisiriez-vous ?",
  "Qu'est-ce qui vous fait le plus peur concernant votre fin de vie ?",
  "Quelle valeur est la plus difficile à incarner pour vous ? Pourquoi ?",
  "Quel regret ne voulez-vous absolument pas avoir sur votre lit de mort ?",
  "Quelle habitude pourriez-vous changer dès aujourd'hui pour mieux incarner vos valeurs ?",
]

// Type for a single reflection
type Reflection = {
  id: string
  date: string
  timestamp: number
  question: string
  answer: string
}

export default function ReflexionPage() {
  const [selectedValues] = useLocalStorage<string[]>("selected-values", [])
  const [reflections, setReflections] = useLocalStorage<Reflection[]>("reflections-list", [])
  const [currentReflection, setCurrentReflection] = useState(() => {
    const randomIndex = Math.floor(Math.random() * REFLECTIONS.length)
    return REFLECTIONS[randomIndex]
  })
  const [response, setResponse] = useState("")
  const [showPastReflections, setShowPastReflections] = useState(false)

  const handleNewReflection = () => {
    // Save current response if any
    if (response) {
      const now = new Date()
      const today = now.toISOString().split("T")[0]

      const newReflection: Reflection = {
        id: `reflection-${now.getTime()}`,
        date: today,
        timestamp: now.getTime(),
        question: currentReflection,
        answer: response,
      }

      setReflections([...reflections, newReflection])
    }

    // Get new reflection
    let newReflection
    do {
      const randomIndex = Math.floor(Math.random() * REFLECTIONS.length)
      newReflection = REFLECTIONS[randomIndex]
    } while (newReflection === currentReflection)

    setCurrentReflection(newReflection)
    setResponse("")
  }

  // Sort reflections by timestamp (most recent first)
  const sortedReflections = [...reflections].sort((a, b) => b.timestamp - a.timestamp)

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8 bg-stone-50">
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center mb-8">
          <Link href="/grille">
            <Button variant="ghost" className="p-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-serif ml-2">Réflexions Quotidiennes</h1>
        </div>

        <div className="mb-8">
          <Card className="bg-stone-100 border-stone-200">
            <CardContent className="p-6">
              {showPastReflections ? (
                <>
                  <h2 className="text-xl font-serif mb-6 text-stone-800 text-center">Mes réflexions passées</h2>

                  {sortedReflections.length > 0 ? (
                    <div className="space-y-6">
                      {sortedReflections.map((reflection) => (
                        <div key={reflection.id} className="border-b border-stone-200 pb-4 mb-4 last:border-0">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">
                              {new Date(reflection.date).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}{" "}
                              <span className="text-sm text-stone-500">
                                {new Date(reflection.timestamp).toLocaleTimeString("fr-FR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </h3>
                          </div>
                          <p className="text-stone-700 italic mb-2">{reflection.question}</p>
                          <p className="text-stone-900 whitespace-pre-line">{reflection.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-stone-500">Vous n'avez pas encore enregistré de réflexions.</p>
                  )}

                  <div className="flex justify-center mt-6">
                    <Button onClick={() => setShowPastReflections(false)} variant="outline">
                      Retour à la réflexion
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-serif mb-6 text-stone-800 text-center">{currentReflection}</h2>

                  <Textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Votre réponse..."
                    className="min-h-[200px] bg-white border-stone-300"
                  />
                </>
              )}
              <div className="flex justify-between mt-4">
                <Button
                  onClick={() => setShowPastReflections(!showPastReflections)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {showPastReflections ? "Nouvelle réflexion" : "Voir mes réflexions passées"}
                </Button>

                {!showPastReflections && (
                  <Button
                    onClick={handleNewReflection}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={!response.trim()}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Enregistrer et nouvelle réflexion
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between">
          <Link href="/explorer">
            <Button variant="outline">Explorer mes écarts</Button>
          </Link>

          <Link href="/">
            <Button className="bg-stone-900 hover:bg-stone-800">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
