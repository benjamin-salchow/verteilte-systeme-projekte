FROM golang:1.26-bookworm AS builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /go-server ./main.go

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /go-server /usr/local/bin/go-server
COPY ./public ./public
EXPOSE 8080
CMD ["/usr/local/bin/go-server"]
