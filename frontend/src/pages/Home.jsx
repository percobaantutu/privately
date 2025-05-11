import Header from "@/components/ui/Header";
import SpecialityMenu from "@/components/ui/SpecialityMenu";
import TopTeachers from "@/components/ui/TopTeachers";
import Banner from "@/components/ui/Banner";
import React from "react";

const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopTeachers />
      <Banner />
    </div>
  );
};

export default Home;
