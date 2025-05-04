import request from "../../request";
import qs from "qs";
import { EncounterEndpoints } from "./config";
import { ClinicalEncounter } from "../../../interfaces/ClinicalEncounter";

export default class EncounterService {
    public static get = async (searchText?: string) => {
        const params = new URLSearchParams();
        if (searchText && searchText.trim() !== '') {
            params.append('search', searchText.trim());
        }
    
        try {
            const response = await request({
                url: `${EncounterEndpoints.get()}?${params.toString()}`,
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
    
            return response?.data || { data: [], count: 0, success: true };
        } catch (error) {
            console.error("Error fetching encounters:", error);
            throw error;
        }
    };

    public static post = async (data: ClinicalEncounter) => {
        return await request({
            url: EncounterEndpoints.post(),
            method: "POST",
            data: qs.stringify(data),
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
    };

    public static put = async (data: ClinicalEncounter) => {
        return await request({
            url: EncounterEndpoints.put(),
            method: "POST",
            data: qs.stringify(data),
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
    };

    public static delete = async (id: number) => {
        return await request({
            url: EncounterEndpoints.delete(),
            method: "POST",
            data: qs.stringify({ id : id}),
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
    };
}
