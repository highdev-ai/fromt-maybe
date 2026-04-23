import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { View } from 'react-native';

const SkeletonList = () => (
  <SkeletonPlaceholder>
    {[...Array(5)].map((_, i) => (
      <View key={i} style={{ marginBottom: 20 }}>
        <View style={{ width: '100%', height: 20, marginBottom: 6 }} />
        <View style={{ width: '80%', height: 20 }} />
      </View>
    ))}
  </SkeletonPlaceholder>
);

export default SkeletonList;