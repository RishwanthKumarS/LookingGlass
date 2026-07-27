import { useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, ImageBackground, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

import TabNavigator from './TabNavigator';
import SettingsModal from '../components/SettingsModal';
import { useTheme } from '../theme/ThemeContext';
import { useSettings } from '../theme/SettingsContext';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { currentTheme } = useTheme();
  const { backgroundBlur } = useSettings();
  const [settingsVisible, setSettingsVisible] = useState(false);

  const content = (
    <NavigationContainer
      theme={{
        ...DarkTheme,
        dark: true,
        colors: {
          ...DarkTheme.colors,
          primary: currentTheme.accent,
          background: 'transparent',
          card: 'transparent',
          text: currentTheme.text,
          border: currentTheme.border,
          notification: currentTheme.accent,
        },
      }}
    >
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

  return (
    <View style={styles.background}>
      {currentTheme.backgroundImage ? (
        <>
          <ImageBackground
            source={currentTheme.backgroundImage}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
          {backgroundBlur > 0 && (
            <BlurView
              intensity={backgroundBlur}
              tint="default"
              experimentalBlurMethod="dimezisBlurView"
              style={StyleSheet.absoluteFillObject}
            />
          )}
        </>
      ) : (
        <View
          style={[StyleSheet.absoluteFillObject, { backgroundColor: currentTheme.background }]}
        />
      )}
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});