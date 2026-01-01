import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useGameStore } from '@/store/gameStore';

export default function Index() {
  const { loadGames } = useGameStore();

  useEffect(() => {
    loadGames();
  }, []);

  return <Redirect href="/screens/HomeScreen" />;
}

