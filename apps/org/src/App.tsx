import { useHealth, useHello } from "@abi/shared";
import { Button } from "@abi/ui";
import { useState } from "react";

export function App() {
  const health = useHealth();
  const hello = useHello("org");
  const [clicks, setClicks] = useState(0);

  return (
    <main className="page">
      <h1>ABI Org</h1>
      <p className="lede">
        Smoke-test page proving the org SPA can call the shared tRPC router and
        render shared UI.
      </p>

      <div className="mb-6">
        <Button type="button" onClick={() => setClicks((n) => n + 1)}>
          Shared UI button ({clicks})
        </Button>
      </div>

      <section>
        <h2>Health</h2>
        {health.isLoading && <p>Loading…</p>}
        {health.error && <p className="error">{health.error.message}</p>}
        {health.data && (
          <pre>{JSON.stringify(health.data, null, 2)}</pre>
        )}
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
