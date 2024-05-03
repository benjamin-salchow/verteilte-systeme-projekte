# Build stage
#FROM rust:alpine AS builder
FROM rust:latest  AS builder
WORKDIR /code

# add dependencies for build
#RUN apk add --no-cache musl-dev openssl-dev
RUN apt-get update && apt-get install -y libssl-dev

# fetch all dependencies and cache it for further builds
RUN cargo init

# Layer Build of defined dependencies
COPY Cargo.toml Cargo.toml
COPY Cargo.lock Cargo.lock
RUN cargo fetch
# Prebuild libs with cache
RUN --mount=type=cache,target=/usr/local/cargo/registry cargo build --release



# copy actual sorce code
COPY src/ src/


# if a DB is required for testing:
#RUN echo "MYSQL_USER=dummy\nMYSQL_PASSWORD=dummy\nMYSQL_HOSTNAME=127.0.0.1\nMYSQL_PORT=3306\nMYSQL_DATABASE=db" > .env
# Test and build with cache from above (contains workaround)
RUN --mount=type=cache,target=/usr/local/cargo/registry <<EOF
  set -e
  # update timestamps to force a new build
  touch /code/src/main.rs
  cargo test --release
  cargo build --release
EOF



# Actual container
#FROM alpine:latest
FROM bitnami/minideb:bookworm

# add dependencies for run-container
#RUN apk add --no-cach openssl
RUN apt-get update && apt-get install -y libssl-dev

WORKDIR /app

# copy static files
COPY public public

# copy server binary from build stage
COPY --from=builder /code/target/release/server server

# set user to non-root unless root is required for your app
USER 1001

# indicate what port the server is running on
EXPOSE 8080

# run server
CMD [ "/app/server" ]