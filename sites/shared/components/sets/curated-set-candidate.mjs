import { ChoiceButton } from 'shared/components/choice-button.mjs'
import { ChoiceLink } from 'shared/components/choice-link.mjs'
import { OkIcon, NoIcon, WarningIcon } from 'shared/components/icons.mjs'
import { useTranslation } from 'next-i18next'
import { capitalize } from 'shared/utils.mjs'

export const ns = ['sets']

const Title = ({ set, language }) => (
  <div className="flex flex-row items-center gap-2">
    <img
      alt="img"
      src={set.img}
      className="shadow mask mask-squircle bg-neutral aspect-square w-12 h-12"
    />
    <span>{set[`name${capitalize(language)}`]}</span>
  </div>
)

export const CuratedSetLacksMeasies = ({ set, design, t, language, href, clickHandler }) => {
  const inner = (
    <div className="flex flex-row gap-2 items-center">
      <WarningIcon className="w-6 h-6 shrink-0 text-error" />
      <span>{t('setLacksMeasiesForDesign', { design: t(`designs:${design}.t`) })}</span>
    </div>
  )
  const wrapProps = {
    icon: <NoIcon className="w-10 h-10 text-error" />,
    title: <Title {...{ set, language }} />,
  }
  if (clickHandler) wrapProps.onClick = clickHandler
  else if (href) wrapProps.href = href

  const Component = clickHandler ? ChoiceButton : ChoiceLink

  return <Component {...wrapProps}></Component>
}

export const CuratedSetSummary = ({ set, language, href, clickHandler }) => {
  const wrapProps = {
    icon: <OkIcon className="w-10 h-10 text-success" />,
    title: <Title {...{ set, language }} />,
  }
  if (clickHandler) wrapProps.onClick = clickHandler
  else if (href) wrapProps.href = href

  const Component = clickHandler ? ChoiceButton : ChoiceLink

  return <Component {...wrapProps}></Component>
}

export const CuratedSetCandidate = ({ set, design, requiredMeasies = [], href }) => {
  const { t, i18n } = useTranslation(['sets'])
  const { language } = i18n

  const setProps = { set, design, t, language, href }

  // Quick check for required measurements
  if (!set.measies || Object.keys(set.measies).length < requiredMeasies.length)
    return <CuratedSetLacksMeasies {...setProps} />

  // Proper check for required measurements
  for (const m of requiredMeasies) {
    if (!Object.keys(set.measies).includes(m)) return <CuratedSetLacksMeasies {...setProps} />
  }

  return <CuratedSetSummary {...setProps} />
}
