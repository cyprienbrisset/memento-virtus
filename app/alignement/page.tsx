"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { RadarChart } from "@/components/radar-chart"

type AlignmentEntry = {
  date: string
  values: Record<
    string,
    {
      score: number
      comment: string
    }
  >
}

export default function AlignementPage() {
  const [selectedValues] = useLocalStorage<string[]>("selected-values", [])
  const [alignmentHistory, setAlignmentHistory] = useLocalStorage<AlignmentEntry[]>("alignment-history", [])
  const [currentScores, setCurrentScores] = useState<Record<string, number>>({})
  const [currentComments, setCurrentComments] = useState<Record<string, string>>({})

  useEffect(() => {
    // Initialize scores for each value
    const scores: Record<string, number> = {}
    const comments: Record<string, string> = {}

    selectedValues.forEach((value) => {
      scores[value] = 3
      comments[value] = ""
    })

    setCurrentScores(scores)
    setCurrentComments(comments)
  }, [selectedValues])

  const handleSaveAlignment = () => {
    const today = new Date().toISOString().split("T")[0]

    const valueEntries: Record<string, { score: number; comment: string }> = {}
    selectedValues.forEach((value) => {
      valueEntries[value] = {
        score: currentScores[value],
        comment: currentComments[value],
      }
    })

    const newEntry: AlignmentEntry = {
      date: today,
      values: valueEntries,
    }

    setAlignmentHistory([...alignmentHistory, newEntry])
    alert("Votre alignement a été enregistré avec succès !")
  }

  const getChartData = () => {
    if (alignmentHistory.length === 0) return []

    // Get the last 6 entries or all if less than 6
    const recentEntries = alignmentHistory.slice(-6)

    return recentEntries.map((entry) => {
      // Créer un objet avec la date et une valeur par défaut de 0 pour chaque clé
      const dataPoint: Record<string, any> = { 
        date: entry.date 
      }
      
      // Initialiser toutes les clés à 0
      selectedValues.forEach(key => {
        dataPoint[key] = 0
      })
      
      // Remplir avec les valeurs réelles si elles existent
      Object.entries(entry.values).forEach(([value, data]) => {
        if (selectedValues.includes(value)) {
          dataPoint[value] = data.score
        }
      })

      return dataPoint
    })
  }

  // Fonction pour mettre à jour un score spécifique
  const updateScore = (value: string, newScore: number) => {
    setCurrentScores(prev => ({
      ...prev,
      [value]: newScore
    }))
  }

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8 bg-stone-50">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center mb-8">
          <Link href="/valeurs">
            <Button variant="ghost" className="p-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-xl md:text-3xl font-serif ml-2 truncate">Alignement Mensuel</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
          <div className="order-1 md:order-1">
            <h2 className="text-lg md:text-xl font-serif mb-4 text-stone-700">Évaluez votre alignement</h2>

            <div className="space-y-4 md:space-y-6">
              {selectedValues.map((value) => (
                <Card key={value} className="overflow-hidden">
                  <CardContent className="p-3 md:p-4">
                    <h3 className="font-medium text-base md:text-lg mb-2">{value}</h3>

                    <div className="mb-3 md:mb-4">
                      <p className="text-xs md:text-sm text-stone-500 mb-2">
                        Ai-je incarné cette valeur ce mois-ci ? ({currentScores[value] || 3}/5)
                      </p>
                      <Slider
                        value={[currentScores[value] || 3]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={(newValues) => updateScore(value, newValues[0])}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-xs text-stone-500">
                        <span>Pas du tout</span>
                        <span>Parfaitement</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs md:text-sm text-stone-500 mb-2">Exemples concrets (facultatif)</p>
                      <Textarea
                        value={currentComments[value] || ""}
                        onChange={(e) => {
                          setCurrentComments({
                            ...currentComments,
                            [value]: e.target.value,
                          })
                        }}
                        placeholder="Notez des exemples où vous avez incarné cette valeur..."
                        className="resize-none h-16 md:h-24 text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-4 md:mt-6">
              <Button
                onClick={handleSaveAlignment}
                className="w-full bg-stone-900 hover:bg-stone-800 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Enregistrer mon alignement
              </Button>
            </div>
          </div>

          <div className="order-2 md:order-2 mt-6 md:mt-0">
            <h2 className="text-lg md:text-xl font-serif mb-4 text-stone-700">Votre évolution</h2>

            {alignmentHistory.length > 0 ? (
              <div className="bg-white p-3 md:p-4 rounded-lg border border-stone-200 shadow-sm">
                <RadarChart data={getChartData()} keys={selectedValues} />
              </div>
            ) : (
              <div className="bg-white p-6 md:p-8 rounded-lg border border-stone-200 shadow-sm flex items-center justify-center">
                <p className="text-stone-500 text-center text-sm md:text-base">
                  Aucune donnée d'alignement disponible.
                  <br />
                  Enregistrez votre premier alignement pour voir votre évolution.
                </p>
              </div>
            )}

            <div className="mt-4 md:mt-8">
              <Link href="/grille">
                <Button variant="outline" className="w-full">
                  Voir la grille d'alignement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
