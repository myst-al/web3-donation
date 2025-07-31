"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, LogOut, Network } from "lucide-react"
import { useWeb3 } from "./web3-provider"
import { useEffect, useState } from "react"

export function WalletConnect() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render on server or before mounting
  if (!mounted) {
    return (
      <Button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700">
        <Wallet className="h-4 w-4" />
        <span>Connect Wallet</span>
      </Button>
    )
  }

  return <WalletConnectContent />
}

function WalletConnectContent() {
  const { account, isConnected, balance, network, chainId, connectWallet, disconnectWallet, switchToLisk } = useWeb3()

  if (isConnected && account) {
    const isLiskNetwork = chainId === 4202

    return (
      <div className="flex items-center space-x-2">
        <div className="hidden md:flex items-center space-x-2">
          <Badge variant={isLiskNetwork ? "default" : "secondary"} className="text-xs">
            {network}
          </Badge>
          <div className="text-sm text-gray-600">{balance} ETH</div>
        </div>

        {!isLiskNetwork && (
          <Button
            variant="outline"
            size="sm"
            onClick={switchToLisk}
            className="hidden sm:flex items-center space-x-1 text-xs bg-transparent"
          >
            <Network className="h-3 w-3" />
            <span>Switch to Lisk</span>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
          className="flex items-center space-x-2 bg-transparent"
        >
          <span className="hidden sm:inline">{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
          <span className="sm:hidden">{`${account.slice(0, 4)}...`}</span>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={connectWallet} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700">
      <Wallet className="h-4 w-4" />
      <span>Connect Wallet</span>
    </Button>
  )
}
