import { redirect } from "next/navigation";

// A roadmap or Gantt implies post-award delivery management. PO-LICE remains
// focused on deterministic pre-award gates and routes this legacy URL to them.
export default function ProjectPlanPage() {
  redirect("/bids");
}
