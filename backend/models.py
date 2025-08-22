from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Numeric, Date, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Firm(Base):
    __tablename__ = "firms"
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    firm_id = Column(Integer, ForeignKey("firms.id"), nullable=False)
    email = Column(String(320), unique=True, nullable=False)
    name = Column(String(200))
    role = Column(String(50), default="advisor")
    sso_sub = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    firm = relationship("Firm")

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True)
    firm_id = Column(Integer, ForeignKey("firms.id"), nullable=False)
    name = Column(String(200), nullable=False)
    external_id = Column(String(200))
    created_at = Column(DateTime, server_default=func.now())
    firm = relationship("Firm")

class Account(Base):
    __tablename__ = "accounts"
    id = Column(Integer, primary_key=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    name = Column(String(200), nullable=False)
    custodian = Column(String(200))
    number = Column(String(200))
    currency = Column(String(10), default="USD")
    created_at = Column(DateTime, server_default=func.now())
    client = relationship("Client")

class Batch(Base):
    __tablename__ = "batches"
    id = Column(Integer, primary_key=True)
    firm_id = Column(Integer, ForeignKey("firms.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    as_of_date = Column(Date, nullable=False)
    status = Column(String(50), default="ingested")
    notes = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

class File(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True)
    firm_id = Column(Integer, ForeignKey("firms.id"), nullable=False)
    sha256 = Column(String(64))
    storage_path = Column(Text)
    size_bytes = Column(Integer)
    mime = Column(String(120))
    created_at = Column(DateTime, server_default=func.now())

class Mapping(Base):
    __tablename__ = "mappings"
    id = Column(Integer, primary_key=True)
    firm_id = Column(Integer, ForeignKey("firms.id"), nullable=False)
    custodian_hint = Column(String(120))
    header_signature = Column(String(255), index=True)
    json_mapping = Column(Text)
    version = Column(Integer, default=1)
    created_at = Column(DateTime, server_default=func.now())

class Position(Base):
    __tablename__ = "positions"
    id = Column(Integer, primary_key=True)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("accounts.id"), nullable=True)
    symbol = Column(String(40))
    name = Column(String(255))
    quantity = Column(Numeric(20, 6))
    price = Column(Numeric(20, 6))
    market_value = Column(Numeric(20, 2))
    cost_basis = Column(Numeric(20, 2))
    currency = Column(String(10), default="USD")
    sector = Column(String(120))
    as_of_date = Column(Date)
    source_file_id = Column(Integer, ForeignKey("files.id"))
    source_row = Column(Integer)

class Price(Base):
    __tablename__ = "prices"
    id = Column(Integer, primary_key=True)
    batch_id = Column(Integer, ForeignKey("batches.id"))
    symbol = Column(String(40), index=True)
    date = Column(Date, index=True)
    price = Column(Numeric(20, 6))
    currency = Column(String(10), default="USD")
    source_file_id = Column(Integer, ForeignKey("files.id"))
    source_row = Column(Integer)

class Balance(Base):
    __tablename__ = "balances"
    id = Column(Integer, primary_key=True)
    batch_id = Column(Integer, ForeignKey("batches.id"))
    account_id = Column(Integer, ForeignKey("accounts.id"))
    date = Column(Date)
    cash = Column(Numeric(20, 2))
    market_value = Column(Numeric(20, 2))
    currency = Column(String(10), default="USD")
    source_file_id = Column(Integer, ForeignKey("files.id"))
    source_row = Column(Integer)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True)
    firm_id = Column(Integer, ForeignKey("firms.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    event_type = Column(String(120))
    entity = Column(String(120))
    entity_id = Column(Integer)
    payload_json = Column(Text)
    created_at = Column(DateTime, server_default=func.now())