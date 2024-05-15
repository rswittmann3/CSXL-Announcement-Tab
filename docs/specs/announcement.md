This document contains the technical specifications, including sample data representation of our feature, descriptions of underlying database / entity-level representation decisions and development concerns.

# Descriptions and Sample Data Representation of feature

We have added / modified the following models / API routes:

## 1. Announcement Model

We first created a new pydantic model for the announcement feature that we were implementing. We made it as such:

```py3
class Announcement(BaseModel):
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
```
We felt that these fields satisfied all the attributes we we need store about an announcement in our database.

## 2. Announcement Service
We added the following methods into the announcement service file. For sake of brevity, we will only include the method signatures here, but you can locate the actual implementation in the repo.
```py3
    def all(self) -> list[Announcement]:
      ...
    def create(self, subject: User, announcement: Announcement) -> Announcement:
        ...


    def get_by_slug(self, slug: str) -> Announcement:
        ...

    def update(self, subject: User, announcement: Announcement) -> Announcement:
        ...

    def delete(self, subject: User, slug: str) -> None:
        ...
```
# 3. Route to get all existing announcements
We added several methods in the backend layer that built off the existing organization methods. For example, to retrieve all the announcements, we use the following:
```py3
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
```
# Underlying Database / Entity-Level Representation decisions
Made a database containing attributes specifiying our announcements. The entity is identical to our model in both the frontend and backend.


# Technical and User Experience Design Choices
A technical decision we had to make was to add our announcement-preview widget to the shared module instead of leaving it in the announcement module. This ended up being beneficial for our development as we will use it in the announcement pages for an organization/CSXL as well as the homepage where it is currently implemented.

A user experience design choice we made was making the default route "/" navigate to the homepage instead of coworking as usual. We felt this was important to ensure users will see the annoucement feed instead of coworking, which is much more beneficial.
```
