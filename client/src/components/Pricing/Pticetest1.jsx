import { Protect } from '@clerk/clerk-react'
import React from 'react'

export default function ProtectPage() {
  return (
    <Protect
      plan="Business"
      fallback={<p>Only subscribers to the Bronze plan can access this content.</p>}
    >
      <div><h1>Welcome to Business</h1></div>
    </Protect>
  )
}