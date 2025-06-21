import request from "../../request";
import { TenantEndpoints } from "./config";
import { Tenant } from "../../../interfaces/Tenant";

export default class TenantService {
    public static open = async (id: number) => {
        try {
            const response = await request({
                url: TenantEndpoints.open(id),
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            return response?.data || { data: {}, success: true };
        } catch (error) {
            console.error("Error fetching encounters:", error);
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
