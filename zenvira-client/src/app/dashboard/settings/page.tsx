import SellerProfileClient from "@/components/dashboard/SellerProfileClient";

export default function SellerProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your seller profile information and photo
        </p>
      </div>

      <SellerProfileClient />
    </div>
  );
}
