import {
  createAbiTrpcClient,
  createQueryClient,
  trpc,
  useHealth,
  useHello,
  useMe,
} from "@abi/shared";
import { Text, theme, View } from "@abi/ui-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  clearSession,
  getValidAccessToken,
  loadSession,
  signInWithWorkOs,
  type WorkOsSession,
} from "./auth";

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001";
const workosClientId = process.env.EXPO_PUBLIC_WORKOS_CLIENT_ID ?? "";
const scheme = "abi-user";

function HomeScreen({
  session,
  onSignIn,
  onSignOut,
  authError,
  authBusy,
}: {
  session: WorkOsSession | null;
  onSignIn: () => void;
  onSignOut: () => void;
  authError: string | null;
  authBusy: boolean;
}) {
  const health = useHealth();
  const hello = useHello("mobile");
  const me = useMe(Boolean(session));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text className="text-3xl font-semibold text-foreground">ABI Mobile</Text>
        <Text className="mb-3 text-base text-muted">
          User app with WorkOS AuthKit (invite-only sign-in).
        </Text>

        {!workosClientId && (
          <Text className="text-destructive">
            Missing EXPO_PUBLIC_WORKOS_CLIENT_ID
          </Text>
        )}

        {authError && (
          <Text className="text-destructive">{authError}</Text>
        )}

        <View className="mb-3 flex-row gap-3">
          {session ? (
            <Pressable onPress={onSignOut} style={styles.button}>
              <Text className="text-foreground">Sign out</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={onSignIn}
              disabled={authBusy || !workosClientId}
              style={styles.button}
            >
              <Text className="text-foreground">
                {authBusy ? "Signing in…" : "Sign in"}
              </Text>
            </Pressable>
          )}
        </View>

        {session && (
          <>
            <Text className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Me
            </Text>
            {me.isLoading && <ActivityIndicator />}
            {me.error && (
              <Text className="text-destructive">{me.error.message}</Text>
            )}
            {me.data && (
              <View className="rounded-lg border border-border bg-card p-3">
                <Text className="font-mono text-sm text-foreground">
                  {JSON.stringify(me.data, null, 2)}
                </Text>
              </View>
            )}
          </>
        )}

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
  const [session, setSession] = useState<WorkOsSession | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const clientIdRef = useRef(workosClientId);
  clientIdRef.current = workosClientId;

  useEffect(() => {
    void loadSession()
      .then(setSession)
      .finally(() => setReady(true));
  }, []);

  const trpcClient = useMemo(
    () =>
      createAbiTrpcClient(apiUrl, {
        getAccessToken: async () => {
          if (!clientIdRef.current) return null;
          return getValidAccessToken({ clientId: clientIdRef.current });
        },
      }),
    [],
  );

  const onSignIn = useCallback(async () => {
    if (!workosClientId) return;
    setAuthBusy(true);
    setAuthError(null);
    try {
      const next = await signInWithWorkOs({
        clientId: workosClientId,
        scheme,
      });
      setSession(next);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Sign-in failed");
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const onSignOut = useCallback(async () => {
    await clearSession();
    setSession(null);
  }, []);

  if (!ready) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <HomeScreen
          session={session}
          onSignIn={() => void onSignIn()}
          onSignOut={() => void onSignOut()}
          authError={authError}
          authBusy={authBusy}
        />
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
  button: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
