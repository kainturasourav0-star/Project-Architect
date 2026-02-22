'use client';

import { useRef } from 'react';
import type { WorkflowSchema } from '@/lib/types';

interface NeuralMapProps {
    schema: WorkflowSchema;
    highlightedIds?: string[];
    scanning?: boolean;
}

const NODE_COLORS = {
    start: { fill: 'rgba(0, 229, 255, 0.15)', stroke: '#00e5ff', text: '#00e5ff' },
    action: { fill: 'rgba(168, 85, 247, 0.12)', stroke: '#a855f7', text: '#e2f4ff' },
    decision: { fill: 'rgba(255, 166, 0, 0.12)', stroke: '#ffa600', text: '#e2f4ff' },
    end: { fill: 'rgba(0, 255, 136, 0.15)', stroke: '#00ff88', text: '#00ff88' },
};

export function NeuralMap({ schema, highlightedIds = [], scanning = false }: NeuralMapProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    const W = 620;
    const H = Math.max(600, schema.nodes.length * 95 + 60);

    // Normalize node positions to fit within SVG
    const minX = Math.min(...schema.nodes.map((n) => n.x));
    const maxX = Math.max(...schema.nodes.map((n) => n.x)) + 120;
    const minY = Math.min(...schema.nodes.map((n) => n.y));
    const maxY = Math.max(...schema.nodes.map((n) => n.y)) + 40;

    function nx(x: number) {
        return 40 + ((x - minX) / Math.max(1, maxX - minX)) * (W - 80);
    }
    function ny(y: number) {
        return 40 + ((y - minY) / Math.max(1, maxY - minY)) * (H - 80);
    }

    const nodeMap = Object.fromEntries(schema.nodes.map((n) => [n.id, { ...n, cx: nx(n.x), cy: ny(n.y) }]));

    return (
        <div
            style={{
                background: '#000d0d',
                border: '1px solid rgba(0, 229, 255, 0.15)',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {scanning && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
                        animation: 'ticker-scroll 2s linear infinite',
                        zIndex: 10,
                    }}
                />
            )}
            <svg
                ref={svgRef}
                width="100%"
                viewBox={`0 0 ${W} ${H}`}
                style={{ display: 'block' }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="rgba(0, 229, 255, 0.6)" />
                    </marker>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Grid */}
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0,229,255,0.04)" strokeWidth="0.5" />
                </pattern>
                <rect width={W} height={H} fill="url(#grid)" />

                {/* Edges */}
                {schema.edges.map((edge) => {
                    const from = nodeMap[edge.from];
                    const to = nodeMap[edge.to];
                    if (!from || !to) return null;
                    const midX = (from.cx + to.cx) / 2;
                    const midY = (from.cy + to.cy) / 2;
                    const highlighted = highlightedIds.includes(from.id) || highlightedIds.includes(to.id);
                    return (
                        <g key={edge.id}>
                            <line
                                x1={from.cx} y1={from.cy + 20}
                                x2={to.cx} y2={to.cy - 20}
                                stroke={highlighted ? 'rgba(255, 51, 102, 0.8)' : 'rgba(0, 229, 255, 0.35)'}
                                strokeWidth={highlighted ? 2 : 1.5}
                                strokeDasharray={highlighted ? '' : ''}
                                markerEnd="url(#arrowhead)"
                                filter={highlighted ? 'url(#glow)' : undefined}
                            />
                            {edge.label && (
                                <text x={midX + 6} y={midY} fill="rgba(0,229,255,0.6)" fontSize="9" fontFamily="Source Code Pro">
                                    {edge.label}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Nodes */}
                {schema.nodes.map((node) => {
                    const { cx, cy } = nodeMap[node.id];
                    const colors = NODE_COLORS[node.type];
                    const isHighlighted = highlightedIds.includes(node.id);
                    const label = node.label;
                    const boxW = Math.max(110, label.length * 7 + 20);
                    const boxH = 36;
                    const shape = node.type === 'decision' ? 'diamond' : 'rect';

                    return (
                        <g key={node.id} transform={`translate(${cx}, ${cy})`}>
                            {shape === 'diamond' ? (
                                <polygon
                                    points={`0,-${boxH / 2} ${boxW / 2},0 0,${boxH / 2} -${boxW / 2},0`}
                                    fill={isHighlighted ? 'rgba(255, 51, 102, 0.2)' : colors.fill}
                                    stroke={isHighlighted ? '#ff3366' : colors.stroke}
                                    strokeWidth={isHighlighted ? 2 : 1}
                                    filter={isHighlighted ? 'url(#glow)' : undefined}
                                />
                            ) : (
                                <rect
                                    x={-boxW / 2} y={-boxH / 2}
                                    width={boxW} height={boxH}
                                    rx="4" ry="4"
                                    fill={isHighlighted ? 'rgba(255, 51, 102, 0.2)' : colors.fill}
                                    stroke={isHighlighted ? '#ff3366' : colors.stroke}
                                    strokeWidth={isHighlighted ? 2 : 1}
                                    filter={isHighlighted ? 'url(#glow)' : undefined}
                                />
                            )}
                            <text
                                textAnchor="middle" dominantBaseline="middle"
                                fill={isHighlighted ? '#ff3366' : colors.text}
                                fontSize="10" fontWeight="600"
                                fontFamily="Inter, system-ui, sans-serif"
                            >
                                {label}
                            </text>
                            {/* Type badge */}
                            <text
                                x={boxW / 2 + 4} y={-boxH / 2}
                                fill="rgba(0,229,255,0.4)" fontSize="7"
                                fontFamily="Source Code Pro, monospace"
                            >
                                [{node.type.toUpperCase()}]
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
