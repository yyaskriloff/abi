import { useHealth, useHello, useMe } from "@abi/shared";
import { Button } from "@abi/ui";
import { useAuth } from "@workos-inc/authkit-react";
import { useEffect, useState } from "react";

export function App() {
  const { isLoading, user, signIn, signOut } = useAuth();
  const health = useHealth();
  const hello = useHello("admin");
  const me = useMe(Boolean(user));
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (window.location.pathname === "/login") {
      void signIn();
    }
  }, [signIn]);

  if (isLoading) {
    return (
      <main className="page">
        <p>Loading auth…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page">
        <h1>ABI Admin</h1>
        <p className="lede">
          Platform admin console. Sign in with your invited WorkOS account.
        </p>
        <Button type="button" onClick={() => void signIn()}>
          Sign in
        </Button>
      </main>
    );
  }

  return (
    <main className="page">
      <h1>ABI Admin</h1>
      <p className="lede">
        Signed in as {user.email}
        {user.firstName ? ` (${user.firstName})` : ""}.
      </p>

      <div className="mb-6 flex gap-3">
        <Button type="button" onClick={() => setClicks((n) => n + 1)}>
          Shared UI button ({clicks})
        </Button>
        <Button type="button" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>

      <section>
        <h2>Me</h2>
        {me.isLoading && <p>Loading…</p>}
        {me.error && <p className="error">{me.error.message}</p>}
        {me.data && <pre>{JSON.stringify(me.data, null, 2)}</pre>}
      </section>

      <section>
        <h2>Health</h2>
        {health.isLoading && <p>Loading…</p>}
        {health.error && <p className="error">{health.error.message}</p>}
        {health.data && <pre>{JSON.stringify(health.data, null, 2)}</pre>}
      </section>

      <section>
        <h2>Hello</h2>
        {hello.isLoading && <p>Loading…</p>}
        {hello.error && <p className="error">{hello.error.message}</p>}
        {hello.data && <pre>{JSON.stringify(hello.data, null, 2)}</pre>}
      </section>
    </main>
  );
}
