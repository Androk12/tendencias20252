# Sistema de Pedidos - Tendencias 2025

Sistema completo de gestión de pedidos con Django REST API, React Frontend y Load Testing con Locust.


## 🚀 Inicio Rápido

### Opción 1: Script Automático (Windows)
```bash
# Ejecutar desde la carpeta raíz del proyecto
start_project.bat
```

### Opción 2: Manual

#### 1. Backend (Django API)
```bash
cd apiGrupo2
..\venv\Scripts\activate
pip install -r ..\requirements.txt
python manage.py migrate
python tests\load_tests\setup_test_data.py
python manage.py runserver 8000
```

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```


## 🌐 URLs del Proyecto

- **API Backend**: http://localhost:8000
- **Frontend**: http://localhost:5173  
- **Load Testing UI**: http://localhost:8089
- **API Documentation**: http://localhost:8000/swagger/
- **Documentacion Front**:https://tecnologicodeantioquia-my.sharepoint.com/:w:/g/personal/diego_ocampo30_correo_tdea_edu_co/EYsvReL2LLFLh6prTTB2MfEBoITOEHQ0WTAfOyVO9m_reA?e=Km5fQp
## 🧪 Load Testing

### Usuarios de Prueba
```
juan:123 (ADMIN)
maria:abc (CLIENTE)
carlos:123 (CLIENTE)
pedro:123 (CLIENTE)
sofia:123 (CLIENTE)
santiago:1234 (VENDEDOR)
ana:1234 (REPARTIDOR)
lucia:abc (CLIENTE)
miguel:1234 (CLIENTE)
diego:abc (REPARTIDOR)
```

### Ejecutar Pruebas de Carga
1. Asegurar que Django esté corriendo en puerto 8000
2. Ejecutar: `locust -f apiGrupo2\tests\load_tests\locustfile.py --host=http://localhost:8000`
3. Ir a http://localhost:8089
4. Configurar usuarios (ej: 20) y spawn rate (ej: 2)
5. Click "Start swarming"

## 📁 Estructura del Proyecto

```
tendencias20252/
├── apiGrupo2/                    # Django Backend
│   ├── tests/
│   │   └── load_tests/          # Pruebas de carga con Locust
│   │       ├── locustfile.py    # Configuración principal de Locust
│   │       ├── setup_test_data.py # Script de datos de prueba
│   │       └── README.md        # Documentación de pruebas
│   ├── apps/pedidos/            # Módulo principal
│   └── manage.py
├── frontend/                    # React Frontend
├── requirements.txt             # Dependencias Python (incluye Locust)
├── start_project.bat           # Script de inicio Windows
└── README.md                   # Este archivo
```

## 🛠️ Tecnologías

- **Backend**: Django 5.2.6 + Django REST Framework + JWT
- **Frontend**: React + Vite + Axios
- **Database**: SQLite (desarrollo)
- **Load Testing**: Locust 2.32.0
- **Authentication**: JWT con Simple JWT

## 📊 Características de Load Testing

- **Pruebas de autenticación**: JWT token management
- **Pruebas de endpoints**: Productos, usuarios, pedidos, perfil
- **Usuarios múltiples**: 10 usuarios de prueba con diferentes roles
- **Stress testing**: Configuración para pruebas de alta frecuencia
- **Métricas en tiempo real**: RPS, latencia, errores
- **Web UI**: Interfaz gráfica para configurar y monitorear pruebas

## 🔒 Super User
- **Username**: Prueba1
- **Password**: tendencias2025

## 📈 Performance Esperado

- **Autenticación**: ~200-300ms
- **API Calls**: ~5-50ms
- **Success Rate**: >95%
- **Concurrent Users**: Hasta 100+ usuarios simultáneos
