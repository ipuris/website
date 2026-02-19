import terminalStyles from './terminal.module.css'
import { TERMINAL_ERROR_MESSAGE } from './terminalScript'
import { useTerminalAnimator } from './useTerminalAnimator'

type DeveloperTerminalProps = {
  playKey: number
}

export const DeveloperTerminal = ({ playKey }: DeveloperTerminalProps) => {
  const state = useTerminalAnimator({ playKey })

  return (
    <div className={`${terminalStyles.terminal} text-neutral-800 dark:text-neutral-200`}>
      <div className={terminalStyles.terminalLine}>
        <span className={terminalStyles.prompt}>$&nbsp;</span>
        <span className={terminalStyles.commandText}>{state.lineOneText}</span>
        {state.lineOneCursorVisible ? (
          <span
            className={`${terminalStyles.cursor} bg-neutral-900 dark:bg-neutral-200`}
          />
        ) : null}
      </div>

      <div className={terminalStyles.terminalLine}>
        {state.lineTwoState === 'cursor' ? (
          <span
            className={`${terminalStyles.cursor} ${terminalStyles.blink} bg-neutral-900 dark:bg-neutral-200`}
          />
        ) : null}
        {state.lineTwoState === 'error' ? (
          <span className={`${terminalStyles.errorText} text-red-700 dark:text-red-400`}>
            {TERMINAL_ERROR_MESSAGE}
          </span>
        ) : null}
      </div>

      <div className={terminalStyles.terminalLine}>
        {state.finalPromptVisible ? (
          <>
            <span className={terminalStyles.prompt}>$&nbsp;</span>
            <span
              className={`${terminalStyles.cursor} ${terminalStyles.blink} bg-neutral-900 dark:bg-neutral-200`}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}
