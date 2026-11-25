import { Navbar } from './components/Navbar';
import { AmbientBackdrop } from './components/AmbientBackdrop';
import { HeroSection } from './components/HeroSection';
import { TelemetryBand } from './components/TelemetryBand';
import { StickyScrollytellingStage } from './components/scrollytelling/StickyScrollytellingStage';
import { BentoGrid } from './components/BentoGrid';
import { DeploymentSection } from './components/DeploymentSection';
import { RoadmapSection } from './components/RoadmapSection';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="relative min-h-screen bg-[#070709] text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <AmbientBackdrop />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <TelemetryBand />
        <StickyScrollytellingStage />
        <BentoGrid />
        <DeploymentSection />
        <RoadmapSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
