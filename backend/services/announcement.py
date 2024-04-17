"""
The Announcements Service allows the API to manipulate announcements data in the database.
"""

from fastapi import Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import db_session
from ..models.announcement import Announcement
from ..entities.announcement_entity import AnnouncementEntity
from ..models import User
from .permission import PermissionService

from .exceptions import ResourceNotFoundException

__authors__ = ["Anish Kompella", "Aditya Krishna", "Robert Wittmann"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"


class AnnouncementService:
    """Service that performs all of the actions on the `Announcement` table"""

    def __init__(
        self,
        session: Session = Depends(db_session),
        permission: PermissionService = Depends(),
    ):
        """Initializes the `AnnouncementService` session, and `PermissionService`"""
        self._session = session
        self._permission = permission

    def all(self) -> list[Announcement]:
        """
        Retrieves all announcements from the table

        Returns:
            list[Announcement]: List of all `Announcement`
        """
        # Select all entries in `Announcement` table
        query = select(AnnouncementEntity)
        entities = self._session.scalars(query).all()

        # Convert entries to a model and return
        return [entity.to_model() for entity in entities]

    def create(self, subject: User, announcement: Announcement) -> Announcement:
        """
        Creates a announcement based on the input object and adds it to the table.
        If the announcement's ID is unique to the table, a new entry is added.
        If the announcement's ID already exists in the table, it raises an error.

        Parameters:
            subject: a valid User model representing the currently logged in User
            announcement (Announcement): announcement to add to table

        Returns:
            Announcement: Object added to table
        """

        # Check if user has admin permissions
        self._permission.enforce(subject, "announcement.create", f"announcement")

        # Checks if the announcement already exists in the table
        if announcement.id:
            # Set id to None so database can handle setting the id
            print("done")
            announcement.id = None

        # Otherwise, create new object
        announcement_entity = AnnouncementEntity.from_model(announcement)

        # Add new object to table and commit changes
        self._session.add(announcement_entity)
        self._session.commit()

        # Return added object
        return announcement_entity.to_model()

    def get_by_slug(self, slug: str) -> Announcement:
        """
        Get the announcement from a slug
        If none retrieved, a debug description is displayed.

        Parameters:
            slug: a string representing a unique announcement slug

        Returns:
            Announcement: Object with corresponding slug

        Raises:
            ResourceNotFoundException if no announcement is found with the corresponding slug
        """

        # Query the announcement with matching slug
        announcement = (
            self._session.query(AnnouncementEntity)
            .filter(AnnouncementEntity.slug == slug)
            .one_or_none()
        )

        # Check if result is null
        if announcement is None:
            raise ResourceNotFoundException(
                f"No announcement found with matching slug: {slug}"
            )

        return announcement.to_model()

    def update(self, subject: User, announcement: Announcement) -> Announcement:
        """
        Update the announcement
        If none found with that id, a debug description is displayed.

        Parameters:
            subject: a valid User model representing the currently logged in User
            announcement (Announcement): Announcement to add to table

        Returns:
            Announcement: Updated announcement object

        Raises:
            ResourceNotFoundException: If no announcement is found with the corresponding ID
        """

        # Check if user has admin permissions
        self._permission.enforce(
            subject, "announcement.update", f"announcement/{announcement.slug}"
        )

        # Query the announcement with matching id
        announce = (
            self._session.get(AnnouncementEntity, announcement.id)
            if announcement.id
            else None
        )

        # Check if result is null
        if announce is None:
            assert announcement.id == 5
            raise ResourceNotFoundException(
                f"No announcement found with matching ID: {announcement.id}"
            )

        # Update announcement object
        announce.id = (announcement.id,)
        announce.author = (announcement.author,)
        announce.organization = (announcement.organization,)
        announce.slug = (announcement.slug,)
        announce.img = (announcement.img,)
        announce.published_date = (announcement.published_date,)
        announce.modified_date = (announcement.modified_date,)
        announce.headline = (announcement.headline,)
        announce.synopsis = (announcement.synopsis,)
        announce.main_story = (announcement.main_story,)
        announce.state = (announcement.state,)

        # Save changes
        self._session.commit()

        # Return updated object
        return announce.to_model()

    def delete(self, subject: User, slug: str) -> None:
        """
        Delete the announcement based on the provided slug.
        If no item exists to delete, a debug description is displayed.

        Parameters:
            subject: a valid User model representing the currently logged in User
            slug: a string representing a unique announcement slug

        Raises:
            ResourceNotFoundException: If no announcement is found with the corresponding slug
        """
        # Check if user has admin permissions
        self._permission.enforce(subject, "announcement.delete", f"announcement")

        # Find object to delete
        announce = (
            self._session.query(AnnouncementEntity)
            .filter(AnnouncementEntity.slug == slug)
            .one_or_none()
        )

        # Ensure object exists
        if announce is None:
            raise ResourceNotFoundException(
                f"No announcement found with matching slug: {slug}"
            )

        # Delete object and commit
        self._session.delete(announce)
        # Save changes
        self._session.commit()