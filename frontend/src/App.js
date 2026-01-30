import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <BrowserRouter basename="/easehire">
      <div>
        {/* Other layout components */}
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
};

export default App;
