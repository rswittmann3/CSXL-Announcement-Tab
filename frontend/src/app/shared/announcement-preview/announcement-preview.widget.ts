/**
 * The Announcement Preview widget abstracts the implementation of each
 * individual announcement from the whole announcement page.
 *
 * @author Aditya Krishna, Anish Kompella, Robert Wittmann
 * @copyright 2024
 * @license MIT
 */
import { Component, Input } from '@angular/core';
import { Announcement } from '../../announcement/announcement.model';
import { Profile } from '/workspace/frontend/src/app/profile/profile.service';

@Component({
  selector: 'announcement-preview',
  templateUrl: './announcement-preview.widget.html',
  styleUrls: ['./announcement-preview.widget.css']
})
export class AnnouncementPreview {
  /** The announcement to show */
  @Input() announcement!: Announcement;
  /** The profile of the currently signed in user */
  @Input() profile?: Profile;
  /** @deprecated Stores the permission values for a profile */
  @Input() profilePermissions!: Map<number, number>;

  constructor() {}
}
