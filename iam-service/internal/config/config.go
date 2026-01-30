package config

import (
	"errors"
	"os"
	"strconv"
	"time"
)

type Config struct {
	HTTPAddr string

	DatabaseURL string

	JWTSecret       string
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
}

func Load() (Config, error) {
	cfg := Config{}

	cfg.HTTPAddr = getEnv("HTTP_ADDR", ":8080")

	cfg.DatabaseURL = os.Getenv("DATABASE_URL")
	if cfg.DatabaseURL == "" {
		return Config{}, errors.New("DATABASE_URL is required")
	}

	cfg.JWTSecret = os.Getenv("JWT_SECRET")
	if cfg.JWTSecret == "" {
		return Config{}, errors.New("JWT_SECRET is required")
	}

	accessTTLMinutes := getEnvAsInt("ACCESS_TOKEN_TTL_MIN", 15)
	refreshTTLDays := getEnvAsInt("REFRESH_TOKEN_TTL_DAYS", 7)

	cfg.AccessTokenTTL = time.Duration(accessTTLMinutes) * time.Minute
	cfg.RefreshTokenTTL = time.Duration(refreshTTLDays) * 24 * time.Hour

	return cfg, nil
}

func getEnv(key, defaultValue string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if v := os.Getenv(key); v != "" {
		if i, err := strconv.Atoi(v); err == nil {
			return i
		}
	}
	return defaultValue
}
