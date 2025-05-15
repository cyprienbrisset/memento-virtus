"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

interface RadarChartProps {
  data: any[]
  keys: string[]
}

export function RadarChart({ data, keys }: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 })

  // Fonction pour mettre à jour les dimensions en fonction de la taille du conteneur
  const updateDimensions = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth
      // Utiliser une largeur maximale de 400px, mais s'adapter à des écrans plus petits
      const width = Math.min(containerWidth, 400)
      const height = width // Maintenir un rapport 1:1
      setDimensions({ width, height })
    }
  }

  // Mettre à jour les dimensions lors du montage et du redimensionnement
  useEffect(() => {
    updateDimensions()
    
    const handleResize = () => {
      updateDimensions()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!data || data.length === 0 || !keys || keys.length === 0 || !svgRef.current) {
      return
    }

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    const { width, height } = dimensions
    const margin = Math.min(60, width * 0.15) // Marge adaptative
    const radius = Math.min(width, height) / 2 - margin

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)

    // Create scales
    const angleScale = d3
      .scalePoint()
      .domain(keys)
      .range([0, 2 * Math.PI])

    const radiusScale = d3.scaleLinear().domain([0, 5]).range([0, radius])

    // Draw the circles
    const circles = [1, 2, 3, 4, 5]
    svg
      .selectAll(".circle")
      .data(circles)
      .join("circle")
      .attr("class", "circle")
      .attr("r", (d) => radiusScale(d))
      .attr("fill", "none")
      .attr("stroke", "#e5e5e5")
      .attr("stroke-width", 1)

    // Taille de police adaptative
    const fontSize = Math.max(8, Math.min(12, width / 35))

    // Add axis labels
    svg
      .selectAll(".axis-label")
      .data(keys)
      .join("text")
      .attr("class", "axis-label")
      .attr("x", (d) => radiusScale(5.5) * Math.sin(angleScale(d) || 0))
      .attr("y", (d) => radiusScale(5.5) * -Math.cos(angleScale(d) || 0))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", `${fontSize}px`)
      .attr("fill", "#78716c")
      .text((d) => d)

    // Draw the axis lines
    svg
      .selectAll(".axis-line")
      .data(keys)
      .join("line")
      .attr("class", "axis-line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d) => radius * Math.sin(angleScale(d) || 0))
      .attr("y2", (d) => radius * -Math.cos(angleScale(d) || 0))
      .attr("stroke", "#e5e5e5")
      .attr("stroke-width", 1)

    // Create the radar path generator
    const radarLine = d3
      .lineRadial<any>()
      .angle((d) => angleScale(d.key) || 0)
      .radius((d) => radiusScale(d.value))
      .curve(d3.curveLinearClosed)

    // Draw the radar paths for each entry
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

    // Vérifier que toutes les clés sont présentes dans chaque entrée
    const processedData = data.map(entry => {
      // S'assurer que chaque clé a une valeur
      const dataPoints = keys.map(key => ({
        key,
        value: typeof entry[key] === 'number' ? entry[key] : 0
      }));
      return {
        date: entry.date,
        dataPoints
      };
    });

    // Dessiner les chemins radar pour chaque entrée
    processedData.forEach((entry, i) => {
      svg
        .append("path")
        .datum(entry.dataPoints)
        .attr("d", radarLine as any)
        .attr("fill", colorScale(i.toString()) as string)
        .attr("fill-opacity", 0.2)
        .attr("stroke", colorScale(i.toString()) as string)
        .attr("stroke-width", 2)
    });

    // Add legend with adaptive positioning
    // Réduire la taille de la légende sur les petits écrans
    const legendX = width < 300 ? -width / 2 + 10 : -width / 2 + 20
    const legendY = width < 300 ? -height / 2 + 10 : -height / 2 + 20
    const legendFontSize = Math.max(8, Math.min(12, width / 35))
    const legendItemHeight = Math.max(15, Math.min(20, width / 20))
    
    const legend = svg.append("g").attr("transform", `translate(${legendX}, ${legendY})`)

    processedData.forEach((entry, i) => {
      // Formatage de la date
      let formattedDate = "";
      try {
        const date = new Date(entry.date);
        formattedDate = date.toLocaleDateString("fr-FR", {
          month: "short",
          year: "numeric",
        });
      } catch (err) {
        // Fallback si la date n'est pas valide
        formattedDate = entry.date || `Série ${i+1}`;
      }

      const legendItem = legend.append("g").attr("transform", `translate(0, ${i * legendItemHeight})`)

      legendItem
        .append("rect")
        .attr("width", Math.max(8, Math.min(12, width / 35)))
        .attr("height", Math.max(8, Math.min(12, width / 35)))
        .attr("fill", colorScale(i.toString()) as string)

      legendItem
        .append("text")
        .attr("x", Math.max(15, Math.min(20, width / 25)))
        .attr("y", Math.max(6, Math.min(10, width / 45)))
        .attr("font-size", `${legendFontSize}px`)
        .attr("fill", "#78716c")
        .text(formattedDate)
    })
  }, [data, keys, dimensions])

  return (
    <div className="w-full flex justify-center items-center" ref={containerRef}>
      <svg ref={svgRef} data-testid="radar-chart" width={dimensions.width} height={dimensions.height} />
    </div>
  )
}
