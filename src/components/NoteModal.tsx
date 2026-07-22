import { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note, updateNote } from '../db/queries/notes';
import { colors, spacing, fontSize } from '../theme/globalStyles';

interface Props {
  note: Note | null;
  visible: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const screenWidth = Dimensions.get('window').width;
const MODAL_SIZE = screenWidth - spacing.lg * 2;

function formatDateTime(note: Note) {
  const date = note.updated_at ? new Date(note.updated_at) : new Date(note.created_at);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function NoteModal({ note, visible, onClose, onUpdated }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');

  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (note) {
      setDraft(note.content);
      setIsEditing(false);
    }
  }, [note]);

  useEffect(() => {
    if (visible) {
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

  if (!note) return null;

  const handleSaveEdit = () => {
    if (draft.trim().length === 0) return;
    updateNote(note.id, draft.trim());
    setIsEditing(false);
    onUpdated();
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={handleClose}>
      <Animated.View style={[styles.overlay, { opacity }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View style={[styles.sheet, { transform: [{ scale }] }]}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={22} color={colors.text} />
          </TouchableOpacity>

          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={draft}
              onChangeText={setDraft}
              multiline
              autoFocus
              placeholderTextColor={colors.textMuted}
            />
          ) : (
            <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingTop: spacing.lg }}>
              {note.subject && <Text style={styles.subject}>{note.subject}</Text>}
              <Text style={styles.content}>{note.content}</Text>
            </ScrollView>
          )}

          <View style={styles.footerRow}>
            <Text style={styles.meta}>{formatDateTime(note)}</Text>
            <TouchableOpacity onPress={() => (isEditing ? handleSaveEdit() : setIsEditing(true))}>
              <Ionicons
                name={isEditing ? 'checkmark-outline' : 'create-outline'}
                size={22}
                color={colors.accent}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    width: MODAL_SIZE,
    height: MODAL_SIZE,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scrollArea: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 1,
  },
  subject: {
    color: colors.accent,
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  content: {
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  editInput: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: 22,
    marginTop: spacing.lg,
    textAlignVertical: 'top',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  meta: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});