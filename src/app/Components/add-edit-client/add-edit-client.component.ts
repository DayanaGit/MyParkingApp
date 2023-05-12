import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Client } from 'src/app/Interfaces/Client';
import { Place } from 'src/app/Interfaces/Place';
import { ClientService } from 'src/app/Services/client.service';
import { PlaceService } from 'src/app/Services/place.service';
import { MAT_DATE_FORMATS} from "@angular/material/core";

import * as moment from 'moment';

export const MY_DATE_FORMATS = {
  parse:{
    dateInput:'DD/MM/YYYY',
  },
  display:{
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLaber: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-add-edit-client',
  templateUrl: './add-edit-client.component.html',
  styleUrls: ['./add-edit-client.component.css']
})
export class AddEditClientComponent implements OnInit{
  formClient: FormGroup;
  titleAction:string = "New";
  buttonAction: string = "Save";
  placesList: Place[] = [];
  isSlideChecked: FormControl = new FormControl();
  vehicleTypeSelected: FormControl = new FormControl();
  checked: boolean = false;
  selectEnable:boolean = true;

  constructor(
    private dialogRef: MatDialogRef<AddEditClientComponent>,
    private fb: FormBuilder, 
    private _snackBar: MatSnackBar, 
    private _clientService: ClientService,
    private _placeService: PlaceService,
    @Inject(MAT_DIALOG_DATA)public dataClient:Client
    ){
      this.formClient = this.fb.group({ 
        plate: ["", Validators.required],
        electricHybrid: [false,Validators.required],
        placeId: ["",{disabled: true},Validators.required],
        vehicleTypeId:["",Validators.required],
        depatureDateTime:[""],
        discount:[false]
       })
    }
  ngOnInit(): void {
    if(this.dataClient){
      this.formClient.patchValue({
        id:this.dataClient.id,
        plate: this.dataClient.plate,
        admissionDateTime: moment(this.dataClient.admissionDateTime).format('YYYY-MM-DD HH:mm:ss').toString(),
        electricHybrid:this.dataClient.electricHybrid,
        placeId: this.dataClient.placeId,
        depatureDateTime: moment(this.dataClient.depatureDateTime).format('YYYY-MM-DD HH:mm:ss').toString(),
        discount: this.dataClient.discount,
        vehicleTypeId: this.dataClient.vehicleTypeId,
        totalPay: this.dataClient.totalPay,
        state: this.dataClient.state
      })
      this.titleAction = "Edit";
      this.buttonAction = "Edit"
    }
  }
    showAlert(msg:string, action:string){
      this._snackBar.open(msg,action,{
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 3000
      });
    }
    addEditClient(){
      const model: Client = {
        id: this.formClient.value.id,
        plate: this.formClient.value.plate,
        electricHybrid: this.checked,
        placeId: this.formClient.value.placeId,
        discount: this.formClient.value.discount,
        vehicleTypeId: this.formClient.value.vehicleTypeId,
        admissionDateTime: null,
        depatureDateTime: moment(this.formClient.value.depatureDateTime).format('YYYY-MM-DD HH:mm:ss').toString(),
        totalPay: this.formClient.value.totalPay,
        state: this.formClient.value.state
      }
      if(this.dataClient == null){
        this._clientService.addClient(model).subscribe({
          next:(data)=>{
            this.showAlert("Client was created","Ready");
            this.dialogRef.close("created");
          },error:(e)=>{
            this.showAlert("Could not create client","Error");
          }
        })
      }else{
        console.log("modeled",model);
        /*this._clientService.updateClient(model).subscribe({
          next:(data)=>{
            this.showAlert("Client was edited","Ready");
            this.dialogRef.close("edited");
          },error:(e)=>{
            this.showAlert("Could not edit client","Error");
          }
        })*/
      }
    }
    onChange() {
      this.checked = this.isSlideChecked.value;
      if(this.checked == true){
        this.formClient.value.discount = true;
      }
    }
    vehicleSelect(){
      var placesAvailable: Place[] = [];
      this.placesList = [];
      this._placeService.getPlaces().subscribe({
        next:(data)=>{
          placesAvailable = data;
          for(let i of placesAvailable){
            if(i.vehicleTypeId == this.formClient.value.vehicleTypeId){
              this.placesList.push(i);
            }
          }
          console.log("placesavaila",this.placesList)
          if(this.placesList !== null){
            this.formClient.get('placeId')?.enable();
          }else{
            this.showAlert("There are no places available","Error");
          }
        },error:(e)=>{}
      })
    }
}

