import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import NoteCaptureScreen from '../screens/NoteCapture/NoteCaptureScreen';
import ReviewScreen from '../screens/Review/ReviewScreen';
import JournalScreen from '../screens/Journal/JournalScreen';
import { colors } from '../theme/globalStyles';

const Tab = createMaterialTopTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        swipeEnabled: true,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, textTransform: 'none' },
        tabBarShowIcon: true,
        tabBarIndicatorStyle: { backgroundColor: colors.accent, top: 0, height: 2 },
        tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 64 + insets.bottom,
            paddingBottom: insets.bottom + 4,
            paddingTop: 8,
        },
        tabBarItemStyle: {
            paddingVertical: 2,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
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