# LLM-Mux Gateway Management API Client

Complete TypeScript API client and React Query data layer for the LLM-Mux Gateway Management API.

## Features

- **Type-safe** - Full TypeScript types generated from OpenAPI spec
- **React Query integration** - Optimistic updates, caching, and auto-refresh
- **Flexible authentication** - Bearer token or X-Management-Key header
- **Configurable base URL** - Via environment variable
- **Error handling** - Custom error class with status codes
- **Auto-refresh** - Usage stats (30s), logs (5s), OAuth polling (2s)

## Installation

The API client is already configured. Just import what you need:

```typescript
import { useDebug, useUpdateDebug, apiClient } from '@/api'
```

## Configuration

Set the API base URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8318/v0/management
```

Set authentication in your app:

```typescript
import { apiClient } from '@/api'

apiClient.setAuth({
  bearerToken: 'your-secret-key',
  // OR
  managementKey: 'your-secret-key',
})
```

## Usage Examples

### Settings

```typescript
import { useDebug, useUpdateDebug } from '@/api'

function DebugToggle() {
  const { data, isLoading } = useDebug()
  const updateDebug = useUpdateDebug()

  return (
    <Switch
      checked={data?.debug ?? false}
      onCheckedChange={(checked) => updateDebug.mutate(checked)}
      disabled={isLoading}
    />
  )
}
```

### API Keys

```typescript
import { useGeminiKeys, useUpdateGeminiKey } from '@/api'

function GeminiKeyManager() {
  const { data } = useGeminiKeys()
  const updateKey = useUpdateGeminiKey()

  const handleUpdate = (index: number, key: GeminiKey) => {
    updateKey.mutate({ index, value: key })
  }

  return <div>{/* Render keys */}</div>
}
```

### Auth Files

```typescript
import { useAuthFiles, useUploadAuthFile } from '@/api'

function AuthFileUpload() {
  const { data: authFiles } = useAuthFiles()
  const uploadFile = useUploadAuthFile()

  const handleUpload = (file: File) => {
    uploadFile.mutate(file)
  }

  return <FileUploader onUpload={handleUpload} />
}
```

### OAuth Flow

```typescript
import { useOAuthUrl, useOAuthStatus } from '@/api'

function AnthropicOAuth() {
  const { refetch: getOAuthUrl } = useOAuthUrl('anthropic', true)
  const [state, setState] = useState<string | null>(null)
  const { data: status } = useOAuthStatus(state, !!state)

  const initiateFlow = async () => {
    const { data } = await getOAuthUrl()
    if (data) {
      setState(data.state)
      window.open(data.url, '_blank')
    }
  }

  useEffect(() => {
    if (status?.status === 'ok') {
      // Authentication successful!
    }
  }, [status])

  return <Button onClick={initiateFlow}>Connect Anthropic</Button>
}
```

### Usage Statistics

```typescript
import { useUsageStats } from '@/api'

function UsageChart() {
  const { data } = useUsageStats(true) // Auto-refresh every 30s

  return (
    <Chart
      data={data?.usage.requests_by_hour}
      failedRequests={data?.failed_requests}
    />
  )
}
```

### Logs

```typescript
import { useServerLogs, useClearLogs } from '@/api'

function LogViewer() {
  const { data } = useServerLogs({ limit: 100 }, true) // Auto-refresh every 5s
  const clearLogs = useClearLogs()

  return (
    <div>
      <Button onClick={() => clearLogs.mutate()}>Clear Logs</Button>
      <pre>{data?.lines.join('\n')}</pre>
    </div>
  )
}
```

### Configuration

```typescript
import { useConfigYaml, useUpdateConfigYaml } from '@/api'

