from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import SessionLocal
from . import models, schemas
from typing import List, Optional

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", tags=["health"])
def read_root():
    return {"message": "Query API is running"}

@router.get("/countries", response_model=List[schemas.Country], description="List countries with optional filtering by id, code, or name. Supports pagination with limit and offset.")
def list_countries(
    id: Optional[int] = None,
    code: Optional[str] = None,
    name: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    sort_by: Optional[str] = "id",
    order: Optional[str] = "asc",
    db: Session = Depends(get_db),
):
    """
    List countries with optional filtering by id, code, or name. Supports pagination with limit and offset. Supports sorting by id, code, or name.
    """
    q = db.query(models.Country)
    if id is not None:
        q = q.filter(models.Country.id == id)
    if code is not None:
        q = q.filter(models.Country.code == code)
    if name is not None:
        q = q.filter(models.Country.name == name)
    # Sorting
    if sort_by in {"id", "code", "name"}:
        sort_col = getattr(models.Country, sort_by)
        q = q.order_by(sort_col.desc() if order == "desc" else sort_col.asc())
    if limit != -1:
        q = q.offset(offset).limit(limit)
    countries = q.all() if limit != -1 else q.offset(offset).all()
    return [schemas.Country(id=c.id, code=c.code, name=c.name) for c in countries]

@router.get("/parent-sectors", response_model=List[schemas.ParentSector], description="List parent sectors with optional filtering by id or name. Supports pagination with limit and offset.")
def list_parent_sectors(
    id: Optional[int] = None,
    name: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    sort_by: Optional[str] = "id",
    order: Optional[str] = "asc",
    db: Session = Depends(get_db),
):
    """
    List parent sectors with optional filtering by id or name. Supports pagination with limit and offset. Supports sorting by id or name.
    """
    q = db.query(models.ParentSector)
    if id is not None:
        q = q.filter(models.ParentSector.id == id)
    if name is not None:
        q = q.filter(models.ParentSector.name == name)
    if sort_by in {"id", "name"}:
        sort_col = getattr(models.ParentSector, sort_by)
        q = q.order_by(sort_col.desc() if order == "desc" else sort_col.asc())
    if limit != -1:
        q = q.offset(offset).limit(limit)
    parent_sectors = q.all() if limit != -1 else q.offset(offset).all()
    return [schemas.ParentSector(id=ps.id, name=ps.name) for ps in parent_sectors]

@router.get("/sectors", response_model=List[schemas.Sector], description="List sectors with optional filtering by id, name, or parent_sector_id. Supports pagination with limit and offset.")
def list_sectors(
    id: Optional[int] = None,
    name: Optional[str] = None,
    parent_sector_id: Optional[int] = None,
    limit: int = 50,
    offset: int = 0,
    sort_by: Optional[str] = "id",
    order: Optional[str] = "asc",
    db: Session = Depends(get_db),
):
    """
    List sectors with optional filtering by id, name, or parent_sector_id. Supports pagination with limit and offset. Supports sorting by id or name.
    """
    q = db.query(models.Sector).outerjoin(models.ParentSector)
    if id is not None:
        q = q.filter(models.Sector.id == id)
    if name is not None:
        q = q.filter(models.Sector.name == name)
    if parent_sector_id is not None:
        q = q.filter(models.Sector.parent_sector_id == parent_sector_id)
    if sort_by in {"id", "name"}:
        sort_col = getattr(models.Sector, sort_by)
        q = q.order_by(sort_col.desc() if order == "desc" else sort_col.asc())
    if limit != -1:
        q = q.offset(offset).limit(limit)
    sectors = q.all() if limit != -1 else q.offset(offset).all()
    return [
        schemas.Sector(
            id=s.id,
            name=s.name,
            parent_sector=schemas.ParentSector(id=s.parent_sector.id, name=s.parent_sector.name) if s.parent_sector else None
        ) for s in sectors
    ]

@router.get("/emissions", response_model=List[schemas.Emission], description="List emissions with flexible filtering on country_id, sector_id, year, emissions, country_code, country_name, sector_name, and parent_sector_name. All filters are combined with AND logic. Supports pagination with limit and offset.")
def list_emissions(
    country_id: Optional[int] = None,
    sector_id: Optional[int] = None,
    year: Optional[int] = None,
    emissions: Optional[float] = None,
    country_code: Optional[str] = None,
    country_name: Optional[str] = None,
    sector_name: Optional[str] = None,
    parent_sector_name: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    sort_by: Optional[str] = "id",
    order: Optional[str] = "asc",
    db: Session = Depends(get_db),
):
    """
    List emissions with flexible filtering on country_id, sector_id, year, emissions, country_code, country_name, sector_name, and parent_sector_name. All filters are combined with AND logic. Supports pagination and sorting.
    """
    q = db.query(models.Emission).join(models.Country).join(models.Sector).join(models.ParentSector, isouter=True)
    if country_id is not None:
        q = q.filter(models.Emission.country_id == country_id)
    if sector_id is not None:
        q = q.filter(models.Emission.sector_id == sector_id)
    if year is not None:
        q = q.filter(models.Emission.year == year)
    if emissions is not None:
        q = q.filter(models.Emission.emissions == emissions)
    if country_code is not None:
        q = q.filter(models.Country.code == country_code.upper())
    if country_name is not None:
        q = q.filter(models.Country.name == country_name)
    if sector_name is not None:
        q = q.filter(models.Sector.name == sector_name)
    if parent_sector_name is not None:
        q = q.filter(models.ParentSector.name == parent_sector_name)
    # Sorting
    valid_sort_fields = {"id", "year", "emissions"}
    if sort_by in valid_sort_fields:
        sort_col = getattr(models.Emission, sort_by)
        q = q.order_by(sort_col.desc() if order == "desc" else sort_col.asc())
    if limit != -1:
        q = q.offset(offset).limit(limit)
    results = q.all() if limit != -1 else q.offset(offset).all()
    return [
        schemas.Emission(
            id=e.id,
            year=e.year,
            emissions=e.emissions,
            country=schemas.Country(id=e.country.id, code=e.country.code, name=e.country.name) if e.country else None,
            sector=schemas.Sector(
                id=e.sector.id,
                name=e.sector.name,
                parent_sector=schemas.ParentSector(id=e.sector.parent_sector.id, name=e.sector.parent_sector.name) if e.sector and e.sector.parent_sector else None
            ) if e.sector else None
        )
        for e in results
    ]