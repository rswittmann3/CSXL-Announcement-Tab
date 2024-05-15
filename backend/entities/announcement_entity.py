"""Definition of a SQLAlchemy table-backed object mapping entity for Announcments."""

from sqlalchemy import Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .entity_base import EntityBase
from typing import Self
from ..models.announcement import Announcement

__authors__ = ["Anish Kompella", "Aditya Krishna", "Robert Wittmann"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"


class AnnouncementEntity(EntityBase):
    """Serves as the database model schema defining the shape of the 'Announcement' table"""

    # Name for the announcements table in the PostgreSQL database
    __tablename__ = "announcement"

    # Announcement properties (columns in the database table)

    # Unique ID for the announcement
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    # Author of the announcement
    author: Mapped[str] = mapped_column(String, nullable=False)
    # Organization that announcement is associated with (In case of Ronda Root, CSXL)
    organization: Mapped[str] = mapped_column(String, nullable=False)
    # Slug of the organization and its announcement id
    slug: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    # Image associated with announcement
    img: Mapped[str] = mapped_column(String)
    # Date announcement was published
    published_date: Mapped[str] = mapped_column(String)
    # Date announcement was last modified
    modified_date: Mapped[str] = mapped_column(String)
    # Headline of the onnouncement
    headline: Mapped[str] = mapped_column(String, nullable=False, default="")
    # Synopsis of the story
    synopsis: Mapped[str] = mapped_column(String)
    # Main Story (written in markdown)
    main_story: Mapped[str] = mapped_column(String, nullable=False)
    # State of announcement (Draft, Published, Archived)
    state: Mapped[str] = mapped_column(String, nullable=False)

    @classmethod
    def from_model(cls, model: Announcement) -> Self:
        """
        Class method that converts an "Announcement" model into an "AnnouncementEntity"

        Parameters:
            - model (Announcement): Model to convert into an entity
        Returns:
            AnnouncementEntity: Entity created from model
        """
        return cls(
            id=model.id,
            author=model.author,
            organization=model.organization,
            slug=model.slug,
            img=model.img,
            published_date=model.published_date,
            modified_date=model.modified_date,
            headline=model.headline,
            synopsis=model.synopsis,
            main_story=model.main_story,
            state=model.state,
        )

    def to_model(self) -> Announcement:
        """
        Converts an `AnnouncementEntity` object into a `Announcement` model object

        Returns:
            Announcement: `Announcement` object from the entity
        """
        return Announcement(
            id=self.id,
            author=self.author,
            organization=self.organization,
            slug=self.slug,
            img=self.img,
            published_date=self.published_date,
            modified_date=self.modified_date,
            headline=self.headline,
            synopsis=self.synopsis,
            main_story=self.main_story,
            state=self.state,
        )