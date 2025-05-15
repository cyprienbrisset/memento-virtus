"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface RadarChartProps {
  data: any[]
  keys: string[]
}

export function RadarChart({ data, keys }: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const width = 400
  const height = 400

  useEffect(() => {
    if (!data || data.length === 0 || !keys || keys.length === 0 || !svgRef.current) {
      return
    }

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    const margin = 60
    const radius = Math.min(width, height) / 2 - margin

    const svg = d3
      .select(svgRef.current)
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
      .attr("font-size", "12px")
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

    data.forEach((entry, i) => {
      const dataPoints = keys.map((key) => ({
        key,
        value: entry[key] || 0,
      }))

      svg
        .append("path")
        .datum(dataPoints)
        .attr("d", radarLine as any)
        .attr("fill", colorScale(i.toString()) as string)
        .attr("fill-opacity", 0.2)
        .attr("stroke", colorScale(i.toString()) as string)
        .attr("stroke-width", 2)
    })

    // Add legend
    const legend = svg.append("g").attr("transform", `translate(${-width / 2 + 20}, ${-height / 2 + 20})`)

    data.forEach((entry, i) => {
      const date = new Date(entry.date)
      const formattedDate = date.toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      })

      const legendItem = legend.append("g").attr("transform", `translate(0, ${i * 20})`)

      legendItem
        .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", colorScale(i.toString()) as string)

      legendItem
        .append("text")
        .attr("x", 20)
        .attr("y", 10)
        .attr("font-size", "12px")
        .attr("fill", "#78716c")
        .text(formattedDate)
    })
  }, [data, keys])

  return (
    <div className="flex justify-center items-center">
      <svg ref={svgRef} data-testid="radar-chart" width={width} height={height} />
    </div>
  )
}
