import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface ChartProps {
  data: ChartData[];
  type: 'pie' | 'donut';
  size?: number;
}

const Chart: React.FC<ChartProps> = ({ data, type, size = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 10;
  const innerRadius = type === 'donut' ? radius * 0.6 : 0;
  const center = size / 2;

  let currentAngle = 0;

  const createPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = center + outerRadius * Math.cos(startAngleRad);
    const y1 = center + outerRadius * Math.sin(startAngleRad);
    const x2 = center + outerRadius * Math.cos(endAngleRad);
    const y2 = center + outerRadius * Math.sin(endAngleRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    if (innerRadius === 0) {
      return `M ${center} ${center} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    } else {
      const x3 = center + innerRadius * Math.cos(endAngleRad);
      const y3 = center + innerRadius * Math.sin(endAngleRad);
      const x4 = center + innerRadius * Math.cos(startAngleRad);
      const y4 = center + innerRadius * Math.sin(startAngleRad);

      return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="mb-4">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const startAngle = currentAngle - 90; // Start from top
          const endAngle = startAngle + angle;

          const path = createPath(startAngle, endAngle, radius, innerRadius);
          currentAngle += angle;

          return (
            <path
              key={index}
              d={path}
              fill={item.color}
              className="hover:opacity-80 transition-opacity duration-200"
            />
          );
        })}
        
        {type === 'donut' && (
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-lg font-semibold fill-gray-700"
          >
            Total
          </text>
        )}
      </svg>

      <div className="grid grid-cols-2 gap-2 text-sm">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600 truncate">{item.label}</span>
            <span className="font-medium text-gray-800">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chart;