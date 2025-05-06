import request from "../../request";
import { PatientEndpoints } from "./config";
import { Patient } from "../../../interfaces/Patient";

export default class PatientService {
    public static get = async (searchText?: string) => {
        const params = new URLSearchParams();
        if (searchText && searchText.trim() !== '') {
            params.append('search', searchText.trim());
        }
    
        try {
            const response = await request({
                url: `${PatientEndpoints.get()}?${params.toString()}`,
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
    
            return response?.data || { data: [], count: 0, success: true };
        } catch (error) {
            console.error("Error fetching patients:", error);
            throw error;
        }
    };

    public static post = async (data: Patient) => {
        return await request({
            url: PatientEndpoints.post(),
            method: "POST",
            data: data,
            headers: { "Content-Type": "application/json" }
        });
    };

    public static put = async (id: number, data: Patient) => {
        return await request({
            url: PatientEndpoints.put(id),
            method: "PUT",
            data: data,
            headers: { "Content-Type": "application/json" }
        });
    };

    public static delete = async (id: number) => {
        return await request({
            url: PatientEndpoints.delete(id),
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
    };
}
