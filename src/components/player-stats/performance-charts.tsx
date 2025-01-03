"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BattingPerformance, BowlingPerformance } from "@/lib/definitions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface PerformanceChartsProps {
  battingPerformances: BattingPerformance[];
  bowlingPerformances: BowlingPerformance[];
}

export function PerformanceCharts({
  battingPerformances,
  bowlingPerformances,
}: PerformanceChartsProps) {
  const battingData = battingPerformances.map((perf, index) => ({
    match: index + 1,
    runs: perf.runs_scored,
    strikeRate: perf.strike_rate,
  }));

  // Process bowling data for the chart
  const bowlingData = bowlingPerformances.map((perf, index) => ({
    match: index + 1,
    wickets: perf.wickets_taken,
    economy: perf.economy_rate,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Batting Form</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={battingData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="match"
                label={{ value: "Matches", position: "bottom" }}
              />
              <YAxis
                yAxisId="left"
                label={{ value: "Runs", angle: -90, position: "insideLeft" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Strike Rate",
                  angle: 90,
                  position: "insideRight",
                }}
              />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="runs"
                stroke="hsl(var(--chart-1))"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="strikeRate"
                stroke="hsl(var(--chart-2))"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Bowling Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bowlingData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="match"
                label={{ value: "Matches", position: "bottom" }}
              />
              <YAxis
                yAxisId="left"
                label={{ value: "Wickets", angle: -90, position: "insideLeft" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: "Economy", angle: 90, position: "insideRight" }}
              />
              <Tooltip />
              <Bar
                yAxisId="left"
                dataKey="wickets"
                fill="hsl(var(--chart-3))"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="economy"
                stroke="hsl(var(--chart-4))"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
