# @marimo-team/iframe-client

Client library for programmatically controlling marimo notebooks embedded in iframes.

## Installation

```bash
npm install @marimo-team/iframe-client
# or
pnpm add @marimo-team/iframe-client
# or
yarn add @marimo-team/iframe-client
```

## Usage

### Basic Example

```typescript
import { createMarimoClient } from '@marimo-team/iframe-client';

// Get reference to your iframe
const iframe = document.getElementById('marimo-iframe') as HTMLIFrameElement;

// Create the client
const client = createMarimoClient(iframe);

// Save the notebook
const saveResult = await client.saveNotebook({ 
  filename: 'my-notebook.py',
  persist: true 
});

if (saveResult.success) {
  console.log('Notebook saved to:', saveResult.filename);
}

// Read the current notebook code
const code = await client.readCode();
console.log('Current notebook code:', code.contents);
```

### React Example

```tsx
import React, { useRef, useEffect, useState } from 'react';
import { createMarimoClient, MarimoIframeApi } from '@marimo-team/iframe-client';

function MarimoEditor() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [client, setClient] = useState<MarimoIframeApi | null>(null);
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (iframeRef.current) {
      const marimoClient = createMarimoClient(iframeRef.current);
      setClient(marimoClient);
    }
  }, []);

  const handleSave = async () => {
    if (!client) return;
    
    const result = await client.saveNotebook({
      filename: 'notebook.py',
      persist: true
    });
    
    if (result.success) {
      alert(`Saved to ${result.filename}`);
    }
  };

  const handleLoadCode = async () => {
    if (!client) return;
    
    const result = await client.readCode();
    setCode(result.contents);
  };

  return (
    <div>
      <div>
        <button onClick={handleSave}>Save Notebook</button>
        <button onClick={handleLoadCode}>Load Code</button>
      </div>
      <iframe
        ref={iframeRef}
        src="http://localhost:2718"
        width="100%"
        height="600"
      />
      {code && (
        <pre>{code}</pre>
      )}
    </div>
  );
}
```

### Advanced: Multiple Iframe Channels

If you have multiple marimo iframes on the same page, you can use different channel IDs to isolate them:

```typescript
// First iframe
const client1 = createMarimoClient(iframe1, 'marimo-1');

// Second iframe
const client2 = createMarimoClient(iframe2, 'marimo-2');

// Each client communicates independently
await client1.saveNotebook({ filename: 'notebook1.py' });
await client2.saveNotebook({ filename: 'notebook2.py' });
```

## API Reference

### `createMarimoClient(iframe, channelId?)`

Creates a client for controlling a marimo notebook in an iframe.

**Parameters:**
- `iframe`: HTMLIFrameElement - The iframe containing the marimo notebook
- `channelId`: string (optional) - Channel ID for namespacing (default: 'marimo-iframe-api')

**Returns:** `MarimoIframeApi` client

### `MarimoIframeApi`

#### `saveNotebook(request?)`

Saves the current notebook.

**Parameters:**
- `request.filename`: string (optional) - The filename to save as
- `request.persist`: boolean (optional) - Whether to persist the save (default: true)

**Returns:** Promise<`SaveNotebookResponse`>
- `success`: boolean - Whether the save was successful
- `filename`: string (optional) - The filename that was saved

#### `readCode()`

Reads the current notebook code as a Python script.

**Returns:** Promise<`ReadCodeResponse`>
- `contents`: string - The notebook code as a Python script

## How It Works

This library uses [bidc](https://github.com/zaaack/bidc) for bidirectional communication between the parent window and the marimo iframe. It automatically handles:

- Connection establishment
- Message serialization/deserialization  
- Promise-based request/response patterns
- Error handling

The marimo application automatically sets up the necessary handlers when loaded in an iframe, so no additional configuration is needed on the marimo side.