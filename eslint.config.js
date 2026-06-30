import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'android', 'ios', 'public/assets']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // We intentionally co-locate each context's Provider with its useX hook.
      'react-refresh/only-export-components': 'off',
      // React Compiler preview rules (eslint-plugin-react-hooks v7) flag a few
      // idiomatic patterns we rely on: data-fetching effects and a time-based
      // useMemo. Disabled until they stabilize; rules-of-hooks and
      // exhaustive-deps stay on.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
    },
  },
])
