import { useContext } from 'react'
import { PanZoomContext } from 'shared/components/workbench/pattern/pan-zoom-context.mjs'
import { useTranslation } from 'next-i18next'
import {
  PaperlessIcon,
  SaIcon,
  RocketIcon,
  BulletIcon,
  UnitsIcon,
  DetailIcon,
  IconWrapper,
  ClearIcon,
} from 'shared/components/icons.mjs'

export const ns = ['common']

const ZoomInIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
  </IconWrapper>
)

const ZoomOutIcon = (props) => (
  <IconWrapper {...props}>
    <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
  </IconWrapper>
)

const IconButton = ({ Icon, onClick, dflt = true, title, hide = false }) => (
  <button
    onClick={onClick}
    className={`text-${dflt ? 'neutral-content' : 'accent'} hover:text-secondary-focus ${
      hide ? 'invisible' : ''
    }`}
    title={title}
  >
    <Icon />
  </button>
)

const ZoomButtons = ({ t }) => {
  const { zoomFunctions, zoomed } = useContext(PanZoomContext)

  if (!zoomFunctions) return null
  return (
    <div className="flex flex-row content-center gap-4">
      <IconButton
        Icon={ClearIcon}
        onClick={zoomFunctions.reset}
        title={t('resetZoom')}
        hide={!zoomed}
      />
      <IconButton
        Icon={ZoomOutIcon}
        onClick={() => zoomFunctions.zoomOut()}
        title={t('zoomOut')}
        dflt
      />
      <IconButton
        Icon={ZoomInIcon}
        onClick={() => zoomFunctions.zoomIn()}
        title={t('zoomIn')}
        dflt
      />
    </div>
  )
}

const Spacer = () => <span className="opacity-50">|</span>

export const ViewHeader = ({ update, settings, ui, control }) => {
  const { t } = useTranslation(ns)
  return (
    <div className="flex flex-row gap-4 py-4 mt-2 pt-4 w-full bg-neutral text-neutral-content items-center justify-center">
      <ZoomButtons t={t} />
      <Spacer />
      <div className="flex flex-row items-center gap-4">
        <IconButton
          Icon={SaIcon}
          dflt={settings.sabool ? false : true}
          onClick={() => update.toggleSa()}
        />
        <IconButton
          Icon={PaperlessIcon}
          dflt={settings.paperless ? false : true}
          onClick={() => update.settings(['paperless'], !settings.paperless)}
        />
        <IconButton
          Icon={DetailIcon}
          dflt={settings.complete}
          onClick={() =>
            update.settings(
              ['complete'],
              typeof settings.complete === 'undefined' ? 0 : settings.complete ? 0 : 1
            )
          }
        />
        <IconButton
          Icon={
            settings.units !== 'imperial'
              ? UnitsIcon
              : ({ className }) => <UnitsIcon className={`${className} rotate-180 w-6 h-6`} />
          }
          dflt={settings.units !== 'imperial'}
          onClick={() =>
            update.settings(['units'], settings.units === 'imperial' ? 'metric' : 'imperial')
          }
        />
      </div>
      <Spacer />
      <div className="flex flex-row items-center">
        {[1, 2, 3, 4, 5].map((score) => (
          <button onClick={() => update.setControl(score)} className="text-primary" key={score}>
            <BulletIcon fill={control >= score ? true : false} />
          </button>
        ))}
      </div>
      <Spacer />
      <div className="flex flex-row items-center gap-4">
        <IconButton
          Icon={RocketIcon}
          dflt={ui.renderer !== 'svg'}
          onClick={() => update.ui(['renderer'], ui.renderer === 'react' ? 'svg' : 'react')}
        />
      </div>
    </div>
  )
}
