from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.main import app

client = TestClient(app)

# Helper: patch get_db dependency to yield a mock session
def override_get_db():
    mock_db = MagicMock()
    yield mock_db

# Patch the get_db dependency globally for all tests
app.dependency_overrides = {}
from app import routes
app.dependency_overrides[routes.get_db] = override_get_db

# DummyColumn for SQLAlchemy-like .asc()/.desc() support
class DummyColumn:
    def asc(self): return self
    def desc(self): return self

# Mock classes with DummyColumn attributes for patching
class MockCountry:
    id = DummyColumn()
    code = DummyColumn()
    name = DummyColumn()
    # For instance attributes
    def __init__(self, id=1, code="US", name="United States"):
        self.id = id
        self.code = code
        self.name = name

class MockCountry2(MockCountry):
    def __init__(self):
        super().__init__(id=2, code="CA", name="Canada")

class MockParentSector:
    id = DummyColumn()
    name = DummyColumn()
    def __init__(self, id=1, name="Energy"):
        self.id = id
        self.name = name

class MockSector:
    id = DummyColumn()
    name = DummyColumn()
    parent_sector_id = DummyColumn()
    def __init__(self, id=1, name="Power", parent_sector=None):
        self.id = id
        self.name = name
        self.parent_sector = parent_sector or MockParentSector()

class MockEmission:
    id = DummyColumn()
    year = DummyColumn()
    emissions = DummyColumn()
    country_id = DummyColumn()
    sector_id = DummyColumn()
    def __init__(self, id=1, year=2000, emissions=123.4, country=None, sector=None):
        self.id = id
        self.year = year
        self.emissions = emissions
        self.country = country or MockCountry()
        self.sector = sector or MockSector()
# For .year access on class
MockEmission.year = DummyColumn()

# Mock data
FAKE_COUNTRIES = [MockCountry(), MockCountry2()]
FAKE_PARENT_SECTORS = [MockParentSector()]
FAKE_SECTORS = [MockSector()]
FAKE_EMISSIONS = [MockEmission()]

@patch('app.routes.models')
def test_countries(mock_models):
    mock_session = MagicMock()
    mock_session.query.return_value.filter.return_value.order_by.return_value.offset.return_value.limit.return_value.all.return_value = FAKE_COUNTRIES
    mock_session.query.return_value.all.return_value = FAKE_COUNTRIES
    mock_models.Country = MockCountry
    with patch('app.routes.SessionLocal', return_value=mock_session):
        response = client.get("/countries")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        if response.json():
            country = response.json()[0]
            assert "id" in country and "code" in country

@patch('app.routes.models')
def test_countries_filter_and_sort(mock_models):
    mock_session = MagicMock()
    mock_session.query.return_value.filter.return_value.order_by.return_value.offset.return_value.limit.return_value.all.return_value = [FAKE_COUNTRIES[1]]
    mock_models.Country = MockCountry2
    with patch('app.routes.SessionLocal', return_value=mock_session):
        response = client.get("/countries?limit=1&sort_by=code&order=desc")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

@patch('app.routes.models')
def test_parent_sectors(mock_models):
    mock_session = MagicMock()
    mock_session.query.return_value.filter.return_value.order_by.return_value.offset.return_value.limit.return_value.all.return_value = FAKE_PARENT_SECTORS
    mock_session.query.return_value.all.return_value = FAKE_PARENT_SECTORS
    mock_models.ParentSector = MockParentSector
    with patch('app.routes.SessionLocal', return_value=mock_session):
        response = client.get("/parent-sectors")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        if response.json():
            ps = response.json()[0]
            assert "id" in ps and "name" in ps

@patch('app.routes.models')
def test_sectors(mock_models):
    mock_session = MagicMock()
    mock_session.query.return_value.outerjoin.return_value.filter.return_value.order_by.return_value.offset.return_value.limit.return_value.all.return_value = FAKE_SECTORS
    mock_session.query.return_value.outerjoin.return_value.all.return_value = FAKE_SECTORS
    mock_models.Sector = MockSector
    mock_models.ParentSector = MockParentSector
    with patch('app.routes.SessionLocal', return_value=mock_session):
        response = client.get("/sectors")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        if response.json():
            sector = response.json()[0]
            assert "id" in sector and "name" in sector
            assert "parent_sector" in sector

@patch('app.routes.models')
def test_emissions(mock_models):
    mock_session = MagicMock()
    mock_session.query.return_value.join.return_value.join.return_value.join.return_value.filter.return_value.order_by.return_value.offset.return_value.limit.return_value.all.return_value = FAKE_EMISSIONS
    mock_session.query.return_value.join.return_value.join.return_value.join.return_value.all.return_value = FAKE_EMISSIONS
    mock_models.Emission = MockEmission
    mock_models.Country = MockCountry
    mock_models.Sector = MockSector
    mock_models.ParentSector = MockParentSector
    with patch('app.routes.SessionLocal', return_value=mock_session):
        response = client.get("/emissions?limit=1")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
        if response.json():
            emission = response.json()[0]
            assert "id" in emission and "year" in emission and "emissions" in emission
            assert "country" in emission and "sector" in emission

@patch('app.routes.models')
def test_emissions_filter(mock_models):
    mock_session = MagicMock()
    mock_session.query.return_value.join.return_value.join.return_value.join.return_value.filter.return_value.order_by.return_value.offset.return_value.limit.return_value.all.return_value = []
    mock_models.Emission = MockEmission
    with patch('app.routes.SessionLocal', return_value=mock_session):
        response = client.get("/emissions?year=9999")
        assert response.status_code == 200
        assert response.json() == []

@patch('app.routes.models')
def test_metadata(mock_models):
    mock_session = MagicMock()
    mock_session.query.return_value.count.side_effect = [2, 1, 1, 1]
    mock_session.query.return_value.order_by.return_value.first.return_value = (2000,)
    mock_models.Country = MockCountry
    mock_models.ParentSector = MockParentSector
    mock_models.Sector = MockSector
    mock_models.Emission = MockEmission
    with patch('app.routes.SessionLocal', return_value=mock_session):
        response = client.get("/metadata")
        assert response.status_code == 200
        data = response.json()
        assert "countries_count" in data
        assert "parent_sectors_count" in data
        assert "sectors_count" in data
        assert "emissions_count" in data
        assert "latest_year_in_emissions" in data