import {
  footerAccountData,
  footerCompanyData,
  footerPolicyData,
  shopInfoData,
} from "@/lib/data";
import React from "react";
import { Link } from "react-router-dom";
import GooglePlay from "@/assets/play-store.png";
import AppStore from "@/assets/apple.png";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Facebook, HousePlug, Instagram, Youtube } from "lucide-react";

const ShoppingFooter = () => {
  return (
    <footer className="w-full px-6 xl:px-30 pt-12">
      <div className="grid grid-cols-7 pb-6">
        {/* shop info */}
        <div className="col-span-2">
          <div>
            <Link to="/shop/home" className="flex items-center gap-2 text-[#00684a]">
              <HousePlug className="w-6 h-6" />
              <span className="font-bold">UltraGadgets</span>
            </Link>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            {shopInfoData.map((item) => (
              <div
                key={item.id}
                className={`flex gap-2 ${item.id !== 1 ? "items-center" : "items-start"}`}
              >
                {<item.icon className="size-5 text-[#00684a]" />}
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  <span className="font-bold">{item.title}:</span>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* company */}
        <div>
          <h3 className="text-xl font-bold mb-4">Company</h3>
          <ul>
            {footerCompanyData.map((item) => (
              <li
                key={item.id}
                className="mb-4 text-sm font-semibold text-gray-700"
              >
                <Link>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        {/* account */}
        <div>
          <h3 className="text-xl font-bold mb-4">Account</h3>
          <ul>
            {footerAccountData.map((item) => (
              <li
                key={item.id}
                className="mb-4 text-sm font-semibold text-gray-700"
              >
                <Link>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        {/* policy */}
        <div>
          <h3 className="text-xl font-bold mb-4">Policy</h3>
          <ul>
            {footerPolicyData.map((item) => (
              <li
                key={item.id}
                className="mb-4 text-sm font-semibold text-gray-700"
              >
                <Link>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        {/* install app */}
        <div className="col-span-2">
          <h3 className="text-xl font-bold mb-4">Install App</h3>
          <p className="text-sm font-semibold text-gray-700 mb-6">
            From Google Play or App Store
          </p>
          <div className="flex items-center gap-3">
            <button className="bg-black flex items-center gap-2 px-5 py-2 rounded-md cursor-pointer">
              <img src={GooglePlay} alt="" className="w-6" />
              <div className="text-left text-white">
                <p className="text-[8px]">GET IT ON</p>
                <h4 className="text-sm font-medium">Google Play</h4>
              </div>
            </button>
            <button className="bg-black flex items-center gap-2 px-5 py-2 rounded-md cursor-pointer">
              <img src={AppStore} alt="" className="w-6 scale-180" />
              <div className="text-left text-white">
                <p className="text-[8px]">Download on the</p>
                <h4 className="text-sm font-medium">App Store</h4>
              </div>
            </button>
          </div>
          <p className="text-sm font-semibold text-gray-700 mt-12">
            Secure Payment Gateways
          </p>
          <div className="mt-5 w-70">
            <img
              src="https://d2t8nl1y0ie1km.cloudfront.net/public/payment-methods.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <Separator className="bg-gray-300" />
      <div className="flex items-center justify-between py-6">
        <p className="text-sm font-medium">
          &copy; 2025 UltraGadgets | All rights reserved
        </p>
        <div className="flex items-center gap-6">
          <h4 className="text-sm font-bold">Follow Us</h4>
          <div className="flex items-center gap-1.5">
            <Button className="w-8 h-8 rounded-full bg-[#00684a] hover:bg-[#00593f] transition cursor-pointer">
              <Facebook className="fill-white" />
            </Button>
            <Button className="w-8 h-8 rounded-full bg-[#00684a] hover:bg-[#00593f] transition cursor-pointer">
              <Instagram className="" />
            </Button>
            <Button className="w-8 h-8 rounded-full bg-[#00684a] hover:bg-[#00593f] transition cursor-pointer">
              <Youtube />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ShoppingFooter;
