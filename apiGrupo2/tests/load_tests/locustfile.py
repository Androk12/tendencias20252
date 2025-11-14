"""
Load Testing Configuration for API Pedidos
Execute from project root: locust -f apiGrupo2/tests/load_tests/locustfile.py
"""
from locust import HttpUser, task, between
import random


class APIUser(HttpUser):
    """Main load test user class"""
    wait_time = between(1, 3)
    
    def on_start(self):
        """Authentication setup"""
        self.authenticate()
    
    def authenticate(self):
        """Get JWT token for API access"""
        users = [
            ("juan", "123"), ("maria", "abc"), ("carlos", "123"), 
            ("pedro", "123"), ("sofia", "123"), ("santiago", "1234"),
            ("ana", "1234"), ("lucia", "abc"), ("miguel", "1234"), ("diego", "abc")
        ]
        username, password = random.choice(users)
        
        with self.client.post("/api/token/", json={
            "username": username,
            "password": password
        }, catch_response=True) as response:
            if response.status_code == 200:
                self.token = response.json()["access"]
                self.headers = {"Authorization": f"Bearer {self.token}"}
                response.success()
            else:
                self.headers = {}
                response.failure(f"Auth failed: {response.status_code}")
    
    @task(3)
    def list_productos(self):
        """Test productos endpoint - High priority"""
        with self.client.get("/api/productos/", headers=self.headers, catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Status: {response.status_code}")
    
    @task(2)
    def list_usuarios(self):
        """Test usuarios endpoint - Medium priority"""
        with self.client.get("/api/usuarios/", headers=self.headers, catch_response=True) as response:
            if response.status_code in [200, 403]:  # 403 OK for non-admin users
                response.success()
            else:
                response.failure(f"Status: {response.status_code}")
    
    @task(1)
    def get_profile(self):
        """Test user profile endpoint"""
        with self.client.get("/api/usuarios/me/", headers=self.headers, catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Status: {response.status_code}")
    
    @task(1)
    def list_pedidos(self):
        """Test pedidos endpoint"""
        with self.client.get("/api/pedidos/", headers=self.headers, catch_response=True) as response:
            if response.status_code in [200, 403]:  # 403 OK for some users
                response.success()
            else:
                response.failure(f"Status: {response.status_code}")


class StressUser(HttpUser):
    """High-frequency stress testing user"""
    wait_time = between(0.1, 0.5)
    weight = 1  # Lower weight than APIUser
    
    def on_start(self):
        """Quick authentication for stress testing"""
        response = self.client.post("/api/token/", json={
            "username": "juan",
            "password": "123"
        })
        
        if response.status_code == 200:
            self.token = response.json()["access"]
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            self.headers = {}
    
    @task
    def rapid_productos_check(self):
        """Rapid fire productos requests"""
        self.client.get("/api/productos/", headers=self.headers)