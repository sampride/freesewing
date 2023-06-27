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
      <h1 className="max-w-6xl m-auto text-center">{t('measurements')}</h1>
      {missingMeasurements ? (
        <Popout note>
          <h5>{t('weLackSomeMeasies')}:</h5>
          <ul className="list list-inside list-disc ml-4">
            {missingMeasurements.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <p>
            <b>{t('youCanPickOrEnter')}</b>
          </p>
        </Popout>
      ) : (
        <Popout tip>
          <h5>{t('measiesOk')}</h5>
        </Popout>
      )}
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
