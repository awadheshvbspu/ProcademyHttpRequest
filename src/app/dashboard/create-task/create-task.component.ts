import { Component,EventEmitter, Output,Input,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from '../../Model/Task';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
  @Input() isEditMode: boolean = false;

  @Input() selectedTask: Task;

  @ViewChild('taskForm') taskForm: NgForm;
  @Output()
  CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  EmitTaskdata: EventEmitter<Task> =new EventEmitter<Task>();

ngAfterViewInit(){
  this.taskForm.setValue(this.selectedTask);
  setTimeout(() => {
    this.taskForm.form.patchValue(this.selectedTask);
  }, 0);
}

  OnCloseForm(){
    this.CloseForm.emit(false);
  }

OnFormSubmitted(form:NgForm){
    this.EmitTaskdata.emit(form.value);
     console.log(form.value);
     this.CloseForm.emit(false)
  }
}
