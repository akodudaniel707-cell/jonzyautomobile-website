import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Welcome from '@/pages/Welcome';
import { AppProvider } from '@/contexts/AppContext';

const Index: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleEnterSite = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <Welcome onEnterSite={handleEnterSite} />;
  }

  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
};

export default Index;