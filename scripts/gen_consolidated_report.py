# -*- coding: utf-8 -*-
"""Informe de Pruebas Unitarias CONSOLIDADO de P.R.I.S.M.A. (.docx).
Cubre el front + los 5 microservicios, con portada, índice, gráficos y conclusión.
Datos REALES de las ejecuciones de Vitest/Jest --coverage."""
import os
from datetime import date

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.text import WD_BREAK

BLUE, YELLOW, GREEN, RED = "#307FE2", "#FFB800", "#43B02A", "#D50032"
HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "_report_assets")
os.makedirs(IMG, exist_ok=True)
DESKTOP = os.path.join(os.path.expanduser("~"), "Desktop")
OUT = os.path.join(DESKTOP, "Informe_Pruebas_Unitarias_PRISMA.docx")

# ── Datos reales por componente ──────────────────────────────────────────────
# (name, framework, suites, tests_pass, tests_skip, stmts, branch, funcs, lines)
COMPONENTS = [
    ("prisma-front", "Vitest", 46, 445, 0, 78.33, 63.45, 69.21, 81.03,
     "SPA React + puerta única. Capa de servicios (auth/jobs/paci/admin), contexto "
     "de sesión activa (SSE), páginas, componentes de UI/layout y utilidades."),
    ("bff-prisma", "Jest", 16, 187, 0, 81.87, 100.0, 98.87, 84.06,
     "Backend-for-Frontend. Cliente HTTP de microservicios, proxy de auth y "
     "agregación cross-service (dashboard, colegios, jobs, students, professors)."),
    ("prisma-ms-users", "Jest", 15, 136, 3, 85.86, 52.58, 84.41, 85.24,
     "Auth + perfil docente + gestión de colegios (multi-tenant). Guards Supabase "
     "y servicios de dominio."),
    ("prisma-ms-docs", "Jest", 25, 77, 0, 85.01, 66.25, 84.21, 83.89,
     "Jobs PACI (S3/Lambda). Servicio de jobs, guard de autenticación y endpoints "
     "(incluye pruebas e2e de la API)."),
    ("prisma-ms-perfil-alumno", "Jest", 16, 63, 0, 87.76, 60.86, 96.61, 87.18,
     "Estudiantes y perfiles PACI. Delegación de controllers, guard JWT y "
     "utilidades de tenancy (colegioId)."),
    ("prisma-adminpanel", "Jest", 22, 169, 0, 79.65, 84.47, 88.28, 80.67,
     "API del panel de administración. Controllers y servicios de colegios, "
     "dashboard, jobs, profesores y estudiantes (multi-tenant)."),
    ("prisma_workflow", "pytest", 18, 245, 0, 85.37, 89.86, 85.37, 85.37,
     "Motor de IA multi-agente (Gemini + ADK). Gates de compliance (Decretos "
     "170/83/67), runner del workflow, API de chat (HITL/SSE), carga/exportación "
     "de documentos y store DynamoDB. coverage.py mide sentencias, líneas y ramas "
     "(no funciones: la columna replica la de sentencias)."),
]

EXAMPLES = {
    "prisma-front": [
        "authService: login/refresh/logout/getCurrentUser delegando en bffApi; un 401 lanza «Correo o contraseña incorrectos».",
        "jobsService / paciService: creación, listado y descarga con manejo de errores (mock de axios).",
        "ActiveSessionContext: tracking por SSE (eventos agent_start y completed) y restauración desde localStorage.",
        "SessionToast: muestra éxito, error y bloqueo normativo (compliance), con auto-cierre del error.",
        "FloatingSessionIndicator: visibilidad según fase y ruta; constants/api: construcción de endpoints.",
    ],
    "bff-prisma": [
        "MicroserviceClient: arma la URL por servicio, propaga el JWT y mapea errores de red a BadGateway.",
        "AuthService: delega login/register/logout en ms-users con el token correcto.",
        "ColegiosService / JobsService / StudentsService / ProfessorsService: enrutan cada operación CRUD al endpoint y método correctos.",
        "DashboardService: agrega datos de múltiples servicios en una sola respuesta (100 % de ramas cubiertas).",
    ],
    "prisma-ms-users": [
        "SupabaseAuthGuard: acepta el token y adjunta el usuario; rechaza header ausente o esquema inválido.",
        "ColegiosService / ColegiosController: alta, consulta y estadísticas de colegios (multi-tenant).",
        "Roles / superadmin guard: control de acceso por rol.",
    ],
    "prisma-ms-docs": [
        "JobsService: creación de jobs, listado y estadísticas por colegio.",
        "SupabaseAuthGuard: decodifica el JWT y adjunta { id, email, role, appRole, colegioId }.",
        "e2e de la API: health, chat/start, jobs/upload, listado y descarga firmada.",
    ],
    "prisma-ms-perfil-alumno": [
        "PaciProfileController / StudentController: delegan cada operación al servicio con el colegioId resuelto.",
        "SupabaseJwtGuard: valida el token contra el JWKS y adjunta el usuario.",
        "tenancy.util: resuelve el colegioId y aplica el control multi-tenant (403 si falta).",
    ],
    "prisma-adminpanel": [
        "ColegiosController / ColegiosService: alta, consulta y estadísticas de colegios con consumo de sesiones (multi-tenant).",
        "ProfessorsService: filtra por colegioId y crea profesores delegando en ms-users.",
        "DashboardController / JobsController / StudentsController: delegan cada operación al servicio correspondiente.",
        "Guard SUPERADMIN: control de acceso por rol en los endpoints administrativos.",
    ],
    "prisma_workflow": [
        "compliance_gates: bloquea PACI por PII (Ley 21.719), informe vencido (D170), categoría NEE no reconocida e incompletitud (D83), sin gastar tokens.",
        "workflow_runner / chat_router: orquestación del flujo, checkpoints HITL y emisión de estado terminal (compliance_blocked) por SSE.",
        "document_loader / document_exporter: carga del PACI + material y generación del .docx final.",
        "extract_metadatos: parseo del bloque ---METADATOS--- (PUEDE_CONTINUAR, FECHA_INFORME, DIAGNOSTICO) que emiten los agentes.",
        "dynamo_store / session_store: persistencia de sesiones del workflow (DynamoDB, TTL 7 días).",
    ],
}

