
export interface Style {
  borderColor?: string, 
  backgroundColor?: string, 
  textColor?: string, 
  fontSize?: number,
  areaLevel?: { op: string, min: number, max?: number },
  iconEnabled?: number,
  iconSize?: number,
  iconColor?: string,
  iconShape?: string,
  beamColor?: string,
  beamTemporary?: boolean,
  beamEnabled?: string,
  soundEnabled?: string,
  soundType?: string,
  soundFile?: string,
  soundDrop?: string,
  soundVolume?: number
}

export interface Rule {
  id: string,
  name: string,
  hide: boolean,
  items: Array<string>,
  style: Style,
  order: number
}