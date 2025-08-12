import { createChannel } from 'bidc';
import type { MarimoIframeApi, SaveNotebookRequest, SaveNotebookResponse, ReadCodeRequest, ReadCodeResponse } from './types';

/**
 * Creates a client for controlling a marimo notebook embedded in an iframe.
 * 
 * @param iframe - The iframe element containing the marimo notebook
 * @param channelId - Optional channel ID for namespacing (default: 'marimo-iframe-api')
 * @returns MarimoIframeApi client
 * 
 * @example
 * ```typescript
 * const iframe = document.getElementById('marimo-iframe') as HTMLIFrameElement;
 * const client = createMarimoClient(iframe);
 * 
 * // Save the notebook
 * const result = await client.saveNotebook({ filename: 'my-notebook.py' });
 * 
 * // Read the current code
 * const code = await client.readCode();
 * console.log(code.contents);
 * ```
 */
export function createMarimoClient(
  iframe: HTMLIFrameElement,
  channelId: string = 'marimo-iframe-api'
): MarimoIframeApi {
  const { send } = createChannel(iframe.contentWindow!, channelId);

  return {
    async saveNotebook(request: SaveNotebookRequest = {}): Promise<SaveNotebookResponse> {
      return send({
        type: 'saveNotebook',
        request,
      }) as Promise<SaveNotebookResponse>;
    },

    async readCode(request: ReadCodeRequest = {}): Promise<ReadCodeResponse> {
      return send({
        type: 'readCode',
        request,
      }) as Promise<ReadCodeResponse>;
    },
  };
}