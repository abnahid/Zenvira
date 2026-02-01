import BestSellingProducts from "./BestSellingProducts";
import CategoryRow from "./CategoryRow";
import FeaturedProducts from "./FeaturedProducts";
import FeaturesSection from "./FeaturesSection";
import HotOfferSection from "./getTimeParts";
import LatestBlogsSection from "./LatestBlogsSection";
import MaskPromoSection from "./MaskPromoSection";
import PromoGrid from "./PromoGrid";

const HomeClient = () => {
  return (
    <div>
      <PromoGrid />
      <CategoryRow />
      <FeaturedProducts />
      <HotOfferSection />
      <BestSellingProducts />
      <MaskPromoSection />
      <LatestBlogsSection />
      <FeaturesSection />
    </div>
  );
};

export default HomeClient;
