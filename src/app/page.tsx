import Link from 'next/link'
import Image from 'next/image'
import FarmingImageCarousel from '@/components/FarmingImageCarousel'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-green-600 to-green-400 text-white">
        <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Connecting Farmers and Buyers Directly</h1>
            <p className="text-xl mb-8">AgriTech is revolutionizing agricultural commerce by eliminating intermediaries and creating a transparent marketplace.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/marketplace" className="btn-primary text-center">
                Browse Marketplace
              </Link>
              <Link href="/register" className="btn-secondary text-center">
                Join AgriTech
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <FarmingImageCarousel height="h-72 md:h-96" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose AgriTech</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fair Pricing</h3>
              <p>By eliminating intermediaries, farmers get better prices for their produce, and buyers pay less.</p>
            </div>
            <div className="card">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Assurance</h3>
              <p>Direct farmer-to-buyer connections ensure fresher produce and transparent quality standards.</p>
            </div>
            <div className="card">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Market Insights</h3>
              <p>Data-driven recommendations help farmers optimize production and pricing for better profitability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How AgriTech Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-2">Sign Up</h3>
              <p>Create your profile as a farmer or buyer and showcase your products or needs.</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-2">Connect</h3>
              <p>Browse listings, connect with farmers or buyers, and negotiate directly.</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-2">Trade</h3>
              <p>Securely complete transactions and arrange for product delivery or pickup.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-16 bg-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Agricultural Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of farmers and buyers already benefiting from our platform.</p>
          <Link href="/register" className="btn-secondary inline-block">
            Get Started Today
          </Link>
        </div>
      </section>
    </main>
  )
} 