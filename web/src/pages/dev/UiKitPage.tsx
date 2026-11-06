// Dev-only page (/dev/ui) for eyeballing the UI primitives against the design.
import { useState } from 'react'
import { CalendarDays, UserPlus } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Logo } from '../../components/ui/Logo'
import { SegmentedTabs } from '../../components/ui/SegmentedTabs'
import { StatusChip } from '../../components/ui/StatusChip'
import { statusStyles, type DisplayStatus } from '../../components/ui/status'

const allStatuses = Object.keys(statusStyles) as DisplayStatus[]

type RequestTab = 'pending' | 'approved' | 'rejected' | 'all'

export function UiKitPage() {
  const [tab, setTab] = useState<RequestTab>('pending')

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-10 py-9">
      <div className="flex items-end justify-between gap-6">
        <div>
          <Logo />
          <p className="mt-4 text-sm font-semibold text-syllo-muted">UI primitives</p>
          <h1 className="font-display text-[40px] leading-[1.1] font-medium">Component check</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={CalendarDays}>
            Open calendar
          </Button>
          <Button icon={UserPlus}>Assign a student</Button>
        </div>
      </div>

      <Card>
        <h2 className="mb-4 font-display text-[22px] font-medium">Status chips</h2>
        <div className="flex flex-wrap gap-2">
          {allStatuses.map((s) => (
            <StatusChip key={s} status={s} />
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 font-display text-[22px] font-medium">Segmented tabs</h2>
        <SegmentedTabs
          label="Request status"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'pending', label: 'Pending Â· 4' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'all', label: 'All history' },
          ]}
        />
        <p className="mt-3 text-sm text-syllo-muted">Selected: {tab}</p>
      </Card>

      <div className="grid grid-cols-3 gap-5">
        <Card shape="tile" className="bg-scheduled-soft! text-scheduled-ink">
          <p className="text-sm">Today's lessons</p>
          <p className="font-display text-4xl font-medium">18</p>
        </Card>
        <Card variant="tint">
          <p className="text-sm text-syllo-muted">Tinted panel</p>
        </Card>
        <Card variant="dark" shape="tile">
          <p className="text-sm font-semibold">Revenue, November so far</p>
          <p className="font-display text-4xl font-medium">EGP 61,200</p>
        </Card>
      </div>
    </main>
  )
}

