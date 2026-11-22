import {
  createAbiTrpcClient,
  createQueryClient,
  trpc,
} from "@abi/shared";
import { AuthKitProvider, useAuth } from "@workos-inc/authkit-react";
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
const workosClientId = import.meta.env.VITE_WORKOS_CLIENT_ID;

function AuthenticatedRoot() {
  const { getAccessToken } = useAuth();
  const getAccessTokenRef = useRef(getAccessToken);
  getAccessTokenRef.current = getAccessToken;

  const [queryClient] = useState(() => createQueryClient());
  const trpcClient = useMemo(
    () =>
      createAbiTrpcClient(apiUrl, {
        getAccessToken: async () => {
          try {
            return await getAccessTokenRef.current();
          } catch {
            return null;
          }
        },
      }),
    [],
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function Root() {
  if (!workosClientId) {
    return (
      <main className="page">
        <h1>ABI Org</h1>
        <p className="error">
          Missing <code>VITE_WORKOS_CLIENT_ID</code>. Copy{" "}
          <code>.env.example</code> to <code>.env</code>.
        </p>
      </main>
    );
  }

  return (
    <AuthKitProvider clientId={workosClientId} devMode>
      <AuthenticatedRoot />
    </AuthKitProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
