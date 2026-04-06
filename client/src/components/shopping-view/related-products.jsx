import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchRelatedProducts,
  setProductDetails,
} from "@/store/shop/products-slice";
import { Badge } from "@/components/ui/badge";

const RelatedProducts = ({ productId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { relatedProducts } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (productId) {
      dispatch(fetchRelatedProducts(productId));
    }
  }, [productId, dispatch]);

  const handleProductClick = (id) => {
    dispatch(setProductDetails());
    navigate(`/shop/product/${id}`);
  };

  const displayProducts = relatedProducts?.length
    ? relatedProducts
    : Array(8).slice(0, 5).fill({
        _id: "dummy",
        image: "https://placehold.co/300x200",
        title: "Sample Product Title",
        price: 1200,
        salePrice: 999,
      });

    // backend theke data ashle tokhon eta rakhbo
    // if (!relatedProducts?.length) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
      <div className="grid grid-cols-5 gap-4">
        {displayProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => handleProductClick(product._id)}
            className="border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
          >
            {/* image */}
            <div className="relative h-50 bg-gray-50 overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* info */}
            <div className="p-3">
              <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
              <h3 className="text-sm font-medium line-clamp-2 leading-snug mb-2">
                {product.title}
              </h3>

              {/* price */}
              <div className="flex items-center gap-2 mb-3">
                {product.salePrice > 0 ? (
                  <>
                    <span className="text-green-600 font-bold text-sm">
                      ৳ {product.salePrice}
                    </span>
                    <span className="text-gray-400 line-through text-xs">
                      ৳ {product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-green-600 font-bold text-sm">
                    ৳ {product.price}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
