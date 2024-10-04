package routes

import (
	"github.com/devniel/iskay-kimsa-tawa/packages/api/controllers"
	"github.com/devniel/iskay-kimsa-tawa/packages/api/logging"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

var logger = logging.GetLogger("routes")

func SetupRoutes(r *chi.Mux) *chi.Mux {

	// Middlewares
	r.Use(middleware.RequestLogger(&middleware.DefaultLogFormatter{
		Logger:  logger,
		NoColor: true,
	}))
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(JSONMiddleware)

	// Routes
	r.Get("/", controllers.Ping)

	return r
}
