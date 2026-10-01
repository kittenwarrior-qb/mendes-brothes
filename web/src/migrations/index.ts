import * as migration_20261001_125844_initial from './20261001_125844_initial'
import * as migration_20261001_130822_theme_contrast from './20261001_130822_theme_contrast'

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
]
