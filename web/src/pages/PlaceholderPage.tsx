import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/layout/PageHeader'

/** Stand-in until each screen is built. */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Coming soon" title={title} />
      <Card variant="tint">
        <p className="text-syllo-muted">This screen hasn't been built yet.</p>
      </Card>
    </div>
  )
}
