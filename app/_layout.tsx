// import { Stack } from "expo-router";

// export default function Layout() {
//   return <Stack />;
// }



import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="scanner/index" options={{ title: "Scanner" }} />
      <Stack.Screen name="welcome" options={{ title: "Welcome" }} />
    </Stack>
  );
}
