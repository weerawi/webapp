"use client"

import { showLoader } from "@/lib/store/slices/loaderSlice";
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Home = () => {

  const router  = useRouter();

  // inside Home()
const dispatch = useDispatch();
useEffect(() => {
  dispatch(showLoader());
  const id = setTimeout(() => {
    router.replace("/login");
  }, 200);
  return () => clearTimeout(id);
}, [dispatch, router]);
  }
  
  export default Home