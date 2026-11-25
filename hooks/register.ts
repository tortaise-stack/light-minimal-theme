import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Light and minimal: near-white surfaces with a faint cool tint, soft ink text,
// one calm purple accent. Light mode only.
const { theme, problems } = makeColors({
  label: 'Light minimal',
  only: 'light',
  roles: { accent: '#6a4fa3', danger: '#b4443a', success: '#3f7f52', warning: '#a5701a', pro: '#8b4a92' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e3daf2',
        'surface-1': '#f0ebf9',
        'surface-2': '#faf7fe',
        'text-primary': '#1f2328',
        'text-secondary': '#454b54',
        'text-muted': '#5f6670',
      },
    },
  },
})

// A soft, barely-purple ground behind the chat.
const BASE: ThemeSetArgs = { colors: theme, overrideColorScheme: 'light', backdrop: { color: '#ebe3f8' } }

// Minimal rows: your messages as a flat white card with a hairline border,
// replies left plain, and a touch more line spacing.
const LOOK: ThemeSetArgs = {
  ...BASE,
  style: {
    Text: { lineHeight: 24 },
    UserMessage: { backgroundColor: '#ffffff', color: '#1f2328', borderColor: '#cfc0ea', borderWidth: 1, radius: 10, paddingX: 14, paddingY: 10, shadow: 'none' },
    ToolUse: { color: '#454b54' },
  },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    let set
    try {
      set = await $.theme.set(LOOK)
    } catch (error) {
      $.ui.log(String(error))
      set = await $.theme.set(BASE)
    }

    if (!set.isDrawn) {
      $.ui.toast(`Light minimal theme not drawn: ${set.reason}`)
    }

    return next(e)
  })
}
