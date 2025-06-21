import { IGemini, IReportEncounter } from "../../../interfaces/Gemini";
import request from "../../request";
import { GeminiEndpoints } from "./config";

export default class GeminiService {
    public static post = async (data: IGemini) => {
        return await request({
            url: GeminiEndpoints.post(),
            method: "POST",
            data: data,
            headers: { "Content-Type": "application/json" }
        });
    };

    public static report = async (data: IReportEncounter) => {
        return await request({
            url: GeminiEndpoints.report(),
            method: "POST",
            data: data,
            headers: { "Content-Type": "application/json" }
        });
    };
}
