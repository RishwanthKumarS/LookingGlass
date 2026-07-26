import { useState, useRef, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, fontSize } from '../theme/globalStyles';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (dontAskAgain: boolean) => void;
}

export default function DeleteConfirmModal({ visible, onCancel, onConfirm }: Props) {
  const { currentTheme } = useTheme();
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setDontAskAgain(false);
      scale.setValue(0.85);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 5,
          tension: 90,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const animateOutThen = (callback: () => void) => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.85,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => callback());
  };

  const handleCancel = () => animateOutThen(onCancel);
  const handleConfirm = () => animateOutThen(() => onConfirm(dontAskAgain));

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    card: {
      width: '100%',
      backgroundColor: currentTheme.surface,
      borderRadius: 16,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: currentTheme.border,
    },
    title: {
      color: currentTheme.text,
      fontSize: fontSize.lg,
      fontWeight: '700',
      marginBottom: spacing.sm,
    },
    body: {
      color: currentTheme.textMuted,
      fontSize: fontSize.sm,
      lineHeight: 20,
      marginBottom: spacing.md,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1.5,
      borderColor: currentTheme.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: currentTheme.accent,
      borderColor: currentTheme.accent,
    },
    checkboxLabel: {
      color: currentTheme.text,
      fontSize: fontSize.sm,
    },
    deleteButton: {
      backgroundColor: '#e0554f',
      borderRadius: 10,
      paddingVertical: spacing.md,
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    deleteButtonText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: fontSize.md,
    },
    cancelButton: {
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    cancelButtonText: {
      color: currentTheme.textMuted,
      fontSize: fontSize.sm,
    },
  });

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={handleCancel}>
      <Animated.View style={[styles.overlay, { opacity, backgroundColor: 'rgba(0,0,0,0.6)' }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={handleCancel} />
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          <Text style={styles.title}>Delete Note</Text>
          <Text style={styles.body}>
            This note will be permanently deleted. This can't be undone.
          </Text>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setDontAskAgain((v) => !v)}
          >
            <View style={[styles.checkbox, dontAskAgain && styles.checkboxChecked]}>
              {dontAskAgain && <Ionicons name="checkmark" size={14} color={currentTheme.background} />}
            </View>
            <Text style={styles.checkboxLabel}>Don't ask me again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleConfirm}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}