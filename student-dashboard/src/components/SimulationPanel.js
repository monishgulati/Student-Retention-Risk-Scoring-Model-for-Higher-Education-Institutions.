import React, { useState } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid,
  Divider,
  Card,
  CardContent
} from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from "recharts";

import GaugeChart from "react-gauge-chart";

function SimulationPanel({ students }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    if (!selectedStudent) return;

    const response = await axios.post(
      "https://student-retention-risk-scoring-model.onrender.com/predict",
      { name: selectedStudent.name }
    );

    setResult(response.data);
  };

  return (
    <Paper elevation={3} style={{ padding: 30, marginTop: 20 }}>
      <Grid container spacing={4}>

        {/* LEFT: STUDENT SELECTION */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Student Risk Prediction
              </Typography>

              <FormControl fullWidth>
                <InputLabel>Select Student</InputLabel>
                <Select
                  value={selectedStudent || ""}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  {students.map((student) => (
                    <MenuItem key={student.name} value={student}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                fullWidth
                size="large"
                style={{ marginTop: 20 }}
                onClick={handlePredict}
              >
                PREDICT RISK
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* CENTER + RIGHT VISUAL AREA */}
        <Grid item xs={12} md={8}>
          {result && selectedStudent && (
            <Grid container spacing={3}>

              {/* CENTER: GAUGE */}
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6">
                      Risk Meter
                    </Typography>

                    <GaugeChart
                      id="risk-gauge"
                      nrOfLevels={20}
                      percent={result.probability}
                      colors={["#00E676", "#FFC107", "#FF4081"]}
                      arcWidth={0.3}
                      textColor="#FFFFFF"
                      formatTextValue={(value) => `${value}%`}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* RIGHT: SUMMARY CARD */}
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: result.probability > 0.5 ? '#FF4081' : '#00E676' }}>
                      {(result.probability * 100).toFixed(2)}%
                    </Typography>

                    <Chip
                      label={
                        result.probability > 0.5
                          ? "High Risk"
                          : "Low Risk"
                      }
                      color={
                        result.probability > 0.5
                          ? "error"
                          : "success"
                      }
                      variant={result.probability > 0.5 ? "filled" : "outlined"}
                      style={{ marginTop: 10, fontWeight: 600 }}
                    />

                    <Divider style={{ margin: "15px 0", borderColor: 'rgba(255,255,255,0.1)' }} />

                    <Typography>
                      Course: {selectedStudent.course}
                    </Typography>
                    <Typography>
                      Year: {selectedStudent.year}
                    </Typography>
                    <Typography>
                      Attendance: {selectedStudent.attendance}%
                    </Typography>
                    <Typography>
                      Avg GPA: {selectedStudent.avg_gpa}
                    </Typography>
                    <Typography>
                      Backlogs: {selectedStudent.backlog_count}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* FULL WIDTH: RISK COMPARISON */}
              <Grid item xs={12}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6">
                      Risk Comparison
                    </Typography>

                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          {
                            name: "Low Risk",
                            value: (1 - result.probability) * 100
                          },
                          {
                            name: "High Risk",
                            value: result.probability * 100
                          }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A3C4D" vertical={false} />
                        <XAxis dataKey="name" stroke="#8892b0" />
                        <YAxis domain={[0, 100]} stroke="#8892b0" />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{ backgroundColor: '#0A1929', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          formatter={(value) => `${value.toFixed(2)}%`}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          <Cell fill="#00E676" />
                          <Cell fill="#FF4081" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

              {/* FULL WIDTH: GPA TREND */}
              <Grid item xs={12}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6">
                      GPA Trend (Semester-wise)
                    </Typography>

                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={[
                          { sem: "Sem 1", gpa: selectedStudent.gpa_sem1 },
                          { sem: "Sem 2", gpa: selectedStudent.gpa_sem2 },
                          { sem: "Sem 3", gpa: selectedStudent.gpa_sem3 },
                          { sem: "Sem 4", gpa: selectedStudent.gpa_sem4 },
                          { sem: "Sem 5", gpa: selectedStudent.gpa_sem5 }
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#2A3C4D" vertical={false} />
                        <XAxis dataKey="sem" stroke="#8892b0" />
                        <YAxis domain={[0, 10]} stroke="#8892b0" />
                        <Tooltip contentStyle={{ backgroundColor: '#0A1929', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                        <Line
                          type="monotone"
                          dataKey="gpa"
                          stroke="#00D8FF"
                          strokeWidth={4}
                          dot={{ r: 4, fill: '#0A1929', strokeWidth: 2 }}
                          activeDot={{ r: 8, fill: '#00D8FF' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>

            </Grid>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default SimulationPanel;