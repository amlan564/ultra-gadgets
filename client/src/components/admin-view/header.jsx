import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { resetTokenAndCredentials } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/auth/login");
  };

  return (
    <header className="flex items-center justify-between px-6 lg:px-10 py-3 bg-background border-b border-gray-200 fixed top-0 z-40 w-full">
      <Button
        onClick={() => setOpen(true)}
        className="lg:hidden bg-black text-white cursor-pointer"
        size="lg"
      >
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="cursor-pointer flex items-center"
          size="lg"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
