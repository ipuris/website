import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  DEVELOPER_TERMINAL_SCRIPT,
  INITIAL_TERMINAL_STATE,
  TerminalAction,
  TerminalViewState,
} from './terminalScript'

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })

type UseTerminalAnimatorParams = {
  playKey: number
  script?: readonly TerminalAction[]
}

export const useTerminalAnimator = ({
  playKey,
  script = DEVELOPER_TERMINAL_SCRIPT,
}: UseTerminalAnimatorParams) => {
  const [state, setState] = useState<TerminalViewState>(INITIAL_TERMINAL_STATE)
  const runIdRef = useRef(0)

  useLayoutEffect(() => {
    if (playKey <= 0) return

    // Invalidate any previous run before paint to avoid showing stale frames.
    runIdRef.current += 1
    setState({
      lineOneText: '',
      lineOneCursorVisible: true,
      lineTwoState: 'hidden',
      finalPromptVisible: false,
    })
  }, [playKey])

  useEffect(() => {
    if (playKey <= 0) return

    const runId = runIdRef.current

    const isStale = () => runId !== runIdRef.current

    const wait = async (ms: number) => {
      await sleep(ms)
      return !isStale()
    }

    const patch = (next: Partial<TerminalViewState>) => {
      if (isStale()) return false
      setState((prev) => ({ ...prev, ...next }))
      return true
    }

    const run = async () => {
      for (const action of script) {
        if (isStale()) return

        switch (action.type) {
          case 'reset': {
            if (
              !patch({
                lineOneText: '',
                lineOneCursorVisible: true,
                lineTwoState: 'hidden',
                finalPromptVisible: false,
              })
            ) {
              return
            }
            break
          }
          case 'blinkLineOneCursor': {
            for (let i = 0; i < action.count; i += 1) {
              if (!(await wait(action.intervalMs / 2))) return
              if (!patch({ lineOneCursorVisible: false })) return
              if (!(await wait(action.intervalMs / 2))) return
              if (!patch({ lineOneCursorVisible: true })) return
            }
            break
          }
          case 'typeText': {
            for (const char of action.text) {
              if (isStale()) return
              setState((prev) => ({
                ...prev,
                lineOneText: `${prev.lineOneText}${char}`,
                lineOneCursorVisible: true,
              }))
              if (!(await wait(action.intervalMs))) return
            }
            break
          }
          case 'deleteText': {
            for (let i = 0; i < action.count; i += 1) {
              if (isStale()) return
              setState((prev) => ({
                ...prev,
                lineOneText: prev.lineOneText.slice(0, -1),
                lineOneCursorVisible: true,
              }))
              if (!(await wait(action.intervalMs))) return
            }
            break
          }
          case 'wait': {
            if (!(await wait(action.durationMs))) return
            break
          }
          case 'setLineOneCursor': {
            if (!patch({ lineOneCursorVisible: action.visible })) return
            break
          }
          case 'setLineTwoState': {
            if (!patch({ lineTwoState: action.state })) return
            break
          }
          case 'setFinalPrompt': {
            if (!patch({ finalPromptVisible: action.visible })) return
            break
          }
          default:
            break
        }
      }
    }

    void run()

    return () => {
      runIdRef.current += 1
    }
  }, [playKey, script])

  return state
}
