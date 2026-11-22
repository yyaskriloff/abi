import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { trpc } from "./src/trpc";

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";

function HomeScreen() {
  const health = trpc.health.useQuery();
  const hello = trpc.hello.useQuery({ name: "mobile" });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>ABI Mobile</Text>
        <Text style={styles.lede}>
          Smoke-test screen proving Expo can call the shared tRPC router.
        </Text>

        <Text style={styles.heading}>Health</Text>
        {health.isLoading && <ActivityIndicator />}
        {health.error && (
          <Text style={styles.error}>{health.error.message}</Text>
        )}
        {health.data && (
          <View style={styles.card}>
            <Text style={styles.mono}>{JSON.stringify(health.data, null, 2)}</Text>
          </View>
        )}

        <Text style={styles.heading}>Hello</Text>
        {hello.isLoading && <ActivityIndicator />}
        {hello.error && (
          <Text style={styles.error}>{hello.error.message}</Text>
        )}
        {hello.data && (
          <View style={styles.card}>
            <Text style={styles.mono}>{JSON.stringify(hello.data, null, 2)}</Text>
          </View>
        )}
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${apiUrl}/trpc`,
        }),
      ],
    }),
  );

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
    backgroundColor: "#FAFAF9",
  },
  container: {
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#1C1917",
  },
  lede: {
    fontSize: 16,
    color: "#57534E",
    marginBottom: 12,
  },
  heading: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#78716C",
  },
  card: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E7E5E4",
    backgroundColor: "#FFFFFF",
  },
  mono: {
    fontFamily: "Courier",
    fontSize: 13,
    color: "#1C1917",
  },
  error: {
    color: "#B91C1C",
  },
});
