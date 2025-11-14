# Load Testing Guide

## Setup
1. Ensure Django server is running: `python manage.py runserver`
2. Setup test data: `python apiGrupo2/tests/load_tests/setup_test_data.py`
3. Run load tests: `locust -f apiGrupo2/tests/load_tests/locustfile.py --host=http://localhost:8000`

## Test Configuration
- **APIUser**: Normal load testing (weight 3)
- **StressUser**: High-frequency testing (weight 1)
- **Wait times**: 1-3 seconds for normal, 0.1-0.5s for stress

## Expected Results
- Auth: ~200-300ms
- API calls: ~5-50ms
- Success rate: >95%

## Test Users Available
juan:123, maria:abc, carlos:123, pedro:123, sofia:123, santiago:1234, ana:1234, lucia:abc, miguel:1234, diego:abc