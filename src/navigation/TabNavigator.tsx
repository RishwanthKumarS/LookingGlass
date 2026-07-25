import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import NoteCaptureScreen from '../screens/NoteCapture/NoteCaptureScreen';
import ReviewScreen from '../screens/Review/ReviewScreen';
import JournalScreen from '../screens/Journal/JournalScreen';
import { layoutMetrics } from '../theme/globalStyles';
import { useTheme } from '../theme/ThemeContext';

const Tab = createMaterialTopTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { currentTheme } = useTheme();

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        swipeEnabled: true,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, textTransform: 'none' },
        tabBarShowIcon: true,
        tabBarIndicatorStyle: { backgroundColor: currentTheme.accent, top: 0, height: 2 },
        tabBarStyle: {
            backgroundColor: currentTheme.surface,
            borderTopColor: currentTheme.border,
            borderTopWidth: 1,
            height: layoutMetrics.tabBarBaseHeight + insets.bottom,
            paddingBottom: insets.bottom + 4,
            paddingTop: 8,
        },
        tabBarItemStyle: {
            paddingVertical: 2,
        },
        tabBarActiveTintColor: currentTheme.accent,
        tabBarInactiveTintColor: currentTheme.textMuted,
        tabBarIcon: ({ color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';

          if (route.name === 'Notes') iconName = 'create-outline';
          else if (route.name === 'Review') iconName = 'refresh-outline';
          else if (route.name === 'Journal') iconName = 'book-outline';

          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Notes" component={NoteCaptureScreen} />
      <Tab.Screen name="Review" component={ReviewScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
    </Tab.Navigator>
  );
}