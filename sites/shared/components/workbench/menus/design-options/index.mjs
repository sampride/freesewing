// Hooks
import { useContext, useState } from 'react'
import { useTranslation } from 'next-i18next'
// Context
import { ModalContext } from 'shared/context/modal-context.mjs'
// Components
import { ModalWrapper } from 'shared/components/wrappers/modal.mjs'
import { Collapse } from 'shared/components/collapse.mjs'
import { OptionsIcon, ClearIcon, HelpIcon, EditIcon } from 'shared/components/icons.mjs'
import { optionsMenuStructure } from 'shared/utils.mjs'
import { optionType } from 'shared/utils.mjs'
import {
  BoolOptionInput,
  ConstantOptionInput,
  CountOptionInput,
  DegOptionInput,
  ListOptionInput,
  MmOptionInput,
  PctOptionInput,
} from './inputs.mjs'
import {
  BoolOptionValue,
  ConstantOptionValue,
  CountOptionValue,
  DegOptionValue,
  ListOptionValue,
  MmOptionValue,
  PctOptionValue,
} from './values.mjs'

export const ns = ['design-options']

// Facilitate lookup of the input component
const inputs = {
  bool: BoolOptionInput,
  constant: ConstantOptionInput,
  count: CountOptionInput,
  deg: DegOptionInput,
  list: ListOptionInput,
  mm: MmOptionInput,
  pct: PctOptionInput,
}

// Facilitate lookup of the value component
const values = {
  bool: BoolOptionValue,
  constant: ConstantOptionValue,
  count: CountOptionValue,
  deg: DegOptionValue,
  list: ListOptionValue,
  mm: MmOptionValue,
  pct: PctOptionValue,
}

// Emojis for option groups :)
const emojis = {
  advanced: '🤓',
  fit: '👕',
  style: '💃🏽',
  dflt: '🕹️',
  groupDflt: '📁',
}

const GroupTitle = ({ group, t, open = false }) => (
  <div className={`flex flex-row gap-1 items-center w-full ${open ? '' : 'justify-between'}`}>
    <span className="font-medium">
      <span role="img" className="pr-2">
        {emojis[group] ? emojis[group] : emojis.groupDflt}
      </span>
      {t(`design-options:${group}.t`)}
      {open ? ':' : ''}
    </span>
    <OptionsIcon className="w-6 h-6 text-primary" />
  </div>
)

const ClearButton = ({ update, name, open }) => (
  <button
    className={`btn btn-accent ${open ? 'btn-xs px-0' : ''}`}
    onClick={(evt) => {
      evt.stopPropagation()
      update.settings(['options', name])
    }}
  >
    <ClearIcon />
  </button>
)

export const DesignOption = ({
  design,
  name,
  current,
  config,
  settings,
  update,
  t,
  loadDocs,
  changed = false,
}) => {
  const [override, setOverride] = useState(false)
  const type = optionType(config)
  const Input = inputs[type]
  const Value = values[type]

  // Hide option?
  if (config?.hide || (typeof config?.hide === 'function' && config.hide(settings))) return null

  if (type === 'bool') {
    config = {
      ...config,
      list: [0, 1],
      choiceTitles: {
        0: `${name}No`,
        1: `${name}Yes`,
      },
      valueTitles: {
        0: 'no',
        1: 'yes',
      },
      dflt: config.dflt ? 1 : 0,
    }
  }

  const buttons = []
  const openButtons = []
  if (loadDocs)
    openButtons.push(
      <button className="btn btn-xs btn-ghost px-0" onClick={(evt) => loadDocs(evt, name)}>
        <HelpIcon className="w-4 h-4" />
      </button>
    )
  if (['pct', 'count', 'deg'].includes(type))
    openButtons.push(
      <button
        className="btn btn-xs btn-ghost px-0"
        onClick={(evt) => {
          evt.stopPropagation()
          setOverride(!override)
        }}
      >
        <EditIcon className={`w-6 h-6 ${override ? 'bg-base-100 text-accent rounded' : ''}`} />
      </button>
    )
  if (changed) {
    buttons.push(<ClearButton {...{ update, name }} />)
    openButtons.push(<ClearButton {...{ update, name }} open />)
  }

  return (
    <Collapse
      color={changed ? 'accent' : 'secondary'}
      title={
        <div className="w-full flex flex-row gap2 items-center justify-between">
          <span className="font-bold">{t(`${name}.t`)}</span>
          <Value {...{ t, name, config, current, design, settings }} />
        </div>
      }
      openTitle={t(`${name}.t`)}
      {...{ buttons, openButtons }}
    >
      <Input {...{ t, name, config, settings, current, design, update, override }} />
    </Collapse>
  )
}

export const DesignOptionGroup = ({
  design,
  patternConfig,
  settings,
  update,
  group,
  options,
  Option,
  t,
  loadDocs,
  topLevel = false,
}) => (
  <Collapse
    bottom
    color={topLevel ? 'primary' : 'secondary'}
    title={<GroupTitle {...{ group, t }} />}
    openTitle={t(group)}
  >
    {Object.entries(options).map(([option, type]) =>
      typeof type === 'string' ? (
        <Option
          {...{ t, design, update, settings, loadDocs }}
          key={option}
          name={option}
          settings={settings}
          current={settings.options?.[option]}
          config={patternConfig.options[option]}
          changed={wasChanged(settings.options?.[option], patternConfig.options[option])}
        />
      ) : (
        <DesignOptionGroup
          {...{ design, patternConfig, settings, update, Option, t, loadDocs }}
          group={option}
          options={type}
          key={option}
        />
      )
    )}
  </Collapse>
)

const wasChanged = (current, config) => {
  if (typeof current === 'undefined') return false
  if (current === config.dflt) return false

  return true
}

export const DesignOptions = ({
  design,
  patternConfig,
  settings,
  update,
  language,
  Option = false,
  DynamicDocs = false,
  control,
}) => {
  const { t } = useTranslation([design])
  const { setModal } = useContext(ModalContext)

  // FIXME: Do we still care about passing in an Option component?
  if (!Option) Option = DesignOption
  const optionsMenu = optionsMenuStructure(patternConfig.options)

  const loadDocs = DynamicDocs
    ? (evt, option = false) => {
        evt.stopPropagation()
        setModal(
          <ModalWrapper>
            <div className="max-w-prose">
              <DynamicDocs
                path={`patterns/${design}/options/${option.toLowerCase()}`}
                language={language}
              />
            </div>
          </ModalWrapper>
        )
      }
    : false

  return (
    <>
      <div className="px-2 mt-8">
        {control > 4 ? null : (
          <>
            <h5 className="flex flex-row gap-2 items-center">
              <OptionsIcon />
              <span>{t('design-options:designOptions')}</span>
            </h5>
            <p>{t('design-options:designOptions.d')}</p>
          </>
        )}
      </div>
      {Object.entries(optionsMenu).map(([group, option]) =>
        typeof option === 'string' ? (
          <Option
            {...{ t, design, update, settings, loadDocs }}
            key={group}
            name={group}
            current={settings.options?.[group]}
            config={patternConfig.options[group]}
            changed={wasChanged(settings.option?.[group], patternConfig.options[group])}
          />
        ) : (
          <DesignOptionGroup
            {...{ design, patternConfig, settings, update, group, Option, t, loadDocs }}
            options={option}
            key={group}
            topLevel
          />
        )
      )}
    </>
  )
}
