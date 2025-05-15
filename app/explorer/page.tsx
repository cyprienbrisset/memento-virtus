"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, BarChart2, Grid, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"

// Type for a single reflection
type Reflection = {
  id: string
  date: string
  timestamp: number
  question: string
  answer: string
}

export default function ExplorerPage() {
  const [eulogy] = useLocalStorage("eulogy-text", "")
  const [selectedValues] = useLocalStorage<string[]>("selected-values", [])
  const [alignmentHistory] = useLocalStorage<any[]>("alignment-history", [])
  const [reflections] = useLocalStorage<Reflection[]>("reflections-list", [])

  const hasEulogy = !!eulogy
  const hasValues = selectedValues.length > 0
  const hasAlignment = alignmentHistory.length > 0
  const hasReflections = reflections.length > 0

  return (
    <main className="min-h-screen flex flex-col p-4 md:p-8 bg-stone-50">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="p-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Retour</span>
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-serif ml-2">Explorer mes écarts</h1>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-serif mb-2 text-stone-700">Votre parcours de réflexion</h2>
          <p className="text-sm text-stone-500 mb-4">
            Explorez les différentes dimensions de votre réflexion sur votre vie idéale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className={`border-l-4 ${hasEulogy ? "border-l-emerald-500" : "border-l-stone-300"}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-stone-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Votre éloge funèbre</h3>
                  <p className="text-sm text-stone-500 mb-4">
                    {hasEulogy
                      ? "Vous avez rédigé votre éloge funèbre idéal."
                      : "Vous n'avez pas encore rédigé votre éloge funèbre."}
                  </p>
                  <Link href="/ecrire">
                    <Button variant="outline" size="sm">
                      {hasEulogy ? "Modifier" : "Rédiger"}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-l-4 ${hasValues ? "border-l-emerald-500" : "border-l-stone-300"}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-stone-100 p-3 rounded-full">
                  <BarChart2 className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Vos valeurs fondamentales</h3>
                  <p className="text-sm text-stone-500 mb-4">
                    {hasValues
                      ? `Vous avez identifié ${selectedValues.length} valeurs fondamentales.`
                      : "Vous n'avez pas encore identifié vos valeurs fondamentales."}
                  </p>
                  <Link href="/valeurs">
                    <Button variant="outline" size="sm">
                      {hasValues ? "Modifier" : "Identifier"}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-l-4 ${hasAlignment ? "border-l-emerald-500" : "border-l-stone-300"}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-stone-100 p-3 rounded-full">
                  <Grid className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Votre alignement</h3>
                  <p className="text-sm text-stone-500 mb-4">
                    {hasAlignment
                      ? `Vous avez enregistré ${alignmentHistory.length} évaluations d'alignement.`
                      : "Vous n'avez pas encore évalué l'alignement de votre vie avec vos valeurs."}
                  </p>
                  <Link href={hasValues ? "/alignement" : "/valeurs"}>
                    <Button variant="outline" size="sm">
                      {hasAlignment ? "Consulter" : "Évaluer"}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-l-4 ${hasReflections ? "border-l-emerald-500" : "border-l-stone-300"}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-stone-100 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-stone-700" />
                </div>
                <div>
                  <h3 className="font-medium text-lg mb-1">Vos réflexions</h3>
                  <p className="text-sm text-stone-500 mb-4">
                    {hasReflections
                      ? `Vous avez enregistré ${reflections.length} réflexions.`
                      : "Vous n'avez pas encore enregistré de réflexions."}
                  </p>
                  <Link href="/reflexion">
                    <Button variant="outline" size="sm">
                      {hasReflections ? "Consulter" : "Réfléchir"}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-stone-100 p-6 rounded-lg border border-stone-200 mb-8">
          <h3 className="font-medium text-lg mb-2">Confidentialité</h3>
          <p className="text-sm text-stone-600 mb-4">
            Toutes vos données sont stockées uniquement sur votre appareil. Aucune information n'est envoyée à nos
            serveurs.
          </p>
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={() => {
              if (confirm("Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.")) {
                localStorage.clear()
                window.location.href = "/"
              }
            }}
          >
            Supprimer toutes mes données
          </Button>
        </div>
      </div>
    </main>
  )
}
