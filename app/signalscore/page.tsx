import type { Metadata } from "next";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import SignalScoreExplainer from "@/components/signalscore/SignalScoreExplainer";

export const metadata: Metadata = {
  title: "SignalScore™ — a single number for the quality of a room",
  description:
    "How SignalScore™ works: LiveConnect's explainable 0–100 measure of relevant, reciprocated, followed-through connection. Play with the live model for a person and a whole event.",
  openGraph: {
    title: "SignalScore™ — a single number for the quality of a room",
    description:
      "An interactive walkthrough of the metric that measures real connection, not headcount.",
    url: "https://liveconnectusa.com/signalscore",
    type: "article",
  },
};

export default function SignalScorePage() {
  return (
    <>
      <Nav />
      <main>
        <SignalScoreExplainer />
      </main>
      <Footer />
    </>
  );
}
