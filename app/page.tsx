import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  description:
    "Transform your college application journey with Paccy's comprehensive suite of tools. Track essays, manage deadlines, build academic profiles, and connect with peers - all in one platform.",
  keywords:
    "college applications, essay tracker, college admissions, academic planner, extracurricular manager, peer network, college prep, university applications",
};

import HomeClientWrapper from "./HomeClientWrapper";

export default function Home() {
  return <HomeClientWrapper />;
}
