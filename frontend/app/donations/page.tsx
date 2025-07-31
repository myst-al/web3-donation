import { DonationCard } from "@/components/donation-card"
import { NetworkStatus } from "@/components/network-status"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Mock data for demonstration
const mockDonations = [
  {
    id: "1",
    title: "Help Build Schools in Rural Areas",
    description: "Supporting education infrastructure in underserved communities across developing nations.",
    image: "/placeholder.svg?height=200&width=400",
    raised: "45.5",
    goal: "100",
    contributors: 234,
    daysLeft: 15,
    creator: "0x1234...5678",
  },
  {
    id: "2",
    title: "Clean Water Initiative",
    description: "Providing clean drinking water access to communities in need through sustainable technology.",
    image: "/placeholder.svg?height=200&width=400",
    raised: "78.2",
    goal: "150",
    contributors: 456,
    daysLeft: 8,
    creator: "0x9876...5432",
  },
  {
    id: "3",
    title: "Wildlife Conservation Project",
    description: "Protecting endangered species and their habitats through community-based conservation efforts.",
    image: "/placeholder.svg?height=200&width=400",
    raised: "32.1",
    goal: "75",
    contributors: 189,
    daysLeft: 22,
    creator: "0x5555...7777",
  },
  {
    id: "4",
    title: "Medical Equipment for Hospitals",
    description: "Funding critical medical equipment for hospitals in low-income regions.",
    image: "/placeholder.svg?height=200&width=400",
    raised: "91.8",
    goal: "120",
    contributors: 678,
    daysLeft: 5,
    creator: "0x3333...9999",
  },
  {
    id: "5",
    title: "Disaster Relief Fund",
    description: "Emergency aid for communities affected by natural disasters and humanitarian crises.",
    image: "/placeholder.svg?height=200&width=400",
    raised: "156.7",
    goal: "200",
    contributors: 892,
    daysLeft: 12,
    creator: "0x7777...1111",
  },
  {
    id: "6",
    title: "Tech Education for Youth",
    description: "Providing coding and technology education to underserved youth communities.",
    image: "/placeholder.svg?height=200&width=400",
    raised: "23.4",
    goal: "60",
    contributors: 145,
    daysLeft: 30,
    creator: "0x2222...8888",
  },
]

export default function DonationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Network Status */}
      <div className="mb-8">
        <NetworkStatus />
      </div>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Active Donation Campaigns on Lisk</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover and support meaningful causes making a real difference in the world
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search campaigns..." className="pl-10" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">All Categories</Button>
            <Button variant="outline">Most Funded</Button>
            <Button variant="outline">Ending Soon</Button>
          </div>
        </div>
      </div>

      {/* Donation Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDonations.map((donation) => (
          <DonationCard key={donation.id} donation={donation} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <Button size="lg" variant="outline">
          Load More Campaigns
        </Button>
      </div>
    </div>
  )
}
