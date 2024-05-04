import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { RxAnnouncement } from '../../announcement/rx-announcement';
import { Announcement } from '../../announcement/announcement.model';

@Injectable({ providedIn: 'root' })
export class AdminAnnouncementService {
  private announcements: RxAnnouncement = new RxAnnouncement();
  public announcements$: Observable<Announcement[]> = this.announcements.value$;

  constructor(protected http: HttpClient) {}

  /** Returns a list of all Announcements
   * @returns {Observable<Announcements[]>}
   */
  list(): void {
    this.http
      .get<Announcement[]>('/api/announcements')
      .subscribe((announcements) => this.announcements.set(announcements));
  }

  /** Creates an announcement
   * @param newAnnouncement: Announcement object that you want to add to the database
   * @returns {Observable<Organization>}
   */
  createAnnouncement(newAnnouncement: Announcement): Observable<Announcement> {
    return this.http
      .post<Announcement>('/api/announcements', newAnnouncement)
      .pipe(
        tap((announcement) => this.announcements.pushAnnouncement(announcement))
      );
  }

  /** Deletes an announcement
   * @param announcement_id: id of the announcement object to delete
   * @returns {Observable<Organization>}
   */
  deleteAnnouncement(
    announcementToRemove: Announcement
  ): Observable<Announcement> {
    return this.http
      .delete<Announcement>(`/api/announcements/${announcementToRemove.slug}`)
      .pipe(
        tap((_) => {
          this.announcements.removeAnnouncement(announcementToRemove);
        })
      );
  }
  /** Deletes an announcement
   * @param announcement_id: id of the announcement object to delete
   * @returns {Observable<Organization>}
   */
  editAnnouncement(announcementToEdit: Announcement): Observable<Announcement> {
    return this.http
      .put<Announcement>(`/api/announcements/${announcementToEdit.slug}`, null)
      .pipe(
        tap((_) => {
          this.announcements.updateAnnouncement(announcementToEdit);
        })
      );
  }
}
