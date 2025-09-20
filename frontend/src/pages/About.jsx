import { assets } from "@/assets/assets_frontend/assets";
import React from "react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* About Us Section */}
      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>{t("about.title")}</p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-[360px] rounded-lg shadow-md object-cover" src={assets.about_image} alt="Dedicated tutor helping a student" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p className="font-semibold text-lg text-primary">{t("about.missionTitle")}</p>
          <p>{t("about.missionText1")}</p>
          <p>{t("about.missionText2")}</p>

          <b className="text-gray-800">{t("about.visionTitle")}</b>
          <p>{t("about.visionText")}</p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="text-xl my-4">
        <p>{t("about.whyTitle")}</p>
      </div>

      <div className="flex flex-col md:flex-row mb-20 text-center">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-l-lg">
          <b>{t("about.whyTrustTitle")}</b>
          <p>{t("about.whyTrustText")}</p>
        </div>

        <div className="border-t border-b md:border-t-0 md:border-b-0 md:border-l md:border-r px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>{t("about.whyConvenienceTitle")}</b>
          <p>{t("about.whyConvenienceText")}</p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer rounded-r-lg">
          <b>{t("about.whySecureTitle")}</b>
          <p>{t("about.whySecureText")}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
