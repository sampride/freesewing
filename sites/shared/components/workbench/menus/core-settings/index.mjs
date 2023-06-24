//Dependencies
import { loadSettingsConfig, defaultSamm } from './config.mjs'
// Components
import { SettingsIcon, TrashIcon } from 'shared/components/icons.mjs'
import { WorkbenchMenu } from '../shared/index.mjs'
import { MenuItem } from '../shared/menu-item.mjs'
// input components and event handlers
import { inputs, handlers } from './inputs.mjs'
// values
import { values } from './values.mjs'

import { useTranslation } from 'next-i18next'

export const ns = ['core-settings', 'modal']

/** A wrapper for {@see MenuItem} to handle core settings-specific business */
const CoreSetting = ({ name, config, control, updateFunc, current, passProps, ...rest }) => {
  // is toggling allowed?
  const allowToggle = control > 3 && config.list?.length === 2

  const handlerArgs = {
    updateFunc,
    current,
    config,
    ...passProps,
  }
  // get the appropriate event handler if there is one
  const handler = handlers[name] ? handlers[name](handlerArgs) : updateFunc

  return (
    <MenuItem
      {...{
        name,
        config,
        control,
        current,
        passProps,
        ...rest,
        allowToggle,
        updateFunc: handler,
      }}
    />
  )
}

export const ClearAllButton = ({ setSettings, compact = false }) => {
  const { t } = useTranslation('core-settings')
  return (
    <div className={`${compact ? '' : 'text-center mt-8'}`}>
      <button
        className={`justify-self-center btn btn-error btn-outline ${compact ? 'btn-sm' : ''}`}
        onClick={() => setSettings({})}
      >
        <TrashIcon />
        {t('clearSettings')}
      </button>
    </div>
  )
}

/**
 * The core settings menu
 * @param  {Object} options.update        settings and ui update functions
 * @param  {Object} options.settings      core settings
 * @param  {Object} options.patternConfig the configuration from the pattern
 * @param  {String} options.language      the menu language
 * @param  {Object} options.account       the user account data
 * @param  {Boolean|React.Com options.DynamicDocs   A docs component
 */
export const CoreSettings = ({
  update,
  settings,
  patternConfig,
  language,
  account,
  DynamicDocs,
}) => {
  const settingsConfig = loadSettingsConfig({
    language,
    units: settings.units,
    sabool: settings.sabool,
    parts: patternConfig.draftOrder,
  })

  const passProps = {
    samm: typeof settings.samm === 'undefined' ? defaultSamm(settings.units) : settings.samm,
    units: settings.units,
  }

  return (
    <>
      <div className="px-2">
        {control > 4 ? (
          <div className="border-t border-solid border-base-300 mx-36"></div>
        ) : (
          <>
            <h5 className="flex flex-row gap-2 items-center">
              <SettingsIcon />
              <span>{t('core-settings:coreSettings')}</span>
            </h5>
            <p>{t('core-settings:coreSettings.d')}</p>
          </>
        )}
      </div>
      {Object.keys(settingsConfig)
        .filter((name) => settingsConfig[name].control <= control)
        .map((name) => (
          <Setting
            key={name}
            {...{ name, design, update, t, patternConfig, loadDocs, control }}
            config={settingsConfig[name]}
            current={settings[name]}
            changed={wasChanged(settings[name], name, settingsConfig)}
            samm={typeof settings.samm === 'undefined' ? settingsConfig.samm.dflt : settings.samm}
            units={settings.units}
          />
        ))}
    </>
  )
}
