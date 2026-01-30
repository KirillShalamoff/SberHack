# Этап сборки
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY go.mod go.sum ./
RUN go mod download

# Копируем исходный код
COPY . .

# Собираем приложение
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o iam-service ./cmd

# Этап финального образа
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Копируем бинарник из этапа сборки
COPY --from=builder /app/iam-service .
COPY --from=builder /app/migrations ./migrations

# Экспонируем порт
EXPOSE 8080

# Запускаем приложение
CMD ["./iam-service"]