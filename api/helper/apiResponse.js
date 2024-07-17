class apiResponse{
    constructor(data,message='success',status){
        this.data = data;
        this.message = message;
        this.status = status;
        this.success = status >= 200 && status < 400;
        this.error = status >= 400;
    }
}
export default apiResponse;