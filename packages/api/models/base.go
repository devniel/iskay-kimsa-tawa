package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Base struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey;" json:"id"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"creation_date"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"update_date"`
}

// BeforeCreate will set a UUID rather than numeric ID.
func (base *Base) BeforeCreate(tx *gorm.DB) error {
	if base.ID == uuid.Nil {
		base.ID = uuid.New()
	}
	return nil
}
