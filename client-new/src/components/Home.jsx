import React from 'react';
// Import Link for navigation and useAuth for user info and logout
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Assuming AuthContext provides user and logout
// Optional: Import icons (e.g., from react-icons)
// import { FiUserPlus, FiEdit3, FiFeather, FiBox, FiLock } from 'react-icons/fi';

export default function Home() {
  const { user, logout } = useAuth(); // Get user and logout function
  const navigate = useNavigate();

  // --- Styles ---

  // Sidebar Styles
  const sidebarStyle = {
    width: '250px', // Fixed width for the sidebar
    height: '100vh', // Full viewport height
    backgroundColor: '#002030', // Dark navy blue background
    display: 'flex',
    flexDirection: 'column',
    color: '#ffffff', // White text color
    fontFamily: "'Inter', sans-serif", // Use Inter font
    flexShrink: 0, // Prevent sidebar from shrinking
  };

  const greetingAreaStyle = {
    padding: '40px 25px',
    flexGrow: 1, // Allow this area to take up space
    fontFamily: "'Inter', sans-serif", // Ensure Inter font
  };

  const mainHeadingStyle = {
    fontSize: '2rem',
    fontWeight: 600,
    margin: '0 0 5px 0',
    fontFamily: "'Inter', sans-serif", // Ensure Inter font
  };

  const subHeadingStyle = {
    fontSize: '0.9rem',
    fontWeight: 300,
    margin: 0,
    opacity: 0.8,
    fontFamily: "'Inter', sans-serif", // Ensure Inter font
  };

  const navAreaStyle = {
    padding: '20px 25px 40px 25px',
    backgroundColor: '#001429', // Slightly darker section for buttons
    borderTopLeftRadius: '20px', // Rounded corner matching image hint
    borderTopRightRadius: '20px',
    border:"1px solid #012544",
    fontFamily: "'Inter', sans-serif", // Ensure Inter font
  };

  const dashboardTitleStyle = {
      fontSize: '1.2rem',
      fontWeight: 500,
      marginBottom: '20px',
      color: '#e0e0e0', // Lighter text for title
      fontFamily: "'Inter', sans-serif", // Ensure Inter font
  };

  const navButtonStyle = {
    display: 'block', // Make links block level
    width: '100%', // Full width within padding
    backgroundColor: '#fff', // White background
    color: '#001f3f', // Dark text matching sidebar bg
    padding: '12px 15px',
    borderRadius: '8px',
    fontSize: '1rem',
    textDecoration: 'none',
    fontWeight: 500,
    border: 'none',
    marginBottom: '15px', // Space between buttons
    textAlign: 'left', // Align text left
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease',
    fontFamily: "'Inter', sans-serif", // Ensure Inter font
  };

   const navButtonHoverStyle = {
       backgroundColor: '#e0e0e0', // Slightly grey on hover
   };

  // Main Content Area - Bento Grid Setup
  const mainContentStyle = {
    flexGrow: 1,
    height: '100vh',
    backgroundColor: '#000', // Lighter background for contrast
    padding: '40px',
    display: 'grid',
    // Define grid structure (e.g., 3 columns, adapt row heights)
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(2, minmax(180px, auto))', // Let rows grow based on content, min height
    gap: '25px', // Gap between blocks
    overflow: 'auto',
    fontFamily: "'Inter', sans-serif", // Set base font for main content
  };

  // Base Style for Bento Blocks
  const blockBaseStyle = {
    borderRadius: '24px', // More rounded
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Align content left/top (cross-axis)
    justifyContent: 'space-between', // Push content to top/bottom (main-axis) - default
    padding: '25px',
    textDecoration: 'none',
    color: '#ffffff', // Default white text
    transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    overflow: 'hidden', // Hide overflow for effects
    position: 'relative', // For potential absolute positioned elements inside
    boxSizing: 'border-box',
    backgroundSize: 'cover', // Cover the entire block
    backgroundPosition: 'center', // Center the image
    zIndex: 1, // Ensure content is above potential pseudo-elements if added later
    fontFamily: "'Inter', sans-serif" // Ensure Inter font for blocks
  };

  // Style for the semi-transparent overlay (applied via wrapping div or ::before pseudo-element in CSS)
  // Using an inline style approach here by adding a div inside the Link
  const overlayStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.35)', // Adjust darkness/opacity as needed
      borderRadius: 'inherit', // Match parent border radius
      zIndex: -1, // Place behind the content
  };

  const blockHoverStyle = {
      transform: 'scale(1.02) translateY(-3px)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)', // Slightly darker shadow on hover
  };

  // Specific Block Styles - Colors & Grid Areas
  // Assigning grid areas: grid-row-start / grid-column-start / grid-row-end / grid-column-end
  const blockStyles = {
    friend: {
      // ...blockBaseStyle, // Base styles are applied directly to Link/div now
      backgroundColor: '#4D77FF', // Brighter Blue
      gridArea: '1 / 1 / 2 / 3', // Span 2 columns on row 1
      color: '#ffffff',
      border:'1px solid #222',
      backgroundImage: 'url(/assets/Inside_Out.webp)',
      // Default justifyContent: 'space-between' from base pushes text to bottom
    },
    gratitude: {
      // ...blockBaseStyle,
      backgroundColor: '#FF6B6B', // Coral/Red
      gridArea: '1 / 3 / 2 / 4', // Row 1, Col 3
      backgroundImage: 'url(/assets/gratitude.jpg)',
      color: '#ffffff',
      // Override base style to push content to the bottom
      justifyContent: 'flex-end',
    },
    garden: {
      // ...blockBaseStyle,
      backgroundColor: '#FFD166', // Sunny Yellow
      gridArea: '2 / 1 / 3 / 2', // Row 2, Col 1
      color: '#fff', // Darker text for yellow
      backgroundImage: 'url(/assets/garden.jpg)',
      // Override base style to push content to the top
      justifyContent: 'flex-start', // Changed from flex-end
    },
    tasks: { // Renamed from comingSoon
      // ...blockBaseStyle,
      backgroundColor: '#343a40', // Darker grey background
      gridArea: '2 / 2 / 3 / 4', // Span 2 columns on row 2
      color: '#adb5bd', // Lighter grey text for contrast
      border:'1px solid #495057', // Slightly lighter border
      cursor: 'not-allowed',
      alignItems: 'flex-start', // Align content to top-left
      justifyContent: 'flex-start', // Align content to top
    },
  };

  // Styles for text within blocks
  const blockTitleStyle = {
      fontSize: '1.7rem', // Slightly larger
      fontWeight: 700, // Bolder
      margin: 0,
      textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)', // Text shadow
      zIndex: 2, // Ensure text is above overlay
      position: 'relative', // Needed for zIndex to work reliably
      fontFamily: "'Inter', sans-serif", // Ensure Inter font
  };
  const blockSubtitleStyle = {
      fontSize: '0.95rem', // Slightly larger
      fontWeight: 400,
      margin: '5px 0 0 0',
      opacity: 0.9,
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)', // Text shadow
      zIndex: 2, // Ensure text is above overlay
      position: 'relative',
      fontFamily: "'Inter', sans-serif", // Ensure Inter font
  };
   const blockIconStyle = { // Example style if using icons
      fontSize: '2.5rem', // Icon size
      marginBottom: '15px', // Space below icon
      alignSelf: 'flex-start', // Keep icon top-left aligned generally
   };

   // Styles for the Task Block
   const taskListStyle = {
       marginTop: '20px', // Space below title/subtitle
       width: '100%',
       opacity: 0.6, // Make the list look disabled/faded
   };

   const taskItemStyle = {
       backgroundColor: 'rgba(255, 255, 255, 0.05)', // Very subtle background
       padding: '8px 12px',
       borderRadius: '6px',
       marginBottom: '8px',
       fontSize: '0.9rem',
       color: '#ced4da', // Lighter grey text for tasks
       display: 'flex',
       alignItems: 'center',
       fontFamily: "'Inter', sans-serif",
   };

   const lockIconStyle = {
       marginRight: '8px',
       fontSize: '1rem',
       color: '#6c757d', // Darker grey for lock icon
   };

   const comingSoonTagStyle = {
       position: 'absolute',
       top: '15px',
       right: '15px',
       backgroundColor: '#ffc107', // Yellow background
       color: '#343a40', // Dark text
       padding: '3px 8px',
       borderRadius: '12px', // Pill shape
       fontSize: '0.75rem',
       fontWeight: 600,
       zIndex: 3, // Above other content
       fontFamily: "'Inter', sans-serif",
   };


  // --- Event Handlers ---
  const handleLogout = async () => {
    try {
      await logout(); // Call logout function from context
      navigate('/'); // Redirect to login/root after logout
    } catch (err) {
      console.error("Logout failed:", err);
      // Optionally show an error message to the user
    }
  };

  // Helper for hover effects (only for interactive blocks)
  const applyHover = (e) => Object.assign(e.currentTarget.style, blockHoverStyle);
  const removeHover = (e) => {
      // Reset only hover-specific styles
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'none'; // Assuming no base box-shadow
  };


  return (
    // Use flex row for the main layout
    <div style={{ display: 'flex', width: '100%', height: '100vh', background:'#000', fontFamily: "'Inter', sans-serif" /* Set base font */ }}>

      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={greetingAreaStyle}>
          {/* Display user's name - fallback to 'User' */}
          <h1 style={mainHeadingStyle}>Hi, {user?.displayName?.split(' ')[0] || user?.email || 'User'}</h1>
          <p style={subHeadingStyle}>Let's make today amazing ✨</p> {/* Updated tagline */}
        </div>
        <div style={navAreaStyle}>
            <h2 style={dashboardTitleStyle}>Dashboard</h2>
            {/* Link to Statistics (Analysis page) */}
            <Link
                to="/analysis" // Link Statistics to the analysis page
                style={navButtonStyle}
                 onMouseEnter={(e) => Object.assign(e.currentTarget.style, navButtonHoverStyle)}
                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = navButtonStyle.backgroundColor}
            >
                Statistics
            </Link>
            {/* Logout Button */}
            <button
                onClick={handleLogout}
                style={navButtonStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, navButtonHoverStyle)}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = navButtonStyle.backgroundColor}
            >
                Logout
            </button>
        </div>
      </div>

      {/* Main Content Area - Bento Grid */}
      <div style={mainContentStyle}>
        {/* Block 1: Choose Friend */}
        {/* Uses default blockBaseStyle (justifyContent: space-between) -> text at bottom */}
        <Link to="/mood" style={{...blockBaseStyle, ...blockStyles.friend}} onMouseEnter={applyHover} onMouseLeave={removeHover}>
             <div style={overlayStyle}></div> {/* Overlay for text readability */}
             {/* Optional Icon: <FiUserPlus style={blockIconStyle} /> */}
             <div> {/* This div contains the text */}
                 <h3 style={blockTitleStyle}>Choose Friend</h3>
                 <p style={blockSubtitleStyle}>Select a guide for your chat</p>
             </div>
        </Link>

        {/* Block 2: Express Gratitude */}
        {/* Uses blockStyles.gratitude (justifyContent: flex-end) -> text at bottom */}
        <Link to="/journal" style={{...blockBaseStyle, ...blockStyles.gratitude}} onMouseEnter={applyHover} onMouseLeave={removeHover}>
             <div style={overlayStyle}></div> {/* Overlay */}
             {/* Optional Icon: <FiEdit3 style={blockIconStyle} /> */}
             <div> {/* This div contains the text */}
                 <h3 style={blockTitleStyle}>Gratitude Journal</h3>
                 <p style={blockSubtitleStyle}>Reflect on your day</p>
             </div>
        </Link>

        {/* Block 3: Visit Garden */}
        {/* Uses blockStyles.garden (justifyContent: flex-start) -> text at top */}
        <Link to="/garden" style={{...blockBaseStyle, ...blockStyles.garden}} onMouseEnter={applyHover} onMouseLeave={removeHover}>
             <div style={overlayStyle}></div> {/* Overlay */}
             {/* Optional Icon: <FiFeather style={blockIconStyle} /> */}
             <div> {/* This div contains the text */}
                 <h3 style={{...blockTitleStyle, color: blockStyles.garden.color || '#ffffff'}}>Mood Garden</h3>
                 <p style={{...blockSubtitleStyle, color: blockStyles.garden.color || '#ffffff', opacity: 0.9}}>See your mood history</p>
             </div>
        </Link>

        {/* Block 4: Tasks (Coming Soon) */}
        {/* Uses blockStyles.tasks (justifyContent: flex-start, alignItems: flex-start) -> content at top */}
        <div style={{...blockBaseStyle, ...blockStyles.tasks}}>
             {/* No overlay needed for dark background */}
             <span style={comingSoonTagStyle}>COMING SOON</span>
             {/* Optional Icon: <FiLock style={{...blockIconStyle, alignSelf: 'flex-start', color: '#6c757d'}} /> */}
             <div> {/* This div contains the text and task list */}
                 <h3 style={{...blockTitleStyle, color: '#e9ecef', textShadow: 'none'}}>Tasks</h3>
                 <p style={{...blockSubtitleStyle, color: '#adb5bd', textShadow: 'none', opacity: 0.8}}>Organize your day</p>

                 {/* Placeholder Locked Task List */}
                 <div style={taskListStyle}>
                     <div style={taskItemStyle}>
                         <span style={lockIconStyle}>🔒</span> {/* Lock Icon */}
                         <span>Plan project steps</span>
                     </div>
                     <div style={taskItemStyle}>
                         <span style={lockIconStyle}>🔒</span> {/* Lock Icon */}
                         <span>Schedule team meeting</span>
                     </div>
                     <div style={taskItemStyle}>
                         <span style={lockIconStyle}>🔒</span> {/* Lock Icon */}
                         <span>Review feedback</span>
                     </div>
                 </div>
             </div>
             {/* Empty div to push content up because of justifyContent: 'space-between' in base */}
             {/* Or change justifyContent in blockStyles.tasks to 'flex-start' */}
             {/* <div></div>  <-- Removed as justifyContent is now flex-start */}
        </div>
      </div>

    </div>
  );
}