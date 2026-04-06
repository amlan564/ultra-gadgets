import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const initialState = {
  fullName: "",
  email: "",
  password: "",
};

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        navigate("/auth/login");
      } else {
        toast.error(data?.payload?.message);
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-lg space-y-8 px-14 py-10 max-sm:px-8 max-sm:mx-6 text-center bg-primary-foreground shadow-sm rounded-lg">
      <h1 className="text-3xl max-sm:text-2xl font-bold tracking-tight text-foreground mb-2">
        Create an account
      </h1>
      <h4 className="text-sm text-muted-foreground mb-6">Get started by filling in your details</h4>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <p>
        Already have an account?
        <Link
          to="/auth/login"
          className="font-medium ml-2 text-[#00684a] hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default AuthRegister;
