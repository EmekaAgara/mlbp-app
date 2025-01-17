import { Redirect, Slot } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return <Redirect href={"/GetStarted"} />;
  // return <Slot />;
}
