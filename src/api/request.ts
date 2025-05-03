import {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse
} from "axios";
import api from "./axios";

const request = async (options: AxiosRequestConfig) => {
    const onSucess = (response: AxiosResponse) => {
        const { data } = response;
        return data;
    };

    const onError = function (error: AxiosError) {
        return Promise.reject({
            message: error.message,
            code: error.code,
            response: error.response
        })
    };

    return api(options).then(onSucess).catch(onError);
};

export default request;