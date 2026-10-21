import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The render engine and the app shell are the @graphlearning/flow and @graphlearning/shell packages,
// not local folders. `dedupe` is what keeps a single copy of react / react-dom
// across this app and both packages — the gotcha that bites when two React copies meet
// (invalid-hook-call). The packages declare them as peer deps and externalise them, so neither ever
// carries its own React; dedupe is the belt to that braces. jsx is automatic with
// @vitejs/plugin-react.
//
// `base` is the Pages path: the site is served at graphl.in/aws-ct/ (the slug is the repo name), so
// the build must be prefixed while dev stays at the root for `npm run dev` and the recorders.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/aws-ct/' : '/',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: { port: 5173 },
}))
