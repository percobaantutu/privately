import { specialityData } from "@/assets/assets_frontend/assets";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SpecialityMenu = () => {
  const { t } = useTranslation();

  return (
    <div id="speciality" className="flex flex-col items-center gap-4 py-16 text-[#262626]">
      <h1 className="text-3xl font-medium">{t("speciality.title")}</h1>
      <p className="sm:w-1/3 text-center text-sm">{t("speciality.subtitle")}</p>
      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll ">
        {specialityData.map((item, index) => (
          <Link onClick={() => scrollTo(0, 0)} to={`/teachers/${item.speciality}`} key={index} className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500">
            <img src={item.image} alt={item.speciality} className="w-16 sm:w-24 mb-2 " />
            <p className="font-medium">{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
