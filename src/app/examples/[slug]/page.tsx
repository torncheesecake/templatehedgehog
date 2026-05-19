import { redirect } from "next/navigation";
import {
  emailWorkflows,
  getEmailWorkflowByLegacyExampleSlug,
} from "@/data/workflows";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return emailWorkflows.map((workflow) => ({
    slug: workflow.legacyExampleSlug,
  }));
}

export default async function ExampleDetailRedirectPage({ params }: Props) {
  const { slug } = await params;
  const workflow = getEmailWorkflowByLegacyExampleSlug(slug);
  if (workflow) {
    redirect(`/layouts/${workflow.linkedLayoutSlug}`);
  }
  redirect("/layouts");
}
