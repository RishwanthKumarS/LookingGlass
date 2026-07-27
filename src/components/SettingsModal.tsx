import { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, fontSize } from '../theme/globalStyles';
import { useTheme } from '../theme/ThemeContext';
import { useSettings } from '../theme/SettingsContext';
import ThemesModal from './ThemesModal';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const screenHeight = Dimensions.get('window').height;
const SHEET_HEIGHT = screenHeight * 0.88;

const BLUR_PRESETS: { label: string; value: number }[] = [
  { label: 'Off', value: 0 },
  { label: 'Light', value: 1 },
  { label: 'Medium', value: 2.5 },
  { label: 'Strong', value: 5 },
];

export default function SettingsModal({ visible, onClose }: Props) {
  const { currentTheme } = useTheme();
  const { confirmDelete, setConfirmDelete, backgroundBlur, setBackgroundBlur } = useSettings();
  const [themesVisible, setThemesVisible] = useState(false);
  const [modalRendered, setModalRendered] = useState(false);

  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      setModalRendered(true);
      translateY.setValue(SHEET_HEIGHT);
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 65,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const closeAnimated = () => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setModalRendered(false);
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 100) {
          closeAnimated();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            friction: 8,
            tension: 65,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const overlayOpacity = translateY.interpolate({
    inputRange: [0, SHEET_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
      height: SHEET_HEIGHT,
      backgroundColor: currentTheme.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: spacing.lg,
    },
    dragHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: currentTheme.border,
      alignSelf: 'center',
      marginBottom: spacing.sm,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
      paddingBottom: spacing.sm,
    },
    title: {
      color: currentTheme.text,
      fontSize: fontSize.xl,
      fontWeight: '700',
    },
    content: {
      paddingBottom: spacing.xl,
    },
    sectionLabel: {
      color: currentTheme.textMuted,
      fontSize: fontSize.sm,
      fontWeight: '600',
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
      textTransform: 'uppercase',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: currentTheme.background,
      borderRadius: 10,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: currentTheme.border,
    },
    rowText: {
      color: currentTheme.text,
      fontSize: fontSize.md,
    },
    blurRow: {
      flexDirection: 'column',
      alignItems: 'stretch',
      backgroundColor: currentTheme.background,
      borderRadius: 10,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: currentTheme.border,
    },
    blurRowTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    presetGroup: {
      flexDirection: 'row',
      gap: spacing.sm / 2,
    },
    presetButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.sm / 2,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: currentTheme.border,
    },
    presetButtonActive: {
      backgroundColor: currentTheme.accent,
      borderColor: currentTheme.accent,
    },
    presetButtonText: {
      color: currentTheme.textMuted,
      fontSize: fontSize.sm,
      fontWeight: '600',
    },
    presetButtonTextActive: {
      color: currentTheme.background,
    },
  });

  if (!modalRendered) return null;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
      <View style={styles.overlay} pointerEvents="auto">
        <Animated.View style={[styles.backdrop, { opacity: overlayOpacity }]} />
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeAnimated} />

        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View {...panResponder.panHandlers}>
            <View style={styles.dragHandle} />
            <View style={styles.headerRow}>
              <Text style={styles.title}>Settings</Text>
              <TouchableOpacity onPress={closeAnimated}>
                <Ionicons name="close" size={26} color={currentTheme.text} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionLabel}>Appearance</Text>
            <TouchableOpacity style={styles.row} onPress={() => setThemesVisible(true)}>
              <Text style={styles.rowText}>Theme</Text>
              <Ionicons name="chevron-forward" size={18} color={currentTheme.textMuted} />
            </TouchableOpacity>

            <View style={styles.blurRow}>
              <View style={styles.blurRowTop}>
                <Text style={styles.rowText}>Background Blur</Text>
              </View>
              <View style={styles.presetGroup}>
                {BLUR_PRESETS.map((preset) => {
                  const isActive = backgroundBlur === preset.value;
                  return (
                    <TouchableOpacity
                      key={preset.label}
                      style={[styles.presetButton, isActive && styles.presetButtonActive]}
                      onPress={() => setBackgroundBlur(preset.value)}
                    >
                      <Text
                        style={[
                          styles.presetButtonText,
                          isActive && styles.presetButtonTextActive,
                        ]}
                      >
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <Text style={styles.sectionLabel}>Reminders</Text>
            <TouchableOpacity style={styles.row}>
              <Text style={styles.rowText}>Reminder Count</Text>
              <Ionicons name="chevron-forward" size={18} color={currentTheme.textMuted} />
            </TouchableOpacity>

            <Text style={styles.sectionLabel}>Notes</Text>
            <View style={styles.row}>
              <Text style={styles.rowText}>Ask before deleting notes</Text>
              <Switch
                value={confirmDelete}
                onValueChange={setConfirmDelete}
                trackColor={{ false: currentTheme.border, true: currentTheme.accent }}
                thumbColor={currentTheme.text}
              />
            </View>

            <Text style={styles.sectionLabel}>Data</Text>
            <TouchableOpacity style={styles.row}>
              <Text style={styles.rowText}>Export Data</Text>
              <Ionicons name="chevron-forward" size={18} color={currentTheme.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
              <Text style={styles.rowText}>Import Data</Text>
              <Ionicons name="chevron-forward" size={18} color={currentTheme.textMuted} />
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>

      <ThemesModal visible={themesVisible} onClose={() => setThemesVisible(false)} />
    </View>
  );
}