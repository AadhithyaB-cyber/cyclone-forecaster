from fastapi import APIRouter, HTTPException
import database

router = APIRouter(prefix="/cyclones", tags=["cyclones"])


@router.get("")
def list_cyclones():
    return database.get_all_cyclones()


@router.get("/{cyclone_id}")
def get_cyclone(cyclone_id: str):
    c = database.get_cyclone(cyclone_id)
    if not c:
        raise HTTPException(status_code=404, detail="Cyclone not found")
    return c