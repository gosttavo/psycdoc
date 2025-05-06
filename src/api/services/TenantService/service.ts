import request from "../../request";
import { TenantEndpoints } from "./config";
import { Tenant } from "../../../interfaces/Tenant";

export default class TenantService {
    public static get = async (searchText?: string) => {
        const params = new URLSearchParams();
        if (searchText && searchText.trim() !== '') {
            params.append('search', searchText.trim());
        }
    
        try {
            const response = await request({
                url: `${TenantEndpoints.get()}?${params.toString()}`,
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
    
            return response?.data || { data: [], count: 0, success: true };
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    };

    public static put = async (id: number, data: Tenant) => {
        return await request({
            url: TenantEndpoints.put(id),
            method: "PUT",
            data: data,
            headers: { "Content-Type": "application/json" }
        });
    };
}
