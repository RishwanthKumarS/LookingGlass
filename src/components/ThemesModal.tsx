import { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  PanResponder,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { spacing, fontSize } from '../theme/globalStyles';
import { builtInThemes, ThemePreview } from '../theme/themeData';
import { useTheme } from '../theme/ThemeContext';
import {
  getRemainingSeconds,
  hasStartedTrial,
  getTrialState,
  startTrial,
  markPurchased,
} from '../theme/trialManager';
import TrialConfirmModal from './TrialConfirmModal';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const THEME_GRID_GAP = spacing.sm;
const THEME_SHEET_PADDING = spacing.lg;
const THEME_CARD_SIZE = (screenWidth - THEME_SHEET_PADDING * 2 - THEME_GRID_GAP) / 2;

interface Props {
  visible: boolean;
  onClose: () => void;
}

function formatHMS(totalSeconds: number) {
  if (!isFinite(totalSeconds)) return '';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${h}h ${m}m ${s}s`;
}

export default function ThemesModal({ visible, onClose }: Props) {
  const { currentTheme, selectTheme } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  const [confirmTheme, setConfirmTheme] = useState<ThemePreview | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (visible) translateY.setValue(0);
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 100) onClose();
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      },
    })
  ).current;

  const handleCardPress = (theme: ThemePreview) => {
    if (!theme.isPremium) {
      selectTheme(theme.id);
      return;
    }
    const state = getTrialState(theme.id);
    if (state.purchased) {
      selectTheme(theme.id);
      return;
    }
    const remaining = getRemainingSeconds(theme.id, theme.trialHours);
    if (hasStartedTrial(theme.id) && remaining > 0) {
      selectTheme(theme.id);
      return;
    }
    setConfirmTheme(theme);
  };

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
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    title: {
      color: currentTheme.text,
      fontSize: fontSize.xl,
      fontWeight: '700',
    },
  });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View {...panResponder.panHandlers}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>Themes</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={26} color={currentTheme.text} />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={builtInThemes}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'flex-start', gap: spacing.sm }}
            contentContainerStyle={{ gap: spacing.sm, paddingBottom: spacing.xl }}
            extraData={tick}
            renderItem={({ item }) => (
              <ThemeCard
                theme={item}
                isActive={item.id === currentTheme.id}
                onPress={() => handleCardPress(item)}
              />
            )}
          />
        </Animated.View>
      </View>

      <TrialConfirmModal
        theme={confirmTheme}
        visible={confirmTheme !== null}
        onClose={() => setConfirmTheme(null)}
        onStartTrial={() => {
          if (!confirmTheme) return;
          startTrial(confirmTheme.id);
          selectTheme(confirmTheme.id);
          setConfirmTheme(null);
        }}
        onPurchase={() => {
          if (!confirmTheme) return;
          markPurchased(confirmTheme.id);
          selectTheme(confirmTheme.id);
          setConfirmTheme(null);
        }}
      />
    </Modal>
  );
}

function ThemeCard({
  theme,
  isActive,
  onPress,
}: {
  theme: ThemePreview;
  isActive: boolean;
  onPress: () => void;
}) {
  const { currentTheme } = useTheme();

  let statusText: string | null = null;

  if (theme.isPremium) {
    const state = getTrialState(theme.id);
    if (state.purchased) {
      statusText = 'Purchased';
    } else {
      const remaining = getRemainingSeconds(theme.id, theme.trialHours);
      if (hasStartedTrial(theme.id) && remaining <= 0) {
        statusText = 'Trial expired';
      } else if (hasStartedTrial(theme.id)) {
        statusText = isActive ? formatHMS(remaining) : `${formatHMS(remaining)} left`;
      } else {
        statusText = `${theme.trialHours}h free trial`;
      }
    }
  }

  const styles = StyleSheet.create({
    card: {
      width: THEME_CARD_SIZE,
      marginBottom: spacing.sm,
    },
    preview: {
      aspectRatio: 1,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      padding: spacing.sm,
      justifyContent: 'flex-end',
    },
    previewSurface: {
      borderRadius: 8,
      padding: spacing.sm,
      gap: 6,
    },
    previewAccentDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    previewTextLine: {
      width: '70%',
      height: 4,
      borderRadius: 2,
      opacity: 0.7,
    },
    badge: {
      position: 'absolute',
      top: spacing.sm,
      right: spacing.sm,
      backgroundColor: currentTheme.accent,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    badgeText: {
      color: currentTheme.background,
      fontSize: 10,
      fontWeight: '700',
    },
    activeBadge: {
      position: 'absolute',
      bottom: spacing.sm,
      right: spacing.sm,
      backgroundColor: currentTheme.accent,
      borderRadius: 10,
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardLabel: {
      color: currentTheme.text,
      fontSize: fontSize.sm,
      marginTop: spacing.sm / 2,
      fontWeight: '600',
    },
    trialLabel: {
      color: currentTheme.textMuted,
      fontSize: 11,
    },
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.preview, { backgroundColor: theme.background }]}>
        <View style={[styles.previewSurface, { backgroundColor: theme.surface }]}>
          <View style={[styles.previewAccentDot, { backgroundColor: theme.accent }]} />
          <View style={[styles.previewTextLine, { backgroundColor: theme.text }]} />
        </View>
        {theme.isPremium && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PRO</Text>
          </View>
        )}
        {isActive && (
          <View style={styles.activeBadge}>
            <Ionicons name="checkmark" size={12} color={currentTheme.background} />
          </View>
        )}
      </View>
      <Text style={styles.cardLabel}>{theme.name}</Text>
      {statusText && <Text style={styles.trialLabel}>{statusText}</Text>}
    </TouchableOpacity>
  );
}