import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Decentralized Donations on Lisk
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Create transparent, trustless donation campaigns on the Lisk blockchain. Every contribution is tracked,
              verified, and immutable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/donations">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3"
                >
                  Explore Donations
                </Button>
              </Link>
              <Link href="/create-donation">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-900 px-8 py-3 bg-transparent"
                >
                  Start Campaign
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Lisk for Donations?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of charitable giving with Lisk blockchain technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every transaction is recorded on the Lisk blockchain, ensuring complete transparency and
                  accountability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Fast & Cheap</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Lisk's efficient blockchain provides fast transactions with minimal fees for your donations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Global Access</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Support causes worldwide without geographical restrictions or currency barriers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <CardTitle>Trustless</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Smart contracts ensure funds reach their intended destination automatically.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">$2.5M+</div>
              <div className="text-gray-600">Total Donations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1,250+</div>
              <div className="text-gray-600">Active Campaigns</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">15,000+</div>
              <div className="text-gray-600">Contributors</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference on Lisk?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of donors and campaign creators using Lisk blockchain technology for transparent giving.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donations">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Browse Campaigns
              </Button>
            </Link>
            <Link href="/create-donation">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 bg-transparent"
              >
                Create Campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
