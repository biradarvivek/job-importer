```mermaid
flowchart LR
A[Frontend] --> B[Express API]
B --> C[Redis Queue]
C --> D[Worker]
D --> E[MongoDB]
D --> F[Redis Pub/Sub]
F --> B
B --> A
```
