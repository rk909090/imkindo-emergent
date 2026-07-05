"""Backend API tests for Imkindo V1"""
import os
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Root ----------
class TestRoot:
    def test_root_returns_imkindo_message(self, api_client):
        r = api_client.get(f"{API}/")
        assert r.status_code == 200
        data = r.json()
        assert "message" in data
        assert "Imkindo" in data["message"]


# ---------- Enquiries ----------
class TestEnquiries:
    valid_payload = {
        "name": "TEST_Alice",
        "company": "TEST Co",
        "position": "Head of Testing",
        "email": "TEST_alice@example.com",
        "phone": "+441234567890",
        "country": "UK",
        "interested_in": "Strategic Partnership",
        "organisation_type": "Enterprise Business",
        "message": "TEST_This is a test enquiry payload for automated testing.",
    }

    def test_create_enquiry_success(self, api_client):
        r = api_client.post(f"{API}/enquiries", json=self.valid_payload)
        assert r.status_code == 201, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
        assert "submitted_at" in data and data["submitted_at"]
        assert data["name"] == self.valid_payload["name"]
        assert data["email"] == self.valid_payload["email"]
        assert data["interested_in"] == self.valid_payload["interested_in"]
        assert data["organisation_type"] == self.valid_payload["organisation_type"]
        assert data["message"] == self.valid_payload["message"]

    def test_create_enquiry_minimal_required(self, api_client):
        payload = {
            "name": "TEST_Bob",
            "email": "TEST_bob@example.com",
            "interested_in": "Media / Other",
            "organisation_type": "Other",
            "message": "TEST_Minimum payload only.",
        }
        r = api_client.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 201, r.text
        data = r.json()
        assert data["company"] == ""
        assert data["phone"] == ""
        assert data["country"] == ""

    def test_create_enquiry_missing_required_returns_422(self, api_client):
        payload = {"name": "TEST_NoEmail", "message": "TEST"}
        r = api_client.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 422

    def test_create_enquiry_invalid_email_returns_422(self, api_client):
        payload = {
            "name": "TEST_BadEmail",
            "email": "not-an-email",
            "interested_in": "Media / Other",
            "organisation_type": "Other",
            "message": "TEST_Invalid email",
        }
        r = api_client.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 422

    def test_create_enquiry_empty_message_returns_422(self, api_client):
        payload = {
            "name": "TEST_EmptyMsg",
            "email": "TEST_empty@example.com",
            "interested_in": "Media / Other",
            "organisation_type": "Other",
            "message": "",
        }
        r = api_client.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 422

    def test_list_enquiries_includes_created_and_sorted_desc(self, api_client):
        # create a fresh enquiry
        payload = dict(self.valid_payload, message="TEST_listing_check_marker")
        create = api_client.post(f"{API}/enquiries", json=payload)
        assert create.status_code == 201
        created_id = create.json()["id"]

        r = api_client.get(f"{API}/enquiries")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        ids = [d["id"] for d in data]
        assert created_id in ids

        # ensure sorted by submitted_at desc
        timestamps = [d["submitted_at"] for d in data]
        assert timestamps == sorted(timestamps, reverse=True)
