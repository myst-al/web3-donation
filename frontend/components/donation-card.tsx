"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, User } from "lucide-react"
import Image from "next/image"
import { DonateModal } from "./donate-modal"
import { useState } from "react"

interface Donation {
  id: string
  title: string
  description: string
  image: string
  raised: string
  goal: string
  contributors: number
  daysLeft: number
  creator: string
}

interface DonationCardProps {
  donation: Donation
}

export function DonationCard({ donation }: DonationCardProps) {
  const [showDonateModal, setShowDonateModal] = useState(false)
  const progressPercentage = (Number.parseFloat(donation.raised) / Number.parseFloat(donation.goal)) * 100

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="relative">
            <Image
              src={donation.image || "/placeholder.svg"}
              alt={donation.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <Badge className="absolute top-2 right-2 bg-white/90 text-gray-900" variant="secondary">
              {donation.daysLeft} days left
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{donation.title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{donation.description}</p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{donation.raised} ETH raised</span>
                <span className="text-gray-500">of {donation.goal} ETH</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{donation.contributors} contributors</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{donation.daysLeft} days left</span>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>by {donation.creator}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setShowDonateModal(true)}>
            Donate Now
          </Button>
        </CardFooter>
      </Card>

      <DonateModal isOpen={showDonateModal} onClose={() => setShowDonateModal(false)} donation={donation} />
    </>
  )
}
