import { View, Text } from "react-native";

export default function TeamCard({ team }) {
  return (
    <View>
      <Text>{team.name}</Text>
    </View>
  );
}
