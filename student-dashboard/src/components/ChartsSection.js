import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid
} from "recharts";

function ChartsSection({ students }) {

  if (students.length === 0) return null;

  const highRisk = students.filter(s => s.dropout_flag === 1).length;
  const lowRisk = students.length - highRisk;

  const riskData = [
    { name: "Low Risk", value: lowRisk },
    { name: "High Risk", value: highRisk }
  ];

  const attendanceData = [
    {
      name: "Low Risk",
      value: students
        .filter(s => s.dropout_flag === 0)
        .reduce((a, s) => a + s.attendance, 0) / lowRisk
    },
    {
      name: "High Risk",
      value: students
        .filter(s => s.dropout_flag === 1)
        .reduce((a, s) => a + s.attendance, 0) / highRisk
    }
  ];

  return (
    <Grid container spacing={3}>

      {/* Risk Pie */}
      <Grid item xs={12} md={6}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h6">
              Risk Distribution
            </Typography>
            <PieChart width={300} height={300}>
              <Pie data={riskData} dataKey="value" outerRadius={120} innerRadius={80} stroke="none">
                <Cell fill="#00E676" />
                <Cell fill="#FF4081" />
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0A1929', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
            </PieChart>
          </CardContent>
        </Card>
      </Grid>

      {/* Attendance vs Risk */}
      <Grid item xs={12} md={6}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h6">
              Attendance vs Risk
            </Typography>
            <BarChart width={300} height={300} data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3C4D" vertical={false} />
              <XAxis dataKey="name" stroke="#8892b0" />
              <YAxis stroke="#8892b0" />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0A1929', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="#00D8FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}

export default ChartsSection;