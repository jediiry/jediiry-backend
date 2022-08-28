from fastapi import FastAPI

instance = FastAPI()

@instance.get('/')
def root():
    return {"message":"Hello World"}
