import { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addNote, getAllNotes, Note } from '../../db/queries/notes';
import { colors, spacing, fontSize } from '../../theme/globalStyles';
import NoteCard, { LayoutMode } from '../../components/NoteCard';
import NoteModal from '../../components/NoteModal';

export default function NoteCaptureScreen() {
  const [input, setInput] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [layout, setLayout] = useState<LayoutMode>('grid2');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const loadNotes = () => {
    const fresh = getAllNotes();
    setNotes(fresh);
    if (selectedNote) {
      const updated = fresh.find((n) => n.id === selectedNote.id);
      if (updated) setSelectedNote(updated);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const handleSave = () => {
    if (input.trim().length === 0) return;
    addNote(input.trim());
    setInput('');
    loadNotes();
  };

  const numColumns = layout === 'grid2' ? 2 : 1;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What did you just learn?"
        placeholderTextColor={colors.textMuted}
        value={input}
        onChangeText={setInput}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <View style={styles.layoutRow}>
        <TouchableOpacity onPress={() => setLayout('grid2')} style={styles.layoutButton}>
          <Ionicons
            name="grid-outline"
            size={20}
            color={layout === 'grid2' ? colors.accent : colors.textMuted}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLayout('grid1')} style={styles.layoutButton}>
          <Ionicons
            name="reorder-four-outline"
            size={20}
            color={layout === 'grid1' ? colors.accent : colors.textMuted}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLayout('compact')} style={styles.layoutButton}>
          <Ionicons
            name="list-outline"
            size={20}
            color={layout === 'compact' ? colors.accent : colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        key={layout}
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={{ paddingTop: spacing.sm }}
        columnWrapperStyle={numColumns === 2 ? { justifyContent: 'flex-start', gap: spacing.sm } : undefined}        renderItem={({ item }) => (
          <NoteCard note={item} layout={layout} onPress={() => setSelectedNote(item)} />
        )}
      />

      <NoteModal
        note={selectedNote}
        visible={selectedNote !== null}
        onClose={() => setSelectedNote(null)}
        onUpdated={loadNotes}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: fontSize.md,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    padding: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: fontSize.md,
  },
  layoutRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  layoutButton: {
    padding: spacing.sm / 2,
  },
});