import { createFileRoute } from "@tanstack/react-router";
import { HousePage } from "@/components/house-page";

export const Route = createFileRoute("/")({
  component: HousePage,
});
