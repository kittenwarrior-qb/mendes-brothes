import * as migration_20261001_125844_initial from './20261001_125844_initial'
import * as migration_20261001_130822_theme_contrast from './20261001_130822_theme_contrast'
import * as migration_20261001_144055_palettes_and_backups from './20261001_144055_palettes_and_backups'
import * as migration_20261001_144113_drop_legacy_contrast from './20261001_144113_drop_legacy_contrast'

export const migrations = [
  {
    up: migration_20261001_125844_initial.up,
    down: migration_20261001_125844_initial.down,
    name: '20261001_125844_initial',
  },
  {
    up: migration_20261001_130822_theme_contrast.up,
    down: migration_20261001_130822_theme_contrast.down,
    name: '20261001_130822_theme_contrast',
  },
  {
    up: migration_20261001_144055_palettes_and_backups.up,
    down: migration_20261001_144055_palettes_and_backups.down,
    name: '20261001_144055_palettes_and_backups',
  },
  {
    up: migration_20261001_144113_drop_legacy_contrast.up,
    down: migration_20261001_144113_drop_legacy_contrast.down,
    name: '20261001_144113_drop_legacy_contrast',
  },
]
