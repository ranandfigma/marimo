import { createChannel } from 'bidc';
import type { MarimoIframeApiHandlers, SaveNotebookRequest, ReadCodeRequest } from './types';

/**
 * Sets up the iframe API handlers inside a marimo notebook.
 * This should be called from within the marimo application.
 * 
 * @param handlers - Object containing handler functions for each API method
 * @param channelId - Optional channel ID for namespacing (default: 'marimo-iframe-api')
 * 
 * @example
 * ```typescript
 * // Inside marimo application
 * setupMarimoIframeApi({
 *   onSaveNotebook: async (request) => {
 *     // Handle save notebook request
 *     const result = await saveNotebook(request.filename);
 *     return { success: true, filename: result.filename };
 *   },
 *   onReadCode: async () => {
 *     // Handle read code request
 *     const code = await readCode();
 *     return { contents: code };
 *   }
 * });
 * ```
 */
export function setupMarimoIframeApi(
  handlers: MarimoIframeApiHandlers,
  channelId: string = 'marimo-iframe-api'
) {
  const { receive } = createChannel(window.parent, channelId);

  receive(async (message: any) => {
    const { type, request } = message;

    switch (type) {
      case 'saveNotebook':
        if (handlers.onSaveNotebook) {
          return await handlers.onSaveNotebook(request as SaveNotebookRequest);
        }
        throw new Error('saveNotebook handler not implemented');

      case 'readCode':
        if (handlers.onReadCode) {
          return await handlers.onReadCode(request as ReadCodeRequest);
        }
        throw new Error('readCode handler not implemented');

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  });
}