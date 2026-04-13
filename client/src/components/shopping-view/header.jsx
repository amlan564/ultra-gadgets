import { HousePlug, LogOut, Menu, ShoppingCart, User } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { resetTokenAndCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import toast from "react-hot-toast";

const MenuItems = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleNavigate = (getCurrentMenuItem) => {
    sessionStorage.removeItem("filters");

    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`),
        )
      : navigate(getCurrentMenuItem.path);

    if (onClose) {
      onClose();
    }
  };

  return (
    <nav className="flex flex-col lg:flex-row lg:items-center mb-3 lg:mb-0 px-8 pt-14 pb-4 lg:px-0 lg:py-0 gap-8">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          key={menuItem.id}
          className="font-medium cursor-pointer relative hover:text-gray-900 transition-colors duration-300 nav-label"
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
};

const HeaderRightContent = ({ onMenuClose }) => {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
    onMenuClose?.();
  };

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  return (
    <div className="flex flex-col lg:items-center lg:flex-row gap-6 lg:gap-4 px-8 lg:px-0">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => {
            setOpenCartSheet(true);
          }}
          variant="ghost"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="size-5" />
          <div className="absolute top-0.5 right-0 w-4 h-4 rounded-full bg-[#00684a]">
            <p className="text-xs text-white">{cartItems?.items?.length || 0}</p>
          </div>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer" asChild>
          {user?.profileImage ? (
            <img
              src={user?.profileImage}
              alt=""
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <Avatar>
              <AvatarFallback className="bg-[#00684a] text-white font-extrabold">
                {user?.fullName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-white border-none p-0"
        >
          <DropdownMenuLabel>
            Logged in as {user?.fullName.split(" ")[0]}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              if (user.role === "guest") {
                toast.error("Guest users cannot access this page.");
                return;
              }

              navigate("/shop/account");
            }}
            className="py-2 data-[highlighted]:bg-[#d1ede4] cursor-pointer"
          >
            <User className="w-4 h-4" />
            My Account
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogout}
            className="py-2 data-[highlighted]:bg-[#d1ede4] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ShoppingHeader = () => {
  const [openMenuSheet, setOpenMenuSheet] = useState(false);

  const closeMenuSheet = () => setOpenMenuSheet(false);

  return (
    <header className="w-full relative">
      <div className="flex h-16 items-center justify-between px-6 xl:px-30 fixed top-0 z-50 w-full bg-white border-b border-gray-200">
        <Link to="/shop/home" className="flex items-center gap-2 text-[#00684a]">
          <HousePlug className="w-6 h-6" />
          <span className="font-bold">UltraGadgets</span>
        </Link>
        <Sheet open={openMenuSheet} onOpenChange={setOpenMenuSheet}>
          <Button
            onClick={() => setOpenMenuSheet(true)}
            size="icon"
            className="lg:hidden bg-[#00684a] text-white"
          >
            <Menu className="w-6 h-6" />
            <span className="sr-only">Toggle header menu</span>
          </Button>
          <SheetContent
            side="left"
            className="w-full max-w-xs bg-white border-none"
          >
            <MenuItems onClose={closeMenuSheet} />
            <HeaderRightContent onMenuClose={closeMenuSheet} />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
