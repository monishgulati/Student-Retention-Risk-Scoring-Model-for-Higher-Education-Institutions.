import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
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
      {/* Premium Hero Section */}
      <Box
        sx={{
          width: '100%',
          height: { xs: '200px', md: '280px' },
          borderRadius: 4,
          mb: 4,
          backgroundImage: `linear-gradient(to right, rgba(10, 25, 41, 0.9) 0%, rgba(10, 25, 41, 0.4) 100%), url('/banner.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          px: { xs: 3, md: 8 },
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box>
          <Typography
            variant="h3"
            fontWeight="700"
            color="#FFFFFF"
            sx={{
              textShadow: '0px 4px 20px rgba(0, 216, 255, 0.6)',
              letterSpacing: '1px'
            }}
          >
            Student Retention Risk Dashboard
          </Typography>
        </Box>
      </Box>

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