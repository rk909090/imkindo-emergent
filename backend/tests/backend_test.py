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


# ---------- Iteration 10: potential_venture_opportunity classification ----------
class TestVentureOpportunityFlag:
    """Internal-only backend classification of enquiries as venture opportunities."""

    base_payload = {
        "name": "TEST_VO_User",
        "company": "TEST Co",
        "position": "Tester",
        "email": "TEST_vo@example.com",
        "phone": "+441234567890",
        "country": "UK",
        "organisation_type": "Enterprise Business",
        "message": "TEST_venture_opportunity_flag_check",
    }

    @pytest.mark.parametrize("interested_in", [
        "Bespoke AI Project",
        "Strategic Partnership",
    ])
    def test_flagged_interests_return_true(self, api_client, interested_in):
        payload = dict(self.base_payload, interested_in=interested_in,
                       message=f"TEST_VO_true_{interested_in}")
        r = api_client.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 201, r.text
        data = r.json()
        assert "potential_venture_opportunity" in data, "field missing from response"
        assert data["potential_venture_opportunity"] is True, (
            f"expected True for {interested_in}, got {data['potential_venture_opportunity']}"
        )

    @pytest.mark.parametrize("interested_in", [
        "NowAgentAI Partnership",
        "NowMoveMe Partnership / Investment",
        "Investing in Imkindo / AI Ventures",
        "AI Implementation for my Business",
        "Media / Other",
    ])
    def test_non_flagged_interests_return_false(self, api_client, interested_in):
        payload = dict(self.base_payload, interested_in=interested_in,
                       message=f"TEST_VO_false_{interested_in}")
        r = api_client.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 201, r.text
        data = r.json()
        assert "potential_venture_opportunity" in data
        assert data["potential_venture_opportunity"] is False, (
            f"expected False for {interested_in}, got {data['potential_venture_opportunity']}"
        )

    def test_flag_persisted_in_db_via_get(self, api_client):
        """Create a flagged (Strategic Partnership) and non-flagged (Media/Other) enquiry,
        then verify both are persisted with correct boolean via GET /api/enquiries."""
        marker_true = "TEST_VO_persist_true_marker"
        marker_false = "TEST_VO_persist_false_marker"

        flagged = dict(self.base_payload,
                       interested_in="Strategic Partnership",
                       message=marker_true)
        non_flagged = dict(self.base_payload,
                           interested_in="Media / Other",
                           message=marker_false)

        c1 = api_client.post(f"{API}/enquiries", json=flagged)
        c2 = api_client.post(f"{API}/enquiries", json=non_flagged)
        assert c1.status_code == 201 and c2.status_code == 201
        flagged_id = c1.json()["id"]
        non_flagged_id = c2.json()["id"]

        r = api_client.get(f"{API}/enquiries?limit=500")
        assert r.status_code == 200
        data = r.json()
        # every record should include the field
        for rec in data:
            assert "potential_venture_opportunity" in rec, (
                f"record {rec.get('id')} missing potential_venture_opportunity"
            )
            assert isinstance(rec["potential_venture_opportunity"], bool)

        flagged_rec = next((d for d in data if d["id"] == flagged_id), None)
        non_flagged_rec = next((d for d in data if d["id"] == non_flagged_id), None)
        assert flagged_rec is not None, "flagged enquiry not persisted"
        assert non_flagged_rec is not None, "non-flagged enquiry not persisted"
        assert flagged_rec["potential_venture_opportunity"] is True
        assert non_flagged_rec["potential_venture_opportunity"] is False
        # sanity: at least one True and one False exist in results
        assert any(d["potential_venture_opportunity"] is True for d in data)
        assert any(d["potential_venture_opportunity"] is False for d in data)
