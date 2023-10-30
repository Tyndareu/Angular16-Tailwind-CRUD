import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { Error404PageComponent } from './error404-page/error404-page.component';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './components/loading/loading.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [Error404PageComponent, LoadingComponent, ModalComponent],
  exports: [Error404PageComponent, LoadingComponent, ModalComponent],
})
export class SharedModule {}