function ConfigEditor() {
  const { data: yaml } = useConfigYaml()
  const updateConfig = useUpdateConfigYaml()

  const handleSave = (newYaml: string) => {
    updateConfig.mutate(newYaml)
  }

  return <YamlEditor value={yaml} onSave={handleSave} />
}
```

## Directory Structure

```
src/api/
├── client.ts              # Base HTTP client with auth
├── queryKeys.ts           # React Query key factory
├── index.ts               # Main export
├── types/                 # TypeScript type definitions
│   ├── common.ts          # Shared types
│   ├── settings.ts        # Settings types
│   ├── api-keys.ts        # API key types
│   ├── auth-files.ts      # Auth file types
│   ├── oauth.ts           # OAuth types
│   ├── usage.ts           # Usage stats types
│   ├── logs.ts            # Logs types
│   └── config.ts          # Config types
├── endpoints/             # API endpoint functions
│   ├── settings.ts        # Settings endpoints
│   ├── api-keys.ts        # API key endpoints
│   ├── auth-files.ts      # Auth file endpoints
│   ├── oauth.ts           # OAuth endpoints
│   ├── usage.ts           # Usage endpoints
│   ├── logs.ts            # Logs endpoints
│   └── config.ts          # Config endpoints
└── hooks/                 # React Query hooks
    ├── useSettings.ts     # Settings hooks
    ├── useApiKeys.ts      # API key hooks
    ├── useAuthFiles.ts    # Auth file hooks
    ├── useOAuth.ts        # OAuth hooks
    ├── useUsage.ts        # Usage hooks
    ├── useLogs.ts         # Logs hooks
    └── useConfig.ts       # Config hooks
```

## API Coverage

### Settings (10 endpoints)
- ✅ Debug mode
- ✅ Logging to file
- ✅ Usage statistics enabled
- ✅ Proxy URL
- ✅ Switch project (quota exceeded)
- ✅ Switch preview model (quota exceeded)
- ✅ Request log
- ✅ WebSocket auth
- ✅ Request retry count
- ✅ Max retry interval

### API Keys (6 key types)
- ✅ Access API keys
- ✅ Gemini API keys
- ✅ Claude API keys
- ✅ Codex API keys
- ✅ OpenAI compatibility
- ✅ OAuth excluded models

### Auth Files
- ✅ List auth files
- ✅ Upload auth file (multipart)
- ✅ Upload auth file (JSON)
- ✅ Download auth file
- ✅ Delete auth file
- ✅ Delete all auth files
- ✅ Import Vertex AI credentials

### OAuth
- ✅ Anthropic OAuth URL
- ✅ Codex OAuth URL
- ✅ Gemini CLI OAuth URL
- ✅ Antigravity OAuth URL
- ✅ Qwen OAuth URL
- ✅ iFlow OAuth URL
- ✅ iFlow cookie auth
- ✅ OAuth status polling

### Usage
- ✅ Get usage statistics

### Logs
- ✅ Get server logs
- ✅ Clear server logs
- ✅ List error log files
- ✅ Download error log file

### Config
- ✅ Get config JSON
- ✅ Get config YAML
- ✅ Update config YAML
- ✅ Get latest version

## React Query Features

### Optimistic Updates
All settings mutations use optimistic updates for instant UI feedback:

```typescript
onMutate: async (value) => {
  await queryClient.cancelQueries({ queryKey })
  const previous = queryClient.getQueryData(queryKey)
  queryClient.setQueryData(queryKey, newValue)
  return { previous }
},
onError: (err, value, context) => {
  queryClient.setQueryData(queryKey, context?.previous)
},
```

### Auto-refresh
- **Usage stats**: 30 seconds
- **Server logs**: 5 seconds
- **OAuth status**: 2 seconds (stops when not 'wait')

### Cache Configuration
- **Stale time**: 5 minutes
- **Retry**: Disabled
- **Refetch on window focus**: Disabled

## Type Safety

All API responses are fully typed:

```typescript
// Inferred types
const { data } = useGeminiKeys() // data: GeminiKeysResponse | undefined
const { data } = useUsageStats() // data: UsageResponse | undefined
const { data } = useAuthFiles()  // data: AuthFilesResponse | undefined
```

## Error Handling

```typescript
import { ApiClientError } from '@/api'

const updateDebug = useUpdateDebug()

updateDebug.mutate(true, {
  onError: (error) => {
    if (error instanceof ApiClientError) {
      console.error(`API Error ${error.statusCode}: ${error.error}`)
    }
  },
})
```

## Direct API Access

For cases where you need direct API access without React Query:

```typescript
import { debugApi, geminiKeysApi } from '@/api'

// Settings
const debugResponse = await debugApi.get()
await debugApi.update({ value: true })

// API Keys
const keysResponse = await geminiKeysApi.get()
await geminiKeysApi.update({
  index: 0,
  value: { 'api-key': 'new-key' },
})
```

## Next Steps

1. Set up authentication in your app
2. Create UI components using the hooks
3. Add error toast notifications
4. Implement loading states
5. Add React Query DevTools for debugging

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Add to your app
<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```
