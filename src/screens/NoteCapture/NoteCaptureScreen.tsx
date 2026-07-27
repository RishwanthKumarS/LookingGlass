import { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addNote, getAllNotes, deleteNote, Note } from '../../db/queries/notes';
import { useSettings } from '../../theme/SettingsContext';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import { spacing, fontSize } from '../../theme/globalStyles';
import { useTheme } from '../../theme/ThemeContext';
import NoteCard, { LayoutMode } from '../../components/NoteCard';
import NoteModal from '../../components/NoteModal';
import { getRandomPrompt } from '../../lib/notePrompts';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { copyToPermanentStorage } from '../../lib/fileStorage';
import { addAttachment } from '../../db/queries/attachments';

export default function NoteCaptureScreen() {
  const [placeholder] = useState(() => getRandomPrompt());
  const [input, setInput] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [layout, setLayout] = useState<LayoutMode>('grid2');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const { currentTheme } = useTheme();
  const { confirmDelete, setConfirmDelete } = useSettings();
  const [pendingAttachments, setPendingAttachments] = useState<{ type: 'image' | 'file'; uri: string; filename: string }[]>([]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      padding: spacing.md,
    },
    input: {
      backgroundColor: currentTheme.surface,
      opacity: 0.8,
      color: currentTheme.text,
      borderRadius: 8,
      padding: spacing.md,
      fontSize: fontSize.md,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    button: {
      backgroundColor: currentTheme.accent,
      opacity: 0.8,
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
    attachRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    attachButton: {
      padding: spacing.sm / 2,
    },
    pendingRow: {
      marginTop: spacing.sm,
      gap: spacing.sm / 2,
    },
    pendingItem: {
      backgroundColor: currentTheme.surface,
      borderRadius: 6,
      paddingVertical: spacing.sm / 2,
      paddingHorizontal: spacing.sm,
    },
    pendingText: {
      color: currentTheme.textMuted,
      fontSize: fontSize.sm,
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

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const { uri, filename } = await copyToPermanentStorage(result.assets[0].uri);
      setPendingAttachments((prev) => [...prev, { type: 'image', uri, filename }]);
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      const { uri, filename } = await copyToPermanentStorage(result.assets[0].uri);
      setPendingAttachments((prev) => [...prev, { type: 'image', uri, filename }]);
    }
  };

  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const { uri, filename } = await copyToPermanentStorage(asset.uri, asset.name);
    setPendingAttachments((prev) => [...prev, { type: 'file', uri, filename }]);
  };

  const handleSave = () => {
    if (input.trim().length === 0) return;
    const noteId = addNote(input.trim());
    pendingAttachments.forEach((att) => {
      addAttachment(noteId, att.type, att.uri, att.filename);
    });
    setPendingAttachments([]);
    setInput('');
    loadNotes();
  };

  const handleLongPress = (note: Note) => {
    if (!confirmDelete) {
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
        setConfirmDelete(false);
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

        <View style={styles.attachRow}>
          <TouchableOpacity onPress={handleTakePhoto} style={styles.attachButton}>
            <Ionicons name="camera-outline" size={20} color={currentTheme.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickImage} style={styles.attachButton}>
            <Ionicons name="image-outline" size={20} color={currentTheme.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickFile} style={styles.attachButton}>
            <Ionicons name="attach-outline" size={20} color={currentTheme.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>

        {pendingAttachments.length > 0 && (
          <View style={styles.pendingRow}>
            {pendingAttachments.map((att, i) => (
              <View key={i} style={styles.pendingItem}>
                <Text style={styles.pendingText} numberOfLines={1}>
                  {att.type === 'image' ? '🖼️' : '📎'} {att.filename}
                </Text>
              </View>
            ))}
          </View>
        )}

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