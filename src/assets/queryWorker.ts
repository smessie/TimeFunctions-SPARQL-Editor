import { QueryEngine } from '@comunica/query-sparql'

const engine = new QueryEngine();

self.onmessage = async (event) => {
  const { sources, query } = event.data;
  await runQuery(sources, query);
};

async function runQuery(sources: string, query: string) {
  const bindingsStream = await engine.queryBindings(query, { sources: [sources], lenient: true });

  bindingsStream.on('data', (binding) => {
    postMessage(binding.toString());
  });
}
