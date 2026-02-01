import CategoryRow from "./CategoryRow";
import FeaturedProducts from "./FeaturedProducts";
import HotOfferSection from "./getTimeParts";
import PromoGrid from "./PromoGrid";

const HomeClient = () => {
  return (
    <div>
      <PromoGrid />
      <CategoryRow />
      <FeaturedProducts />
      <HotOfferSection />
    </div>
  );
};

export default HomeClient;
