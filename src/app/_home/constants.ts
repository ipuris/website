export const SECTION_INDEX = {
  ENTREPRENEUR: 0,
  DEVELOPER: 1,
  RESEARCHER: 2,
  PERSON: 3,
} as const

export const MOBILE_MEDIA_QUERY = '(max-width: 768px)'

export const STAGE_ANIMATION = {
  maxBlur: 8,
  transitionDurationSec: 0.3,
  bounceOpacity: 0.7,
  bounceDurationSec: 0.12,
} as const

export const SCROLL_INPUT = {
  mobileCooldownMs: 50,
  desktopCooldownMs: 200,
  mobileWheelThreshold: 50,
  desktopWheelThreshold: 300,
  velocityBoostRatio: 1.25,
  touchThresholdRatio: 0.6,
} as const
