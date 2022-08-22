import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TrainingDialogComponent } from './training-dialog/training-dialog.component';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {

  displayedColumns: string[] = ['subject', 'validity', 'necessity','department','action',];
   
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private dialog:MatDialog, 
    private trainingService:TrainingService,        
    ) { }

  ngOnInit(): void {
   this.getAlltraining();
  }
  openDialog() {    
    this.dialog.open(TrainingDialogComponent, {
      width:'600px',
    }).afterClosed().subscribe(val=>
      {
        if(val==='save')
        this.getAlltraining();
      })

  }
  getAlltraining(){
    this.trainingService.getTraining().subscribe({
      next:(res)=>{
        this.dataSource=new MatTableDataSource(res);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
      },
      error:()=>{
        alert('error while fetching the record');
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  edit(row:any){
    this.dialog.open(TrainingDialogComponent,{
      width:'600px',
      data:row,
    }).afterClosed().subscribe(val=>
      {
        if(val==='update')
        this.getAlltraining();
      })    
  }
  deleteTrainings(id:number){
    this.trainingService.deleteTraining(id)
    .subscribe({
      next:(res)=>{
        this.getAlltraining();
      },
      error:()=>{
        console.log("error on delete");

      }
    })
  }
}

