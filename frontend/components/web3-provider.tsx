"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface Web3ContextType {
  account: string | null
  isConnected: boolean
  balance: string
  network: string | null
  chainId: number | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchToLisk: () => Promise<void>
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

// Lisk Sepolia network configuration
const LISK_SEPOLIA_CONFIG = {
  chainId: "0x106A", // 4202 in hex
  chainName: "Lisk Sepolia Testnet",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.sepolia-api.lisk.com"],
  blockExplorerUrls: ["https://sepolia-blockscout.lisk.com"],
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState("0")
  const [isConnected, setIsConnected] = useState(false)
  const [network, setNetwork] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const { toast } = useToast()

  const getNetworkName = (chainId: number): string => {
    switch (chainId) {
      case 4202:
        return "Lisk Sepolia"
      case 1135:
        return "Lisk Mainnet"
      case 1:
        return "Ethereum Mainnet"
      case 11155111:
        return "Sepolia"
      default:
        return "Unknown Network"
    }
  }

  const updateBalance = async (address: string) => {
    try {
      const balance = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      const ethBalance = (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
      setBalance(ethBalance)
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }

  const updateNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      const numericChainId = Number.parseInt(chainId, 16)
      setChainId(numericChainId)
      setNetwork(getNetworkName(numericChainId))
    } catch (error) {
      console.error("Error fetching network:", error)
    }
  }

  const switchToLisk = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Web3 wallet",
        variant: "destructive",
      })
      return
    }

    try {
      // Try to switch to Lisk Sepolia
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: LISK_SEPOLIA_CONFIG.chainId }],
      })

      toast({
        title: "Network Switched",
        description: "Successfully switched to Lisk Sepolia",
      })
    } catch (switchError: any) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [LISK_SEPOLIA_CONFIG],
          })

          toast({
            title: "Network Added",
            description: "Lisk Sepolia network has been added to your wallet",
          })
        } catch (addError) {
          console.error("Error adding network:", addError)
          toast({
            title: "Network Error",
            description: "Failed to add Lisk Sepolia network",
            variant: "destructive",
          })
        }
      } else {
        console.error("Error switching network:", switchError)
        toast({
          title: "Network Error",
          description: "Failed to switch to Lisk Sepolia",
          variant: "destructive",
        })
      }
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Web3 wallet",
        variant: "destructive",
      })
      return
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)

        await updateBalance(accounts[0])
        await updateNetwork()

        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        })

        // Check if user is on Lisk network, if not suggest switching
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        const numericChainId = Number.parseInt(chainId, 16)

        if (numericChainId !== 4202) {
          toast({
            title: "Switch to Lisk",
            description: "For the best experience, switch to Lisk Sepolia network",
          })
        }
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setIsConnected(false)
    setBalance("0")
    setNetwork(null)
    setChainId(null)

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  useEffect(() => {
    // Check if wallet is already connected
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
          updateBalance(accounts[0])
          updateNetwork()
        }
      })

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setAccount(accounts[0])
          updateBalance(accounts[0])
        }
      }

      // Listen for network changes
      const handleChainChanged = (chainId: string) => {
        const numericChainId = Number.parseInt(chainId, 16)
        setChainId(numericChainId)
        setNetwork(getNetworkName(numericChainId))

        // Update balance when network changes
        if (account) {
          updateBalance(account)
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
          window.ethereum.removeListener("chainChanged", handleChainChanged)
        }
      }
    }
  }, [account])

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        balance,
        network,
        chainId,
        connectWallet,
        disconnectWallet,
        switchToLisk,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
