import { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
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
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onCancel} />
        <View style={styles.card}>
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

          <TouchableOpacity style={styles.deleteButton} onPress={() => onConfirm(dontAskAgain)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}