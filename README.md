# Taskr

AA &amp; SIC

## Database setup

```
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```

```
docker exec -it postgres psql -U postgres -c "create database taskr;"
```
