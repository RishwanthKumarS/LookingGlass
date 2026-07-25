import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { Note } from '../db/queries/notes';
import { useTheme } from '../theme/ThemeContext';
import { spacing, fontSize } from '../theme/globalStyles';

export type LayoutMode = 'grid2' | 'grid1' | 'compact';

interface Props {
  note: Note;
  layout: LayoutMode;
  onPress: () => void;
  onLongPress?: () => void;
}

const screenWidth = Dimensions.get('window').width;
const GRID2_GAP = spacing.sm;
const GRID2_PADDING = spacing.md;
const GRID2_SIZE = (screenWidth - GRID2_PADDING * 2 - GRID2_GAP) / 2;

function formatDate(note: Note) {
  const date = note.updated_at ? new Date(note.updated_at) : new Date(note.created_at);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function NoteCard({ note, layout, onPress, onLongPress }: Props) {
  const { currentTheme } = useTheme();

  const styles = StyleSheet.create({
    cardGrid2: {
      width: GRID2_SIZE,
      height: GRID2_SIZE,
      backgroundColor: currentTheme.surface,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: currentTheme.border,
      flexDirection: 'column',
    },
    cardGrid1: {
      backgroundColor: currentTheme.surface,
      borderRadius: 12,
      padding: spacing.md,
      marginBottom: spacing.sm,
      minHeight: 80,
      borderWidth: 1,
      borderColor: currentTheme.border,
      flexDirection: 'column',
    },
    cardText: {
      flex: 1,
      color: currentTheme.text,
      fontSize: fontSize.sm,
      overflow: 'hidden',
    },
    timeText: {
      color: currentTheme.textMuted,
      fontSize: 11,
      marginTop: spacing.sm,
    },
    compactCard: {
      backgroundColor: currentTheme.surface,
      borderRadius: 8,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: currentTheme.border,
    },
    compactText: {
      color: currentTheme.text,
      fontSize: fontSize.sm,
    },
  });

  if (layout === 'compact') {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} onLongPress={onLongPress}>
        <Text style={styles.compactText} numberOfLines={1}>
          {note.content}
        </Text>
      </TouchableOpacity>
    );
  }

  const cardStyle = layout === 'grid2' ? styles.cardGrid2 : styles.cardGrid1;

  return (
    <TouchableOpacity style={cardStyle} onPress={onPress} onLongPress={onLongPress}>
      <Text style={styles.cardText} numberOfLines={layout === 'grid2' ? undefined : 4}>
        {note.content}
      </Text>
      <Text style={styles.timeText}>{formatDate(note)}</Text>
    </TouchableOpacity>
  );
}