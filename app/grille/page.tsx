"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, HelpCircle } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

export default function GrillePage() {
  const [selectedValues] = useLocalStorage<string[]>("selected-values", [])
  const [alignmentHistory] = useLocalStorage<AlignmentEntry[]>("alignment-history", [])
  const [monthsToShow, setMonthsToShow] = useState(12)

  // Group entries by month
  const getMonthlyData = () => {
    const monthlyData: Record<string, Record<string, number>> = {}

    // Create empty months for the last X months
    const today = new Date()
    for (let i = 0; i < monthsToShow; i++) {
      const date = new Date(today)
      date.setMonth(today.getMonth() - i)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      monthlyData[monthKey] = {}

      selectedValues.forEach((value) => {
        monthlyData[monthKey][value] = 0 // 0 means not evaluated
      })
    }

    // Fill with actual data
    alignmentHistory.forEach((entry) => {
      const date = new Date(entry.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (monthlyData[monthKey]) {
        Object.entries(entry.values).forEach(([value, data]) => {
          monthlyData[monthKey][value] = data.score
        })
      }
    })

    return monthlyData
  }

  const getCellClass = (score: number) => {
    if (score === 0) return "memento-cell unevaluated"
    if (score >= 4) return "memento-cell fulfilled"
    if (score >= 2) return "memento-cell partial"
    return "memento-cell neglected"
  }

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split("-")
    const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
    return date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
  }

  const monthlyData = getMonthlyData()
  const months = Object.keys(monthlyData).sort().reverse()

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8 bg-stone-50">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center mb-8">
          <Link href="/alignement">
            <Button variant="ghost" className="p-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-serif ml-2">Grille d'Alignement</h1>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-serif mb-2 text-stone-700 flex items-center gap-2">
            Memento Mori des Valeurs
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-stone-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    Chaque colonne représente une valeur, et chaque ligne un mois.
                    <br />
                    <br />🟩 Valeur pleinement incarnée (4-5)
                    <br />🟨 Valeur partiellement incarnée (2-3)
                    <br />🟥 Valeur négligée (1)
                    <br />⬛ Non évalué
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h2>
          <p className="text-sm text-stone-500 mb-4">
            Visualisez l'alignement de votre vie avec vos valeurs au fil du temps.
          </p>
        </div>

        <div className="overflow-x-auto mb-8">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-sm font-medium text-stone-500">Mois</th>
                {selectedValues.map((value) => (
                  <th key={value} className="p-2 text-center text-sm font-medium text-stone-500">
                    {value}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {months.map((month) => (
                <tr key={month} className="border-t border-stone-200">
                  <td className="p-2 text-sm text-stone-700">{getMonthName(month)}</td>
                  {selectedValues.map((value) => (
                    <td key={`${month}-${value}`} className="p-2 text-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className={getCellClass(monthlyData[month][value])} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {value}:{" "}
                              {monthlyData[month][value] === 0 ? "Non évalué" : `${monthlyData[month][value]}/5`}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between">
          <Link href="/alignement">
            <Button variant="outline">Retour à l'alignement</Button>
          </Link>

          <Link href="/reflexion">
            <Button className="bg-stone-900 hover:bg-stone-800">Réflexions quotidiennes</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
