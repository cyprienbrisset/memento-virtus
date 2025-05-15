"use client"

import { useCallback } from 'react'

export function usePdfExport() {
  const exportToPdf = useCallback(async (elementId: string, filename: string = 'document.pdf') => {
    // Dynamically import jsPDF and html2canvas only when needed
    const jsPDF = (await import('jspdf')).default
    const html2canvas = (await import('html2canvas')).default

    const element = document.getElementById(elementId)
    if (!element) {
      console.error(`Element with id ${elementId} not found`)
      return
    }

    try {
      console.log('Starting PDF export process...')
      console.log('Element found:', element)
      console.log('Element content:', element.innerHTML.substring(0, 100) + '...')
      
      // Forcer le rendu visible pour la capture
      const originalStyles = {
        position: element.style.position,
        left: element.style.left,
        top: element.style.top,
        visibility: element.style.visibility,
        zIndex: element.style.zIndex,
      }
      
      // Temporairement rendons l'élément visible pour la capture
      element.style.position = 'fixed'
      element.style.left = '0'
      element.style.top = '0'
      element.style.visibility = 'visible'
      element.style.zIndex = '9999'
      
      // Attendre que le DOM soit mis à jour
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Capturer l'élément avec html2canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Meilleure qualité
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        allowTaint: true,
        foreignObjectRendering: false
      })
      
      // Restaurer les styles originaux
      element.style.position = originalStyles.position
      element.style.left = originalStyles.left
      element.style.top = originalStyles.top
      element.style.visibility = originalStyles.visibility
      element.style.zIndex = originalStyles.zIndex

      const imgData = canvas.toDataURL('image/png')
      console.log('Canvas generated successfully')
      
      // Vérification des dimensions du canvas
      const imgWidth = Math.max(canvas.width, 1) // Éviter les dimensions nulles
      const imgHeight = Math.max(canvas.height, 1) 
      
      console.log('Canvas dimensions:', imgWidth, imgHeight)
      
      // Créer le PDF avec l'image générée
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })
      
      // Dimensions A4 en mm
      const pdfWidth = 210
      const pdfHeight = 297
      
      // Calculer les dimensions de l'image avec sécurité
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight, 1) // Limiter le ratio à 1
      
      // Vérifier que les valeurs sont valides et positives
      const scaledWidth = imgWidth * ratio
      const scaledHeight = imgHeight * ratio
      
      // Centrer l'image sur la page avec des valeurs valides
      const imgX = Math.max((pdfWidth - scaledWidth) / 2, 0)
      const imgY = Math.max(20, 0) // Marge supérieure
      
      console.log('PDF coordinates:', imgX, imgY, scaledWidth, scaledHeight)
      
      // Ajouter l'image au PDF avec des dimensions sécurisées
      if (scaledWidth > 0 && scaledHeight > 0) {
        pdf.addImage(imgData, 'PNG', imgX, imgY, scaledWidth, scaledHeight)
      } else {
        console.error('Invalid image dimensions for PDF:', scaledWidth, scaledHeight)
        // Créer une page vide avec un message
        pdf.text('Impossible de générer l\'image du contenu', 20, 20)
      }
      
      // Formatage de la date côté client
      const currentDate = new Date()
      const dateString = currentDate.toLocaleDateString('fr-FR')
      
      // Télécharger le PDF
      console.log('Saving PDF...')
      pdf.save(filename)
      console.log('PDF saved successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.')
    }
  }, [])

  return { exportToPdf }
} 