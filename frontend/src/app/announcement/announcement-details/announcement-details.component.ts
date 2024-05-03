import { Component } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ResolveFn,
  Route
} from '@angular/router';
import { announcementDetailResolver } from '../announcement.resolver';
import { profileResolver } from 'src/app/profile/profile.resolver';
import { Profile } from 'src/app/models.module';
import { Announcement } from '../announcement.model';
import { MatSnackBar } from '@angular/material/snack-bar';

let titleResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  return route!.data['announcement']?.headline;
};
@Component({
  selector: 'app-announcement-details',
  templateUrl: './announcement-details.component.html',
  styleUrls: ['./announcement-details.component.css']
})
export class AnnouncementDetailsComponent {
  public static Route: Route = {
    path: 'announcements/:slug',
    component: AnnouncementDetailsComponent,
    resolve: {
      profile: profileResolver,
      announcement: announcementDetailResolver
    },
    children: [
      {
        path: '',
        title: 'Announcement',
        component: AnnouncementDetailsComponent
      }
    ]
  };
  public profile: Profile;
  public announcement: Announcement;

  constructor(
    private route: ActivatedRoute,
    protected snackBar: MatSnackBar
  ) {
    /** Initialize data from resolvers. */
    const data = this.route.snapshot.data as {
      profile: Profile;
      announcement: Announcement;
    };
    this.profile = data.profile;
    this.announcement = data.announcement;
  }
}
