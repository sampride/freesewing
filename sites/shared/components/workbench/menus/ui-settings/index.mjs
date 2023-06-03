//Dependencies
import { loadSettingsConfig } from './config.mjs'
// Components
import { WorkbenchMenu } from '../shared/index.mjs'
import { MenuItem } from '../shared/menu-item.mjs'
import { DesktopIcon } from 'shared/components/icons.mjs'
import { inputs } from './inputs.mjs'
import { values } from './values.mjs'

export const ns = ['ui-settings']

// Facilitate lookup of the value component
const values = {
  control: ControlSettingValue,
  renderer: RendererSettingValue,
  inspect: InspectSettingValue,
}

// Facilitate lookup of the input component
const inputs = {
  control: ControlSettingInput,
  renderer: RendererSettingInput,
  inspect: InspectSettingInput,
}

const wasChanged = (current, name, settingsConfig) => {
  if (typeof current === 'undefined') return false
  if (current === settingsConfig[name].dflt) return false

  return true
}

export const UiTitle = ({ name, t, current = null, open = false, emoji = '' }) => (
  <div className={`flex flex-row gap-1 items-center w-full ${open ? '' : 'justify-between'}`}>
    <span className="font-medium">
      <span role="img" className="pr-2">
        {emoji}
      </span>
      {t(`ui-settings:${name}.t`)}
      {open ? ':' : ''}
    </span>
    <span className="font-bold">{current}</span>
  </div>
)

export const Setting = ({ name, config, current, update, t, changed, loadDocs, control, ui }) => {
  const drillProps = { name, config, current, update, t, changed, control }

  // Don't bother with inspect in SVG mode
  if (name === 'inspect' && ui.renderer === 'svg') return null

  const Input = inputs[name]
  const Value = values[name]

  const buttons = []
  const openButtons = []
  if (loadDocs)
    openButtons.push(
      <button
        className="btn btn-xs btn-ghost px-0"
        key="help"
        onClick={(evt) => loadDocs(evt, name)}
      >
        <HelpIcon className="w-4 h-4" />
      </button>
    )
  if (changed) {
    buttons.push(
      <button
        className="btn btn-accent"
        key="clear"
        onClick={(evt) => {
          evt.stopPropagation()
          update.ui([name], config.dflt)
        }}
      >
        <ClearIcon />
      </button>
    )
    openButtons.push(
      <button
        className="btn btn-ghost btn-xs px-0"
        key="clear"
        onClick={(evt) => {
          evt.stopPropagation()
          update.ui([name], config.dflt)
        }}
      >
        <ClearIcon />
      </button>
    )
  }

  const titleProps = { name, t, current: <Value {...drillProps} />, emoji: config.emoji }

  if (control > 4) {
    // Save gurus some clicks
    const onClick = {
      renderer: () => (current === 'svg' ? update.ui([name]) : update.ui([name], 'svg')),
      inspect: () => (current === 1 ? update.ui([name]) : update.ui([name], 1)),
    }
    if (['renderer', 'inspect'].includes(name))
      return (
        <Collapse
          color={changed ? 'accent' : 'primary'}
          title={<UiTitle {...titleProps} />}
          onClick={onClick[name]}
        />
      )
  }

  return (
    <Collapse
      color={changed ? 'accent' : 'primary'}
      openTitle={<UiTitle open {...titleProps} />}
      title={<UiTitle {...titleProps} />}
      buttons={buttons}
      openButtons={openButtons}
    >
      <Input {...drillProps} />
    </Collapse>
  )
}

export const UiSettings = ({ design, update, settings, ui, control, language, DynamicDocs }) => {
  const settingsConfig = loadSettingsConfig(ui)

  return (
    <>
      <div className="px-2">
        {control > 4 ? (
          <div className="border-t border-solid border-base-300 mx-36"></div>
        ) : (
          <>
            <h5 className="flex flex-row gap-2 items-center">
              <DesktopIcon />
              <span>{t('ui-settings:uiSettings')}</span>
            </h5>
            <p>{t('ui-settings:uiSettings.d')}</p>
          </>
        )}
      </div>
      {Object.keys(settingsConfig)
        .filter((name) => settingsConfig[name].control <= control)
        .map((name) => (
          <Setting
            key={name}
            {...{ name, design, update, t, loadDocs, control, ui }}
            config={settingsConfig[name]}
            current={ui[name]}
            changed={wasChanged(ui[name], name, settingsConfig)}
          />
        ))}
    </>
  )
}
