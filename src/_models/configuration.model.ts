export interface ConfigurationModel {
  id: number
  nomEntreprise: string
  adresseEntreprise: string
  telephoneEntreprise1: string
  telephoneEntreprise2?: string
  emailEntreprise?: string
  siteWebEntreprise?: string
  logoEntrepriseUrl?: string
  identifiantsEntreprise?: Record<string, string>
  comptesBancairesEntreprise?: string
  variablesEnvironnementales?: Record<string, string>
  createdAt: Date
  updatedAt: Date
}
