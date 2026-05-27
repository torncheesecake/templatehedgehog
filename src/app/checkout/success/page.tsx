import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessRedirectPage({ searchParams }: Props) {
  const params = await searchParams;
  const sessionId = params.session_id?.trim();

  if (sessionId) {
    redirect(`/success?session_id=${encodeURIComponent(sessionId)}`);
  }

  redirect("/success");
}
