import { PricingTable, SignedIn, SignedOut } from '@clerk/clerk-react'

function Plan() {
  return (
    <div className='max-w-2xl mx-auto z-20 my-30'>
      <div className='text-center'>
        <h2 className='text-slate-700 text-[42px] font-semibold'>
          Choose Your Plan
        </h2>
        <p className='text-gray-500 max-w-lg mx-auto'>
          Start for free and scale up as you grow.
        </p>
      </div>

      <div className='mt-14'>
        <SignedIn>
          <PricingTable />
        </SignedIn>

        <SignedOut>
          <p className="text-center text-gray-500">
            Please sign in to view pricing plans.
          </p>
        </SignedOut>
      </div>
    </div>
  )
}

export default Plan
