import axios from "@lib/axios";

const getCategories = async () => {
    const response = await axios.get("/api/admin/summery");
    return response.data;
};

export default { getCategories }
