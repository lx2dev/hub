import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-medium text-2xl">
          Welcome to the Lx2 Hub
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        Lx2 Hub is a centralized platform for support-oriented inquiries
        regarding Lx2 community services, including the Lx2 Discord server, Lx2
        websites, and public GitHub repositories. We&apos;ll do our best to
        respond to you as quickly as possible!
      </CardContent>
    </Card>
  )
}
