import { RxObject } from '../rx-object';
import { Announcement } from './announcement.model';

export class RxAnnouncement extends RxObject<Announcement[]> {
  pushAnnouncement(announcement: Announcement): void {
    this.value.push(announcement);
    this.notify();
  }

  updateAnnouncement(announcement: Announcement): void {
    this.value = this.value.map((o) => {
      return o.id !== announcement.id ? o : announcement;
    });
    this.notify();
  }

  removeAnnouncement(announcementToRemove: Announcement): void {
    this.value = this.value.filter(
      (announcement) => announcementToRemove.slug !== announcement.slug
    );
    this.notify();
  }
}
