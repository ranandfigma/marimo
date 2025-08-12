/* Copyright 2024 Marimo. All rights reserved. */

import { setupMarimoIframeApi } from "@marimo-team/iframe-client";
import { getRequestClient } from "../network/requests";
import { getNotebook, getCellConfigs } from "../cells/cells";
import { notebookCells } from "../cells/utils";
import { store } from "../state/jotai";
import { filenameAtom } from "../saving/file-state";
import { connectionAtom } from "../network/connection";
import { WebSocketState } from "../websocket/types";
import { getSerializedLayout } from "../layout/layout";
import { Logger } from "@/utils/Logger";

/**
 * Initializes the iframe API for controlling marimo from a parent window.
 * This should be called when marimo is embedded in an iframe.
 */
export function initializeIframeApi() {
  // Check if we're in an iframe
  if (window.self === window.top) {
    Logger.log("Top, not initializing iframe API");
    return;
  }

  Logger.log("Initializing iframe API");

  setupMarimoIframeApi({
    onSaveNotebook: async (request) => {
      try {
        const notebook = getNotebook();
        const cells = notebookCells(notebook);
        const cellIds = cells.map((cell) => cell.id);
        const codes = cells.map((cell) => cell.code);
        const cellNames = cells.map((cell) => cell.name);
        const configs = getCellConfigs(notebook);
        const connection = store.get(connectionAtom);
        
        // Use provided filename or current filename
        const filename = request.filename || store.get(filenameAtom) || "notebook.py";

        // Don't save if there are no cells
        if (codes.length === 0) {
          return { success: false };
        }

        // Don't save if we are not connected to a kernel
        if (connection.state !== WebSocketState.OPEN) {
          return { success: false };
        }

        const client = getRequestClient();
        await client.sendSave({
          cellIds: cellIds,
          codes,
          names: cellNames,
          filename,
          configs,
          layout: getSerializedLayout(),
          persist: request.persist ?? true,
        });

        Logger.log("Saved notebook via iframe API to", filename);
        return { success: true, filename };
      } catch (error) {
        Logger.error("Failed to save notebook via iframe API", error);
        return { success: false };
      }
    },

    onReadCode: async () => {
      try {
        const client = getRequestClient();
        const result = await client.readCode();
        return { contents: result.contents };
      } catch (error) {
        Logger.error("Failed to read code via iframe API", error);
        return { contents: "" };
      }
    },
  });
}
