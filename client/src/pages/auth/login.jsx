import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { loginUser, guestLoginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

const initialState = {
  email: "",
  password: "",
};

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
      } else {
        toast.error(data?.payload?.message);
      }
    });
  };

  const handleGuestLogin = () => {
    dispatch(guestLoginUser()).then((data) => {
      if (data?.payload?.success) {
        toast.success("Logged in as Demo User");
      } else {
        toast.error("Guest login failed");
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-2 px-14 py-10 max-sm:px-8 max-sm:mx-6 text-center bg-primary-foreground shadow-sm rounded-lg">
      <h1 className="text-3xl max-sm:text-2xl font-bold tracking-tight text-foreground mb-8">
        Sign in to your account
      </h1>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Login"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-sm">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        onClick={handleGuestLogin}
        className="w-full bg-gray-400 text-white hover:bg-gray-500 mb-6"
      >
        Login as Demo User
      </Button>

      <p>
        Don't have an account?
        <Link
          to="/auth/register"
          className="font-medium ml-2 text-primary hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
};

export default AuthLogin;
