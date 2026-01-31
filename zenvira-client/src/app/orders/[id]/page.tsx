import OrderDetailsClient from "@/components/orders/OrderDetailsClient";

export default function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <OrderDetailsClient orderId={params.id} />;
}
