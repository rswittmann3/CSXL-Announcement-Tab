"""Contains mock data for to run tests on the announcement feature."""

import pytest
from sqlalchemy.orm import Session
from ....models.announcement import Announcement
from ....entities.announcement_entity import AnnouncementEntity

from ..reset_table_id_seq import reset_table_id_seq

__authors__ = ["Anish Kompella, Aditya Krishna, Robert Wittmann"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"

# Sample Data Objects

post1 = Announcement(
    id = 1,
    author = "Jane Doe",
    organization = "Computer Science & Social Good",
    slug = "cscg",
    img = "https://raw.githubusercontent.com/briannata/comp423_a3_starter/main/logos/cssg.png",
    published_date = " April 2nd, 2023",
    modified_date = "April 15th, 2023",
    headline = "Welcome to Computer Science & Social Good!",
    synopsis = "A post meant to warmly welcome new students",
    main_story = "This is just a test",
    state = "published"
)

post2 = Announcement(
    id = 2,
    author = "Elijah Moore",
    organization = "App Team Carolina",
    slug = "app-team",
    img = "https://raw.githubusercontent.com/briannata/comp423_a3_starter/main/logos/appteam.jpg",
    published_data = "December 10th, 2022",
    modified_data = "December 11th, 2022",
    headline = "Product Management Event",
    synopsis = "For students interested in a Product Management talk",
    main_story = "Tuesday, March 26th, Principal Technical Product Manager @Digital Asset, Dr Curtis Hrischuk will be speaking at FB009 on Product Management and emerging technologies in the finance space!",
    state = "draft"
)

post3 = Announcement(
    id = 3,
    author = "Vikram Smith",
    organization = "Carolina Analytics & Data Science",
    slug = "cads",
    img = "https://raw.githubusercontent.com/briannata/comp423_a3_starter/main/logos/cads.png",
    published_date = " April 3rd, 2024",
    modified_date = "April 15th, 2024",
    headline = "CADS x SAIL Workshop & CADS x AI Club Workshop",
    synopsis = "CADS is informing students about upcoming workshops",
    main_story = "SAIL (Sports Analytics Intelligence Lab) x CADS will host a workshop on Monday 04/08 at 6:00PM in FB009! Join us Monday for a workshop with SAIL to learn more about their work with UNC athletics program data and more!",
    state = "published"
)

announcements = [post1, post2, post3]

to_add = Announcement(
    author = "Jack Stone",
    organization = "HackNC",
    slug = "hacknc",
    img = "",
    published_date = " September 10th, 2024",
    modified_date = "September 12th, 2024",
    headline = "Welcome to HackNC!",
    synopsis = "Welcomes new students to HackNC",
    main_story = "We want to give everyone a warm welcome to HackNC",
    state = "published"
)

to_add_conflicting_id = Announcement(
    id = 2,
    author = "Jack Stone",
    organization = "HackNC",
    slug = "hacknc",
    img = "",
    published_date = " September 10th, 2034",
    modified_date = "September 12th, 2023",
    headline = "Welcome to HackNC!",
    synopsis = "Welcomes new students to HackNC",
    main_story = "We want to give everyone a warm welcome to HackNC",
    state = "published"
)

new_post1 = Announcement(
    id = 1,
    author = "Jane Doe",
    organization = "Computer Science & Social Good",
    slug = "cscg",
    img = "https://raw.githubusercontent.com/briannata/comp423_a3_starter/main/logos/cssg.png",
    published_date = " April 17th, 2023",
    modified_date = "April 18th, 2023",
    headline = "Welcome to Computer Science & Social Good!",
    synopsis = "A post meant to warmly welcome new students. Also an update is included.",
    main_story = "This is just a test. We also wanted to add that there will be free cupcakes at the meeting!",
    state = "published"
)

# Data Functions


def insert_fake_data(session: Session):
    """Inserts fake organization data into the test session."""

    global announcements

    # Create entities for test organization data
    entities = []
    for announcement in announcements:
        entity = AnnouncementEntity.from_model(announcement)
        session.add(entity)
        entities.append(entity)

    # Reset table IDs to prevent ID conflicts
    reset_table_id_seq(
        session, AnnouncementEntity, AnnouncementEntity.id, len(announcements) + 1
    )

    # Commit all changes
    session.commit()


@pytest.fixture(autouse=True)
def fake_data_fixture(session: Session):
    """Insert fake data the session automatically when test is run.
    Note:
        This function runs automatically due to the fixture property `autouse=True`.
    """
    insert_fake_data(session)
    session.commit()
    yield
