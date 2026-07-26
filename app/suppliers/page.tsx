import { redirect } from "next/navigation";

// Supplier geography and relationship visualisations are intentionally not a
// pre-award PO-LICE surface. Integrity signals are shown in the Dynamic Docket.
export default function SuppliersPage() {
  redirect("/bids");
}