TOTAL_TESTS = sum(c[3] for c in COMPONENTS)
TOTAL_SKIP = sum(c[4] for c in COMPONENTS)
TOTAL_SUITES = sum(c[2] for c in COMPONENTS)

# ── Gráficos ─────────────────────────────────────────────────────────────────
def chart_lines():
    names = [c[0] for c in COMPONENTS][::-1]
    vals = [c[8] for c in COMPONENTS][::-1]
    colors = [GREEN if v >= 70 else (YELLOW if v >= 25 else RED) for v in vals]
    fig, ax = plt.subplots(figsize=(7.4, 3.4), dpi=150)
    bars = ax.barh(names, vals, color=colors)
    ax.set_xlim(0, 100)
    ax.set_xlabel("% Líneas cubiertas")
    ax.set_title("Cobertura de líneas por componente", fontsize=12, fontweight="bold")
    ax.axvline(80, color=BLUE, linestyle="--", linewidth=1.3, label="Umbral 80%")
    for b, v in zip(bars, vals):
        ax.text(v + 1.5, b.get_y() + b.get_height() / 2, f"{v:.1f}%", va="center", fontsize=8, fontweight="bold")
    ax.legend(loc="lower right", fontsize=8)
    fig.tight_layout()
    p = os.path.join(IMG, "c_lines.png"); fig.savefig(p); plt.close(fig); return p

def chart_tests():
    names = [c[0] for c in COMPONENTS][::-1]
    vals = [c[3] for c in COMPONENTS][::-1]
    fig, ax = plt.subplots(figsize=(7.4, 3.4), dpi=150)
    bars = ax.barh(names, vals, color=BLUE)
    ax.set_xlabel("Pruebas aprobadas")
    ax.set_title(f"Pruebas unitarias por componente ({TOTAL_TESTS} en total)", fontsize=12, fontweight="bold")
    for b, v in zip(bars, vals):
        ax.text(v + 2, b.get_y() + b.get_height() / 2, str(v), va="center", fontsize=8, fontweight="bold")
    ax.set_xlim(0, max(vals) * 1.15)
    fig.tight_layout()
    p = os.path.join(IMG, "c_tests.png"); fig.savefig(p); plt.close(fig); return p

def chart_metrics():
    labels = ["Sentencias", "Ramas", "Funciones", "Líneas"]
    # promedio ponderado simple por componente (visión global del proyecto)
    import statistics
    idx = [5, 6, 7, 8]
    vals = [statistics.mean([c[i] for c in COMPONENTS]) for i in idx]
    fig, ax = plt.subplots(figsize=(7.4, 3.0), dpi=150)
    bars = ax.bar(labels, vals, color=[BLUE, GREEN, BLUE, BLUE])
    ax.set_ylim(0, 100)
    ax.set_ylabel("% promedio entre componentes")
    ax.set_title("Métricas de cobertura (promedio del proyecto)", fontsize=12, fontweight="bold")
    for b, v in zip(bars, vals):
        ax.text(b.get_x() + b.get_width() / 2, v + 2, f"{v:.1f}%", ha="center", fontsize=9, fontweight="bold")
    fig.tight_layout()
    p = os.path.join(IMG, "c_metrics.png"); fig.savefig(p); plt.close(fig); return p

