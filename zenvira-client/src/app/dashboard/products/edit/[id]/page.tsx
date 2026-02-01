import EditProductClient from "@/components/dashboard/EditProductClient";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditProductClient id={id} />;
}
