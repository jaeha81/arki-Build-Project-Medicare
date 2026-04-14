import { HeroSection } from "@/components/home/hero-section";
import { TrustBar } from "@/components/home/trust-bar";
import { CategoryCards } from "@/components/home/category-cards";
import { ProcessSteps } from "@/components/home/process-steps";
import { SocialProof } from "@/components/home/social-proof";
import { FaqPreview } from "@/components/home/faq-preview";
import { BottomCta } from "@/components/home/bottom-cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategoryCards />
      <ProcessSteps />
      <SocialProof />
      <FaqPreview />
      <BottomCta />
    </>
  );
}
