from pydantic import BaseModel
from typing import Optional, List

class Country(BaseModel):
    id: int
    code: str
    name: Optional[str]
    class Config:
        orm_mode = True

class ParentSector(BaseModel):
    id: int
    name: Optional[str]
    class Config:
        orm_mode = True

class Sector(BaseModel):
    id: int
    name: str
    parent_sector: Optional[ParentSector] = None
    class Config:
        orm_mode = True

class Emission(BaseModel):
    id: int
    year: int
    emissions: float
    country: Optional[Country] = None
    sector: Optional[Sector] = None
    class Config:
        orm_mode = True
