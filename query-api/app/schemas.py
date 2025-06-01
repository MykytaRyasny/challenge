from pydantic import BaseModel, ConfigDict
from typing import Optional, List

class Country(BaseModel):
    id: int
    code: str
    name: Optional[str]
    model_config = ConfigDict(from_attributes=True)

class ParentSector(BaseModel):
    id: int
    name: Optional[str]
    model_config = ConfigDict(from_attributes=True)

class Sector(BaseModel):
    id: int
    name: str
    parent_sector: Optional[ParentSector] = None
    model_config = ConfigDict(from_attributes=True)

class Emission(BaseModel):
    id: int
    year: int
    emissions: float
    country: Optional[Country] = None
    sector: Optional[Sector] = None
    model_config = ConfigDict(from_attributes=True)
