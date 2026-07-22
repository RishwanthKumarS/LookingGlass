import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { colors } from './src/theme/globalStyles';
import { initDatabase } from './src/db/client';

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </View>
  );
}