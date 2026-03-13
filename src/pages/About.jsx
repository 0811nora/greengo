import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import HeroSection from '../components/about/HeroSection';
import StorySection from '../components/about/StorySection';
import BeliefSection from '../components/about/BeliefSection';
import MissionSection from '../components/about/MissionSection';
import FAQSection from '../components/about/FAQSection';


export default function About() {

  useEffect(() => {
    AOS.init({
      duration: 2000,
      once: true,
    });
  }, []);

  return (
    <>
      <main className="c-about">

        <HeroSection />
        <StorySection />
        <BeliefSection />
        <MissionSection />
        <FAQSection />

      </main>
    </>
  )
}