img_lines, img_tests, img_metrics = chart_lines(), chart_tests(), chart_metrics()

# ── Documento ────────────────────────────────────────────────────────────────
doc = Document()
doc.styles["Normal"].font.name = "Calibri"
doc.styles["Normal"].font.size = Pt(11)


def kv_table(rows, headers, style="Light Grid Accent 1"):
    t = doc.add_table(rows=1, cols=len(headers))
    t.style = style
    for i, hd in enumerate(headers):
        t.rows[0].cells[i].paragraphs[0].add_run(hd).bold = True
    for row in rows:
        cells = t.add_row().cells
        for i, val in enumerate(row):
            cells[i].text = str(val)
    return t


def page_break():
    doc.add_paragraph().add_run().add_break(WD_BREAK.PAGE)


# ── Portada ──
for _ in range(4):
    doc.add_paragraph()
t = doc.add_paragraph(); t.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = t.add_run("Informe de Pruebas Unitarias"); r.bold = True; r.font.size = Pt(30)
r.font.color.rgb = RGBColor.from_string(BLUE.lstrip("#"))
s = doc.add_paragraph(); s.alignment = WD_ALIGN_PARAGRAPH.CENTER
rs = s.add_run("Sistema P.R.I.S.M.A."); rs.bold = True; rs.font.size = Pt(18)
s2 = doc.add_paragraph(); s2.alignment = WD_ALIGN_PARAGRAPH.CENTER
s2.add_run("Frontend + 5 microservicios + motor de IA multi-agente").font.size = Pt(13)
for _ in range(8):
    doc.add_paragraph()
m = doc.add_paragraph(); m.alignment = WD_ALIGN_PARAGRAPH.CENTER
m.add_run(
    f"Cobertura ejecutada con Vitest y Jest  ·  {TOTAL_TESTS} pruebas en {TOTAL_SUITES} suites\n"
    f"Fecha: {date.today().strftime('%d-%m-%Y')}"
).italic = True
page_break()

# ── Índice ──
doc.add_heading("Índice", level=1)
INDEX = [
    "1. Introducción y alcance",
    "2. Herramientas y metodología",
    "3. Resumen consolidado y métricas",
    "4. Resultados por componente",
    "    4.1  prisma-front (Vitest)",
    "    4.2  bff-prisma (Jest)",
    "    4.3  prisma-ms-users (Jest)",
    "    4.4  prisma-ms-docs (Jest)",
    "    4.5  prisma-ms-perfil-alumno (Jest)",
    "    4.6  prisma-adminpanel (Jest)",
    "    4.7  prisma_workflow (pytest)",
    "5. Conclusiones y recomendaciones",
]
for line in INDEX:
    p = doc.add_paragraph(line)
    p.paragraph_format.space_after = Pt(2)
page_break()

# ── 1. Introducción ──
doc.add_heading("1. Introducción y alcance", level=1)
doc.add_paragraph(
    "Este informe documenta las pruebas unitarias del sistema P.R.I.S.M.A., abarcando "
    "el frontend (SPA React), los cinco microservicios del backend y el motor de IA "
    "multi-agente (prisma_workflow). Para cada "
    "componente se ejecutó su suite con medición de cobertura de código y se reportan "
    "las métricas reales generadas por las herramientas de testing, junto con ejemplos "
    "representativos de las pruebas realizadas y su resultado. Las dependencias externas "
    "(HTTP, base de datos, autenticación) se aíslan mediante mocks, garantizando pruebas "
    "deterministas y reproducibles."
)

# ── 2. Herramientas ──
doc.add_heading("2. Herramientas y metodología", level=1)
kv_table([
    ["Frontend (prisma-front)", "Vitest + Testing Library + jsdom", "v8 (cobertura)"],
    ["Microservicios (NestJS)", "Jest + ts-jest + @nestjs/testing", "Istanbul (cobertura)"],
    ["Motor de IA (prisma_workflow)", "pytest + pytest-cov", "coverage.py (sentencias/ramas)"],
    ["Tipo de prueba", "Unitaria (con e2e de API en ms-docs)", "Mocks / spies"],
    ["Comando front", "npm test -- --coverage", "—"],
    ["Comando microservicios", "npm test -- --coverage", "—"],
], ["Ámbito", "Stack de testing", "Cobertura"])

