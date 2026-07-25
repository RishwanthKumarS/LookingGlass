import { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { getSetting, setSetting } from '../db/queries/settings';
import { spacing, fontSize } from '../theme/globalStyles';
import ThemesModal from './ThemesModal';
import { Switch } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: Props) {
  const { currentTheme } = useTheme();

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    sheet: {
      height: '88%',
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
  });

  const [confirmDelete, setConfirmDelete] = useState(() => getSetting('confirmDelete') !== 'false');

  const handleToggleConfirmDelete = (value: boolean) => {
    setConfirmDelete(value);
    setSetting('confirmDelete', value ? 'true' : 'false');
  };

  const translateY = useRef(new Animated.Value(0)).current;
  const [themesVisible, setThemesVisible] = useState(false);

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
          onClose();
        }
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View {...panResponder.panHandlers}>
            <View style={styles.dragHandle} />
            <View style={styles.headerRow}>
              <Text style={styles.title}>Settings</Text>
              <TouchableOpacity onPress={onClose}>
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
                onValueChange={handleToggleConfirmDelete}
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
    </Modal>
  );
}