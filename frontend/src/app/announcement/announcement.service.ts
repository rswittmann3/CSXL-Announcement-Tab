import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Announcement } from './announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  constructor(
    protected http: HttpClient,
    protected auth: AuthenticationService,
    protected snackBar: MatSnackBar
  ) {}
  getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>('/api/announcements');
  }

  /** Returns the announcement object from the backend database table using the backend HTTP get request.
   * @param slug: String representing the announcement slug
   * @returns {Observable<Announcement>}
   */
  getAnnouncement(slug: string): Observable<Announcement> {
    return this.http.get<Announcement>('/api/announcements/' + slug);
  }

  /** Returns the new announcement object from the backend database table using the backend HTTP post request.
   * @param announcement: AnnouncementSummary representing the new announcement
   * @returns {Observable<Announcement>}
   */
  createAnnouncement(announcement: Announcement): Observable<Announcement> {
    return this.http.post<Announcement>('/api/announcements', announcement);
  }

  /** Returns the updated announcement object from the backend database table using the backend HTTP put request.
   * @param announcement: AnnouncementSummary representing the updated announcement
   * @returns {Observable<Announcement>}
   */
  updateAnnouncement(announcement: Announcement): Observable<Announcement> {
    return this.http.put<Announcement>('/api/announcements', announcement);
  }
}
