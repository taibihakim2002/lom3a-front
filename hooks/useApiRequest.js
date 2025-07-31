import errorMessages from "@/constants/errorMessages";
import { useState } from "react";

const useApiRequest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const request = async (apiCall) => {
    setLoading(true);
    setError("");
    try {
      const response = await apiCall();
      // console.log(response);
      setData(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      // console.log(err);
      let errorMsg = "حدث خطأ غير متوقع";
      if (err?.response?.data?.code) {
        errorMsg = errorMessages[err?.response?.data?.code] || errorMsg;
      }
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, request };
};

export default useApiRequest;
