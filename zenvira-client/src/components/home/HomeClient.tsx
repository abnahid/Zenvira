import CategoryRow from "./CategoryRow";
import FeaturedProducts from "./FeaturedProducts";
import PromoGrid from "./PromoGrid";

const HomeClient = () => {
  return (
    <div>
      <PromoGrid />
      <CategoryRow />
      <FeaturedProducts />
    </div>
  );
};

export default HomeClient;
