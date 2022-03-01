import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TrainerComponentRoutingModule} from './trainer-routing.module';
import { TrainerComponent } from './trainer.component';
import {InfoDialogComponent} from '../modal/info/info.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrainerComponentRoutingModule,
  ],
  declarations: [
    TrainerComponent,
    InfoDialogComponent,
  ]
})
export class TrainerComponentModule {}
