from fastapi import APIRouter, Query
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import io
import database
import ai_engine

router = APIRouter(prefix="/report", tags=["report"])


@router.get("")
def download_report(cyclone_id: str = Query(default=None)):
    cyclone = database.get_cyclone(cyclone_id) if cyclone_id else database.get_default_cyclone()

    rows = [["Zone", "District", "Risk Score", "Risk Level", "Top Factor"]]
    for zone in database.get_all_zones():
        a = ai_engine.assess_zone(cyclone, zone)
        top_factor = a["key_factors"][0] if a["key_factors"] else "-"
        rows.append([zone["name"], zone["district"], str(a["risk_score"]), a["risk_level"], top_factor])

    rows.sort(key=lambda r: int(r[2]) if r[2].isdigit() else 0, reverse=True)
    rows.insert(0, ["Zone", "District", "Risk Score", "Risk Level", "Top Factor"])
    rows.pop(1)  # remove the duplicate header pushed down by sort

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph(f"Cyclone Impact Risk Report — {cyclone['name']}", styles["Title"]))
    elements.append(Paragraph(f"Landfall: {cyclone['landfall_location']} | ETA: {cyclone['landfall_eta']}", styles["Normal"]))
    elements.append(Spacer(1, 10 * mm))

    table = Table(rows, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0b3d5c")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f0f4f8")]),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(table)

    doc.build(elements)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="cyclone-risk-report-{cyclone["id"]}.pdf"'},
    )