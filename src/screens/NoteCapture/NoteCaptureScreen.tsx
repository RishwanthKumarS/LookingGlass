import { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addNote, getAllNotes, deleteNote, Note } from '../../db/queries/notes';
import { getSetting, setSetting } from '../../db/queries/settings';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import { spacing, fontSize } from '../../theme/globalStyles';
import { useTheme } from '../../theme/ThemeContext';
import NoteCard, { LayoutMode } from '../../components/NoteCard';
import NoteModal from '../../components/NoteModal';
import { getRandomPrompt } from '../../lib/notePrompts';

export default function NoteCaptureScreen() {
  const [placeholder] = useState(() => getRandomPrompt());
  const [input, setInput] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [layout, setLayout] = useState<LayoutMode>('grid2');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const { currentTheme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentTheme.background,
      padding: spacing.md,
    },
    input: {
      backgroundColor: currentTheme.surface,
      color: currentTheme.text,
      borderRadius: 8,
      padding: spacing.md,
      fontSize: fontSize.md,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    button: {
      backgroundColor: currentTheme.accent,
      borderRadius: 8,
      padding: spacing.sm,
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    buttonText: {
      color: currentTheme.background,
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
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyStateText: {
      color: currentTheme.textMuted,
      fontSize: fontSize.md,
    },
  });

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

  const handleLongPress = (note: Note) => {
    const skipConfirm = getSetting('confirmDelete') === 'false';
    if (skipConfirm) {
      deleteNote(note.id);
      loadNotes();
    } else {
      setNoteToDelete(note);
    }
  };

  const handleConfirmDelete = (dontAskAgain: boolean) => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id);
      if (dontAskAgain) {
        setSetting('confirmDelete', 'false');
      }
      setNoteToDelete(null);
      loadNotes();
    }
  };
  const numColumns = layout === 'grid2' ? 2 : 1;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={currentTheme.textMuted}
        value={input}
        onChangeText={setInput}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>

      <View style={styles.layoutRow}>
        <TouchableOpacity onPress={() => setLayout('grid2')} style={styles.layoutButton}>
          <Ionicons
            name="grid-outline"
            size={20}
            color={layout === 'grid2' ? currentTheme.accent : currentTheme.textMuted}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLayout('grid1')} style={styles.layoutButton}>
          <Ionicons
            name="reorder-four-outline"
            size={20}
            color={layout === 'grid1' ? currentTheme.accent : currentTheme.textMuted}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLayout('compact')} style={styles.layoutButton}>
          <Ionicons
            name="list-outline"
            size={20}
            color={layout === 'compact' ? currentTheme.accent : currentTheme.textMuted}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        key={layout}
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={
          notes.length === 0 ? { flex: 1 } : { paddingTop: spacing.sm }
        }
        columnWrapperStyle={
          notes.length > 0 && numColumns === 2
            ? { justifyContent: 'flex-start', gap: spacing.sm }
            : undefined
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Add notes to see them here</Text>
          </View>
        }
        renderItem={({ item }) => (
          <NoteCard note={item} layout={layout} onPress={() => setSelectedNote(item)} onLongPress={() => handleLongPress(item)} />
        )}
      />

      <NoteModal
        note={selectedNote}
        visible={selectedNote !== null}
        onClose={() => setSelectedNote(null)}
        onUpdated={loadNotes}
      />

      <DeleteConfirmModal
        visible={noteToDelete !== null}
        onCancel={() => setNoteToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}