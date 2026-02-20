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
              <Pie data={riskData} dataKey="value" outerRadius={120}>
                <Cell fill="#4CAF50" />
                <Cell fill="#F44336" />
              </Pie>
              <Tooltip />
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1976D2" />
            </BarChart>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}

export default ChartsSection;