// SnackbarContext.tsx
import { Snackbar } from '@mui/material';
import React, { createContext, useContext, useState } from 'react';

interface SnackbarContextType {
  showSnackbarMessage: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showSnackbar, setShowSnackbar] = useState<string | null>(null);

  const showSnackbarMessage = (message: string) => {
    setShowSnackbar(message);
    setTimeout(() => {
      setShowSnackbar(null);
    }, 3000);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbarMessage }}>
      {children}
      {showSnackbar && (
        <Snackbar
          open={!!showSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowSnackbar(null)}
          message={showSnackbar}
        />
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
