import { Component } from '@angular/core';
import { profileResolver } from 'src/app/profile/profile.resolver';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile } from '/workspace/frontend/src/app/profile/profile.service';
import { announcementResolver } from 'src/app/announcement/announcement.resolver';
import { Announcement } from 'src/app/announcement/announcement.model';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  /** Route information to be used in Homepage Routing Module */
  public static Route = {
    path: '',
    title: 'Homepage',
    component: HomepageComponent,
    canActivate: [],
    resolve: {
      profile: profileResolver,
      announcements: announcementResolver
    }
  };
  /** Store Observable list of Announcements */
  public announcements: Announcement[];

  /** Store searchBarQuery */
  public searchBarQuery = '';

  /** Store the currently-logged-in user's profile.  */
  public profile: Profile;

  /** Stores the user permission value for current organization. */
  public permValues: Map<number, number> = new Map();

  constructor(
    private route: ActivatedRoute,
    protected snackBar: MatSnackBar
  ) {
    /** Initialize data from resolvers. */
    const data = this.route.snapshot.data as {
      profile: Profile;
      announcements: Announcement[];
    };
    this.profile = data.profile;
    this.announcements = data.announcements;
  }
}
