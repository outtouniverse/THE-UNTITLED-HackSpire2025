import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const API_URL = 'http://localhost:3001'; // Your backend API base URL

export default function AnalysisView() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Define Dark Theme Colors ---
  const darkTheme = {
    // Assuming outer background is handled by App.jsx or index.css
    containerBg: '#000', // Dark blue/purple background for the card
    textColor: '#fff',    // Light grey text
    subtleTextColor: '#a0a0a0', // Dimmer grey for less important text
    borderColor: 'rgba(255, 255, 255, 0.15)', // Subtle light border
    accentColor: '#bb86fc', // Purple accent for highlights
    shadow: '0 8px 30px rgba(0, 0, 0, 0.5)', // Suitable shadow for dark mode
    borderRadius: '16px',
    statsAreaBg: 'rgba(255, 255, 255, 0.05)', // Very subtle light contrast area
    chartColors: [ // Dark mode friendly chart colors
      'rgba(187, 134, 252, 0.8)', // Purple Accent
      'rgba(3, 218, 197, 0.7)',  // Teal
      'rgba(100, 181, 246, 0.7)', // Lighter Blue
      'rgba(255, 213, 79, 0.7)', // Lighter Yellow
      'rgba(240, 98, 146, 0.7)', // Pink/Red
      'rgba(129, 212, 250, 0.7)', // Light Blue
      'rgba(124, 179, 66, 0.7)', // Light Green
    ],
    chartGridColor: 'rgba(255, 255, 255, 0.1)', // Light grid lines
    chartTooltipBg: 'rgba(30, 30, 63, 0.9)',  // Dark tooltip bg (matches container)
  };
  // --- End Dark Theme Colors ---


  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/analysis/last7days`, { credentials: 'include' })
      .then(res => {
        if (res.status === 401) throw new Error('Unauthorized. Please log in.');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data && data.analysis) {
          setAnalysisData(data.analysis);
          setError(null);
        } else {
          setAnalysisData(null);
          setError(data.message || "No analysis data found.");
        }
      })
      .catch(err => {
        console.error("Error fetching analysis:", err);
        setError(err.message || "Failed to load analysis data.");
        setAnalysisData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // --- Chart Data Preparation (Using darkTheme colors) ---
  const characterFrequencyData = {
    labels: analysisData ? Object.keys(analysisData.characterFrequency) : [],
    datasets: [{
      label: 'Chats per Guide',
      data: analysisData ? Object.values(analysisData.characterFrequency) : [],
      // Use dark theme chart colors
      backgroundColor: darkTheme.chartColors,
      // Generate solid border colors matching the background colors but with full opacity
      borderColor: darkTheme.chartColors.map(color => color.replace(/[^,]+(?=\))/, '1')),
      borderWidth: 1,
    }],
  };

  // --- Chart Options (Using darkTheme colors) ---
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: darkTheme.subtleTextColor } // Dark theme text color
      },
      title: {
        display: true,
        text: 'Character Interaction Frequency (Last 7 Days)',
        color: darkTheme.textColor, // Dark theme text color
        font: { size: 16, family: "'Inter', sans-serif" }
      },
      tooltip: {
        backgroundColor: darkTheme.chartTooltipBg, // Dark theme tooltip bg
        titleColor: '#ffffff', // White text in tooltip
        bodyColor: '#ffffff',
      }
    },
    scales: { // Only relevant for Bar chart
      y: {
        beginAtZero: true,
        ticks: { color: darkTheme.subtleTextColor, stepSize: 1 }, // Dark theme text color
        grid: { color: darkTheme.chartGridColor } // Dark theme grid color
      },
      x: {
        ticks: { color: darkTheme.subtleTextColor }, // Dark theme text color
        grid: { display: false }
      }
    }
  };
   const pieChartOptions = {
      ...chartOptions, // Inherit base options
      scales: undefined, // No scales for Pie chart
       plugins: {
           ...chartOptions.plugins, // Inherit base plugins
           title: {
               ...chartOptions.plugins.title, // Inherit title config
               text: 'Character Interaction Share (Last 7 Days)', // Overwrite text
               color: darkTheme.textColor, // Ensure dark theme color
           },
            legend: { // Custom legend for Pie
                position: 'bottom',
                labels: { color: darkTheme.subtleTextColor, padding: 15 } // Dark theme text color
            },
            tooltip: { // Ensure tooltip styles apply to pie too
               backgroundColor: darkTheme.chartTooltipBg,
               titleColor: '#ffffff',
               bodyColor: '#ffffff',
            }
       }
   };
  // --- End Chart Options ---

  // --- Render Logic ---
  if (loading) {
    // Use dark theme text color
    return <div style={{ padding: '50px', textAlign: 'center', color: darkTheme.subtleTextColor }}>Loading analysis...</div>;
  }

  if (error || !analysisData) {
    // Use a distinct error color
    return <div style={{ padding: '50px', textAlign: 'center', color: '#ff8080' }}>Error: {error || "Could not load analysis data."}</div>;
  }

  if (analysisData.totalChats === 0) {
       return (
           // Use dark theme text colors
           <div style={{ textAlign: 'center', color: darkTheme.textColor, maxWidth: '100%', margin: '50px auto' }}>
               <h2 style={{ color: darkTheme.textColor }}>Analysis (Last 7 Days)</h2>
               <p style={{ marginTop: '20px', fontSize: '1.1rem', lineHeight: 1.6, color: darkTheme.subtleTextColor }}>
                   It looks like you haven't chatted with any guides in the past week. <br/>
                   Start a conversation to see your interaction patterns here! 💬
               </p>
           </div>
       );
  }

  // --- Apply Dark Theme Styles to JSX ---
  return (
    <div className="analysis-view-container" style={{ // Keep className if needed for other things
      maxWidth: '100%',
     height:"100vh",
     paddingTop:"50px",
      background: darkTheme.containerBg, // Use dark theme background
      boxShadow: darkTheme.shadow, // Use dark theme shadow
      color: darkTheme.textColor, // Use dark theme text color
      fontFamily: "'Inter', sans-serif",
    }}>
      <h2 style={{
        fontFamily: "'Playfair Display', serif", // Keep specific font if desired
        color: darkTheme.textColor, // Use dark theme text color
        textAlign: 'center',
        marginBottom: '40px',
        fontWeight: 600,
        fontSize: '1.9rem',
      }}>
        Your Week in Reflection
      </h2>

      {/* Summary Stats - Apply dark theme styles */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        gap: '20px',
        marginBottom: '40px',
        padding: '20px',
        background: darkTheme.statsAreaBg, // Use dark theme stats area bg
        borderRadius: '12px',
        border: `1px solid ${darkTheme.borderColor}` // Use dark theme border
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 600, color: darkTheme.accentColor }}>{analysisData.totalChats}</div>
          <div style={{ fontSize: '0.9rem', color: darkTheme.subtleTextColor }}>Total Chats</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 600, color: darkTheme.accentColor }}>{analysisData.totalUserMessages}</div>
          <div style={{ fontSize: '0.9rem', color: darkTheme.subtleTextColor }}>Messages Sent</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 600, color: darkTheme.accentColor }}>{analysisData.mostFrequentCharacter || '-'}</div>
          <div style={{ fontSize: '0.9rem', color: darkTheme.subtleTextColor }}>Most Frequent Guide</div>
        </div>
      </div>

      {/* Charts Area - Structure unchanged, options apply theme */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ height: '350px', width: '100%', maxWidth: '400px', marginBottom: '30px' }}>
          <Bar options={chartOptions} data={characterFrequencyData} />
        </div>
        <div style={{ height: '350px', width: '100%', maxWidth: '350px', marginBottom: '30px' }}>
           <Pie options={pieChartOptions} data={characterFrequencyData} />
        </div>
      </div>
    </div>
  );
}