// Hooks
import { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'next-i18next'
// Context
import { ModalContext } from 'shared/context/modal-context.mjs'
import { LoadingContext } from 'shared/context/loading-context.mjs'
// Components
import {
  CommunityIcon,
  DesignIcon,
  DocsIcon,
  MenuIcon,
  RssIcon,
  SearchIcon,
  ShowcaseIcon,
  UserIcon,
  ThemeIcon,
  I18nIcon,
  MeasureIcon,
  PageIcon,
} from 'shared/components/icons.mjs'
import { Ribbon } from 'shared/components/ribbon.mjs'
import Link from 'next/link'
import { ModalThemePicker, ns as themeNs } from 'shared/components/modal/theme-picker.mjs'
import { ModalLocalePicker, ns as localeNs } from 'shared/components/modal/locale-picker.mjs'
import { ModalMenu } from 'site/components/navigation/modal-menu.mjs'

export const ns = ['header', 'sections', ...themeNs, ...localeNs]

const NavButton = ({ href, label, color, children, onClick = false, extraClasses = '' }) => {
  const className =
    'border-0 px-1 lg:px-4 text-base py-3 lg:py-4 text-center flex flex-col items-center 2xl:w-36 ' +
    `hover:bg-${color}-400 text-${color}-400 hover:text-neutral grow lg:grow-0 ${extraClasses}`
  const span = <span className="block font-bold hidden 2xl:block">{label}</span>

  return onClick ? (
    <button {...{ onClick, className }} title={label}>
      {children}
      {span}
    </button>
  ) : (
    <Link {...{ href, className }} title={label}>
      {children}
      {span}
    </Link>
  )
}

const NavSpacer = () => (
  <div className="hidden lg:block text-base lg:text-4xl font-thin opacity-30 px-0.5 lg:px-2">|</div>
)

export const colors = {
  menu: 'red',
  designs: 'orange',
  patterns: 'yellow',
  sets: 'lime',
  showcase: 'green',
  docs: 'cyan',
  theme: 'blue',
  language: 'indigo',
  search: 'violet',
  account: 'purple',
}

const NavIcons = ({ setModal, setSearch }) => {
  const { t } = useTranslation(['header'])
  const iconSize = 'h-6 w-6 lg:h-12 lg:w-12'

  return (
    <>
      <NavButton
        onClick={() => setModal(<ModalMenu />)}
        label={t('header:menu')}
        color={colors.menu}
      >
        <MenuIcon className={iconSize} />
      </NavButton>
      <NavSpacer />
      <NavButton href="/designs" label={t('header:designs')} color={colors.designs}>
        <DesignIcon className={iconSize} />
      </NavButton>
      <NavButton
        href="/patterns"
        label={t('header:patterns')}
        color={colors.patterns}
        extraClasses="hidden lg:flex"
      >
        <PageIcon className={iconSize} />
      </NavButton>
      <NavButton
        href="/sets"
        label={t('header:sets')}
        color={colors.sets}
        extraClasses="hidden lg:flex"
      >
        <MeasureIcon className={iconSize} />
      </NavButton>
      <NavButton
        href="/showcase"
        label={t('header:showcase')}
        color={colors.showcase}
        extraClasses="hidden lg:flex"
      >
        <ShowcaseIcon className={iconSize} />
      </NavButton>
      <NavButton
        href="/docs"
        label={t('header:docs')}
        color={colors.docs}
        extraClasses="hidden lg:flex"
      >
        <DocsIcon className={iconSize} />
      </NavButton>
      <NavSpacer />
      <NavButton
        onClick={() => setModal(<ModalThemePicker />)}
        label={t('header:theme')}
        color={colors.theme}
      >
        <ThemeIcon className={iconSize} />
      </NavButton>
      <NavButton
        onClick={() => setModal(<ModalLocalePicker />)}
        label={t('header:language')}
        color={colors.language}
      >
        <I18nIcon className={iconSize} />
      </NavButton>
      <NavButton onClick={() => setSearch(true)} label={t('header:search')} color={colors.search}>
        <SearchIcon className={iconSize} />
      </NavButton>
      <NavSpacer />
      <NavButton href="/account" label={t('header:account')} color={colors.account}>
        <UserIcon className={iconSize} />
      </NavButton>
    </>
  )
}

export const Header = ({ setSearch }) => {
  const { setModal } = useContext(ModalContext)
  const { loading } = useContext(LoadingContext)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        const curScrollPos = typeof window !== 'undefined' ? window.pageYOffset : 0
        if (curScrollPos >= prevScrollPos) {
          if (show && curScrollPos > 20) setShow(false)
        } else setShow(true)
        setPrevScrollPos(curScrollPos)
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [prevScrollPos, show])

  return (
    <header
      className={`
      fixed bottom-0 lg:bottom-auto lg:top-0 left-0
      bg-neutral
      w-full
      z-30
      transition-transform
      ${show || loading ? '' : 'fixed bottom-0 lg:top-0 left-0 translate-y-36 lg:-translate-y-36'}
      drop-shadow-xl
    `}
    >
      <div className="m-auto md:px-8">
        <div className="p-0 flex flex-row gap-2 justify-between text-neutral-content items-center">
          {/* Non-mobile content */}
          <div className="hidden lg:flex lg:px-2 flex-row items-center justify-center w-full">
            <NavIcons setModal={setModal} setSearch={setSearch} />
          </div>

          {/* Mobile content */}
          <div className="flex lg:hidden flex-row items-center justify-between w-full">
            <NavIcons setModal={setModal} setSearch={setSearch} />
          </div>
        </div>
      </div>
      <Ribbon />
    </header>
  )
}
