import ProductFilter from "@/components/shopping-view/filter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDown, Funnel } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProductTile from "./product-tile";
import { useSearchParams } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "react-hot-toast";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import ProductFilterDrawer from "@/components/shopping-view/filter-drawer";

const createSearchParamsHelper = (filterParams) => {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
};

const ShoppingListing = () => {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts,
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const categorySearchParam = searchParams.get("category");

  const handleSort = (value) => {
    setSort(value);
  };

  const handleFilter = (getSectionId, getCurrentOption) => {
    let copyFilters = { ...filters };

    if (getSectionId === "reset") {
      // Reset all filters
      copyFilters = {};
    } else if (getSectionId === "price") {
      // For price, directly set the array [minPrice, maxPrice]
      copyFilters = {
        ...copyFilters,
        [getSectionId]: getCurrentOption,
      };
    } else {
      const indexOfCurrentSection =
        Object.keys(copyFilters).indexOf(getSectionId);

      if (indexOfCurrentSection === -1) {
        copyFilters = {
          ...copyFilters,
          [getSectionId]: [getCurrentOption],
        };
      } else {
        const indexofCurrentOption =
          copyFilters[getSectionId].indexOf(getCurrentOption);

        if (indexofCurrentOption === -1) {
          copyFilters[getSectionId].push(getCurrentOption);
        } else {
          copyFilters[getSectionId].splice(indexofCurrentOption, 1);
        }
      }
    }

    setFilters(copyFilters);
    sessionStorage.setItem("filters", JSON.stringify(copyFilters));
  };

  const handleGetProductDetails = (getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId));
  };

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId,
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;

        if (getQuantity + 1 > getTotalStock) {
          toast.error(
            `Only ${getQuantity} quantity can be added for this product`,
          );
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product is added to cart");
      }
    });
  };

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString), {
        replace: true,
      });
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }),
      );
    }
  }, [dispatch, sort, filters]);

  return (
    <div className="px-6 xl:px-30 py-6 min-h-[90vh] flex justify-between gap-6">
      {/* filter section */}
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      {/* all products section */}
      <div className="w-full">
        <div className="p-3 flex items-center justify-between bg-white shadow-sm rounded-lg border border-gray-200">
          <h2 className="md:text-lg font-bold ml-2">All Products</h2>
          <div className="flex items-center gap-6">
            <span className="text-gray-600 max-sm:hidden">
              {productList?.length === 0
                ? "No Products"
                : `${productList?.length} ${
                    productList?.length === 1 ? "Product" : "Products"
                  }`}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-gray-200"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] bg-white border-gray-200"
              >
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      key={sortItem.id}
                      value={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Drawer>
              <DrawerTrigger className="lg:hidden" asChild>
                <Button variant="outline" size="sm">
                  <Funnel className="w-4 h-4" />
                  <span>Filters</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <ProductFilterDrawer
                  filters={filters}
                  handleFilter={handleFilter}
                />
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        {/* All products list */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
          {productList && productList.length > 0
            ? productList.map((productItem, index) => (
                <ShoppingProductTile
                  key={index}
                  product={productItem}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddToCart={handleAddToCart}
                ></ShoppingProductTile>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default ShoppingListing;
