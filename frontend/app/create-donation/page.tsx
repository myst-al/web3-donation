"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NetworkStatus } from "@/components/network-status"
import { useState } from "react"
import { useWeb3 } from "@/components/web3-provider"
import { useToast } from "@/hooks/use-toast"
import { Upload, ImageIcon } from "lucide-react"

export default function CreateDonationPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    duration: "",
    category: "",
    image: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { isConnected, chainId, connectWallet, switchToLisk } = useWeb3()
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      await connectWallet()
      return
    }

    if (chainId !== 4202) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Lisk Sepolia network to create a campaign",
        variant: "destructive",
      })
      await switchToLisk()
      return
    }

    if (!formData.title || !formData.description || !formData.goal) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate campaign creation on Lisk
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Campaign Created on Lisk!",
        description: "Your donation campaign has been successfully created and deployed to the Lisk blockchain.",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        goal: "",
        duration: "",
        category: "",
        image: "",
      })
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "There was an error creating your campaign. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Network Status */}
      <div className="mb-8">
        <NetworkStatus />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Create Donation Campaign on Lisk</h1>
        <p className="text-xl text-gray-600">Launch your transparent, blockchain-based fundraising campaign on Lisk</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>
            Fill in the information below to create your donation campaign on Lisk Sepolia
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Campaign Title *</Label>
              <Input
                id="title"
                placeholder="Enter a compelling title for your campaign"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="mt-1"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your cause, goals, and how donations will be used..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="mt-1 min-h-[120px]"
                required
              />
            </div>

            {/* Goal and Duration */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal">Funding Goal (ETH) *</Label>
                <Input
                  id="goal"
                  type="number"
                  step="0.01"
                  min="0.1"
                  placeholder="10.0"
                  value={formData.goal}
                  onChange={(e) => handleInputChange("goal", e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration">Campaign Duration</Label>
                <Select onValueChange={(value) => handleInputChange("duration", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="disaster-relief">Disaster Relief</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Upload */}
            <div>
              <Label>Campaign Image</Label>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-sm text-gray-600 mb-2">Upload an image to represent your campaign</div>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </div>

            {/* Lisk Smart Contract Info */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">Lisk Blockchain Features</h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Fast and low-cost transactions on Lisk network</li>
                <li>• Transparent tracking of all donations</li>
                <li>• Automatic fund distribution when goal is reached</li>
                <li>• Immutable campaign terms on Lisk blockchain</li>
                <li>• Built-in refund mechanism if goal is not met</li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading || (isConnected && chainId !== 4202)}
              size="lg"
            >
              {isLoading
                ? "Creating Campaign on Lisk..."
                : !isConnected
                  ? "Connect Wallet to Create"
                  : chainId !== 4202
                    ? "Switch to Lisk Network"
                    : "Create Campaign on Lisk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
