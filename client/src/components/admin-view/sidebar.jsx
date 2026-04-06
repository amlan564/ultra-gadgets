import {
  ChartNoAxesCombined,
  BadgeCheck,
  LayoutDashboard,
  ListTodo,
  Image,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSideBarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "feature-image",
    label: "Feature Image",
    path: "/admin/feature-image",
    icon: <Image />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ListTodo />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
];

const MenuItems = ({ setOpen }) => {
  const navigate = useNavigate();

  return (
    <nav className="flex flex-col gap-2 mt-8 bg-white h-full">
      {adminSideBarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer text-gray-500 hover:bg-gray-200 hover:text-black"
        >
          {menuItem.icon}
          <span className="text-sm font-medium">{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
};

const AdminSideBar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="lg:fixed bg-white h-screen z-50 border-r border-gray-200">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-white">
          <div className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 mt-5">
                <ChartNoAxesCombined size={30} />
                <span className="text-xl font-extrabold">Admin Panel</span>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col px-8 py-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center justify-center gap-2 cursor-pointer"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </div>
  );
};

export default AdminSideBar;
