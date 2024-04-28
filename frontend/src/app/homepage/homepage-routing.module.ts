import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AnnouncementDetailsComponent } from '../announcement/announcement-details/announcement-details.component';

const routes: Routes = [
  HomepageComponent.Route,
  AnnouncementDetailsComponent.Route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageRoutingModule {}
