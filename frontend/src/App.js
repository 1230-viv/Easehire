import React from 'react';
import AppRoutes from './routes/AppRoutes'; // Import your routes

const App = () => {
  return (
    <div>
      {/* Other parts of your app layout (header, footer, etc.) */}
      <AppRoutes /> {/* Render the routes */}
    </div>
  );
};

export default App;