import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../../theme/globalStyles';

export default function ReviewScreen() {
  return (
    <View style={[globalStyles.screen, styles.transparent]}>
      <Text style={globalStyles.heading}>LookingGlass - Review</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  transparent: {
    backgroundColor: 'transparent',
  },
});