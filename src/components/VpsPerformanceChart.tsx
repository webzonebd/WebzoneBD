import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Cpu, Zap, Activity, Info } from 'lucide-react';

interface ChartData {
  label: string;
  value: number; // raw value
  displayVal: string;
  color: string;
  isEpyc: boolean;
}

export default function VpsPerformanceChart() {
  const [metric, setMetric] = useState<'cpu' | 'ram'>('cpu');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // CPU: Cinebench R23 Multicore Relative Index
  const cpuData: ChartData[] = [
    { label: 'AMD EPYC™ Gen-4', value: 74500, displayVal: '74,500 pts', color: '#06b6d4', isEpyc: true }, // cyan-500
    { label: 'Legacy Xeon', value: 31200, displayVal: '31,200 pts', color: '#94a3b8', isEpyc: false }, // slate-400
  ];

  // RAM: Bandwidth read capability in GB/s
  const ramData: ChartData[] = [
    { label: 'EPYC DDR5 (4800MHz)', value: 307.2, displayVal: '307.2 GB/s', color: '#3b82f6', isEpyc: true }, // blue-500
    { label: 'Standard DDR4', value: 136.5, displayVal: '136.5 GB/s', color: '#94a3b8', isEpyc: false }, // slate-400
  ];

  const activeData = metric === 'cpu' ? cpuData : ramData;
  const multiplier = (activeData[0].value / activeData[1].value).toFixed(2);

  useEffect(() => {
    if (!svgRef.current) return;

    // Responsive sizing inside the pricing card container
    const width = 290;
    const height = 120;
    const margin = { top: 15, right: 15, bottom: 25, left: 110 };

    // Clear previous drawing
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('overflow', 'visible');

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    // X scale
    const x = d3.scaleLinear()
      .domain([0, d3.max(activeData, d => d.value) || 100])
      .range([0, chartWidth]);

    // Y scale
    const y = d3.scaleBand()
      .domain(activeData.map(d => d.label))
      .range([0, chartHeight])
      .padding(0.28);

    // Draw background tracks for glowing comparison look
    g.selectAll('.track-rect')
      .data(activeData)
      .enter()
      .append('rect')
      .attr('class', 'track-rect')
      .attr('y', d => y(d.label) || 0)
      .attr('x', 0)
      .attr('width', chartWidth)
      .attr('height', y.bandwidth())
      .attr('rx', 6)
      .attr('fill', 'rgba(148, 163, 184, 0.08)'); // subtle light gray track

    // Draw active animated bars
    const bars = g.selectAll('.bar-rect')
      .data(activeData)
      .enter()
      .append('rect')
      .attr('class', 'bar-rect')
      .attr('y', d => y(d.label) || 0)
      .attr('x', 0)
      .attr('height', y.bandwidth())
      .attr('rx', 6)
      .attr('fill', d => d.color)
      .style('cursor', 'pointer')
      .style('filter', d => d.isEpyc ? 'drop-shadow(0px 0px 6px rgba(59, 130, 246, 0.4))' : 'none');

    // Smooth transition width animation
    bars.transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr('width', d => x(d.value));

    // Y Axis Text Labels (Plan server type)
    const yAxisG = g.append('g')
      .attr('class', 'y-axis')
      .style('font-family', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace')
      .style('font-size', '9.5px')
      .style('font-weight', '700');

    yAxisG.selectAll('.label-text')
      .data(activeData)
      .enter()
      .append('text')
      .attr('class', 'label-text')
      .attr('x', -8)
      .attr('y', d => (y(d.label) || 0) + y.bandwidth() / 2 + 3)
      .attr('text-anchor', 'end')
      .attr('fill', 'currentColor')
      .text(d => d.isEpyc ? '🚀 AMD EPYC' : 'Standard');

    // Value Labels on top of/inside the bars
    const valueTexts = g.selectAll('.value-text')
      .data(activeData)
      .enter()
      .append('text')
      .attr('class', 'value-text')
      .attr('y', d => (y(d.label) || 0) + y.bandwidth() / 2 + 3.5)
      .attr('x', 6)
      .style('font-family', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace')
      .style('font-size', '9px')
      .style('font-weight', '850')
      .attr('fill', d => d.isEpyc ? '#ffffff' : '#64748b')
      .style('opacity', 0);

    valueTexts.transition()
      .delay(400)
      .duration(500)
      .attr('x', d => Math.max(8, x(d.value) - 62))
      .style('opacity', 1)
      .text(d => d.displayVal);

    // Interactive overlays for hover events
    g.selectAll('.interactive-overlay')
      .data(activeData)
      .enter()
      .append('rect')
      .attr('class', 'interactive-overlay')
      .attr('y', d => y(d.label) || 0)
      .attr('x', 0)
      .attr('width', chartWidth)
      .attr('height', y.bandwidth())
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        const idx = activeData.findIndex(item => item.label === d.label);
        setHoveredIdx(idx);
      })
      .on('mouseleave', () => {
        setHoveredIdx(null);
      });

  }, [metric]);

  return (
    <div className="my-5 p-3.5 bg-neutral-50/50 dark:bg-neutral-900/40 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/60 select-none">
      <div className="flex items-center justify-between gap-1.5 mb-2">
        <div className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
          <span className="text-[10px] font-black tracking-wider text-neutral-800 dark:text-neutral-250 font-mono uppercase">
            AMD EPYC™ Benching
          </span>
        </div>
        
        {/* Metric Selector Toggles */}
        <div className="flex p-0.5 bg-neutral-200/60 dark:bg-neutral-850 rounded-lg">
          <button
            onClick={() => setMetric('cpu')}
            className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-colors ${metric === 'cpu' ? 'bg-blue-600 text-white shadow-xs' : 'text-neutral-500 dark:text-neutral-400'}`}
          >
            CPU vCPU
          </button>
          <button
            onClick={() => setMetric('ram')}
            className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-colors ${metric === 'ram' ? 'bg-blue-600 text-white shadow-xs' : 'text-neutral-500 dark:text-neutral-400'}`}
          >
            RAM Band
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="flex justify-center py-1">
        <svg ref={svgRef} className="text-neutral-700 dark:text-neutral-300" />
      </div>

      {/* Dynamic Multiplier Analysis */}
      <div className="mt-2.5 flex items-center justify-between border-t border-neutral-200/40 dark:border-neutral-800/50 pt-2 text-[10px]">
        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold">
          <Zap className="w-3 h-3 fill-current" />
          <span>+{multiplier}x Higher Capacity</span>
        </div>
        <span className="text-[9.5px] font-semibold text-neutral-400 dark:text-neutral-500 font-mono">
          {metric === 'cpu' ? 'EPYC vCPU v/s Older Xeon' : 'EPYC DDR5 v/s Dual DDR4'}
        </span>
      </div>

      {/* Interactive Tooltip Explanation */}
      {hoveredIdx !== null && (
        <div className="mt-2 p-1.5 rounded-lg bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/20 text-[9.5px] text-blue-700 dark:text-cyan-400 leading-tight font-sans text-center transition-all animate-fade-in">
          {hoveredIdx === 0 ? (
            <span>⚡ <strong>{activeData[0].label}</strong> excels with larger L3 Cache structures, lower hyper-thread overhead & PCIe Gen5 pathways.</span>
          ) : (
            <span>⚠️ <strong>{activeData[1].label}</strong> is restricted by traditional thread limitations & legacy memory clock speeds.</span>
          )}
        </div>
      )}
    </div>
  );
}
