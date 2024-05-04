import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Announcement } from './announcement.model';
import { AnnouncementService } from './announcement.service';

import { catchError, map, of } from 'rxjs';

/** This resolver injects the list of announcements into the announcement component. */
export const announcementResolver: ResolveFn<Announcement[] | undefined> = (
  route,
  state
) => {
  return inject(AnnouncementService).getAnnouncements();
};

/** This resolver injects an announcement into the announcement detail component. */
export const announcementDetailResolver: ResolveFn<Announcement | undefined> = (
  route,
  state
) => {
  // If the announcement is new, return a blank one
  if (route.paramMap.get('slug')! == 'new') {
    return {
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
  }

  // Otherwise, return the announcement.
  // If there is an error, return undefined
  return inject(AnnouncementService)
    .getAnnouncement(route.paramMap.get('slug')!)
    .pipe(
      catchError((error) => {
        console.log(error);
        return of(undefined);
      })
    );
};
