import { trpc } from "./trpc";

export function App() {
  const health = trpc.health.useQuery();
  const hello = trpc.hello.useQuery({ name: "admin" });

  return (
    <main className="page">
      <h1>ABI Admin</h1>
      <p className="lede">
        Smoke-test page proving the admin SPA can call the shared tRPC router.
      </p>

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
