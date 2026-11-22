import {
  createAbiTrpcClient,
  createQueryClient,
  trpc,
  useHealth,
  useHello,
} from "@abi/shared";
import { Text, theme, View } from "@abi/ui-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

function HomeScreen() {
  const health = useHealth();
  const hello = useHello("mobile");

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text className="text-3xl font-semibold text-foreground">ABI Mobile</Text>
        <Text className="mb-3 text-base text-muted">
          Smoke-test screen proving Expo can call the shared tRPC router and use
          NativeWind UI.
        </Text>

        <Text className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Health
        </Text>
        {health.isLoading && <ActivityIndicator />}
        {health.error && (
          <Text className="text-destructive">{health.error.message}</Text>
        )}
        {health.data && (
          <View className="rounded-lg border border-border bg-card p-3">
            <Text className="font-mono text-sm text-foreground">
              {JSON.stringify(health.data, null, 2)}
            </Text>
          </View>
        )}

        <Text className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Hello
        </Text>
        {hello.isLoading && <ActivityIndicator />}
        {hello.error && (
          <Text className="text-destructive">{hello.error.message}</Text>
        )}
        {hello.data && (
          <View className="rounded-lg border border-border bg-card p-3">
            <Text className="font-mono text-sm text-foreground">
              {JSON.stringify(hello.data, null, 2)}
            </Text>
          </View>
        )}
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

export default function App() {
  const [queryClient] = useState(() => createQueryClient());
  const [trpcClient] = useState(() => createAbiTrpcClient(apiUrl));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HomeScreen />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: 24,
    gap: 12,
  },
});
