from pydantic import BaseModel

__authors__ = ["Anish Kompella", "Aditya Krishna", "Robert Wittmann"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"


class Announcement(BaseModel):
    """
    Pydantic model to represent an 'Announcement'.

    This model is based on the 'AnnouncementEntity' model, which defines the shape
    of the 'Announcement' database in the PostgreSQL database.
    """

    id: int
    author: str
    organization: str | None
    slug: str
    img: str | None
    published_date: str
    modified_date: str
    headline: str
    synopsis: str
    main_story: str
    state: str
    