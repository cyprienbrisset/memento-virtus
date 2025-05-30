import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Feather, BarChart2 } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-stone-50 relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 20 L40 20 M20 0 L20 40" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>

      <div className="max-w-3xl w-full text-center space-y-8 md:space-y-12 relative z-10">
        <div className="flex justify-center items-center">
          <Image
            src="/logo.png"
            alt="Momento Virtus"
            width={300}
            height={100}
            priority
            className="h-auto w-[200px] md:w-[300px]"
          />
        </div>

        <p className="text-lg md:text-2xl font-serif italic text-stone-700 max-w-2xl mx-auto px-2">
          "Ce n'est pas la mort qu'on redoute, mais de ne pas avoir vécu à hauteur de ses principes."
        </p>

        <div className="space-y-4 md:space-y-6 pt-4 md:pt-6">
          <h2 className="text-xl md:text-3xl font-serif">Tu veux qu'on dise quoi de toi ?</h2>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4">
            <Link href="/ecrire" className="w-full sm:w-auto">
              <Button className="text-sm md:text-lg px-4 py-4 md:px-6 md:py-6 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-md flex items-center gap-2 w-full justify-center">
                <Feather className="h-4 w-4 md:h-5 md:w-5" />
                Écrire mon éloge
              </Button>
            </Link>

            <Link href="/explorer" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="text-sm md:text-lg px-4 py-4 md:px-6 md:py-6 border-stone-300 text-stone-700 rounded-md flex items-center gap-2 w-full justify-center"
              >
                <BarChart2 className="h-4 w-4 md:h-5 md:w-5" />
                Explorer mes écarts
              </Button>
            </Link>
          </div>
        </div>

        <footer className="pt-8 md:pt-12 text-stone-500 text-xs md:text-sm">
          <p>Aucun compte requis. Toutes vos données restent sur votre appareil.</p>
        </footer>
      </div>
    </main>
  )
}
