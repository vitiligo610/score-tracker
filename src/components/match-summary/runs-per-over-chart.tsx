"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RunsPerOverData } from "@/lib/definitions";

interface RunsPerOverChartProps {
  data: RunsPerOverData[];
}

export function RunsPerOverChart({ data }: RunsPerOverChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Runs Per Over</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="over_number"
              label={{ value: "Over", position: "insideBottom", offset: -5 }}
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
                            {payload[0].payload.over_number}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Runs
                          </span>
                          <span className="font-bold">{payload[0].value}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="runs"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
