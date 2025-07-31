"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useWeb3 } from "./web3-provider"
import { useToast } from "@/hooks/use-toast"

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

interface DonateModalProps {
  isOpen: boolean
  onClose: () => void
  donation: Donation
}

export function DonateModal({ isOpen, onClose, donation }: DonateModalProps) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { isConnected, connectWallet } = useWeb3()
  const { toast } = useToast()

  const handleDonate = async () => {
    if (!isConnected) {
      await connectWallet()
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate donation transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Donation Successful!",
        description: `Thank you for donating ${amount} ETH to ${donation.title}`,
      })

      setAmount("")
      onClose()
    } catch (error) {
      toast({
        title: "Donation Failed",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const quickAmounts = ["0.1", "0.5", "1.0", "2.0"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Donate to Campaign</DialogTitle>
          <DialogDescription>{donation.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Donation Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Quick Select</Label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {quickAmounts.map((quickAmount) => (
                <Button key={quickAmount} variant="outline" size="sm" onClick={() => setAmount(quickAmount)}>
                  {quickAmount} ETH
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <div className="flex justify-between">
              <span>Donation:</span>
              <span>{amount || "0"} ETH</span>
            </div>
            <div className="flex justify-between">
              <span>Gas Fee (est.):</span>
              <span>~0.002 ETH</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-1 mt-1">
              <span>Total:</span>
              <span>{amount ? (Number.parseFloat(amount) + 0.002).toFixed(3) : "0.002"} ETH</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleDonate} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
            {isLoading ? "Processing..." : isConnected ? "Donate" : "Connect Wallet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
