import request from "../../request";
import { EncounterEndpoints } from "./config";
import { ClinicalEncounter } from "../../../interfaces/ClinicalEncounter";

export default class EncounterService {
    public static get = async ({ searchText, patientId }: { searchText?: string, patientId?: number }) => {
        const params = new URLSearchParams();
        if (searchText && searchText.trim() !== '') {
            params.append('search', searchText.trim());
        }

        if (patientId) {
            params.append('patientId', patientId.toString());
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

    public static open = async (id: number) => {
        try {
            const response = await request({
                url: EncounterEndpoints.open(id),
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            return response?.data || { data: {}, success: true };
        } catch (error) {
            console.error("Error fetching encounters:", error);
            throw error;
        }
    };

    public static post = async (data: ClinicalEncounter) => {
        return await request({
            url: EncounterEndpoints.post(),
            method: "POST",
            data: data,
            headers: { "Content-Type": "application/json" }
        });
    };

    public static put = async (id: number, data: ClinicalEncounter) => {
        return await request({
            url: EncounterEndpoints.put(id),
            method: "PUT",
            data: data,
            headers: { "Content-Type": "application/json" }
        });
    };

    public static delete = async (id: number) => {
        return await request({
            url: EncounterEndpoints.delete(id),
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
    };

    public static initEncounter = async (id: number, tenantId: number) => {
        return await request({
            url: EncounterEndpoints.initEncounter(id),
            method: "PUT",
            data: { tenantId },
            headers: { "Content-Type": "application/json" }
        });
    };
}
