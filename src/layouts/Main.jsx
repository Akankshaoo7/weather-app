import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function Main() {
  return (
    <>
      <Navbar />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9  w-full  pb-10 pt-4 ">
        <Outlet />
      </main>
    </>
  );
}

export default Main;
