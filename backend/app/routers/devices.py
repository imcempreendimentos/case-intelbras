from typing import Optional

from fastapi import APIRouter, Header, HTTPException, Query

from app.schemas import Device, DeviceListResponse, PaginationMeta
from app.services.intelbras import listar_dispositivos

router = APIRouter(prefix="/api/devices", tags=["devices"])


@router.post("", response_model=DeviceListResponse)
async def list_devices(
    pagina: int = Query(default=1, ge=1, description="Número da página"),
    tamanhoPagina: int = Query(
        default=10, ge=1, le=100, alias="tamanhoPagina", description="Itens por página"
    ),
    origem: Optional[str] = Query(
        default=None,
        description="Filtro por origem: vinculado, compartilhado ou todos",
    ),
    authorization: Optional[str] = Header(default=None),
):
    """
    Lista dispositivos da API Intelbras com proxy de autenticação.

    - Repassa o token Authorization para a API Intelbras.
    - Suporta filtragem por origem (vinculado/compartilhado).
    - Suporta paginação via API Intelbras.
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail={
                "erro": "nao_autorizado",
                "mensagem": "Token de autenticação não fornecido. Envie o header Authorization.",
                "codigo": 401,
            },
        )

    # Chama API Intelbras
    data = await listar_dispositivos(
        token=authorization,
        pagina=pagina,
        tamanho_pagina=tamanhoPagina,
    )

    # Extrai a lista de dispositivos da resposta da API Intelbras
    # Formato: {"status": "sucesso", "data": [...]}
    dispositivos_raw = []

    if isinstance(data, dict):
        dispositivos_raw = data.get("data") or data.get("dispositivos") or []
    elif isinstance(data, list):
        dispositivos_raw = data

    # Mapeia para o modelo Device
    dispositivos = []
    for d in dispositivos_raw:
        if isinstance(d, dict):
            status = d.get("status", "offline")
            device = Device(
                ns=d.get("ns", ""),
                nome=d.get("nome", ""),
                modelo=d.get("modelo", ""),
                status=status,
                online=status.lower() == "online",
                versao=d.get("versao", ""),
                origem=d.get("origem", ""),
                subdispositivo=d.get("subdispositivo", False),
                id_produto=d.get("idProduto", ""),
                ultima_vez_online=d.get("ultimaVezOnline", ""),
                dispositivo_pai=d.get("dispositivoPai"),
                id_produto_dispositivo_pai=d.get("idProdutoDispositivoPai"),
                atualizacao_disponivel=d.get("atualizacaoDisponivel", False),
            )
            dispositivos.append(device)

    # Filtragem por origem (backend-side, a API Intelbras não suporta nativamente)
    if origem and origem.lower() != "todos":
        dispositivos = [
            d
            for d in dispositivos
            if d.origem and d.origem.lower() == origem.lower()
        ]

    total_registros = len(dispositivos)
    total_paginas = max(1, (total_registros + tamanhoPagina - 1) // tamanhoPagina)

    return DeviceListResponse(
        dispositivos=dispositivos,
        paginacao=PaginationMeta(
            pagina=pagina,
            tamanho_pagina=tamanhoPagina,
            total_registros=total_registros,
            total_paginas=total_paginas,
        ),
    )
