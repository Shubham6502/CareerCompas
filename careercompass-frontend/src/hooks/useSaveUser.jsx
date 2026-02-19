import axios from "axios";
import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

export default function useSaveUser() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const saveUser = async () => {
      try {
        await axios.post("https://careercompas.onrender.com/api/users/save", {
          clerkId: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
        });
      } catch (err) {
        console.log("User save failed", err);
      }
    };

    saveUser();
  }, [isLoaded, user]);


  useEffect(()=>{
    if (!isLoaded || !user) return;
    const saveProfile = async ()=>{
      try{
        await axios.post("https://careercompas.onrender.com/api/profile/save",{
           user
        })
      }catch{
        console.log("Something went wrong")
      }
    }
    saveProfile();
  },[isLoaded,user])


}
