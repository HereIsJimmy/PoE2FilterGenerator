
export const typesWithRarity = ['armours', 'weapons', 'offHands', 'jewellery', 'charms', 'flasks']
export const rarities = [
  { label: 'Normal', value: 'normal' },
  { label: 'Magic', value: 'magic' },
  { label: 'Rare', value: 'rare' },
  { label: 'Unique', value: 'unique' },
]

export const baseTypes = [
  { label: 'Armour', value: 'armours' },
  { label: 'Weapons', value: 'weapons' },
  { label: 'OffHands', value: 'offHands' },
  { label: 'Jewellery', value: 'jewellery' },
  { label: 'Other', value: 'others' },
]
export const otherTypes = [
  { label: 'Currency', value: 'currency' },
  { label: 'Soul Cores', value: 'soulCores' },
  { label: 'Runes', value: 'runes' },
  { label: 'Jewels', value: 'jewels' },
  { label: 'Fragments', value: 'fragments' },
  { label: 'Essences', value: 'essences' },
  { label: 'Distiled Emotions', value: 'distiled' },
  { label: 'Catalysts', value: 'catalysts' },
  { label: 'Keys', value: 'keys' },
  { label: 'Expedition', value: 'expedition' },
  { label: 'Charms', value: 'charms' },
  { label: 'Flasks', value: 'flasks' },
]
export const weaponTypes = [
  { label: '1H Maces', value: 'oneHandMaces' },
  { label: '2H Maces', value: 'twoHandMaces' },
  { label: 'Sceptres', value: 'sceptres' },
  { label: 'Wands', value: 'wands' },
  { label: 'Bows', value: 'bows' },
  { label: 'Staves', value: 'staves' },
  { label: 'Quarterstaves', value: 'quarterstaves' },
  { label: 'Crossbows', value: 'crossbows' },
]
export const armourTypes = [
  { label: 'Armour', value: 'armour' },
  { label: 'Evasion', value: 'evasion' },
  { label: 'Energy Shield', value: 'energyShield' },
  { label: 'Armour / Evasion', value: 'armourEvasion' },
  { label: 'Armour / Energy Shield', value: 'armourEnergyShield' },
  { label: 'Evasion / Energy Shield', value: 'evasionEnergyShield' },
]
export const armourPieces = [
  { label: 'Helm', value: 'helmets' },
  { label: 'Chest', value: 'bodyArmours' },
  { label: 'Gloves', value: 'gloves' },
  { label: 'Boots', value: 'boots' },
]
export const offHandTypes = [
  { label: 'Focus', value: 'foci' },
  { label: 'Quiver', value: 'quivers' },
  ...armourTypes.map(it => ({
    label: `Shield - ${it.label}`,
    value: it.value
  })),
  { label: 'Shield - Other', value: 'others' },
]
export const jewelleryTypes = [
  { label: 'Ring', value: 'rings' },
  { label: 'Amulet', value: 'amulets' },
  { label: 'Belt', value: 'belts' },
]