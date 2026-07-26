import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from 'react-native';

import TabNavigator from './TabNavigator';
import SettingsModal from '../components/SettingsModal';
import { useTheme } from '../theme/ThemeContext';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { currentTheme } = useTheme();
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          screenOptions={{
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen
            name="Main"
            component={TabNavigator}
            options={{
              headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: currentTheme.text, fontSize: 18, fontWeight: '600' }}>
                    LookingGlass
                  </Text>
                </View>
              ),
              headerStyle: { backgroundColor: currentTheme.surface },
              headerShadowVisible: false,
              headerRight: () => (
                <TouchableOpacity onPress={() => setSettingsVisible(true)}>
                  <Ionicons name="settings-outline" size={22} color={currentTheme.text} />
                </TouchableOpacity>
              ),
            }}
          />
        </Stack.Navigator>
      </View>

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </NavigationContainer>
  );
}