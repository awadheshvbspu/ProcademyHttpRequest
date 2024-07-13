import { Component, OnInit, inject } from '@angular/core';
import { Task } from '../Model/Task';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { TaskService } from '../Services/task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  showCreateTaskForm: boolean = false;
  showTaskDetails: boolean = false;
  http: HttpClient = inject(HttpClient)
  allTasks: Task[] = [];
  taskService: TaskService = inject(TaskService);
  currentTaskId: string = '';
  isLoading: boolean = false;

  currentTask: Task | null = null;

  errorMessage: string | null = null;

  editMode: boolean = false;
  selectedTask: Task;

  errorSub: Subscription

  ngOnInit(){
    this.fetchAllTasks();
    this.errorSub = this.taskService.errorSubject.subscribe({next: (httpError) => {
      this.setErrorMessage(httpError);
    }})
  }

  ngOnDestroy(){
    this.errorSub.unsubscribe();
  }

  OpenCreateTaskForm(){
    this.showCreateTaskForm = true;
    this.editMode = false;
    this.selectedTask = {title: '', desc: '', assignedTo: '', createdAt: '', priority: '', status: ''}
  }

  showCurrentTaskDetails(id: string | undefined){
    this.showTaskDetails = true;
    this.taskService.getTaskDetails(id).subscribe({next: (data: Task) => {
      this.currentTask = data;
    }});
  }

  CloseTaskDetails(){
    this.showTaskDetails = false;
  }

  CloseCreateTaskForm(){
    this.showCreateTaskForm = false;
  }

  CreateOrUpdateTask(data: Task){
    if(!this.editMode)
      this.taskService.CreateTask(data);
    else
      this.taskService.UpdateTask(this.currentTaskId, data);
  }

  /*{
    key1: {},
    key2: {}
  }*/

  FetchAllTaskClicked(){
    this.fetchAllTasks()
  }
  // CreateTask(data:Task){
  //       this.taskService.CreateTask(data);
  //     }
  private fetchAllTasks(){
    this.isLoading = true;
    this.taskService.GetAlltasks().subscribe({next: (tasks) => {
      this.allTasks = tasks;
      this.isLoading = false;
    }, error: (error) => {
      this.setErrorMessage(error);
      this.isLoading = false;
    }})
  }

  private setErrorMessage(err: HttpErrorResponse){
    if(err.error.error === 'Permission denied'){
      this.errorMessage = 'You do not have permisssion to perform this action';
    }
    else{
      this.errorMessage = err.message;
    }

    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }

  DeleteTask(id: string | undefined){
    this.taskService.DeleteTask(id);
  }

  DeleteAllTask(){
    this.taskService.DeleteAllTasks();
  }

  OnEditTaskClicked(id: string | undefined){
    this.currentTaskId = id;
    
    //OPEN EDIT TASK FORM
    this.showCreateTaskForm = true;
    this.editMode = true;

    this.selectedTask = this.allTasks.find((task) => {return task.id === id})
  }
}

// import { Component, OnInit, inject } from '@angular/core';
// import { Task } from '../Model/Task';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { map } from 'rxjs';
// import { TaskService } from '../Services/task.service';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent implements OnInit{
//   showCreateTaskForm: boolean = false;
//   allTasks: Task[] = [];
//   taskService: TaskService = inject(TaskService);

  
//   ngOnInit(){
//   this.fetchAllTasks();
//   }
//   http:HttpClient =inject(HttpClient)

//   OpenCreateTaskForm(){
//     this.showCreateTaskForm = true;
//   }

//   CloseCreateTaskForm(){
//     this.showCreateTaskForm = false;
//   }

//   CreateTask(data:Task){
//     this.taskService.CreateTask(data);
//   }
//   FetchAllTaskClicked(){
//     this.fetchAllTasks();
//   } 
//   private fetchAllTasks(){
//   this.http.get<{[key:string]:Task}>('https://angularhttp-client-75a29-default-rtdb.firebaseio.com/tasks.json').pipe(map((response)=>{
//     //transform the data
//     let tasks=[];

//     for(let key in response){
//       if(response.hasOwnProperty(key)){

//         tasks.push({...response[key], id: key})
//       };
//     }
//     return tasks;
//   })).subscribe((tasks)=>{
//     this.allTasks=tasks;
// console.log(tasks);

//   })
//   }
//   DeleteTask(id:string | undefined){
//    this.http.delete('https://angularhttp-client-75a29-default-rtdb.firebaseio.com/tasks/' +id+ '.json').subscribe((res) =>{
//     console.log(res);
//     this.fetchAllTasks();
//    })
//   }
//   DeleteAllTask(){
//   this.http.delete('https://angularhttp-client-75a29-default-rtdb.firebaseio.com/tasks/tasks.json')
// .subscribe((res)=>{
//   this.fetchAllTasks();
// })
//   }
// }
