"""Announcement API

Announcement routes are used to create, retrieve, and update Announcements."""

from fastapi import APIRouter, Depends

from ..services import AnnouncementService
from ..models.announcement import Announcement
from ..api.authentication import registered_user
from ..models.user import User

__authors__ = ["Anish Kompella", "Aditya Krishna", "Robert Wittmann"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"

api = APIRouter(prefix="/api/announcements")
openapi_tags = {
    "name": "Announcements",
    "description": "Create, update, delete, and retrieve Announcements.",
}


@api.get("", response_model=list[Announcement], tags=["Announcements"])
def get_announcements(
    announcement_service: AnnouncementService = Depends(),
) -> list[Announcement]:
    """
    Get all announcements

    Parameters:
        announcement_service: a valid AnnouncementService

    Returns:
        list[Announcement]: All `Announcement`s in the `Announcement` database table
    """

    # Return all announcements
    return announcement_service.all()

@api.post("", response_model=Announcement, tags=["Announcements"])
def new_announcement(
    announcement: Announcement,
    subject: User = Depends(registered_user),
    announcement_service: AnnouncementService = Depends(),
) -> Announcement:
    """
    Create announcement

    Parameters:
        announcement: a valid Announcement model
        subject: a valid User model representing the currently logged in User
        announcement_service: a valid AnnouncementService

    Returns:
        Announcement: Created announcement

    Raises:
        HTTPException 422 if create() raises an Exception
    """

    return announcement_service.create(subject, announcement)

@api.get(
    "/{slug}",
    responses={404: {"model": None}},
    response_model=Announcement,
    tags=["Announcement"],
)
def get_announcement_by_slug(
    slug: str, announcement_service: AnnouncementService = Depends()
) -> Announcement:
    """
    Get announcement with matching slug

    Parameters:
        slug: a string representing a unique identifier for an Announcement
        announcement_service: a valid AnnouncementService

    Returns:
        Announcement: Announcement with matching slug

    Raises:
        HTTPException 404 if get_by_slug() raises an Exception
    """

    return announcement_service.get_by_slug(slug)


@api.put(
    "",
    responses={404: {"model": None}},
    response_model=Announcement,
    tags=["Announcements"],
)
def update_announcement(
    announcement: Announcement,
    subject: User = Depends(registered_user),
    announcement_service: AnnouncementService = Depends(),
) -> Announcement:
    """
    Update announcement

    Parameters:
        announcement: a valid Announcement model
        subject: a valid User model representing the currently logged in User
        announcement_service: a valid AnnouncementService

    Returns:
        Announcement: Updated announcement

    Raises:
        HTTPException 404 if update() raises an Exception
    """

    return announcement_service.update(subject, announcement)


@api.delete("/{slug}", response_model=None, tags=["Announcements"])
def delete_announcement(
    slug: str,
    subject: User = Depends(registered_user),
    announcement_service: AnnouncementService = Depends(),
):
    """
    Delete announcement based on slug

    Parameters:
        slug: a string representing a unique identifier for an Announcement
        subject: a valid User model representing the currently logged in User
        announcement_service: a valid AnnouncementService

    Raises:
        HTTPException 404 if delete() raises an Exception
    """

    announcement_service.delete(subject, slug)