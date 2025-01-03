"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RunsPerOverData } from "@/lib/definitions";

interface RunsProgressionChartProps {
  data: RunsPerOverData[];
}

export function RunsProgressionChart({ data }: RunsProgressionChartProps) {
  const progressionData = data.map((over, index) => {
    const cumulativeRuns = data
      .slice(0, index + 1)
      .reduce((sum, curr) => sum + curr.runs, 0);
    return {
      over: over.over_number,
      runs: over.runs,
      cumulativeRuns,
      wickets: over.wickets,
    };
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Runs Progression</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={progressionData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="over"
              label={{ value: "Overs", position: "insideBottom", offset: -5 }}
              className="text-sm"
            />
            <YAxis
              label={{
                value: "Runs",
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
              className="text-sm"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Over
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].payload.over}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Runs
                          </span>
                          <span className="font-bold">
                            {payload[0].payload.cumulativeRuns}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="cumulativeRuns"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
