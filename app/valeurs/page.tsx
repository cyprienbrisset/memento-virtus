"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Check } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

const DEFAULT_VALUES = [
  "Sagesse",
  "Générosité",
  "Curiosité",
  "Courage",
  "Fidélité",
  "Intégrité",
  "Créativité",
  "Compassion",
  "Liberté",
  "Famille",
  "Amitié",
  "Authenticité",
  "Discipline",
  "Humilité",
  "Justice",
  "Passion",
  "Persévérance",
  "Respect",
  "Responsabilité",
  "Sérénité",
]

export default function ValeursPage() {
  const [availableValues, setAvailableValues] = useState<string[]>(DEFAULT_VALUES)
  const [selectedValues, setSelectedValues] = useLocalStorage<string[]>("selected-values", [])
  const [newValue, setNewValue] = useState("")

  const handleSelectValue = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value))
    } else if (selectedValues.length < 7) {
      setSelectedValues([...selectedValues, value])
    }
  }

  const handleAddCustomValue = () => {
    if (newValue && !availableValues.includes(newValue) && selectedValues.length < 7) {
      setAvailableValues([...availableValues, newValue])
      setSelectedValues([...selectedValues, newValue])
      setNewValue("")
    }
  }

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8 bg-stone-50">
      <div className="max-w-3xl mx-auto w-full">
        <div className="flex items-center mb-8">
          <Link href="/ecrire">
            <Button variant="ghost" className="p-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-serif ml-2">Vos valeurs fondamentales</h1>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-serif mb-2 text-stone-700">Sélectionnez 5 à 7 valeurs qui vous définissent</h2>
          <p className="text-sm text-stone-500 mb-4">
            Ces valeurs serviront de boussole pour évaluer l'alignement de votre vie.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-3 mb-6">
            {selectedValues.map((value) => (
              <div
                key={value}
                className="value-tag selected flex items-center gap-1"
                onClick={() => handleSelectValue(value)}
              >
                {value}
                <Check className="h-3 w-3" />
              </div>
            ))}
            {selectedValues.length === 0 && <p className="text-sm text-stone-500 italic">Aucune valeur sélectionnée</p>}
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {availableValues
              .filter((value) => !selectedValues.includes(value))
              .map((value) => (
                <div key={value} className="value-tag unselected" onClick={() => handleSelectValue(value)}>
                  {value}
                </div>
              ))}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Ajouter une valeur personnalisée"
              className="flex-1 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-400"
              maxLength={20}
            />
            <Button
              onClick={handleAddCustomValue}
              disabled={!newValue || selectedValues.length >= 7}
              className="bg-stone-800 hover:bg-stone-700"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Ajouter</span>
            </Button>
          </div>

          {selectedValues.length > 0 && selectedValues.length < 5 && (
            <p className="text-sm text-amber-600">Sélectionnez au moins 5 valeurs</p>
          )}
        </div>

        <div className="flex justify-between">
          <Link href="/ecrire">
            <Button variant="outline">Retour</Button>
          </Link>

          <Link href="/alignement" className={selectedValues.length < 5 ? "pointer-events-none opacity-50" : ""}>
            <Button className="bg-stone-900 hover:bg-stone-800" disabled={selectedValues.length < 5}>
              Continuer
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
