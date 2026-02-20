import React, { useState, useEffect } from "react";
import { Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import KPISection from "./KPISection";
import ChartsSection from "./ChartsSection";
import SimulationPanel from "./SimulationPanel";
import StudentTable from "./StudentTable";

function Dashboard() {

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get("https://student-retention-risk-scoring-model.onrender.com/students")
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 5 }}>
      {/* Compact Header */}
      <Typography variant="h4" gutterBottom fontWeight="600" color="#FFFFFF">
        Student Retention Risk Dashboard
      </Typography>

      <KPISection students={students} />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <ChartsSection students={students} />
        </Grid>

        <Grid item xs={12} md={4}>
          <SimulationPanel
            students={students}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            setResult={setResult}
            result={result}
          />
        </Grid>
      </Grid>

      <StudentTable students={students} />
    </Container>
  );
}

export default Dashboard;