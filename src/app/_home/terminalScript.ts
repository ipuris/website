export type LineTwoState = 'hidden' | 'cursor' | 'error'

export type TerminalViewState = {
  lineOneText: string
  lineOneCursorVisible: boolean
  lineTwoState: LineTwoState
  finalPromptVisible: boolean
}

export type TerminalAction =
  | { type: 'reset' }
  | { type: 'blinkLineOneCursor', count: number, intervalMs: number }
  | { type: 'typeText', text: string, intervalMs: number }
  | { type: 'deleteText', count: number, intervalMs: number }
  | { type: 'wait', durationMs: number }
  | { type: 'setLineOneCursor', visible: boolean }
  | { type: 'setLineTwoState', state: LineTwoState }
  | { type: 'setFinalPrompt', visible: boolean }

export const INITIAL_TERMINAL_STATE: TerminalViewState = {
  lineOneText: '',
  lineOneCursorVisible: false,
  lineTwoState: 'hidden',
  finalPromptVisible: false,
}

export const TERMINAL_ERROR_MESSAGE = 'sh: command not found: Hello,'

export const DEVELOPER_TERMINAL_SCRIPT: readonly TerminalAction[] = [
  { type: 'reset' },
  { type: 'blinkLineOneCursor', count: 2, intervalMs: 500 },
  { type: 'typeText', text: 'Hello, wordl', intervalMs: 200 },
  { type: 'wait', durationMs: 1000 },
  { type: 'deleteText', count: 2, intervalMs: 300 },
  { type: 'wait', durationMs: 700 },
  { type: 'typeText', text: 'ld!', intervalMs: 200 },
  { type: 'wait', durationMs: 1000 },
  { type: 'setLineOneCursor', visible: false },
  { type: 'setLineTwoState', state: 'cursor' },
  { type: 'wait', durationMs: 1000 },
  { type: 'setLineTwoState', state: 'error' },
  { type: 'wait', durationMs: 400 },
  { type: 'setFinalPrompt', visible: true },
]
