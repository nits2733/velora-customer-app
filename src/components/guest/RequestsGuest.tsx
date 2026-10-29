import { useEffect } from 'react';
import { strings } from '@/content/strings';
import { track } from '@/utils/analytics';
import { BenefitRows } from './BenefitRows';
import { HeroIllustration } from './HeroIllustration';
import { SampleRequest } from './SampleRequest';
import { SignedOutHero } from './SignedOutHero';

/** The Requests tab for someone who is not logged in: what it is for, what it will show, and a real-looking example. */
export function RequestsGuest() {
  const g = strings.guest.requests;
  useEffect(() => {
    track({ name: 'signed_out_requests_viewed' });
  }, []);

  return (
    <SignedOutHero source="requests" next="/requests" visual={<HeroIllustration />} headline={g.headline} support={g.support} browseLink>
      <BenefitRows title={g.benefitsTitle} benefits={g.benefits} />
      <SampleRequest />
    </SignedOutHero>
  );
}
