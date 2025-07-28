import type { Metadata } from "next";
import Page1 from "../components/Landing/landing1";
import Page2 from "../components/Landing/landing2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  description:
    "Transform your college application journey with Paccy's comprehensive suite of tools. Track essays, manage deadlines, build academic profiles, and connect with peers - all in one platform.",
  keywords:
    "college applications, essay tracker, college admissions, academic planner, extracurricular manager, peer network, college prep, university applications",
};

export default function Home() {
  return (
    <div className="">
      <Navbar />
      <div className="pt-20">
        <Page1 />
        <div id="features">
          <Page2 />
        </div>
      </div>
      <Footer />
    </div>
  );
}
