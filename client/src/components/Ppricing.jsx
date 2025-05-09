import { PricingTable } from '@clerk/clerk-react';

export default function PPrice() {
  return (
    <>
    <PricingTable
      plans={[
        {
          name: 'Free',
          price: '$0',
          features: ['10,000 MAUs', 'Pre-built components', 'Custom domain'],
        },
        {
          name: 'Pro',
          price: '$25',
          features: ['Remove Clerk branding', 'Custom session duration', 'Allowlist/Blocklist'],
        },
        {
          name: 'Enterprise',
          price: 'Contact us',
          features: ['Enhanced authentication', 'Enterprise SSO', 'Dedicated support'],
        },
      ]}
    ></PricingTable>
    <div>asdfasd</div>
    </>
  );
}