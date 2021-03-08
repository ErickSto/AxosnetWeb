export class ReciboBusqueda{
    fechaInicio: Date;
    fechaFin: Date;
    Id_Proveedor: number;
    constructor(){
        this.fechaInicio = new Date();
        this.fechaFin = new Date();
        this.Id_Proveedor = 0;
    }
}