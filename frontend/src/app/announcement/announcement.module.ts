import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementEditorComponent } from './announcement-editor/announcement-editor.component';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AnnouncementDetailsCard } from './widgets/announcement-details-card/announcement-details-card';

import { AnnouncementEditorComponent } from './announcement-editor/announcement-editor.component';
import { AnnouncementRoutingModule } from './announcement-routing.module';

/* UI Widgets */
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AnnouncementDetailsComponent } from './announcement-details/announcement-details.component';

@NgModule({
  declarations: [
    AnnouncementEditorComponent,
    AnnouncementDetailsComponent,
    AnnouncementDetailsCard
  ],

  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatListModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    AnnouncementRoutingModule,
    RouterModule,
    SharedModule
  ]
})
export class AnnouncementModule {}