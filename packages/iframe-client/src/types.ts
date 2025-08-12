export interface SaveNotebookRequest {
  filename?: string;
  persist?: boolean;
  [key: string]: any;
}

export interface SaveNotebookResponse {
  success: boolean;
  filename?: string;
  [key: string]: any;
}

export interface ReadCodeRequest {
  [key: string]: any;
}

export interface ReadCodeResponse {
  contents: string;
  [key: string]: any;
}

export interface MarimoIframeApi {
  saveNotebook(request?: SaveNotebookRequest): Promise<SaveNotebookResponse>;
  readCode(request?: ReadCodeRequest): Promise<ReadCodeResponse>;
}

export interface MarimoIframeApiHandlers {
  onSaveNotebook?: (request: SaveNotebookRequest) => Promise<SaveNotebookResponse>;
  onReadCode?: (request: ReadCodeRequest) => Promise<ReadCodeResponse>;
}