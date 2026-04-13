import { CircleUser } from "lucide-react";
import { useSelector } from "react-redux";

const UserCard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex items-start gap-4 rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
        {user?.profileImage ? (
          <img src={user?.profileImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <CircleUser className="w-full h-full" />
        )}
      </div>
      <div>
        <p className="font-bold">{user?.fullName}</p>
        <span className="text-sm font-bold text-gray-500">{user?.email}</span>
      </div>
    </div>
  );
};

export default UserCard;
