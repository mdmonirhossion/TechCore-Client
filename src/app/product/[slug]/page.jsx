import { redirect } from 'next/navigation';

export default async function ProductRedirectPage({ params }) {
  const { slug } = await params;
  redirect(`/products/${slug}`);
}
