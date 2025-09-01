'use client';
import {
  RadialBar,
  RadialBarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '../ui/chart';

interface TopItemsChartProps {
  data: {
    name: string;
    quantity: number;
    fill: string;
  }[];
}

export default function TopItemsChart({ data }: TopItemsChartProps) {
  const chartConfig = data.reduce((acc, item) => {
    acc[item.name] = {
      label: item.name,
      color: item.fill,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="h-[350px]">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            barSize={12}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey="quantity"
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ right: 20 }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
