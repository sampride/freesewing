import { MainSections, ActiveSection, ns as navNs } from './primary.mjs'

export const ns = navNs

export const AsideNavigation = ({ mobileOnly = false, before = [], after = [] }) => (
  <aside
    className={`
    hidden lg:block
    fixed top-0 right-0 h-screen
    overflow-y-auto z-20
    bg-base-100 text-base-content
    px-0 pb-20 pt-8 shrink-0

    lg:w-auto
    lg:sticky lg:relative lg:transform-none
    lg:justify-center
    lg:bg-base-300 lg:bg-opacity-10
    lg:pt-16
    ${mobileOnly ? 'block lg:hidden w-full ' : ''}
  `}
  >
    <div className="w-screen lg:w-auto">
      {before}
      <MainSections />
      <div className="mt-4 pt-4">
        <ActiveSection />
      </div>
      {after}
    </div>
  </aside>
)
