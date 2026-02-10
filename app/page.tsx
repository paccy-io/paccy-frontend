import type { Metadata } from "next";
import ClientPage from "./ClientPage";

export const metadata: Metadata = {
  description:
    "Transform your college application journey with Paccy's comprehensive suite of tools - completely free! Track essays, manage deadlines, build academic profiles, and connect with peers - all in one platform.",
  keywords:
    "college applications, essay tracker, college admissions, academic planner, extracurricular manager, peer network, college prep, university applications, free college tools",
};

export default function ServerWrapper() {
  return <ClientPage />;
}
