import { Component } from '@angular/core';
import { AnnouncementPreview } from 'src/app/announcement/widgets/announcement-preview/announcement-preview.widget';
import { profileResolver } from 'src/app/profile/profile.resolver';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile } from '/workspace/frontend/src/app/profile/profile.service';

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
      profile: profileResolver
      // announcement: announcementResolver
    }
  };
  /** Store Observable list of Announcements */
  // public announcements: AnnouncementPreview[];

  /** Store searchBarQuery */
  public searchBarQuery = '';

  /** Store the currently-logged-in user's profile.  */
  public profile: Profile;

  constructor(
    private route: ActivatedRoute,
    protected snackBar: MatSnackBar
  ) {
    /** Initialize data from resolvers. */
    const data = this.route.snapshot.data as {
      profile: Profile;
      // announcements: AnnouncementPreview[];
    };
    this.profile = data.profile;
    //this.announcements = data.announcements;
  }
}
