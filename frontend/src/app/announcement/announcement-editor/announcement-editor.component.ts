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
import { announcementDetailResolver } from '../announcement.resolver';

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
    path: ':slug/edit',
    component: AnnouncementEditorComponent,
    title: 'Announcement Editor',
    canActivate: [canActivateEditor],
    resolve: {
      profile: profileResolver,
      announcement: announcementDetailResolver
    }
  };

  /** Store the announcement.  */
  public announcement: Announcement = {
    id: null,
    author: 'test',
    organization: 'test org',
    slug: 'new',
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
  slug: string = this.announcement.slug;

  /** Add validators to the form */
  // author = new FormControl(this.announcement.author, [Validators.required]);

  organization = new FormControl(this.announcement.organization, [
    Validators.required
  ]);
  img = new FormControl(this.announcement.img, [Validators.maxLength(2000)]);
  main_story = new FormControl(this.announcement.main_story, [

    Validators.maxLength(1000000)

  ]);
  headline = new FormControl(this.announcement.headline, [
    Validators.maxLength(2000)
  ]);
  synopsis = new FormControl(this.announcement.synopsis, [
    Validators.maxLength(2000)
  ]);

  /** Announcement Editor Form */
  public announcementForm = this.formBuilder.group({
    // author: this.author,


    organization: this.organization,
    slug: this.slug,
    img: this.img,
    headline: this.headline,
    synopsis: this.synopsis,
    main_story: this.main_story


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
    const data = this.route.snapshot.data as {
      profile: Profile;
      announcement: Announcement;
    };
    this.profile = data.profile;
    this.announcement = data.announcement;
    /** Set announcement form data */
    this.announcementForm.setValue({
      // author: this.profile.first_name + ' ' + this.profile.last_name,

      organization: this.announcement.organization,
      slug: this.announcement.slug,
      img: this.announcement.img,
      headline: this.announcement.headline,
      synopsis: this.announcement.synopsis,
      main_story: this.announcement.main_story
    });
    /** Get id from the url */
    let announcement_slug = this.route.snapshot.params['slug'];
    this.slug = announcement_slug;

  }

  /** Event handler to handle submitting the Update Announcement Form.
   * @returns {void}
   */
  onSubmit(): void {
    console.log(this.announcementForm.valid);
    if (this.announcementForm.valid) {
      Object.assign(this.announcement, this.announcementForm.value);
      this.announcement.slug =
        this.announcement.organization +
        this.announcement.headline.slice(0, 10);
      if (this.slug == 'new') {

        this.announcementService
          .createAnnouncement(this.announcement)
          .subscribe({
            next: (announcement) => this.onSuccess(announcement),
            error: (err) => this.onError(err)
          });
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
    this.router.navigate([`/`]);
  }

  // /** Event handler to handle the first change in the announcement name field
  //  * Automatically generates a slug from the announcement name (that can be edited)
  //  * @returns {void}
  //  */
  // generateSlug(): void {
  //   const id = this.announcement.id;
  //   const slug = this.announcementForm.controls['slug'].value;
  //   if (id && !slug) {
  //     var generatedSlug = String(id).replace(/[^a-zA-Z0-9]/g, '-');
  //     this.announcementForm.setControl('slug', new FormControl(generatedSlug));
  //   }
  // }

  /** Opens a confirmation snackbar when an announcement is successfully updated.
   * @returns {void}
   */
  private onSuccess(announcement: Announcement): void {
    this.router.navigate(['/announcements/', this.announcement.slug]);


    let message: string =
      this.slug === 'new' ? 'Announcement Created' : 'Announcement Updated';

    this.snackBar.open(message, '', { duration: 2000 });
  }

  /** Opens a snackbar when there is an error updating an announcement.
   * @returns {void}
   */
  private onError(err: any): void {
    let message: string =
      this.slug === 'new'
        ? 'Error: Announcement Not Created'
        : 'Error: Announcement Not Updated';

    this.snackBar.open(message, '', {
      duration: 2000
    });
  }
  /** Event handler to handle submitting the Update Announcement Form.
   * @returns {void}
   */
  onPublish(): void {
    this.announcement.author =
      this.profile?.first_name + ' ' + this.profile?.last_name;
    this.announcement.state = 'published';
    if (this.announcementForm.valid) {
      Object.assign(this.announcement, this.announcementForm.value);
      if (this.slug == 'new') {
        this.announcement.slug =
          this.announcement.organization +
          this.announcement.headline.slice(0, 10);
        this.announcementService
          .createAnnouncement(this.announcement)
          .subscribe({
            next: (announcement) => this.onSuccess(announcement),
            error: (err) => this.onError(err)
          });
      } else {
        this.announcement.state = 'published';
        this.announcementService
          .updateAnnouncement(this.announcement)
          .subscribe({
            next: (announcement) => this.onSuccess(announcement),
            error: (err) => this.onError(err)
          });
      }
    }
  }
  onPreview(): void {
    this.announcement.author =
      this.profile?.first_name + ' ' + this.profile?.last_name;
    if (this.announcementForm.valid) {
      Object.assign(this.announcement, this.announcementForm.value);
      this.announcement.state = 'draft';
      if (this.slug == 'new') {
        this.announcement.slug =
          this.announcement.organization +
          this.announcement.headline.slice(0, 10);
        this.announcementService
          .createAnnouncement(this.announcement)
          .subscribe({
            next: (announcement) => this.onSuccess(announcement),
            error: (err) => this.onError(err)
          });
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
  // onDelete(): void {
  //   this.announcementService
  //     .deleteAnnouncement(this.announcement.slug)
  //     .subscribe({
  //       error: (err) => this.onError(err)
  //     });
  // }
}
