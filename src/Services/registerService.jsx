import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/Auth";

const registerService = {
  register: async (fullName,email,password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Register`, {fullName,email, password});
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default registerService;