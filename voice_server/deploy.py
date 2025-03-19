import modal
from app import web_app

app = modal.App("playai-server", secrets=[modal.Secret.from_dotenv()])
image = modal.Image.debian_slim(python_version="3.11").pip_install("fastapi[standard]", "requests").add_local_python_source("app")

@app.function(image=image, allow_concurrent_inputs=1000, min_containers=1)
@modal.asgi_app()
def fastapi_app():
    return web_app
