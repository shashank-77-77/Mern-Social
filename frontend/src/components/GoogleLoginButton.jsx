import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";

const GoogleAuthButton = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          credential: credentialResponse.credential,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Signed in with Google");
      window.location.reload();
    } catch (error) {
      console.error("Google Auth Error", error);
      toast.error("Google sign-in failed");
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google sign-in failed")}
        theme="filled_black"
        size="large"
        shape="pill"
      />
    </div>
  );
};

export default GoogleAuthButton;
