import { RoadmapNode } from '../types/roadmap';
import RoadmapNodeComponent from './RoadmapNode';

interface RoadmapPathProps {
  nodes: RoadmapNode[];
  onTapNode: (node: RoadmapNode) => void;
}

export default function RoadmapPath({ nodes, onTapNode }: RoadmapPathProps) {
  // Sort nodes by position.y to draw continuous path lines accurately
  const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);

  // Generate SVG lines for all connections
  const pathLines = sortedNodes.flatMap((node) => {
    return node.connections
      .map((connId) => {
        const nextNode = sortedNodes.find((n) => n.id === connId);
        if (!nextNode) return null;

        const isCompleted = node.status === 'completed' && nextNode.status === 'completed';
        const isActive = node.status === 'completed' && nextNode.status === 'active';

        return {
          fromX: `${node.position.x}%`,
          fromY: node.position.y,
          toX: `${nextNode.position.x}%`,
          toY: nextNode.position.y,
          strokeColor: isCompleted
            ? '#10b981' // emerald-500
            : isActive
            ? '#3b82f6' // blue-500
            : '#71717a', // zinc-500/gray
          strokeDash: isActive || (!isCompleted && !isActive) ? '6 6' : '0',
          isCompleted,
          isActive,
        };
      })
      .filter(Boolean);
  });

  return (
    <div className="relative w-full h-[600px] overflow-visible select-none py-12">
      {/* Background SVG for connector lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {pathLines.map((line, idx) => (
          <line
            key={idx}
            x1={line!.fromX}
            y1={line!.fromY}
            x2={line!.toX}
            y2={line!.toY}
            stroke={line!.strokeColor}
            strokeWidth="3"
            strokeDasharray={line!.strokeDash}
            className={line!.isActive ? 'animate-pulse' : ''}
          />
        ))}
      </svg>

      {/* Foreground Interactive Circles */}
      <div className="relative z-10">
        {nodes.map((node) => (
          <RoadmapNodeComponent key={node.id} node={node} onTap={onTapNode} />
        ))}
      </div>
    </div>
  );
}
