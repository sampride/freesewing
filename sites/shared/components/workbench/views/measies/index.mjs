import { ns as authNs } from 'shared/components/wrappers/auth/index.mjs'
import { SetPicker, ns as setsNs } from 'shared/components/sets/set-picker.mjs'
import { Tabs, Tab } from 'shared/components/mdx/tabs.mjs'
import { MeasiesEditor } from './editor.mjs'
import { useTranslation } from 'next-i18next'
import { useToast } from 'shared/hooks/use-toast.mjs'

export const ns = ['wbmeasies', ...authNs, setsNs]

const tabNames = ['editCurrent', 'chooseNew']
export const MeasiesView = ({ design, Design, settings, update }) => {
  const { t } = useTranslation(['wbmeasies'])
  const toast = useToast()

  const tabs = tabNames.map((n) => t(n)).join(',')

  const loadMeasurements = (set) => {
    update.settings([
      [['measurements'], designMeasurements(Design, set.measies)],
      [['units'], set.imperial ? 'imperial' : 'metric'],
    ])
    setView('draft')
    toast.success(t('updatedMeasurements'))
  }

  return (
    <div className="m-6">
      <h1 className="max-w-6xl m-auto text-center"> {t('changeMeasies')}</h1>
      <Tabs tabs={tabs}>
        <Tab key="edit">
          <MeasiesEditor {...{ Design, settings, update }} />
        </Tab>
        <Tab key="choose">
          <SetPicker design={design} />
        </Tab>
      </Tabs>
    </div>
  )
}
