import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const Garden = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [plants, setPlants] = useState({});
  const [moodTypes, setMoodTypes] = useState({}); // Track mood types for each day
  const [streaks, setStreaks] = useState({
    happy: 0,
    sad: 0,
    current: 0,
    monthlyHappy: 0,
    monthlySad: 0,
    daysThisMonth: 0
  });

  // Function to calculate streaks
  const calculateStreaks = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let happyStreak = 0;
    let sadStreak = 0;
    let currentStreak = 0;
    let monthlyHappy = 0;
    let monthlySad = 0;
    let daysThisMonth = 0;
    
    // Sort dates in descending order
    const sortedDates = Object.keys(moodTypes).sort((a, b) => new Date(b) - new Date(a));
    
    // Calculate current streak
    for (const date of sortedDates) {
      const mood = moodTypes[date];
      const dateObj = new Date(date);
      
      // Check if the date is consecutive
      const isConsecutive = currentStreak === 0 || 
        (new Date(date).getTime() === new Date(sortedDates[currentStreak - 1]).getTime() - 86400000);
      
      if (isConsecutive) {
        currentStreak++;
        
        if (mood === "Happy" || mood === "Amazing" || mood === "Excited" || mood === "Loved" || mood === "Energetic") {
          happyStreak++;
        } else if (mood === "Sad") {
          sadStreak++;
        }
      } else {
        break;
      }
    }

    // Calculate monthly stats
    for (const date of sortedDates) {
      const mood = moodTypes[date];
      const dateObj = new Date(date);
      
      if (dateObj.getMonth() === currentMonth && dateObj.getFullYear() === currentYear) {
        daysThisMonth++;
        
        if (mood === "Happy" || mood === "Amazing" || mood === "Excited" || mood === "Loved" || mood === "Energetic") {
          monthlyHappy++;
        } else if (mood === "Sad") {
          monthlySad++;
        }
      }
    }
    
    setStreaks({
      happy: happyStreak,
      sad: sadStreak,
      current: currentStreak,
      monthlyHappy,
      monthlySad,
      daysThisMonth
    });
  };

  useEffect(() => {
    calculateStreaks();
  }, [moodTypes]);

  const handleMood = (selectedMood) => {
    const dateKey = selectedDate.toLocaleDateString();
    let flower = "";

    switch (selectedMood) {
      case "Sad":
        flower = "🌸"; // Cherry blossom
        break;
      case "Happy":
        flower = "🌻"; // Sunflower
        break;
      case "Amazing":
        flower = "🌹"; // Red rose
        break;
      case "Excited":
        flower = "🌼"; // Daisy
        break;
      case "Relaxed":
        flower = "🪷"; // Lotus
        break;
      case "Loved":
        flower = "💐"; // Bouquet
        break;
      case "Energetic":
        flower = "🌺"; // Hibiscus
        break;
      default:
        flower = "🌿"; // Default plant
        break;
    }

    setPlants(prev => {
      const existingFlowers = prev[dateKey] || [];
      return {
        ...prev,
        [dateKey]: [...existingFlowers, flower]
      };
    });

    // Update mood type for the day
    setMoodTypes(prev => ({
      ...prev,
      [dateKey]: selectedMood
    }));
  };

  const tileContent = ({ date }) => {
    const dateKey = date.toLocaleDateString();
    if (plants[dateKey]) {
      return (
        <div className="flower-cluster shake-on-hover">
          {plants[dateKey].map((flower, index) => (
            <span key={index} className="flower grow">{flower}</span>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="garden-container">
      <h1 className="garden-title">🌿 Mood Garden Calendar 🌸</h1>

      <div className="streak-container">
        <div className="streak-card">
          <h3>Current Streak</h3>
          <p>{streaks.current} days 🔥</p>
        </div>
        <div className="streak-card">
          <h3>Happy Streak</h3>
          <p>{streaks.happy} days 🌟</p>
        </div>
        <div className="streak-card">
          <h3>Sad Streak</h3>
          <p>{streaks.sad} days 😢</p>
        </div>
      </div>

     

      <Calendar
        onClickDay={handleDateChange}
        tileContent={tileContent}
        value={selectedDate}
        className="garden-calendar"
      />

      <div className="mood-buttons">
        <h2>Selected Date: {selectedDate.toLocaleDateString()}</h2>
        <div>
          <button onClick={() => handleMood("Sad")} className="plant-button">Sad 🌸</button>
          <button onClick={() => handleMood("Happy")} className="plant-button">Happy 🌻</button>
          <button onClick={() => handleMood("Amazing")} className="plant-button">Amazing 🌹</button>
          <button onClick={() => handleMood("Excited")} className="plant-button">Excited 🌼</button>
          <button onClick={() => handleMood("Relaxed")} className="plant-button">Relaxed 🪷</button>
          <button onClick={() => handleMood("Loved")} className="plant-button">Loved 💐</button>
          <button onClick={() => handleMood("Energetic")} className="plant-button">Energetic 🌺</button>
        </div>
      </div>
      <div className="monthly-stats">
        <h2>Monthly Statistics</h2>
        <div className="streak-container">
          <div className="streak-card">
            <h3>Happy Days This Month</h3>
            <p>{streaks.monthlyHappy} days 🌟</p>
          </div>
          <div className="streak-card">
            <h3>Sad Days This Month</h3>
            <p>{streaks.monthlySad} days 😢</p>
          </div>
          <div className="streak-card">
            <h3>Total Days Tracked</h3>
            <p>{streaks.daysThisMonth} days 📅</p>
          </div>
        </div>
      </div>
      {/* Falling Petals */}
      <div className="falling-petals">
        {Array.from({ length: 15 }).map((_, i) => {
          const randomLeft = Math.random() * 100;
          const randomDelay = Math.random() * 10;

          return (
            <div
              key={i}
              className="petal"
              style={{
                left: `${randomLeft}%`,
                animationDelay: `${randomDelay}s`,
              }}
            >
              🌸
            </div>
            
          );
        })}
      </div>
    </div>
    
  );
};

export default Garden;