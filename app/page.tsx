import Masthead from "@/components/newsletter/Masthead";
import ExtraBanner from "@/components/newsletter/ExtraBanner";
import ThePivot from "@/components/newsletter/ThePivot";
import BuildYourClutch from "@/components/newsletter/BuildYourClutch";
import ReaderFeedback from "@/components/newsletter/ReaderFeedback";
import TicketFooter from "@/components/newsletter/TicketFooter";

export default function Home() {
  return (
    <main className="relative mx-auto w-full max-w-[1200px] overflow-x-hidden pb-10 pt-4 sm:pt-6">
      <Masthead />
      <ExtraBanner />
      <ThePivot />
      <BuildYourClutch />
      <ReaderFeedback />
      <TicketFooter />
    </main>
  );
}
