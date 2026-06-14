import { redirect } from "next/navigation";
import { emailWorkflows, getEmailWorkflowBySlug } from "@/data/workflows";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return emailWorkflows.map((workflow) => ({ slug: workflow.slug }));
}

export default async function WorkflowDetailRedirectPage({ params }: Props) {
  const { slug } = await params;
  const workflow = getEmailWorkflowBySlug(slug);
  if (workflow) {
    redirect(`/layouts/${workflow.linkedLayoutSlug}`);
  }

  redirect("/layouts");
}
