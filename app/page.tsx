import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Hero from "@/components/home/Hero";
import TrustMarquee from "@/components/home/TrustMarquee";
import HowItWorks from "@/components/home/HowItWorks";
import DirectoryWall from "@/components/home/DirectoryWall";
import Features from "@/components/home/Features";
import SignalScore from "@/components/home/SignalScore";
import LiveScreen from "@/components/home/LiveScreen";
import UseCases from "@/components/home/UseCases";
import Organizers from "@/components/home/Organizers";
import Cities from "@/components/home/Cities";
import CtaBand from "@/components/home/CtaBand";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustMarquee />
        <HowItWorks />
        <DirectoryWall />
        <Features />
        <SignalScore />
        <LiveScreen />
        <UseCases />
        <Organizers />
        <Cities />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
