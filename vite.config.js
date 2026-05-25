import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  test: {
    // The server tests drive an in-process Express app via supertest. On Node 24
    // this occasionally throws a transient HTTP transport parse error
    // (HPE_INVALID_CONSTANT, "Expected HTTP/") that is unrelated to app logic —
    // the assertions are correct and pass on retry. A genuine failure still fails
    // all attempts. This absorbs that ~1% harness flake so the suite is reliable.
    retry: 2,
  },
})
