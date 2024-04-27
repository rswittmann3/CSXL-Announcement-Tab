import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Announcement } from '/workspace/frontend/src/app/announcement/announcement.model';
import { permissionGuard } from 'src/app/permission.guard';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminAnnouncementService } from '../../admin-announcement.service';

@Component({
  selector: 'app-admin-announcement-list',
  templateUrl: './admin-announcement-list.component.html',
  styleUrls: ['./admin-announcement-list.component.css']
})
export class AdminAnnouncementListComponent {
  public announcements$: Observable<Announcement[]>;
  public displayedColumns: string[] = ['headline'];

  public static Route = {
    path: 'announcements',
    component: AdminAnnouncementListComponent,
    title: 'Announcement Administration',
    canActivate: [permissionGuard('announcement.list', 'announcement')]
  };

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private adminAnnouncementService: AdminAnnouncementService
  ) {
    this.announcements$ = adminAnnouncementService.announcements$;
    adminAnnouncementService.list();
  }
  createAnnouncement(): void {
    // Navigate to the announcement editor for a new announcement (slug = create)
    this.router.navigate(['announcements', 'new', 'edit']);
  }
  deleteAnnouncement(announcement: Announcement): void {
    let confirmDelete = this.snackBar.open(
      'Are you sure you want to delete this announcement?',
      'Delete',
      { duration: 15000 }
    );
    confirmDelete.onAction().subscribe(() => {
      this.adminAnnouncementService
        .deleteAnnouncement(announcement)
        .subscribe(() => {
          this.snackBar.open('This announcement has been deleted.', '', {
            duration: 2000
          });
        });
    });
  }
}
