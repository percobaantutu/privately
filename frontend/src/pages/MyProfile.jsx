import { assets } from "@/assets/assets_frontend/assets";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

function MyProfile() {
  const [userData, setUserData] = useState({
    name: "Restu Muhammad",
    image: assets.profile_pic,
    email: "restumhmmad27@gmail.com",
    phone: "082128459689",
    address: {
      line1: "Komplek Bumi Pesona Asri, blok C3 no 53",
      line2: "Desa Linggar, Kecamatan Rancaekek, Kabupaten Bandung",
    },
    gender: "male",
    dob: "2001-04-16",
  });

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm pt-5">
      <img src={userData.image} className="w-36 rounded" alt="Profile" />
      {isEdit ? <input type="text" value={userData.name} onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))} /> : <p className="font-medium text-3xl text-[#262626] mt-4">{userData.name}</p>}

      <hr className="bg-[#ADADAD] h-[1px] border-none" />
      <div>
        <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
          <p className="font-medium">Email:</p>
          <p className="text-blue-500">{userData.email}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? <input className="bg-gray-50 max-w-52" type="text" value={userData.phone} onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))} /> : <p className="text-blue-500">{userData.phone}</p>}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <p className="text-blue-500">
              <input
                className="bg-gray-50 max-w-52"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                value={userData.address.line1}
                type="text"
              />
              <br />
              <input
                className="bg-gray-50 max-w-52"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                value={userData.address.line2}
                type="text"
              />
            </p>
          ) : (
            <p className="text-blue-500">
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
          <hr className="bg-[#ADADAD] h-[1px] border-none" />
        </div>
      </div>

      <div>
        <p className="text-[#797979] underline mt-3">Basic Information</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select className="max-w-20 bg-gray-100" onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
              <option value="male" className="text-gray-500">
                Male
              </option>
              <option value="female" className="text-gray-500">
                Female
              </option>
            </select>
          ) : (
            <p className="text-gray-500">{userData.gender}</p>
          )}

          <p className="font-medium">Birth Day:</p>
          {isEdit ? <input className="bg-gray-50 max-w-52" type="date" onChange={(e) => setUserData((prev) => ({ ...prev, dob: e.target.value }))} value={userData.dob} /> : <p className="text-gray-500">{userData.dob}</p>}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <Button className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all" onClick={() => setIsEdit(false)}>
            Save Information
          </Button>
        ) : (
          <Button className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all" onClick={() => setIsEdit(true)}>
            Edit
          </Button>
        )}
      </div>
    </div>
  );
}

export default MyProfile;
