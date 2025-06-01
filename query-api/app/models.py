from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Country(Base):
    __tablename__ = 'countries'
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String)
    emissions = relationship('Emission', back_populates='country')

class ParentSector(Base):
    __tablename__ = 'parent_sectors'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    sectors = relationship('Sector', back_populates='parent_sector')

class Sector(Base):
    __tablename__ = 'sectors'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    parent_sector_id = Column(Integer, ForeignKey('parent_sectors.id'))
    parent_sector = relationship('ParentSector', back_populates='sectors')
    emissions = relationship('Emission', back_populates='sector')

class Emission(Base):
    __tablename__ = 'emissions'
    id = Column(Integer, primary_key=True, index=True)
    country_id = Column(Integer, ForeignKey('countries.id'))
    sector_id = Column(Integer, ForeignKey('sectors.id'))
    year = Column(Integer)
    emissions = Column(Float)
    country = relationship('Country', back_populates='emissions')
    sector = relationship('Sector', back_populates='emissions')
