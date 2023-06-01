export const loadSettingsConfig = () => ({
  control: {
    control: 1, // Show when control > 0
    emoji: '🖥️',
  },
  renderer: {
    control: 4, // Show when control > 3
    list: ['react', 'svg'],
    choiceTitles: {
      react: 'renderWithReact',
      svg: 'renderWithCore',
    },
    valueTitles: {
      react: 'React',
      svg: 'SVG',
    },
    dflt: 'react',
    emoji: '🚀',
  },
})
