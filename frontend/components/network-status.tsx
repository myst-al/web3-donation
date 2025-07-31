"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Network } from "lucide-react"
import { useWeb3 } from "./web3-provider"
import { useEffect, useState } from "react"

export function NetworkStatus() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render on server or before mounting
  if (!mounted) {
    return null
  }

  return <NetworkStatusContent />
}

function NetworkStatusContent() {
  const { isConnected, network, chainId, switchToLisk } = useWeb3()

  if (!isConnected) {
    return null
  }

  const isLiskNetwork = chainId === 4202

  if (isLiskNetwork) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Connected to Lisk Sepolia network. You're ready to interact with donation campaigns!
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between text-orange-800">
        <span>You're connected to {network}. Switch to Lisk Sepolia for full functionality.</span>
        <Button
          variant="outline"
          size="sm"
          onClick={switchToLisk}
          className="ml-4 border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
        >
          <Network className="h-4 w-4 mr-1" />
          Switch to Lisk
        </Button>
      </AlertDescription>
    </Alert>
  )
}
