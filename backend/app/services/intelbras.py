import httpx
from fastapi import HTTPException

from app.config import settings


INTELBRAS_DEVICES_URL = (
    f"{settings.intelbras_api_base_url}/produtos/listar-dispositivos/v1"
)


async def listar_dispositivos(
    token: str,
    pagina: int = 1,
    tamanho_pagina: int = 10,
) -> dict:
    """
    Faz a chamada à API Intelbras para listar dispositivos.

    Args:
        token: Token de autenticação Bearer.
        pagina: Número da página.
        tamanho_pagina: Quantidade de itens por página.

    Returns:
        Dicionário com a resposta da API Intelbras.

    Raises:
        HTTPException: Em caso de erros de autenticação, rede ou API.
    """
    # Normaliza o token — garante prefixo "Bearer"
    normalized_token = token.strip()
    if not normalized_token.lower().startswith("bearer "):
        normalized_token = f"Bearer {normalized_token}"

    headers = {
        "Authorization": normalized_token,
        "Content-Type": "application/json",
    }

    body = {
        "pagina": pagina,
        "tamanhoPagina": tamanho_pagina,
    }

    try:
        async with httpx.AsyncClient(
            timeout=settings.intelbras_api_timeout
        ) as client:
            response = await client.post(
                INTELBRAS_DEVICES_URL,
                headers=headers,
                json=body,
            )
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail={
                "erro": "timeout",
                "mensagem": "A API Intelbras não respondeu a tempo. Tente novamente.",
                "codigo": 504,
            },
        )
    except httpx.RequestError:
        raise HTTPException(
            status_code=502,
            detail={
                "erro": "rede",
                "mensagem": "Não foi possível conectar à API Intelbras. Verifique sua conexão.",
                "codigo": 502,
            },
        )

    if response.status_code == 401:
        raise HTTPException(
            status_code=401,
            detail={
                "erro": "nao_autorizado",
                "mensagem": "Token inválido ou não fornecido. Verifique suas credenciais.",
                "codigo": 401,
            },
        )

    if response.status_code == 403:
        raise HTTPException(
            status_code=403,
            detail={
                "erro": "token_expirado",
                "mensagem": "Seu token expirou. Faça login novamente para obter um novo token.",
                "codigo": 403,
            },
        )

    if response.status_code >= 500:
        raise HTTPException(
            status_code=500,
            detail={
                "erro": "erro_interno",
                "mensagem": "A API Intelbras está com problemas internos. Tente novamente mais tarde.",
                "codigo": 500,
            },
        )

    if response.status_code >= 400:
        raise HTTPException(
            status_code=response.status_code,
            detail={
                "erro": "requisicao_invalida",
                "mensagem": f"Erro na requisição à API Intelbras (código {response.status_code}).",
                "codigo": response.status_code,
            },
        )

    return response.json()
