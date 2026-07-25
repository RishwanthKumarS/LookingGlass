import { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, PanResponder, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TabNavigator from './TabNavigator';
import SettingsModal from '../components/SettingsModal';
import { layoutMetrics } from '../theme/globalStyles';
import { useTheme } from '../theme/ThemeContext';

const Stack = createNativeStackNavigator();

function SwipeUpZone({ onSwipeUp, bottomOffset }: { onSwipeUp: () => void; bottomOffset: number }) {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy < -20) {
          onSwipeUp();
        }
      },
    })
  ).current;

  return (
    <View
      style={[styles.handleZone, { bottom: bottomOffset }]}
      {...panResponder.panHandlers}
    />
  );
}

export default function RootNavigator() {
  const { currentTheme } = useTheme();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const tabBarHeight = layoutMetrics.tabBarBaseHeight + insets.bottom;

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

        <SwipeUpZone
          onSwipeUp={() => setSettingsVisible(true)}
          bottomOffset={tabBarHeight}
        />
      </View>

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  handleZone: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});