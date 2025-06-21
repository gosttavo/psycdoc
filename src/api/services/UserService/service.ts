import request from "../../request";
import { UserEndpoints } from "./config";
import { User } from "../../../interfaces/User";

export default class UserService {
    public static get = async (searchText?: string) => {
        const params = new URLSearchParams();
        if (searchText && searchText.trim() !== '') {
            params.append('search', searchText.trim());
        }
    
        try {
            const response = await request({
                url: `${UserEndpoints.get()}?${params.toString()}`,
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
    
            return response?.data || { data: [], count: 0, success: true };
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    };

    public static open = async (id: number) => {
        try {
            const response = await request({
                url: UserEndpoints.open(id),
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            return response?.data || { data: {}, success: true };
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    };

    public static post = async (data: User) => {
        return await request({
            url: UserEndpoints.post(),
            method: "POST",
            data: data,
            headers: { "Content-Type": "application/json" }
        });
    };

    public static put = async (id: number, data: User) => {
        return await request({
            url: UserEndpoints.put(id),
            method: "PUT",
            data: data,
            headers: { "Content-Type": "application/json" }
        });
    };

    public static delete = async (id: number) => {
        return await request({
            url: UserEndpoints.delete(id),
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
    };
}
