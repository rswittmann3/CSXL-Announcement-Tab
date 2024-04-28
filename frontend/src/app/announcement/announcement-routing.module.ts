import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementEditorComponent } from './announcement-editor/announcement-editor.component';
import { AnnouncementDetailsComponent } from './announcement-details/announcement-details.component';

const routes: Routes = [
  AnnouncementEditorComponent.Route,
  AnnouncementDetailsComponent.Route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementRoutingModule {}
