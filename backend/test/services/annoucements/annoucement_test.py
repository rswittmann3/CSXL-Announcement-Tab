# PyTest
import pytest
from unittest.mock import create_autospec

from backend.services.exceptions import (
    UserPermissionException,
    ResourceNotFoundException,
    
)

# Tested Dependencies
from ....models import Announcement
from ....services import AnnouncementService

# Injected Service Fixtures
from ..fixtures import announcement_svc_integration

# Explicitly import Data Fixture to load entities in database
from ..core_data import setup_insert_data_fixture

# Data Models for Fake Data Inserted in Setup
from .announcement_test_data import (
    announcements,
    to_add,
    post1,
    new_post1,
    to_add_conflicting_id,
)
from ..user_data import root, user

__authors__ = ["Anish Kompella, Aditya Krishna, Robert Wittmann"]
__copyright__ = "Copyright 2023"
__license__ = "MIT"

def test_get_all(announcement_svc_integration: AnnouncementService):
    """Test that all announcements can be retrieved."""
    fetched_announcements = announcement_svc_integration.all()
    assert fetched_announcements is not None
    assert len(fetched_announcements) == len(announcements)
    assert isinstance(fetched_announcements[0], Announcement)

def test_get_by_slug(announcement_svc_integration: AnnouncementService):
    """Test that announcements can be retrieved based on their ID."""
    fetched_announcement = announcement_svc_integration.get_by_slug(post1.slug)
    assert fetched_announcement is not None
    assert isinstance(fetched_announcement, Announcement)
    assert fetched_announcement.slug == post1.slug

def test_create_enforces_permission(announcement_svc_integration: AnnouncementService):
    """Test that the service enforces permissions when attempting to create an announcement."""

    # Setup to test permission enforcement on the PermissionService.
    announcement_svc_integration._permission = create_autospec(
        announcement_svc_integration._permission
    )

    # Test permissions with root user (admin permission)
    announcement_svc_integration.create(root, to_add)
    announcement_svc_integration._permission.enforce.assert_called_with(
        root, "announcement.create", "announcement"
    )
def test_create_announcement_as_root(announcement_svc_integration: AnnouncementService):
    """Test that the root user is able to create new announcements."""
    created_announcement = announcement_svc_integration.create(root, to_add)
    assert created_announcement is not None
    assert created_announcement.id is not None

def test_create_announcement_as_user(announcement_svc_integration: Announcement):
    """Test that any user is *unable* to create new announcements."""
    with pytest.raises(UserPermissionException):
        announcement_svc_integration.create(user, to_add)
        pytest.fail()  # Fail test if no error was thrown above



def test_update_announcement_as_root(
    announcement_svc_integration: AnnouncementService,
):
    """Test that the root user is able to update announcements.
    Note: Test data's website field is updated
    """
    announcement_svc_integration.update(root, new_post1)
    assert (
        announcement_svc_integration.get_by_slug("cscg").published_date
        == "April 17th, 2023"
    )


def test_update_announcement_as_user(announcement_svc_integration: AnnouncementService):
    """Test that any user is *unable* to update new announcement."""
    with pytest.raises(UserPermissionException):
        announcement_svc_integration.update(user, new_post1)


def test_update_announcement_does_not_exist(
    announcement_svc_integration: AnnouncementService,
):
    """Test updating an announcement that does not exist."""
    with pytest.raises(ResourceNotFoundException):
        announcement_svc_integration.update(root, to_add)


def test_delete_enforces_permission(announcement_svc_integration: AnnouncementService):
    """Test that the service enforces permissions when attempting to delete an announcement."""

    # Setup to test permission enforcement on the PermissionService.
    announcement_svc_integration._permission = create_autospec(
        announcement_svc_integration._permission
    )

    # Test permissions with root user (admin permission)
    announcement_svc_integration.delete(root, post1.slug)
    announcement_svc_integration._permission.enforce.assert_called_with(
        root, "announcement.delete", "announcement"
    )


def test_delete_announcement_as_root(announcement_svc_integration: AnnouncementService):
    """Test that the root user is able to delete announcements."""
    announcement_svc_integration.delete(root, post1.slug)
    with pytest.raises(ResourceNotFoundException):
        announcement_svc_integration.get_by_slug(post1.slug)


def test_delete_announcement_as_user(announcement_svc_integration: AnnouncementService):
    """Test that any user is *unable* to delete announcements."""
    with pytest.raises(UserPermissionException):
        announcement_svc_integration.delete(user, post1.slug)


def test_delete_announcement_does_not_exist(
    announcement_svc_integration: AnnouncementService,
):
    """Test deleting an announcement that does not exist."""
    with pytest.raises(ResourceNotFoundException):
        announcement_svc_integration.delete(root, to_add.slug)

