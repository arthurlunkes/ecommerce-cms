export interface StateDTO {
  id?: string
  name: string
  ibge: string
  acronym: string
}

export interface CityDTO {
  id?: string
  name: string
  ibge: string
  state: StateDTO
}

export interface CustomerDTO {
  id?: string
  name: string
  address?: string
  zipcode?: string
  city?: CityDTO
}
