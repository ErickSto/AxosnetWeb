import { Component, OnInit } from '@angular/core';
import { RecibosService } from '../../services/recibos/recibos.service';
import { Proveedor } from '../../models/proveedor';
import { Observable } from 'rxjs';
import { ProveedoresService } from '../../services/proveedores/proveedores.service';
import { FormControl, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ReciboConsulta } from 'src/app/models/recibo';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AgregarComponent } from './agregar/agregar.component';


@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.component.html',
  styleUrls: ['./recibos.component.css']
})
export class RecibosComponent implements OnInit {

  paramsBusqueda = new FormGroup({
    Id_proveedor: new FormControl(''),
    fechaInicio: new FormControl(''),
    fechaFin: new FormControl('')
  });

  Id_Proveedor: number;
  autoComplete = new FormControl();
  proveedores: Proveedor[];
  filteredOptions: Observable<any[]>;

  pagina: number = 1;
  regPagina: number = 50;
  totalRegistros: number = 0;

  displayedColumns: string[] = ['Folio', 'Proveedor', 'Monto', 'Moneda', 'Fecha', 'Creado', 'Modificado', 'Acciones'];

  dataSource: ReciboConsulta[]

  constructor(private recService: RecibosService,
              private provService: ProveedoresService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.consultaProveedores();
    this.consultarRecibos();
  }

  async consultaProveedores(){
    this.proveedores =  await this.provService.consultaProveedores();
    this.filteredOptions = this.autoComplete.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string){
    const filterValue = value.toLowerCase();
    let proveedor = this.proveedores.filter(option => option.nombre.toLowerCase().includes(filterValue));
    if(value != ''){
      this.Id_Proveedor = (proveedor[0].Id_proveedor || 0);
    }else{
      this.Id_Proveedor = 0;
    }
    return this.proveedores.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  async consultarRecibos(){
    let respuesta = await this.recService.consultaRecibos(
      new Date(this.paramsBusqueda.controls["fechaInicio"].value || '1900-01-01').toISOString().substr(0,10),
      new Date(this.paramsBusqueda.controls["fechaFin"].value || '1900-01-01').toISOString().substr(0,10),
      (this.Id_Proveedor || 0),
      this.pagina,
      this.regPagina
    )
    this.dataSource = respuesta;
    this.totalRegistros = this.dataSource[0].totalRegistros;
  }

  async eliminarRecibo(recibo: ReciboConsulta){
    Swal.fire({
      title: 'Eliminar',
      text: "¿Realmente desea eliminar el registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Si, quiero eliminarlo.',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let respuesta = await this.recService.eliminarRecibo(recibo.Id_recibo);
        this.consultarRecibos();        
      }
    })

  }

  editar(recibo: ReciboConsulta){
    let dialogRef = this.dialog.open(AgregarComponent, {
      height: 'auto',
      width: '600px',
      data: { 
        Id_recibo: recibo.Id_recibo
      },
    })

    dialogRef.afterClosed().subscribe(x => {
      this.consultarRecibos();
    });
  }

  agregar(){
    let dialogRef = this.dialog.open(AgregarComponent, {
      height: 'auto',
      width: '600px',
      data: { 
        Id_recibo: 0
      },
    })
    dialogRef.afterClosed().subscribe(x => {
      this.consultarRecibos();
    });
  }

  changePagina(event: any){
    this.regPagina = event.pageSize;
    this.pagina = event.pageIndex + 1;
    this.consultarRecibos()
  }
}
