import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { spacing, fontSize } from '../theme/globalStyles';

import { ThemePreview } from '../theme/themeData';

interface Props {
  theme: ThemePreview | null;
  visible: boolean;
  onClose: () => void;
  onStartTrial: () => void;
  onPurchase: () => void;
}

export default function TrialConfirmModal({
  theme,
  visible,
  onClose,
  onStartTrial,
  onPurchase,
}: Props) {
  if (!theme) return null;
  const { currentTheme } = useTheme();

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
        marginBottom: spacing.lg,
    },
    primaryButton: {
        backgroundColor: currentTheme.accent,
        borderRadius: 10,
        paddingVertical: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    primaryButtonText: {
        color: currentTheme.background,
        fontWeight: '700',
        fontSize: fontSize.md,
    },
    secondaryButton: {
        backgroundColor: currentTheme.background,
        borderRadius: 10,
        paddingVertical: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: currentTheme.border,
    },
    secondaryButtonText: {
        color: currentTheme.text,
        fontWeight: '600',
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
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.title}>{theme.name}</Text>
          <Text style={styles.body}>
            This is a premium theme. Start a free {theme.trialHours}-hour trial, or purchase it to unlock it permanently.
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={onStartTrial}>
            <Text style={styles.primaryButtonText}>Start {theme.trialHours}h Free Trial</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={onPurchase}>
            <Text style={styles.secondaryButtonText}>Purchase Theme</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}