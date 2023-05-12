export interface Client{
    id: number,
    plate: string,
    admissionDateTime: string|null,
    electricHybrid: boolean,
    placeId: number,
    depatureDateTime: string|null,
    discount: boolean,
    vehicleTypeId: number,
    totalPay: string|null,
    state:boolean
}