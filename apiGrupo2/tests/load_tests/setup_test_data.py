"""
Test data setup script for load testing
Run from project root: python apiGrupo2/tests/load_tests/setup_test_data.py
"""
import os
import sys
import django

# Setup Django environment
project_root = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
sys.path.append(project_root)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'apiGrupo2.settings')
django.setup()

from apps.pedidos.models import Usuario, Producto, Pedido, DetallePedido
from decimal import Decimal

def setup_test_data():
    """Create test data for load testing"""
    print("Setting up test data for load testing...")
    
    # Create test users
    test_users = [
        {'username': 'juan', 'email': 'juan@test.com', 'password': '123', 'role': 'ADMIN'},
        {'username': 'maria', 'email': 'maria@test.com', 'password': 'abc', 'role': 'CLIENTE'},
        {'username': 'carlos', 'email': 'carlos@test.com', 'password': '123', 'role': 'CLIENTE'},
        {'username': 'pedro', 'email': 'pedro@test.com', 'password': '123', 'role': 'CLIENTE'},
        {'username': 'sofia', 'email': 'sofia@test.com', 'password': '123', 'role': 'CLIENTE'},
        {'username': 'santiago', 'email': 'santiago@test.com', 'password': '1234', 'role': 'VENDEDOR'},
        {'username': 'ana', 'email': 'ana@test.com', 'password': '1234', 'role': 'REPARTIDOR'},
        {'username': 'lucia', 'email': 'lucia@test.com', 'password': 'abc', 'role': 'CLIENTE'},
        {'username': 'miguel', 'email': 'miguel@test.com', 'password': '1234', 'role': 'CLIENTE'},
        {'username': 'diego', 'email': 'diego@test.com', 'password': 'abc', 'role': 'REPARTIDOR'},
    ]
    
    # Clear existing test users
    Usuario.objects.filter(email__endswith='@test.com').delete()
    
    # Create users
    for user_data in test_users:
        Usuario.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password'],
            role=user_data['role']
        )
    
    print(f"Created {len(test_users)} test users")
    
    # Create test products
    test_products = [
        {'nombre': 'Pizza Test', 'precio': Decimal('15.99'), 'stock': 100},
        {'nombre': 'Burger Test', 'precio': Decimal('12.50'), 'stock': 80},
        {'nombre': 'Salad Test', 'precio': Decimal('9.99'), 'stock': 60},
    ]
    
    # Clear existing test products
    Producto.objects.filter(nombre__endswith='Test').delete()
    
    # Create products
    for product_data in test_products:
        Producto.objects.create(**product_data)
    
    print(f"Created {len(test_products)} test products")
    print("Test data setup complete!")

if __name__ == "__main__":
    setup_test_data()