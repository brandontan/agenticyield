import TopBar from "@/components/top-bar"
import { Card } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <TopBar />

      <div className="container mx-auto px-4 py-6 md:py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Card className="p-6">
          <p className="text-muted-foreground">
            Basic settings coming soon. For now, use the controls on the Earn page.
          </p>
        </Card>
      </div>
    </div>
  )
}