# ── 3. Resumen consolidado ──
doc.add_heading("3. Resumen consolidado y métricas", level=1)
doc.add_paragraph(
    f"En total se ejecutaron {TOTAL_TESTS} pruebas unitarias (más {TOTAL_SKIP} omitidas) "
    f"en {TOTAL_SUITES} suites, con un 100 % de aprobación en todos los componentes."
)
kv_table(
    [[c[0], c[1], c[2], c[3] + c[4], f"{c[5]:.1f}%", f"{c[6]:.1f}%", f"{c[7]:.1f}%", f"{c[8]:.1f}%"] for c in COMPONENTS]
    + [["TOTAL", "—", TOTAL_SUITES, TOTAL_TESTS + TOTAL_SKIP, "—", "—", "—", "—"]],
    ["Componente", "Runner", "Suites", "Tests", "% Stmt", "% Ramas", "% Func", "% Líneas"],
)
doc.add_paragraph()
doc.add_picture(img_tests, width=Inches(6.3))
doc.add_paragraph()
doc.add_picture(img_lines, width=Inches(6.3))
doc.add_paragraph()
doc.add_picture(img_metrics, width=Inches(6.3))
doc.add_paragraph(
    "Lectura: los seis componentes superan el umbral del 80 % de cobertura de líneas. "
    "Los microservicios de dominio (ms-perfil-alumno 87.2 %, ms-users 85.2 %, ms-docs "
    "83.9 %) están sólidamente cubiertos. El BFF alcanza 84.1 % de líneas con 100 % de "
    "ramas y 98.9 % de funciones sobre su lógica de agregación y proxy. El front llega a "
    "81.0 % de líneas tras ampliar las pruebas a páginas, layout y componentes, y "
    "adminpanel pasó de cobertura mínima a 80.7 % al sumar specs de todos sus módulos. "
    "El motor de IA (prisma_workflow) suma 85.4 % de sentencias y 89.9 % de ramas, con "
    "los gates de compliance normativos cubiertos al 100 %. El proyecto completo cumple "
    "el objetivo de cobertura ≥ 80 %."
)

# ── 4. Por componente ──
doc.add_heading("4. Resultados por componente", level=1)
for i, c in enumerate(COMPONENTS, start=1):
    name, fw, suites, tp, ts, st, br, fn, ln, desc = c
    doc.add_heading(f"4.{i}  {name} ({fw})", level=2)
    doc.add_paragraph(desc)
    kv_table([
        ["Suites", str(suites)],
        ["Pruebas", f"{tp} aprobadas" + (f" (+{ts} omitidas)" if ts else "")],
        ["Resultado", "✓ 100 % aprobadas"],
        ["Cobertura — Sentencias", f"{st:.2f}%"],
        ["Cobertura — Ramas", f"{br:.2f}%"],
        ["Cobertura — Funciones", f"{fn:.2f}%"],
        ["Cobertura — Líneas", f"{ln:.2f}%"],
    ], ["Métrica", "Valor"])
    doc.add_paragraph("Ejemplos de pruebas realizadas:", style=None).runs[0].italic = True
    for ex in EXAMPLES[name]:
        p = doc.add_paragraph(style="List Bullet")
        p.add_run(ex + "  ")
        rr = p.add_run("[PASS]"); rr.bold = True; rr.font.color.rgb = RGBColor.from_string(GREEN.lstrip("#"))

# ── 5. Conclusiones ──
doc.add_heading("5. Conclusiones y recomendaciones", level=1)
for t in [
    f"El sistema cuenta con {TOTAL_TESTS} pruebas unitarias que pasan al 100 %, cubriendo "
    "frontend, los cinco microservicios y el motor de IA multi-agente; son deterministas "
    "y aptas para integrarse como etapa bloqueante del pipeline CI/CD.",
    "Los siete componentes alcanzan el objetivo de cobertura ≥ 80 %: "
    "ms-perfil-alumno 87.2 %, prisma_workflow 85.4 %, ms-users 85.2 %, bff-prisma 84.1 %, "
    "ms-docs 83.9 %, prisma-front 81.0 % y adminpanel 80.7 %. El BFF destaca con 100 % de "
    "ramas y 98.9 % de funciones, y los gates de compliance normativos del motor de IA "
    "están cubiertos al 100 %.",
    "El esfuerzo del equipo elevó de forma notable los componentes que estaban rezagados: "
    "el front pasó de ~26 % a 81 % de líneas, el BFF de ~17 % a 84 % y adminpanel de "
    "~2 % a 81 %, agregando pruebas a páginas, módulos y servicios antes sin cobertura.",
    "Recomendación: reforzar la cobertura de ramas (caminos condicionales) en ms-users "
    "(52.6 %) y front (63.5 %), donde aún hay rutas de error/permisos sin ejercitar.",
    "Recomendación: incorporar más pruebas end-to-end (supertest) siguiendo el patrón ya "
    "presente en ms-docs, y publicar el reporte de cobertura (lcov) como artefacto del CI.",
]:
    doc.add_paragraph(t, style="List Bullet")

doc.save(OUT)
print("OK ->", OUT)
