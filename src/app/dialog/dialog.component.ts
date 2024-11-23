import { Component, Inject, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  taskmanagementForm !: FormGroup;
  isEditing: boolean = false;
  actionBtn: string = "save"

  constructor(private formbuilder: FormBuilder, private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>) {

  }

  ngOnInit(): void {
    this.taskmanagementForm = this.formbuilder.group({
      taskdescription: ['', Validators.required],
      duedate: ['', Validators.required],
      status: ['incomplete', Validators.required]
    });

    if (this.editData) {
      this.actionBtn = "Update";
      this.isEditing = true;
      this.taskmanagementForm.controls['taskdescription'].setValue(this.editData.taskdescription);
      this.taskmanagementForm.controls['duedate'].setValue(this.editData.duedate);
      this.taskmanagementForm.controls['status'].setValue(this.editData.status);
    }

  }

  addtask() {
    if (!this.editData) {
      if (this.taskmanagementForm.valid) {
        this.api.posttask(this.taskmanagementForm.value)
          .subscribe({
            next: (res) => {
              this.isEditing = false;
              Swal.fire({
                title: 'Success!',
                text: 'Task has been added successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
              }); 
              this.taskmanagementForm.reset();
              this.dialogRef.close('save');
            },
            error: () => {
              Swal.fire({
                title: 'Error!',
                text: 'Error while adding the task!',
                icon: 'success',
                confirmButtonText: 'OK'
              }); 
            }
          })
      };
    }
    else {
      this.updateTask();
    }
  }

  updateTask() {
    this.api.puttask(this.taskmanagementForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          Swal.fire({
            title: 'Success!',
            text: 'Task has been updted successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }); 
          this.taskmanagementForm.reset();
          this.dialogRef.close('update');
        },
        error: () => {
          Swal.fire({
            title: 'Error!',
            text: 'Error while updating the task!',
            icon: 'success',
            confirmButtonText: 'OK'
          }); 
        }
      })
  }
}
