import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivateFn,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { profileResolver } from 'src/app/profile/profile.resolver';
import { PermissionService } from 'src/app/permission.service';
import { Announcement } from '../announcement.model';
import { AnnouncementService } from '../announcement.service';
import { Profile } from 'src/app/profile/profile.service';
//import { announcementResolver } from '../announcement.resolver';

//todo
const canActivateEditor: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  /** Determine if page is viewable by user based on permissions */

  let slug: string = route.params['slug'];

  if (slug === 'new') {
    return inject(PermissionService).check(
      'announcement.create',
      'announcement'
    );
  } else {
    return inject(PermissionService).check(
      'announcement.update',
      `announcement/${slug}`
    );
  }
};

@Component({
  selector: 'app-announcement-editor',
  templateUrl: './announcement-editor.component.html',
  styleUrls: ['./announcement-editor.component.css']
})
export class AnnouncementEditorComponent {
  public static Route: Route = {
    path: 'edit',
    component: AnnouncementEditorComponent,
    title: 'Announcement Editor',
    canActivate: [canActivateEditor],
    resolve: {
      profile: profileResolver
      //announcement: announcementResolver
    }
  };

  /** Store the announcement.  */
  public announcement: Announcement = {
    id: 0,
    author: 'test',
    organization: 'test org',
    slug: 'test slug',
    img: 'test img url',
    headline: 'test headline',
    synopsis: 'test synopsis',
    main_story: 'test main story',
    state: 'draft',
    published_date: '',
    modified_date: ''
  };

  /** Store the currently-logged-in user's profile.  */
  public profile: Profile | null = null;

  /** Store the announcement id. */
  announcement_slug: string = 'new';
  id = 0;
  /** Add validators to the form */
  author = new FormControl('', [Validators.required]);
  slug = '0';
  organization = new FormControl('', [Validators.required]);
  img = new FormControl('', [Validators.maxLength(2000)]);
  main_story = new FormControl('', [Validators.maxLength(2000)]);
  headline = new FormControl('', [Validators.maxLength(2000)]);
  synopsis = new FormControl('', [Validators.maxLength(2000)]);
  state = 'draft';
  /** Announcement Editor Form */
  public announcementForm = this.formBuilder.group({
    id: this.id,
    author: this.author,
    organization: this.organization,
    slug: this.slug,
    img: this.img,
    headline: this.headline,
    synopsis: this.synopsis,
    main_story: this.main_story,
    state: this.state
  });

  /** Constructs the announcement editor component */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected formBuilder: FormBuilder,
    protected snackBar: MatSnackBar,
    private announcementService: AnnouncementService
  ) {
    /** Initialize data from resolvers. */
    // const data = this.route.snapshot.data as {
    //   profile: Profile;
    //   announcement: Announcement;
    // };
    // this.profile = data.profile;
    // this.announcement = data.announcement;
    // /** Set announcement form data */
    // this.announcementForm.setValue({
    //   id: this.announcement.id,
    //   author: this.announcement.author,
    //   organization: this.announcement.organization,
    //   slug: this.announcement.slug,
    //   img: this.announcement.img,
    //   headline: this.announcement.headline,
    //   synopsis: this.announcement.synopsis,
    //   main_story: this.announcement.main_story,
    //   state: this.announcement.state
    // });
    // /** Get id from the url */
    // let announcement_slug = this.route.snapshot.params['slug'];
    // this.announcement_slug = announcement_slug;
  }

  /** Event handler to handle submitting the Update Announcement Form.
   * @returns {void}
   */
  onSubmit(): void {
    if (this.announcementForm.valid) {
      Object.assign(this.announcement, this.announcementForm.value);
      if (this.announcement_slug == 'new') {
        this.announcementService.createAnnouncement(this.announcement);
      } else {
        this.announcementService
          .updateAnnouncement(this.announcement)
          .subscribe({
            next: (announcement) => this.onSuccess(announcement),
            error: (err) => this.onError(err)
          });
      }
    }
  }

  /** Event handler to handle cancelling the editor and going back to
   * the previous announcement page.
   * @returns {void}
   */
  onCancel(): void {
    this.router.navigate([`announcements/${this.announcement_slug}`]);
  }

  /** Event handler to handle the first change in the announcement name field
   * Automatically generates a slug from the announcement name (that can be edited)
   * @returns {void}
   */
  generateSlug(): void {
    const id = this.announcementForm.controls['id'].value;
    const slug = this.announcementForm.controls['slug'].value;
    if (id && !slug) {
      var generatedSlug = String(id).replace(/[^a-zA-Z0-9]/g, '-');
      this.announcementForm.setControl('slug', new FormControl(generatedSlug));
    }
  }

  /** Opens a confirmation snackbar when an announcement is successfully updated.
   * @returns {void}
   */
  private onSuccess(announcement: Announcement): void {
    this.router.navigate(['/announcements/', announcement.slug]);

    let message: string =
      this.announcement_slug === 'new'
        ? 'Announcement Created'
        : 'Announcement Updated';

    this.snackBar.open(message, '', { duration: 2000 });
  }

  /** Opens a snackbar when there is an error updating an announcement.
   * @returns {void}
   */
  private onError(err: any): void {
    let message: string =
      this.announcement_slug === 'new'
        ? 'Error: Announcement Not Created'
        : 'Error: Announcement Not Updated';

    this.snackBar.open(message, '', {
      duration: 2000
    });
  }
}
