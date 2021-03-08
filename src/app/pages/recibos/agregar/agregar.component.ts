import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Proveedor } from 'src/app/models/proveedor';
import { ProveedoresService } from '../../../services/proveedores/proveedores.service';
import { MonedasService } from '../../../services/monedas/monedas.service';
import { Moneda } from '../../../models/monedas';
import Swal from 'sweetalert2';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NumberSymbol } from '@angular/common';
import { RecibosService } from '../../../services/recibos/recibos.service';

export interface dataRecibo {
  Id_recibo: number
}

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})

export class AgregarComponent implements OnInit {
  
  recibo = new FormGroup({
    Id_proveedor: new FormControl('', Validators.required,),
    Id_moneda: new FormControl('', Validators.required),
    monto: new FormControl('',Validators.required),
    comentario: new FormControl('', [Validators.required, Validators.min(0.01)])
  });

  Id_Proveedor: number;
  Id_Moneda: number;
  autoComplete = new FormControl();
  autoCompleteMoneda = new FormControl();
  proveedores: Proveedor[];
  monedas: Moneda[];
  filteredOptions: Observable<any[]>;
  filteredOptionsMonedas: Observable<any[]>;

  edicion: boolean = false;

  folio: string= "";

  constructor(public dialogRef: MatDialogRef<AgregarComponent>,
              private provService: ProveedoresService,
              private recService: RecibosService,
              private monedaService: MonedasService,
              @Inject(MAT_DIALOG_DATA) public data: dataRecibo) { }

  async ngOnInit() {

    Swal.fire({
      title: 'Cargando datos.',
      text: 'Espere un momento por favor.',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
          Swal.showLoading()
      },
    });

    await this.consultaMonedas();
    await this.consultaProveedores();

    if(this.data.Id_recibo > 0){
    
      let respuesta = await this.recService.consultaRecibo(this.data.Id_recibo);
      this.recibo.controls["Id_proveedor"].setValue(respuesta.proveedorNombre);
      this.recibo.controls["Id_moneda"].setValue(respuesta.monedaNombre);
      this.recibo.controls["monto"].setValue(respuesta.monto);
      this.recibo.controls["comentario"].setValue(respuesta.comentario);

      this.Id_Proveedor = respuesta.proveedor_Id;
      this.Id_Moneda = respuesta.moneda_Id;

      this.edicion = true;
      this.folio = respuesta.folio;
    }

    Swal.close();
  }

  closeDialog() {
    this.dialogRef.close();
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

  async consultaMonedas(){
    this.monedas =  await this.monedaService.consultaMonedas();
    this.filteredOptionsMonedas = this.autoCompleteMoneda.valueChanges.pipe(
      startWith(''),
      map(value => this._filterMonedas(value))
    );
  }

  private _filterMonedas(value: string){
    const filterValue = value.toLowerCase();
    let moneda = this.monedas.filter(option => option.nombre.toLowerCase().includes(filterValue));
    if(value != ''){
      this.Id_Moneda = (moneda[0].Id_moneda || 0);
    }else{
      this.Id_Moneda = 0;
    }
    return this.monedas.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  async guardar(){
    if( (this.Id_Moneda || 0) === 0 || 
        (this.Id_Proveedor || 0) === 0 ||
        (this.recibo.controls["comentario"].value || '') === '',
        (this.recibo.controls["monto"].value || 0.0) === 0.0){
      Swal.fire({
        title: 'Campos requeridos',
        text: 'Los campos no deben estar vacios',
        icon: 'warning'
      });
      return;
    }

    Swal.fire({
      title: 'Guardando',
      text: 'Espere un momento por favor.',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
          Swal.showLoading()
      },
    });

    if(this.data.Id_recibo > 0){
      let respuesta = await this.recService.editaRecibo(
        this.data.Id_recibo, 
        this.Id_Moneda, 
        this.Id_Proveedor,
        this.recibo.controls["comentario"].value,
        this.recibo.controls["monto"].value
      )
      if(respuesta.status != undefined && respuesta.status != 200){
        Swal.fire({
          title: 'Error al editar el registro',
          text: respuesta.error.Message,
          icon: 'error' 
        });
        return;
      }
      Swal.close();
      Swal.fire({
        title: 'Correcto',
        text: 'El registro se edito correctamente',
        icon:'success'
      });
      this.closeDialog();
    }else{
      let respuesta = await this.recService.guardaRecibo(
        this.Id_Moneda, 
        this.Id_Proveedor,
        this.recibo.controls["comentario"].value,
        this.recibo.controls["monto"].value
      )
      if(respuesta.status != undefined && respuesta.status != 200){
        Swal.fire({
          title: 'Error al guardar el registro',
          text: respuesta.error.Message,
          icon: 'error' 
        });
        return;
      }
      Swal.close();
      Swal.fire({
        title: 'Correcto',
        text: `El registro se guardo correctamente con el folio ${respuesta}`,
        icon:'success'
      });
      this.closeDialog();
    }
  }
}
