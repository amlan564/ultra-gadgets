import { CircleUser } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const UserCard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="flex gap-4 rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="w-12 h-12">
        {user?.profileImage ? (
          <img src={user?.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
        ) : (
          <CircleUser className="w-full h-full" />
        )}
      </div>
      <div>
        <p className="font-bold -mt-1">{user?.fullName}</p>
        <span className="text-sm font-bold text-gray-500">{user?.email}</span>
      </div>
    </div>
  );
};

export default UserCard;
