import { useContext } from 'react';
import { DownloadsContext } from '../context/DownloadsContext';

export const useDownloads = () => {
  const context = useContext(DownloadsContext);
  if (context === undefined) {
    throw new Error('useDownloads must be used within a DownloadsProvider');
  }
  return context;
};