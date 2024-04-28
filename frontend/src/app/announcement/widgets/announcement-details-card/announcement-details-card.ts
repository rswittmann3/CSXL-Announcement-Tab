import { Component, Input } from '@angular/core';
import { Announcement } from '../../announcement.model';
import { Profile } from 'src/app/profile/profile.service';

@Component({
  selector: 'announcement-details-card',
  templateUrl: './announcement-details-card.widget.html',
  styleUrls: ['./announcement-details-card.widget.css']
})
export class AnnouncementDetailsCard {
  /** The announcement to show */
  @Input() announcement?: Announcement;
  /** The currently logged in user */
  @Input() profile?: Profile;

  constructor() {}
}
