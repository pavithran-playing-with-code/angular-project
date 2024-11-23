import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angularproject';

  displayedColumns: string[] = ['id', 'taskdescription', 'duedate', 'status', 'Action'];
  dataSource !: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService) {

  }

  ngOnInit(): void {
    this.getAlltask();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '30%',
      disableClose: true
    }).afterClosed().subscribe(val => {
      if (val == "save") {
        this.getAlltask();
      }
    })
  }

  getAlltask() {
    this.api.gettask()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          Swal.fire({
            title: 'Deleted!',
            text: 'Error occured while Fetching the record!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
      })
  }

  editTask(row: any) {
    this.dialog.open(DialogComponent, {
      width: '30%',
      data: row
    }).afterClosed().subscribe(val => {
      if (val == "update") {
        this.getAlltask();
      }
    })
  }

  deleteTask(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This task will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.deletetask(id)
          .subscribe({
            next: (res) => {
              Swal.fire({
                title: 'Deleted!',
                text: 'Task has been successfully deleted.',
                icon: 'success',
                confirmButtonText: 'OK'
              });
              this.getAlltask();
            },
            error: () => {
              Swal.fire({
                title: 'Error!',
                text: 'Error while deleting the task!',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
