/**
 * This is the pipe used to filter announcements on the announcements page.
 *
 * @author Robert Wittmann
 * @copyright 2023
 * @license MIT
 */

import { Pipe, PipeTransform } from '@angular/core';
import { Announcement } from '/workspace/frontend/src/app/announcement/announcement.model';

@Pipe({
  name: 'announcementFilter'
})
export class AnnouncementFilterPipe implements PipeTransform {
  /** Returns a mapped array of announcements that start with the input string (if search query provided).
   * @param {Observable<Announcement[]>} announcements: observable list of valid Announcement models
   * @param {String} searchQuery: input string to filter by
   * @returns {Observable<Announcement[]>}
   */
  transform(
    announcements: Announcement[],
    searchQuery: String
  ): Announcement[] {
    // Sort the announcements list in order by date published
    announcements = announcements.sort((a: Announcement, b: Announcement) => {
      if (a.published_date && b?.published_date) {
        if (a.published_date > b.published_date) {
          return 1;
        }
        if (a.published_date < b.published_date) {
          return -1;
        }
      } else if (!a.published_date && b?.published_date) {
        return -1; // Move items with null published_date to the beginning
      } else if (a.published_date && !b?.published_date) {
        return 1; // Move items with null published_date to the end
      }
      return 0; // If both are null or undefined, consider them equal
    });

    // If a search query is provided, return the announcements that start with the search query.
    if (searchQuery) {
      return announcements.filter(
        (announcement) =>
          announcement.organization
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          announcement.headline
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          announcement.synopsis
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          announcement.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      // Otherwise, return the original list.
      return announcements;
    }
  }
}
