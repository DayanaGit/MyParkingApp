import { AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { Client } from 'src/app/Interfaces/Client';
import { ClientService } from 'src/app/Services/client.service';
import { MatDialog} from '@angular/material/dialog';
import { AddEditClientComponent } from '../add-edit-client/add-edit-client.component';
import { MatSnackBar} from '@angular/material/snack-bar';
import { DialogDeleteComponent } from 'src/app/Dialogs/dialog-delete/dialog-delete.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit{

  displayedColumns: string[] = ['id','plate', 'place', 'admissionDateTime', 'depatureDateTime', 'vehicleTypeId', 'electricHybrid', 'discount','totalPay','Actions'];
  dataSource = new MatTableDataSource<Client>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private _clientService: ClientService, public dialog: MatDialog, private _snackBar:MatSnackBar) { }

  ngOnInit(): void {
    this.showClients();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  showAlert(msg:string, action:string){
    this._snackBar.open(msg,action,{
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }
  showClients(){
    this._clientService.getClients().subscribe({
      next:(res) => {
        console.log("data clients",res);
        this.dataSource.data = res;
      },error:(e) =>{
        console.log("error getclients",e);
      }
    })
  }
  dialogAddClient() {
    this.dialog.open(AddEditClientComponent,{
      disableClose:true,
      width:"700px"
    }).afterClosed().subscribe(res =>{
      if(res === "created"){
        this.showClients();
      }
    });
  }
  dialogEditClient(dataClient:Client) {
    this.dialog.open(AddEditClientComponent,{
      disableClose:true,
      width:"700px",
      data:dataClient
    }).afterClosed().subscribe(res =>{
      if(res === "edited"){
        this.showClients();
      }
    });
  }
  dialogDeleteClient(dataClient: Client){
    this.dialog.open(DialogDeleteComponent,{
      disableClose:true,
      data:dataClient
    }).afterClosed().subscribe(res =>{
      if(res === "delete"){
        this._clientService.deleteClient(dataClient.id).subscribe({
          next:(data)=>{
            this.showAlert("Client deleted","Ready");
            this.showClients();
          },error:(e)=>{console.log(e)}
        })
        
      }
    });
  }
}
